import React, { ReactNode, useEffect, useState } from "react";

import {
  API_GATEWAY_CUSTOM,
  API_GATEWAY_LAST_GOOD,
} from "@nihongo/core/shared/constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";

import { getTokenRegion } from "../auth/claims";

const PING_TIMEOUT = 4_000;
const REQUEST_TIMEOUT = 60_000;
const PROBE_CACHE_TTL = 30_000;

type PingBody = { ok?: boolean; region?: string };
export type ProbeResult = { ok: true; region: string; ms: number } | { ok: false };
export type GatewayStatus = { url: string; region: string } & ProbeResult;

class ApiGatewayService {
  // * Текущий, самый быстрый url api-gateway
  private _current: string | null = null;

  // * Хранит промис текущей (или уже завершённой) загрузки (для loadCustomGateways)
  private _customGatewaysLoading: Promise<void> | null = null;

  // * Хранит все gateway которые добваил пользователь
  private _customGateways: string[] = [];

  // * Хранит промис идущего выбора
  private _selection: Promise<string> | null = null;

  // * Кэш последнего опроса всех gateway — probeAll ходит в сеть по всем url сразу
  private _probeCache: { at: number; statuses: Promise<GatewayStatus[]> } | null = null;

  constructor() {}

  // * Получение активного, выбранного gateway
  getCurrentGateway = (): string | null => this._current;

  // * Получение только base gateways (из .env)
  getBaseGateways = (): string[] =>
    String(process.env.NIHONGO_API_GATEWAY ?? "")
      .replace(/^\s*\[/, "")
      .replace(/\]\s*$/, "")
      .split(",")
      .map((entry) =>
        entry
          .trim()
          .replace(/^['"]|['"]$/g, "")
          .replace(/\/+$/, ""),
      )
      .filter((url) => /^https?:\/\//.test(url));

  // * Получение всех gateways в формате [url1, url2, url3], и добавленных пользователем, и base
  getAllGateways = (): string[] => [
    ...new Set([...this.getBaseGateways(), ...this._customGateways]),
  ];

  probeGateway = async (base: string): Promise<ProbeResult> => {
    const start = Date.now();

    try {
      const { region } = await this.requestPing(base);
      return { ok: true, region: region ?? "—", ms: Date.now() - start };
    } catch {
      return { ok: false };
    }
  };

  requestPing = async (base: string): Promise<PingBody> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PING_TIMEOUT);

    try {
      const response = await fetch(`${base}/api/ping`, { signal: controller.signal });
      if (!response.ok) throw new Error(`ping ${base}: HTTP ${response.status}`);

      const body = (await response.json()) as PingBody;
      if (body?.ok !== true) throw new Error(`ping ${base}: not ok`);

      return body;
    } finally {
      clearTimeout(timer);
    }
  };

  // * Ping
  ping = async (base: string): Promise<string> => {
    await this.requestPing(base);
    return base;
  };

  selectFastest = (urls: string[], exclude?: string): Promise<string> => {
    const candidates = urls.filter((url) => url !== exclude);
    return Promise.any((candidates.length > 0 ? candidates : urls).map(this.ping));
  };

  probeAll = (urls: string[]): Promise<GatewayStatus[]> => {
    return Promise.all(
      urls.map(async (url) => ({ url, region: "unknown", ...(await this.probeGateway(url)) })),
    );
  };

  // * То же самое, но с коротким кэшем: параллельные вызовы шарят один опрос
  private probeAllCached = (): Promise<GatewayStatus[]> => {
    const now = Date.now();

    if (this._probeCache && now - this._probeCache.at < PROBE_CACHE_TTL) {
      return this._probeCache.statuses;
    }

    const statuses = this.probeAll(this.getAllGateways());
    this._probeCache = { at: now, statuses };

    return statuses;
  };

  // * Шлюз региона, в котором лежат данные пользователя (регион берётся из клейма токена)
  resolveUserGateway = async (): Promise<string | null> => {
    const [region, statuses] = await Promise.all([getTokenRegion(), this.probeAllCached()]);
    if (!region) return null;

    return statuses.find((status) => status.ok && status.region === region)?.url ?? null;
  };

  forceSelect = async (url: string): Promise<boolean> => {
    try {
      await this.ping(url);
      this.setCurrent(url);
      return true;
    } catch {
      return false;
    }
  };

  // * Выбирает gateway заново, например если текущей умер
  reselect = (exclude?: string): Promise<string> => {
    if (!this._selection) {
      const runSelection = async (exclude?: string): Promise<string> => {
        await this.loadCustomGateways();
        const fastest = await this.selectFastest(this.getAllGateways(), exclude);
        return this.setCurrent(fastest);
      };

      this._selection = runSelection(exclude).finally(() => {
        this._selection = null;
      });
    }
    return this._selection;
  };

  // * Если мертвый gateway всё ещё активный, выбрать новый, исключив этот
  invalidate = (deadUrl: string): Promise<string> => {
    if (this._current === deadUrl) this._current = null;
    return this.reselect(deadUrl);
  };

  // * Достаёт из localStorage все api gateway
  private readCustomGateways = async (): Promise<void> => {
    const raw = await AsyncStorage.getItem(API_GATEWAY_CUSTOM);
    this._customGateways = raw ? (JSON.parse(raw) as string[]) : [];
  };

  private loadCustomGateways = (): Promise<void> => {
    if (!this._customGatewaysLoading) {
      this._customGatewaysLoading = this.readCustomGateways().catch(() => {
        this._customGateways = [];
        this._customGatewaysLoading = null;
      });
    }
    return this._customGatewaysLoading;
  };

  autoSelect = (): Promise<string> => {
    this._current = null;
    return this.reselect();
  };

  // * Сохраняет Gateways
  private saveCustomGateways = async () => {
    await AsyncStorage.setItem(API_GATEWAY_CUSTOM, JSON.stringify(this._customGateways));
  };

  // * Добавление нового Gateway
  addCustomGateway = async (url: string): Promise<string[]> => {
    await this.loadCustomGateways();

    const normalizeUrl = (url: string): string => {
      const trimmed = url.trim().replace(/\/+$/, "");
      if (!trimmed) return "";
      return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
    };

    const normalized = normalizeUrl(url);
    if (!normalized) throw new Error("empty url");

    if (!this.getAllGateways().includes(normalized)) {
      this._customGateways = [...this._customGateways, normalized];
      await this.saveCustomGateways();
    }

    return this.getAllGateways();
  };

  // * Удаляет Gateway
  removeCustomGateway = async (url: string): Promise<string[]> => {
    await this.loadCustomGateways();

    this._customGateways = this._customGateways.filter((gateway) => gateway !== url);
    await this.saveCustomGateways();

    if (this._current === url) this._current = null;

    return this.getAllGateways();
  };

  // * Сеттит текущий url к которому будут идти запросы
  private setCurrent = (url: string): string => {
    this._current = url;
    AsyncStorage.setItem(API_GATEWAY_LAST_GOOD, url).catch(() => {});
    return url;
  };

  // * Возвращает базовый URL шлюза, с которым можно работать прямо сейчас
  ensureSelected = async (): Promise<string> => {
    if (this._current) return this._current;

    const readLastGood = async (): Promise<string | null> => {
      await this.loadCustomGateways();

      const lastGood = await AsyncStorage.getItem(API_GATEWAY_LAST_GOOD);
      return lastGood && this.getAllGateways().includes(lastGood) ? lastGood : null;
    };

    const lastGood = await readLastGood();

    if (this._current) return this._current;

    if (lastGood) {
      this._current = lastGood;
      return lastGood;
    }

    return this.reselect();
  };

  private request = async (
    url: string,
    init: RequestInit | undefined,
    timeout: number,
  ): Promise<Response> => {
    const controller = new AbortController();
    const abort = () => controller.abort();
    const timer = setTimeout(abort, timeout);

    if (init?.signal?.aborted) abort();
    init?.signal?.addEventListener("abort", abort, { once: true });

    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timer);
      init?.signal?.removeEventListener("abort", abort);
    }
  };

  apiFetch = async (
    path: string,
    init?: RequestInit,
    options?: ApiFetchOptions,
  ): Promise<Response> => {
    const timeout = options?.timeout ?? REQUEST_TIMEOUT;
    const base = await this.ensureSelected();

    const allowFailover = options?.failover !== false;

    const isIdempotent = (method: string = "GET"): boolean =>
      ["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());

    try {
      const response = await this.request(`${base}${path}`, init, timeout);

      const shouldFailover = response.status >= 500 && isIdempotent(init?.method);
      if (!shouldFailover || !allowFailover) return response;
    } catch (error) {
      if (init?.signal?.aborted) throw error;
      if (!allowFailover) throw error;
    }

    const fallback = await this.invalidate(base);
    console.log("[api] fail", { from: base, to: fallback, path });
    return this.request(`${fallback}${path}`, init, timeout);
  };
}

const apiGatewayService = new ApiGatewayService();

export const addCustomGateway = apiGatewayService.addCustomGateway;
export const autoSelect = apiGatewayService.autoSelect;
export const ensureSelected = apiGatewayService.ensureSelected;
export const forceSelect = apiGatewayService.forceSelect;
export const getAllGateways = apiGatewayService.getAllGateways;
export const getCurrentGateway = apiGatewayService.getCurrentGateway;
export const getBaseGateways = apiGatewayService.getBaseGateways;
export const removeCustomGateway = apiGatewayService.removeCustomGateway;
export const probeGateway = apiGatewayService.probeGateway;
export const apiFetch = apiGatewayService.apiFetch;
export const ping = apiGatewayService.ping;
export const selectFastest = apiGatewayService.selectFastest;
export const refreshSelection = (): Promise<string> => apiGatewayService.reselect();
export const resolveUserGateway = apiGatewayService.resolveUserGateway;

// ? Создаёт url с gateway на котором находятся данные пользователя
export const useUserGatewayUrl = (path: string): string | undefined => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    let active = true;

    apiGatewayService
      .resolveUserGateway()
      .then((base) => {
        if (active && base) setUrl(`${base}${path}`);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [path]);

  if (path == "") return "";

  return url;
};

// ? Создаёт url c самым выбранным gateway который быстрее всего
export const useGatewayUrl = (path: string): string | undefined => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    let active = true;

    apiGatewayService
      .ensureSelected()
      .then((base) => {
        if (active) setUrl(`${base}${path}`);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [path]);

  return url;
};

// ? Абсолютный url отдаёт как есть, имя файла (uuid.png) — c самым быстрым gateway: {gateway}/file/{name}
export const useFileUrl = (src: string): string | undefined => {
  const isAbsolute = /^https?:\/\//i.test(src);
  const gatewayUrl = useGatewayUrl(isAbsolute ? "" : `/file/${src}`);

  return isAbsolute ? src : gatewayUrl;
};

export type ApiFetchOptions = {
  timeout?: number;
  failover?: boolean;
};

export const ApiGatewayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    apiGatewayService.ensureSelected().catch(() => {});
    refreshSelection().catch(() => {});

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refreshSelection().catch(() => {});
    });

    return () => subscription.remove();
  }, []);

  return <>{children}</>;
};

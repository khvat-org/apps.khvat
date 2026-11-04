import { useSyncExternalStore } from "react";

export type FeatureFlags = string;

const parseRemoteFlags = (value: unknown): string[] | null =>
  Array.isArray(value) && value.every((flag) => typeof flag === "string") ? value : null;

class FeatureFlagsServiceClass {
  private _envFlags: string[] = [];
  private _remoteFlags: string[] | null = null;
  private _listeners = new Set<() => void>();

  constructor() {
    let envFlags: string[] = [];

    try {
      envFlags = process.env.FEATURE_FLAGS ? JSON.parse(process.env.FEATURE_FLAGS) : [];
    } catch (_) {
      console.error(`
        Invalid FEATURE_FLAGS, place array of available feature flags.
        For example: ["develop", "askAI"]
      `);
    }

    this._envFlags = envFlags;
  }

  public get availableFlags(): string[] {
    return this._remoteFlags ?? this._envFlags;
  }

  setRemoteFlags = (value: unknown): void => {
    const next = parseRemoteFlags(value);
    if (JSON.stringify(next) === JSON.stringify(this._remoteFlags)) return;

    this._remoteFlags = next;
    this._listeners.forEach((listener) => listener());
  };

  subscribe = (listener: () => void): (() => void) => {
    this._listeners.add(listener);

    return () => {
      this._listeners.delete(listener);
    };
  };

  isEnabled(flag: FeatureFlags): boolean;
  isEnabled(flags: FeatureFlags[]): boolean;
  isEnabled(flagOrFlags: FeatureFlags | FeatureFlags[]): boolean {
    if (Array.isArray(flagOrFlags)) {
      return flagOrFlags.every((flag) => this.availableFlags.includes(flag));
    } else {
      return this.availableFlags.includes(flagOrFlags);
    }
  }
}

export const FeatureFlagsService = new FeatureFlagsServiceClass();

export const useFeatureFlag = (flag: FeatureFlags): boolean =>
  useSyncExternalStore(FeatureFlagsService.subscribe, () => FeatureFlagsService.isEnabled(flag));

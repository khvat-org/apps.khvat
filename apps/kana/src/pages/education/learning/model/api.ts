import { apiFetch } from "@nihongo/core/shared/lib/api-gateway";

import { Chapter } from "./types";

async function request<TResponse>(
  path: string,
  timeoutMs: number = 60000,
  externalSignal?: AbortSignal,
): Promise<[TResponse, number]> {
  const response = await apiFetch(path, { signal: externalSignal }, { timeout: timeoutMs });
  const data = (await response.json()) as TResponse;
  return [data, response.status];
}

export const getLessons = async (lang: string, signal?: AbortSignal) => {
  const app = encodeURIComponent(process.env.APP_SLUG ?? "");
  const version = encodeURIComponent(process.env.VERSION ?? "");
  const path = `/api/v2/lessons?language=${lang}&app=${app}&app_version=${version}`;
  const [data, status] = await request<{ data: Chapter[] }>(path, 60000, signal);
  return { data: data.data, status };
};

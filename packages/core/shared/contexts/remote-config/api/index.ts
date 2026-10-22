import { apiFetch } from "@nihongo/core/shared/lib/api-gateway";

export const fetchRemoteConfig = async (
  language: string,
  signal?: AbortSignal,
): Promise<Record<string, unknown> | null> => {
  console.log("call fetchRemoteConfig");

  try {
    const appSlug = process.env.APP_SLUG;
    const appParam = appSlug ? `&app=${encodeURIComponent(appSlug)}` : "";
    const versionParam = `&app_version=${encodeURIComponent(process.env.VERSION ?? "")}`;

    const response = await apiFetch(
      `/api/conf?language=${encodeURIComponent(language)}${appParam}${versionParam}`,
      { signal },
    );

    if (!response.ok) return null;

    const text = await response.text();

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return null;
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return null;
    }

    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
};

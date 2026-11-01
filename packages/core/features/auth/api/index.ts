import { apiFetch } from "@nihongo/core/shared/lib/api-gateway";

export type AuthResponseBody = {
  access_token?: string;
  refresh_token?: string;
  region?: string;
  reset_token?: string;
  error?: string;
};

export type ApiResult<T = AuthResponseBody> = {
  ok: boolean;
  status: number;
  body: T;
};

const postJson = async (path: string, payload: unknown): Promise<ApiResult> => {
  const res = await apiFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}) as AuthResponseBody);
  return { ok: res.ok, status: res.status, body };
};

export const signInWithEmail = (email: string, password: string) =>
  postJson("/api/v2/auth/sign-in", { email, password });

export type SignUpPayload = {
  email: string;
  password: string;
  name: string;
  date_of_birth: string;
};

export const signUpWithEmail = (payload: SignUpPayload) =>
  postJson("/api/v2/auth/sign-up", payload);

export const verifyEmail = (email: string, code: string, region: string) =>
  postJson("/api/v2/auth/verify-email", { email, code, region });

export const resendVerification = (email: string, region: string) =>
  postJson("/api/v2/auth/resend-verification", { email, region });

export const oauthGoogle = (idToken: string) =>
  postJson("/api/v2/auth/oauth/google", { id_token: idToken });

export type OAuthApplePayload = {
  id_token: string;
  authorization_code: string;
  nonce: string;
  name?: string;
};

export const oauthApple = (payload: OAuthApplePayload) =>
  postJson("/api/v2/auth/oauth/apple", payload);

export const GOOGLE_OAUTH_BLOCKED = "google_oauth_unavailable_in_country";

export type GoogleOAuthAvailability = {
  available: boolean;
  error?: string;
  ip?: string;
  country?: string;
};

export const checkGoogleOAuthAvailability = async (): Promise<GoogleOAuthAvailability> => {
  const res = await apiFetch("/api/v2/auth/oauth/google/availability", {
    cache: "no-store",
    headers: { "Cache-Control": "no-cache" },
  });
  return (await res.json()) as GoogleOAuthAvailability;
};

export const requestPasswordReset = (email: string) =>
  postJson("/api/v2/auth/password/forgot", { email });

export const verifyResetCode = (email: string, code: string, region: string) =>
  postJson("/api/v2/auth/password/verify-code", { email, code, region });

export const resendResetCode = (email: string, region: string) =>
  postJson("/api/v2/auth/password/resend", { email, region });

export const resetPassword = (
  email: string,
  region: string,
  resetToken: string,
  newPassword: string,
) =>
  postJson("/api/v2/auth/password/reset", {
    email,
    region,
    reset_token: resetToken,
    new_password: newPassword,
  });

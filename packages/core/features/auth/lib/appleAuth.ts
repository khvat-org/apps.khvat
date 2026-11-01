import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";

export type AppleSignInResult = {
  idToken: string;
  authorizationCode: string;
  nonce: string;
  name: string;
};

export const isAppleSignInAvailable = async (): Promise<boolean> => {
  if (Platform.OS !== "ios") return false;
  return AppleAuthentication.isAvailableAsync().catch(() => false);
};

export const isAppleSignInCancelled = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code?: string }).code === "ERR_REQUEST_CANCELED";

export const appleSignIn = async (): Promise<AppleSignInResult> => {
  const nonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce, {
    encoding: Crypto.CryptoEncoding.HEX,
  });

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  if (!credential.identityToken) throw new Error("apple_no_id_token");

  const name = credential.fullName ? AppleAuthentication.formatFullName(credential.fullName) : "";

  return {
    idToken: credential.identityToken,
    authorizationCode: credential.authorizationCode ?? "",
    nonce,
    name: name.trim(),
  };
};

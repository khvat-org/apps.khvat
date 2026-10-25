import React, { useEffect, useMemo, useState } from "react";

import { signInWithEmail } from "@nihongo/core/features/auth/api";
import { completeAuth } from "@nihongo/core/features/auth/lib/completeAuth";
import { commonAuthError } from "@nihongo/core/features/auth/lib/serverError";
import { AUTH_ROUTES, AuthParamList } from "@nihongo/core/features/auth/routes";
import { useResetApp } from "@nihongo/core/shared/contexts/reset-context/reset-context";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import Input from "@nihongo/core/shared/ui/input";
import KeyboardScrollLayout from "@nihongo/core/shared/ui/layouts/keyboard-scroll-layout";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Text } from "react-native";
import { z } from "zod";

// * Messages are i18n keys (auth.errors.*); translated in the component via t().
const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "emailRequired")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "invalidEmail"),
  password: z.string().min(1, "passwordRequired"),
});

const validateSignIn = (d: Record<string, string>): Record<string, string> => {
  const result = signInSchema.safeParse({
    email: d.email ?? "",
    password: d.password ?? "",
  });
  if (result.success) return {};

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
};

// * Backend error codes (docs/auth/auth_api.md) -> form fields.
const mapSignInError = (status: number, code?: string): Record<string, string> => {
  switch (code) {
    case "invalid_credentials":
      return { password: "invalidCredentials" };
    case "email_not_verified":
      return { email: "emailNotVerified" };
    case "use_google_to_sign_in":
      return { email: "useGoogleToSignIn" };
    case "user_not_found":
      return { email: "userNotFound" };
    case "too_many_attempts":
      return { password: "loginBlocked" };
  }
  return { email: commonAuthError(status, code) ?? "somethingWrong" };
};

type LoginNavigationProp = StackNavigationProp<AuthParamList, typeof AUTH_ROUTES.SIGN_IN>;

export const SignInPage: React.FC = () => {
  const navigation = useNavigation<LoginNavigationProp>();

  const { t } = useTranslation();

  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
    });
  }, [navigation]);

  const goBack = () => navigation.goBack();

  const { forceReset } = useResetApp();

  const [data, setData] = useState<Record<string, string>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = (name: string, val: string) => {
    setData((prev) => ({ ...prev, [name]: val }));
    setServerErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const errors = useMemo(() => validateSignIn(data), [data]);
  const isValid = Object.keys(errors).length === 0;

  const fieldError = (name: string): string | undefined => {
    if (!submitted) return undefined;
    const key = errors[name] ?? serverErrors[name];
    return key ? t(`auth.errors.${key}`) : undefined;
  };

  const next = async () => {
    setSubmitted(true);
    setServerErrors({});

    if (!isValid) return;

    setSubmitting(true);
    try {
      const { ok, status, body } = await signInWithEmail(data["email"].trim(), data["password"]);

      if (ok && body.access_token && body.refresh_token) {
        await completeAuth(body.access_token, body.refresh_token);
        forceReset(); // * exit the auth flow into the app
        return;
      }

      setServerErrors(mapSignInError(status, body.error));
    } catch {
      setServerErrors({ email: "requestFailed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardScrollLayout onBack={goBack}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("auth.signIn.title")}</Text>
      </View>

      <View style={styles.inputs}>
        <Input
          placeholder={t("auth.fields.email")}
          onChange={(val: string) => setField("email", val)}
          error={fieldError("email")}
        />
        <Input
          placeholder={t("auth.fields.password")}
          isSecure
          onChange={(val: string) => setField("password", val)}
          error={fieldError("password")}
        />
      </View>

      <Button
        color="primary"
        onClick={next}
        isDisabled={(submitted && !isValid) || submitting}
        style={styles.submitButton}
        text={t("auth.signIn.submit")}
      />

      <Button
        color="primary"
        variant="text"
        size="sm"
        isHapticFeedback
        text={t("auth.resetPassword.title")}
        onClick={() => {
          navigation.navigate(AUTH_ROUTES.RESET_PASSWORD_ASK_EMAIL);
        }}
        style={{ marginTop: 16, alignSelf: "center" }}
      />
    </KeyboardScrollLayout>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    header: {
      width: "100%",
    },
    title: {
      ...Typography.H3,

      color: colors.TextPrimary,

      marginTop: 80,

      maxWidth: 300,
    },

    inputs: {
      marginTop: 32,

      width: "100%",
      gap: 8,
    },

    submitButton: {
      width: "100%",

      marginTop: 44,
    },

    subtitle: {
      ...Typography.regularLabel,

      color: colors.TextPrimary,

      marginTop: 16,

      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",

      // textAlign: 'center',
      // alignItems: 'center',

      maxWidth: 360,
    },
  });

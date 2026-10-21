import React, { useEffect, useMemo, useState } from "react";

import { resetPassword } from "@nihongo/core/features/auth/api";
import { completeAuth } from "@nihongo/core/features/auth/lib/completeAuth";
import { commonAuthError } from "@nihongo/core/features/auth/lib/serverError";
import { AUTH_ROUTES, AuthParamList } from "@nihongo/core/features/auth/routes";
import { useResetApp } from "@nihongo/core/shared/contexts/reset-context/reset-context";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import PrimaryButton from "@nihongo/core/shared/ui/buttons/Primary/primary-button";
import Input from "@nihongo/core/shared/ui/input";
import KeyboardScrollLayout from "@nihongo/core/shared/ui/layouts/keyboard-scroll-layout";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";
import { z } from "zod";

// * i18n-ключи (auth.errors.*); переводятся в компоненте через t().
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "passwordMin")
      .regex(/[A-Za-z]/, "passwordLetter")
      .regex(/\d/, "passwordDigit"),
    password2: z.string().min(1, "passwordRepeat"),
  })
  .refine((d) => d.password === d.password2, {
    path: ["password2"],
    message: "passwordsMismatch",
  });

const validate = (d: Record<string, string>): Record<string, string> => {
  const result = passwordSchema.safeParse({
    password: d.password ?? "",
    password2: d.password2 ?? "",
  });
  if (result.success) return {};

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
};

// * Backend error codes (docs/auth/reset_password.md) -> поля формы.
const mapServerError = (status: number, code?: string): Record<string, string> => {
  switch (code) {
    case "weak_password":
      return { password: "weakPassword" };
    case "invalid_reset_token":
      // * reset_token истёк/невалиден — сессию сброса надо начинать заново (§7.1 доков).
      return { password2: "invalidResetToken" };
  }
  return { password2: commonAuthError(status, code) ?? "somethingWrong" };
};

type ResetPasswordNavProp = StackNavigationProp<
  AuthParamList,
  typeof AUTH_ROUTES.RESET_PASSWORD_CONFIRM
>;
type ResetPasswordRouteProp = RouteProp<AuthParamList, typeof AUTH_ROUTES.RESET_PASSWORD_CONFIRM>;

export const ResetPasswordPage: React.FC = () => {
  const navigation = useNavigation<ResetPasswordNavProp>();
  const { params } = useRoute<ResetPasswordRouteProp>();
  const { email, region, resetToken } = params;

  const { t } = useTranslation();

  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const { forceReset } = useResetApp();

  const [data, setData] = useState<Record<string, string>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
    });
  }, [navigation]);

  const goBack = () => navigation.goBack();

  const setField = (name: string, val: string) => {
    setData((prev) => ({ ...prev, [name]: val }));
    setServerErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const errors = useMemo(() => validate(data), [data]);
  const isValid = Object.keys(errors).length === 0;

  const fieldError = (name: string): string | undefined => {
    if (!submitted) return undefined;
    const key = errors[name] ?? serverErrors[name];
    return key ? t(`auth.errors.${key}`) : undefined;
  };

  const confirm = async () => {
    setSubmitted(true);
    setServerErrors({});

    if (!isValid) return;

    setSubmitting(true);
    try {
      const { ok, status, body } = await resetPassword(email, region, resetToken, data["password"]);

      if (ok && body.access_token && body.refresh_token) {
        await completeAuth(body.access_token, body.refresh_token);
        forceReset(); // * авто-логин: выходим из auth-флоу в приложение
        return;
      }

      setServerErrors(mapServerError(status, body.error));
    } catch {
      setServerErrors({ password2: "requestFailed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardScrollLayout onBack={goBack}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("auth.resetPassword.changeTitle")}</Text>
      </View>

      <View style={styles.inputs}>
        <Input
          placeholder={t("auth.fields.newPassword")}
          isSecure
          onChange={(val: string) => setField("password", val)}
          error={fieldError("password")}
        />
        <Input
          placeholder={t("auth.fields.repeatPassword")}
          isSecure
          onChange={(val: string) => setField("password2", val)}
          error={fieldError("password2")}
        />
      </View>

      <PrimaryButton
        onClick={confirm}
        isDisabled={(submitted && !isValid) || submitting}
        containerStyles={styles.submitButton}
        text={t("auth.resetPassword.confirm")}
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
  });

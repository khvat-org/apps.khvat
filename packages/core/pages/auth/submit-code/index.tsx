import React, { useEffect, useState } from "react";

import { resendVerification, verifyEmail } from "@nihongo/core/features/auth/api";
import { completeAuth } from "@nihongo/core/features/auth/lib/completeAuth";
import { commonAuthError } from "@nihongo/core/features/auth/lib/serverError";
import { AUTH_ROUTES, AuthParamList } from "@nihongo/core/features/auth/routes";
import { useResetApp } from "@nihongo/core/shared/contexts/reset-context/reset-context";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import Input from "@nihongo/core/shared/ui/input";
import KeyboardScrollLayout from "@nihongo/core/shared/ui/layouts/keyboard-scroll-layout";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Text } from "react-native";

const RESEND_COOLDOWN_SEC = 45;

const maskEmail = (email: string): string => {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return `****${local.slice(-2)}@${domain}`;
};

const mapCodeError = (status: number, code?: string): string => {
  switch (code) {
    case "invalid_code":
      return "invalidCode";
    case "code_expired":
      return "codeExpired";
    case "too_many_attempts":
      return "tooManyAttempts";
    case "resend_cooldown":
      return "resendCooldown";
  }
  return commonAuthError(status, code) ?? "somethingWrong";
};

type SubmitCodeNavProp = StackNavigationProp<AuthParamList, typeof AUTH_ROUTES.SUBMIT_CODE>;
type SubmitCodeRouteProp = RouteProp<AuthParamList, typeof AUTH_ROUTES.SUBMIT_CODE>;

export const SubmitCode: React.FC = () => {
  const navigation = useNavigation<SubmitCodeNavProp>();
  const { params } = useRoute<SubmitCodeRouteProp>();
  const { email, region } = params;

  const { t } = useTranslation();

  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const { forceReset } = useResetApp();

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SEC);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const goBack = () => navigation.goBack();

  const isCodeValid = /^\d{6}$/.test(code);

  const onChangeCode = (val: string) => {
    setCode(val);
    if (error) setError(undefined);
  };

  const verify = async () => {
    if (!isCodeValid) {
      setError("codeRequired");
      return;
    }

    setSubmitting(true);
    try {
      const { ok, status, body } = await verifyEmail(email, code, region);

      if (ok && body.access_token && body.refresh_token) {
        await completeAuth(body.access_token, body.refresh_token);
        forceReset(); // * exit the auth flow into the app
        return;
      }

      setError(mapCodeError(status, body.error));
    } catch {
      setError("requestFailed");
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    if (cooldown > 0 || resending) return;

    setResending(true);
    setError(undefined);
    try {
      const { ok, status, body } = await resendVerification(email, region);

      if (ok || status === 204) {
        setCooldown(RESEND_COOLDOWN_SEC);
        return;
      }

      setError(mapCodeError(status, body.error));
    } catch {
      setError("requestFailed");
    } finally {
      setResending(false);
    }
  };

  const resendLabel =
    cooldown > 0
      ? t("auth.verifyEmail.resendCooldown", { seconds: cooldown })
      : t("auth.verifyEmail.resend");

  return (
    <KeyboardScrollLayout onBack={goBack}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("auth.verifyEmail.title")}</Text>
      </View>

      <Text style={styles.subtitle}>
        {t("auth.verifyEmail.subtitle", { email: maskEmail(email) })}
      </Text>

      <View style={styles.inputs}>
        <Input
          placeholder={t("auth.fields.code")}
          isCode
          onChange={onChangeCode}
          error={error ? t(`auth.errors.${error}`) : undefined}
        />
      </View>

      <Button
        color="primary"
        onClick={verify}
        isDisabled={!isCodeValid || submitting}
        style={styles.submitButton}
        text={t("auth.verifyEmail.submit")}
      />
      <Button
        color="secondary"
        onClick={resend}
        isDisabled={cooldown > 0 || resending}
        style={[styles.submitButton, { marginTop: 8 }]}
        text={resendLabel}
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

    subtitle: {
      marginTop: 8,

      ...Typography.regularDefault,

      color: colors.TextSecondary,
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

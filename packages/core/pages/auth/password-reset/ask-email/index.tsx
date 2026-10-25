import React, { useEffect, useMemo, useState } from "react";

import { requestPasswordReset } from "@nihongo/core/features/auth/api";
import { commonAuthError } from "@nihongo/core/features/auth/lib/serverError";
import { AUTH_ROUTES, AuthParamList } from "@nihongo/core/features/auth/routes";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import Input from "@nihongo/core/shared/ui/input";
import KeyboardScrollLayout from "@nihongo/core/shared/ui/layouts/keyboard-scroll-layout";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";
import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "emailRequired")
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "invalidEmail");

const mapServerError = (status: number, code?: string): string => {
  switch (code) {
    case "invalid_email":
      return "invalidEmail";
  }
  return commonAuthError(status, code) ?? "somethingWrong";
};

type LoginNavigationProp = StackNavigationProp<
  AuthParamList,
  typeof AUTH_ROUTES.RESET_PASSWORD_ASK_EMAIL
>;

export const ResetPasswordAskEmailPage: React.FC = () => {
  const navigation = useNavigation<LoginNavigationProp>();

  const { t } = useTranslation();

  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validationError = useMemo(() => {
    const result = emailSchema.safeParse(email);
    return result.success ? undefined : result.error.issues[0]?.message;
  }, [email]);

  const isValid = validationError === undefined;

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
    });
  }, [navigation]);

  const goBack = () => navigation.goBack();

  const onChangeEmail = (val: string) => {
    setEmail(val);
    if (serverError) setServerError(undefined);
  };

  const errorKey = submitted ? (validationError ?? serverError) : undefined;

  const next = async () => {
    setSubmitted(true);
    setServerError(undefined);

    if (!isValid) return;

    const trimmed = email.trim();

    setSubmitting(true);
    try {
      const { ok, status, body } = await requestPasswordReset(trimmed);

      if (ok && body.region) {
        navigation.navigate(AUTH_ROUTES.RESET_PASSWORD_SUBMIT_CODE, {
          email: trimmed,
          region: body.region,
        });
        return;
      }

      setServerError(mapServerError(status, body.error));
    } catch {
      setServerError("requestFailed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardScrollLayout onBack={goBack}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("auth.resetPassword.title")}</Text>
      </View>

      <Text style={styles.subtitle}>{t("auth.resetPassword.subtitle")}</Text>

      <View style={styles.inputs}>
        <Input
          placeholder={t("auth.fields.email")}
          onChange={onChangeEmail}
          error={errorKey ? t(`auth.errors.${errorKey}`) : undefined}
        />
      </View>

      <Button
        color="primary"
        onClick={next}
        isDisabled={(submitted && !isValid) || submitting}
        style={styles.submitButton}
        text={t("auth.verifyEmail.submit")}
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

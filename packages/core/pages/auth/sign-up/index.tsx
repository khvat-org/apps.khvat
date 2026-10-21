import React, { useEffect, useMemo, useState } from "react";

import { signUpWithEmail } from "@nihongo/core/features/auth/api";
import { commonAuthError } from "@nihongo/core/features/auth/lib/serverError";
import { AUTH_ROUTES, AuthParamList } from "@nihongo/core/features/auth/routes";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { useGatewayUrl } from "@nihongo/core/shared/lib/api-gateway";
import { Typography } from "@nihongo/core/shared/typography";
import PrimaryButton from "@nihongo/core/shared/ui/buttons/Primary/primary-button";
import Input from "@nihongo/core/shared/ui/input";
import KeyboardScrollLayout from "@nihongo/core/shared/ui/layouts/keyboard-scroll-layout";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Pressable, Text, Linking } from "react-native";
import { z } from "zod";

const ageFromDateString = (value: string): number => {
  const dob = new Date(value);
  if (Number.isNaN(dob.getTime())) return -1;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age--;
  return age;
};

// * Messages are i18n keys (auth.errors.*); translated in the component via t().
const signUpSchema = z
  .object({
    name: z.string().trim().min(1, "nameRequired"),
    email: z
      .string()
      .trim()
      .min(1, "emailRequired")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "invalidEmail"),
    date: z.string().min(1, "dateRequired"),
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
  })
  .refine((d) => !d.date || ageFromDateString(d.date) >= 13, {
    path: ["date"],
    message: "tooYoung",
  });

const validateSignUp = (d: Record<string, string>): Record<string, string> => {
  const result = signUpSchema.safeParse({
    name: d.name ?? "",
    email: d.email ?? "",
    date: d.date ?? "",
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

// * Returns i18n keys (auth.errors.*) by field.
const mapServerError = (status: number, code?: string): Record<string, string> => {
  switch (code) {
    case "email_taken":
    case "email_taken_oauth":
      return { email: "emailTaken" };
    case "invalid_email":
      return { email: "invalidEmail" };
    case "weak_password":
      return { password: "weakPassword" };
    case "invalid_date_of_birth":
      return { date: "invalidDate" };
    case "too_many_attempts":
      return { email: "tooManyAttempts" };
  }
  return { email: commonAuthError(status, code) ?? "somethingWrong" };
};

type LoginNavigationProp = StackNavigationProp<AuthParamList, typeof AUTH_ROUTES.SIGN_UP>;

export const SignUpPage: React.FC = () => {
  const navigation = useNavigation<LoginNavigationProp>();

  const { t, i18n } = useTranslation();

  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
    });
  }, [navigation]);

  const goBack = () => navigation.goBack();

  const privacyPolicyUrl = useGatewayUrl(
    `/${i18n.language}/docs/${process.env.DOCS_SLUG}/privacy_policy`,
  );
  const termsUrl = useGatewayUrl(
    `/${i18n.language}/docs/${process.env.DOCS_SLUG}/terms_conditions`,
  );

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

  const errors = useMemo(() => validateSignUp(data), [data]);
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

    const formatDate = (date: Date) => {
      const pad = (value: number) => String(value).padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    };

    const email = data["email"].trim();

    setSubmitting(true);
    try {
      const { status, body } = await signUpWithEmail({
        email,
        password: data["password"],
        name: data["name"].trim(),
        date_of_birth: formatDate(new Date(data["date"])),
      });

      if (status === 201 && body?.region) {
        navigation.navigate(AUTH_ROUTES.SUBMIT_CODE, { email, region: body.region });
        return;
      }

      setServerErrors(mapServerError(status, body?.error));
    } catch {
      setServerErrors({ email: "requestFailed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardScrollLayout onBack={goBack}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("auth.signUp.title")}</Text>
      </View>

      <View style={styles.inputs}>
        <Input
          placeholder={t("auth.fields.name")}
          onChange={(val: string) => setField("name", val)}
          error={fieldError("name")}
        />
        <Input
          placeholder={t("auth.fields.email")}
          onChange={(val: string) => setField("email", val)}
          error={fieldError("email")}
        />
        <Input
          placeholder={t("auth.fields.birthDate")}
          isAge
          onChange={(val: string) => setField("date", val)}
          error={fieldError("date")}
        />
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
        onClick={next}
        isDisabled={(submitted && !isValid) || submitting}
        containerStyles={styles.submitButton}
        text={t("auth.signUp.submit")}
      />

      <View style={styles.subtitle}>
        <Text
          style={{
            height: 20,
            margin: 0,
            padding: 0,
            alignItems: "center",
            color: colors.TextPrimary,
            ...Typography.regularLabel,
          }}
        >
          {t("auth.agreement.prefix")}
        </Text>

        <Pressable
          onPress={() => {
            if (termsUrl) Linking.openURL(termsUrl);
          }}
          style={{ height: 20, margin: 0, padding: 0, alignItems: "center" }}
        >
          {({ pressed }) => (
            <Text
              style={[
                styles.link,
                { color: pressed ? colors.TextPrimaryPressed : colors.TextPrimary },
              ]}
            >
              {t("auth.agreement.terms")}
            </Text>
          )}
        </Pressable>

        <Text
          style={{
            height: 20,
            margin: 0,
            padding: 0,
            alignItems: "center",
            color: colors.TextPrimary,
            ...Typography.regularLabel,
          }}
        >
          {" & "}
        </Text>

        <Pressable
          onPress={() => {
            if (privacyPolicyUrl) Linking.openURL(privacyPolicyUrl);
          }}
          style={{ height: 20, margin: 0, padding: 0, alignItems: "center" }}
        >
          {({ pressed }) => (
            <Text
              style={[
                styles.link,
                { color: pressed ? colors.TextPrimaryPressed : colors.TextPrimary },
              ]}
            >
              {t("auth.agreement.privacy")}
            </Text>
          )}
        </Pressable>
      </View>
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

      maxWidth: 360,
    },
    link: {
      ...Typography.boldLabel,
      color: colors.TextPrimary,
    },
  });

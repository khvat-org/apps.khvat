import React, { useMemo, useState } from "react";

import { commonAuthError } from "@nihongo/core/features/auth/lib/serverError";
import { PROFILE_ROUTES, ProfileParamList } from "@nihongo/core/pages/profile/routes";
import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { changePassword } from "@nihongo/core/shared/lib/auth";
import Input from "@nihongo/core/shared/ui/input";
import { ModalHeader } from "@nihongo/core/shared/ui/modal-header/modal-header";
import { ModelContainer } from "@nihongo/core/shared/ui/model-container/model-container";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { z } from "zod";

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "passwordRequired"),
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
    oldPassword: d.oldPassword ?? "",
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

const mapServerError = (status: number, code?: string): Record<string, string> => {
  switch (code) {
    case "invalid_credentials":
      return { oldPassword: "incorrectOldPassword" };
    case "weak_password":
      return { password: "weakPassword" };
    case "use_google_to_sign_in":
      return { oldPassword: "useGoogleToSignIn" };
  }
  return { password2: commonAuthError(status, code) ?? "somethingWrong" };
};

type NavigationProp = StackNavigationProp<ProfileParamList, typeof PROFILE_ROUTES.EDIT_PASSWORD>;

const ProfileChangePasswordPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const { t } = useTranslation();

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

  const errors = useMemo(() => validate(data), [data]);
  const isValid = Object.keys(errors).length === 0;

  const fieldError = (name: string): string | undefined => {
    if (!submitted) return undefined;
    const key = errors[name] ?? serverErrors[name];
    return key ? t(`auth.errors.${key}`) : undefined;
  };

  const save = async () => {
    setSubmitted(true);
    setServerErrors({});

    if (!isValid || submitting) return;

    setSubmitting(true);
    try {
      const { ok, status, error } = await changePassword(data["oldPassword"], data["password"]);

      if (ok) {
        navigation.goBack();
        return;
      }

      setServerErrors(mapServerError(status, error));
    } catch {
      setServerErrors({ password2: "requestFailed" });
    } finally {
      setSubmitting(false);
    }
  };

  const canSave = isValid && !submitting;

  return (
    <ModelContainer>
      <View style={{ flex: 1 }}>
        <ModalHeader
          title={t("profile.edit.changePassword")}
          left={{
            text: t("common.back"),
            onPress: () => navigation.goBack(),
          }}
          right={{
            text: t("common.save"),
            onPress: save,
            isDisabled: !canSave,
          }}
        />

        <View style={styles.content}>
          <Input
            placeholder={t("auth.fields.oldPassword")}
            isSecure
            autoFocus
            onChange={(val: string) => setField("oldPassword", val)}
            error={fieldError("oldPassword")}
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
      </View>
    </ModelContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,

    gap: 8,

    width: "100%",
    maxWidth: TABLET_WIDTH,
    alignSelf: "center",
  },
});

export default ProfileChangePasswordPage;

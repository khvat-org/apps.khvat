import React, { useMemo, useState } from "react";

import { commonAuthError } from "@nihongo/core/features/auth/lib/serverError";
import { PROFILE_ROUTES, ProfileParamList } from "@nihongo/core/pages/profile/routes";
import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { updateProfile } from "@nihongo/core/shared/lib/auth";
import Input from "@nihongo/core/shared/ui/input";
import { ModalHeader } from "@nihongo/core/shared/ui/modal-header/modal-header";
import { ModelContainer } from "@nihongo/core/shared/ui/model-container/model-container";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { z } from "zod";

const NAME_MAX_LENGTH = 16;

const nameSchema = z.string().trim().min(1, "nameRequired").max(NAME_MAX_LENGTH, "nameTooLong");

const validate = (name: string): string | undefined => {
  const result = nameSchema.safeParse(name);
  return result.success ? undefined : result.error.issues[0]?.message;
};

const mapServerError = (status: number, code?: string): string => {
  switch (code) {
    case "invalid_name":
      return "nameTooLong";
  }
  return commonAuthError(status, code) ?? "somethingWrong";
};

type NavigationProp = StackNavigationProp<ProfileParamList, typeof PROFILE_ROUTES.EDIT_NAME>;

const ProfileChangeNamePage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const { t } = useTranslation();
  const { colors } = useThemeContext();

  const [name, setName] = useState("");
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const error = useMemo(() => validate(name), [name]);
  const isValid = error === undefined;

  const setField = (val: string) => {
    setName(val);
    setServerError(undefined);
  };

  const fieldError = (): string | undefined => {
    if (!submitted) return undefined;
    const key = error ?? serverError;
    return key ? t(`auth.errors.${key}`) : undefined;
  };

  const save = async () => {
    setSubmitted(true);
    setServerError(undefined);

    if (!isValid || submitting) return;

    setSubmitting(true);
    try {
      const { ok, status, error: code } = await updateProfile({ name: name.trim() });

      if (ok) {
        navigation.goBack();
        return;
      }

      setServerError(mapServerError(status, code));
    } catch {
      setServerError("requestFailed");
    } finally {
      setSubmitting(false);
    }
  };

  const canSave = isValid && !submitting;

  return (
    <ModelContainer>
      <View style={{ flex: 1 }}>
        <ModalHeader
          title={t("profile.edit.changeName")}
          left={{
            text: t("common.back"),
            onPress: () => navigation.goBack(),
          }}
          right={{
            text: t("common.save"),
            onPress: save,
            color: canSave ? colors.TextPrimary : colors.TextDisabled,
          }}
        />

        <View style={styles.content}>
          <Input
            placeholder={t("auth.fields.newName")}
            value={name}
            autoFocus
            onChange={setField}
            error={fieldError()}
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

export default ProfileChangeNamePage;

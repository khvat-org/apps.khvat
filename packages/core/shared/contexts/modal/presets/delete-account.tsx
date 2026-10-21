import React, { useEffect, useState } from "react";

import { commonAuthError } from "@nihongo/core/features/auth/lib/serverError";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text } from "react-native";

import { TABLET_WIDTH } from "../../../constants/sizes";
import { Typography } from "../../../typography";
import PrimaryButton from "../../../ui/buttons/Primary/primary-button";
import SecondaryButton from "../../../ui/buttons/Secondary/secondary-button";
import Input from "../../../ui/input";
import { ColorsType, useThemeContext } from "../../theme/theme-context";

const RESEND_COOLDOWN_SEC = 45;

export type DeleteActionResult = { ok: boolean; status?: number; error?: string };

interface DeleteAccountModalProps {
  // * Подтверждает удаление кодом (DELETE /account). ok=true → аккаунт удалён.
  onConfirm: (code: string) => Promise<DeleteActionResult>;
  // * Повторно запрашивает код (request-deletion).
  onResend: () => Promise<DeleteActionResult>;
  // * Вызывается после успешного удаления (очистка токенов + выход на онбординг).
  onSuccess: () => void;
  onCancel: () => void;
}

// * Backend error codes (docs/auth/remove_account.md) -> i18n-ключи (auth.errors.*).
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
    case "account_migrating":
      return "accountMigrating";
  }
  return commonAuthError(status, code) ?? "somethingWrong";
};

export const DeleteAccountModal = (props: DeleteAccountModalProps) => {
  const { onConfirm, onResend, onSuccess, onCancel } = props;

  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SEC);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const isCodeValid = /^\d{6}$/.test(code);

  const onChangeCode = (val: string) => {
    setCode(val);
    if (error) setError(undefined);
  };

  const confirm = async () => {
    if (!isCodeValid) {
      setError("codeRequired");
      return;
    }

    setSubmitting(true);
    try {
      const { ok, status, error: err } = await onConfirm(code);

      if (ok) {
        onSuccess();
        return;
      }

      setError(mapCodeError(status ?? 0, err));
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
      const { ok, status, error: err } = await onResend();

      if (ok) {
        setCooldown(RESEND_COOLDOWN_SEC);
        return;
      }

      setError(mapCodeError(status ?? 0, err));
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
    <View style={styles.modal}>
      <Text style={styles.title}>{t("settings.deleteAccount.title")}</Text>
      <Text style={styles.subtitle}>{t("settings.deleteAccount.subtitle")}</Text>

      <View style={styles.input}>
        <Input
          placeholder={t("auth.fields.code")}
          onChange={onChangeCode}
          error={error ? t(`auth.errors.${error}`) : undefined}
        />
      </View>

      <View style={styles.buttons}>
        <PrimaryButton onClick={onCancel} isFullWidth text={t("alert.cancel")} />
        <SecondaryButton
          onClick={confirm}
          isOutline
          isFullWidth
          isDisabled={!isCodeValid || submitting}
          text={t("settings.deleteAccount.confirm")}
        />
      </View>

      <SecondaryButton
        onClick={resend}
        isFullWidth
        isDisabled={cooldown > 0 || resending}
        containerStyles={styles.resend}
        text={resendLabel}
      />
    </View>
  );
};

const makeStyles = (color: ColorsType) =>
  StyleSheet.create({
    modal: {
      backgroundColor: color.BgPrimary,
      padding: 16,
      borderRadius: 24,

      width: "100%",
      maxWidth: TABLET_WIDTH,
    },
    title: {
      color: color.TextPrimary,
      ...Typography.H4,
      textAlign: "center",
    },
    subtitle: {
      color: color.TextPrimary,
      ...Typography.regularDefault,
      textAlign: "center",
      marginTop: 8,
    },
    input: {
      marginTop: 16,
    },
    buttons: {
      marginTop: 16,
      flexDirection: "row",
      gap: 16,
    },
    resend: {
      marginTop: 8,
    },
  });

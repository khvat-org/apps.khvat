import React from "react";

import SettingItem from "@nihongo/core/entities/setting/setting-item/setting-item";
import { commonAuthError } from "@nihongo/core/features/auth/lib/serverError";
import { useEraseData } from "@nihongo/core/features/settings/lib/use-erase-data";
import { useModal } from "@nihongo/core/shared/contexts/modal/modal-context";
import { AlertModal } from "@nihongo/core/shared/contexts/modal/presets/alert";
import { ConfirmationModal } from "@nihongo/core/shared/contexts/modal/presets/confirmation";
import { DeleteAccountModal } from "@nihongo/core/shared/contexts/modal/presets/delete-account";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import {
  clearTokens,
  deleteAccount,
  logout as revokeSession,
  requestAccountDeletion,
} from "@nihongo/core/shared/lib/auth";
import { SignOutIcon, TrashIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";

const AccountActions: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();

  const { showModal, hideModal } = useModal();
  const eraseData = useEraseData();

  const logout = async () => {
    await revokeSession();
    await eraseData();
  };

  const confirmLogout = () =>
    showModal({
      closeOnBackdrop: false,
      onClose: () => {},
      content: (
        <ConfirmationModal
          title={t("settings.logout.title")}
          subtitle={t("settings.logout.subtitle")}
          cancelText={t("alert.cancel")}
          confirmText={t("alert.confirm")}
          onConfirm={() => {
            void logout();
            hideModal();
          }}
          onCancel={hideModal}
        />
      ),
    });

  const onDeleted = async () => {
    hideModal();
    await clearTokens();
    await eraseData();
  };

  const showDeleteCodeModal = () =>
    showModal({
      closeOnBackdrop: false,
      onClose: () => {},
      content: (
        <DeleteAccountModal
          onConfirm={(code) => deleteAccount(code)}
          onResend={requestAccountDeletion}
          onSuccess={onDeleted}
          onCancel={hideModal}
        />
      ),
    });

  const showError = (subtitle: string) =>
    showModal({
      closeOnBackdrop: false,
      onClose: () => {},
      content: (
        <AlertModal
          title={t("settings.deleteAccount.button")}
          subtitle={subtitle}
          onPress={hideModal}
        />
      ),
    });

  const requestDelete = async () => {
    try {
      const { ok, status, error } = await requestAccountDeletion();

      if (ok || error === "resend_cooldown") {
        showDeleteCodeModal();
        return;
      }

      if (error === "account_migrating") {
        showError(t("auth.errors.accountMigrating"));
        return;
      }

      showError(t(`auth.errors.${commonAuthError(status, error) ?? "somethingWrong"}`));
    } catch {
      showError(t("auth.errors.requestFailed"));
    }
  };

  const confirmDelete = () =>
    showModal({
      closeOnBackdrop: false,
      onClose: () => {},
      content: (
        <ConfirmationModal
          title={t("settings.deleteAccount.confirmTitle")}
          subtitle={t("settings.deleteAccount.confirmSubtitle")}
          cancelText={t("alert.cancel")}
          confirmText={t("settings.deleteAccount.confirm")}
          onConfirm={() => void requestDelete()}
          onCancel={hideModal}
        />
      ),
    });

  return (
    <>
      <SettingItem
        leftIcon={<TrashIcon size={20} color={colors.BgDanger} />}
        isDanger
        text={t("settings.deleteAccount.button")}
        onClick={confirmDelete}
      />
      <SettingItem
        leftIcon={<SignOutIcon size={20} color={colors.BgDanger} />}
        isLast
        isDanger
        text={t("settings.logout.button")}
        onClick={confirmLogout}
      />
    </>
  );
};

export default AccountActions;

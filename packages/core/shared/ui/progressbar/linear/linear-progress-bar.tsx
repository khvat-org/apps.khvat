import React from "react";

import { FeatureFlagsService } from "@nihongo/core/shared/services/feature-flags-service/feature-flags-service";
import { XIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";

import { useModal } from "../../../contexts/modal/modal-context";
import { ConfirmationModal } from "../../../contexts/modal/presets/confirmation";
import { ColorsType, useThemeContext } from "../../../contexts/theme/theme-context";
import { Typography } from "../../../typography/index";
import Button from "../../button";

interface ProgressBarProp {
  close?: () => void;
  requireConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationSubtitle?: string;
  current: number;
  all: number;
  title?: string;
}

const LinearProgressBar: React.FC<ProgressBarProp> = ({
  close,
  requireConfirmation = true,
  confirmationTitle,
  confirmationSubtitle,
  current,
  all,
  title,
}) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const { showModal, hideModal } = useModal();

  const styles = makeStyles(colors);

  const localizedConfirmationTitle = confirmationTitle
    ? confirmationTitle
    : t("alert.exitConformation.title");
  const localizedConfirmationSubtitle = confirmationSubtitle
    ? confirmationSubtitle
    : t("alert.exitConformation.subtitle");

  const confirmationCloseAlert = () =>
    showModal({
      closeOnBackdrop: false,
      onClose: () => {},
      content: (
        <ConfirmationModal
          title={localizedConfirmationTitle}
          subtitle={localizedConfirmationSubtitle}
          cancelText={t("alert.cancel")}
          confirmText={t("alert.ok")}
          onConfirm={() => {
            hideModal();
            close?.();
          }}
          onCancel={hideModal}
        />
      ),
    });

  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarLine}>
        <View
          style={[
            styles.progressBarLineActive,
            { width: `${all > 0 ? (Math.min(current, all) / all) * 100 : 0}%` },
          ]}
        />
      </View>
      <View style={styles.progressBarBottom}>
        <Button
          color="secondary"
          size="sm"
          isHapticFeedback
          icon={<XIcon size={20} />}
          onClick={() => {
            if (requireConfirmation) {
              confirmationCloseAlert();
            } else {
              close?.();
            }
          }}
        />

        <Text style={styles.progressBarText}>
          {title ? title : t("practice.question")} {current + 1} / {all}
        </Text>

        {FeatureFlagsService.isEnabled("askAI") && (
          <Button
            color="primary"
            size="sm"
            text={"Ask AI"}
            onClick={() => {
              console.log("Тест");
            }}
          />
        )}
      </View>
    </View>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    progressBarContainer: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",

      marginTop: 8,
    },
    progressBarLine: {
      width: "100%",
      height: 4,
      backgroundColor: colors.BgSecondary,
      borderRadius: 2,
    },
    progressBarLineActive: {
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.BgContrast,
    },
    progressBarBottom: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      marginTop: 12,
    },
    progressBarClose: {
      zIndex: 999,
      justifyContent: "center",
      alignItems: "center",
    },
    progressBarText: {
      ...Typography.regularCaption,
      textAlign: "right",
      fontStyle: "normal",
      color: colors.TextSecondary,
    },
  });

export default LinearProgressBar;

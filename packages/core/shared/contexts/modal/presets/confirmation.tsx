import React from "react";

import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text } from "react-native";

import { TABLET_WIDTH } from "../../../constants/sizes";
import { Typography } from "../../../typography";
import Button from "../../../ui/button";
import { ColorsType, useThemeContext } from "../../theme/theme-context";

interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;

  title: string;
  subtitle?: string;

  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationModal = (props: ConfirmationModalProps) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();

  const { onConfirm, onCancel, title, subtitle, confirmText, cancelText } = props;

  const styles = makeStyles(colors);

  const buttonConfirmText = confirmText ? confirmText : t("alert.ok");
  const buttoncancelText = cancelText ? cancelText : t("alert.cancel");

  return (
    <View style={styles.modal}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.buttons}>
        <Button color="primary" onClick={onCancel} isFullWidth text={buttoncancelText} />
        <Button color="secondary" onClick={onConfirm} isFullWidth text={buttonConfirmText} />
      </View>
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
      marginTop: 8,
      paddingHorizontal: 16,
    },
    subtitle: {
      color: color.TextPrimary,
      ...Typography.regularDefault,
      textAlign: "center",
      marginTop: 8,
      paddingHorizontal: 16,
    },
    buttons: {
      marginTop: 32,
      flexDirection: "row",
      gap: 16,
    },
  });

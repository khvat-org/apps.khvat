import React from "react";

import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text } from "react-native";

import { TABLET_WIDTH } from "../../../constants/sizes";
import { Typography } from "../../../typography";
import Button from "../../../ui/button";
import { ColorsType, useThemeContext } from "../../theme/theme-context";

interface AlertModalProps {
  title: string;
  subtitle?: string;

  button?: string;
  onPress: () => void;
}

export const AlertModal = (props: AlertModalProps) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();

  const { onPress, title, subtitle, button } = props;

  const styles = makeStyles(colors);

  const buttonText = button ? button : t("alert.ok");

  return (
    <View style={styles.modal}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.buttons}>
        <Button color="primary" onClick={onPress} isFullWidth text={buttonText} />
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

import React, { useState } from "react";

import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { ColorsType, useThemeContext } from "../../contexts/theme/theme-context";
import Button from "../button";

const MIN_DATE = new Date(1900, 0, 1);
const CARD_MAX_WIDTH = 360;
const SUPPORTED_ORIENTATIONS = ["portrait", "landscape"] as const;

interface BirthDatePickerProps {
  value: Date | null;
  onConfirm: (date: Date) => void;
  onClose: () => void;
}

export const openAndroidBirthDatePicker = (value: Date | null, onConfirm: (date: Date) => void) => {
  DateTimePickerAndroid.open({
    value: value ?? new Date(),
    mode: "date",
    minimumDate: MIN_DATE,
    maximumDate: new Date(),
    onValueChange: (_event, date) => onConfirm(date),
  });
};

export const IOSBirthDatePicker: React.FC<BirthDatePickerProps> = ({
  value,
  onConfirm,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const [draft, setDraft] = useState(value ?? new Date());

  return (
    <Modal
      transparent
      visible
      animationType="fade"
      supportedOrientations={SUPPORTED_ORIENTATIONS}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.card}>
          <DateTimePicker
            value={draft}
            mode="date"
            display="spinner"
            locale={i18n.language}
            themeVariant={colors._theme === "dark" ? "dark" : "light"}
            minimumDate={MIN_DATE}
            maximumDate={new Date()}
            onValueChange={(_event, date) => setDraft(date)}
          />

          <View style={styles.buttons}>
            <Button color="secondary" isHapticFeedback text={t("alert.cancel")} onClick={onClose} />
            <Button
              color="primary"
              isHapticFeedback
              text={t("alert.confirm")}
              onClick={() => onConfirm(draft)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    card: {
      width: "100%",
      maxWidth: CARD_MAX_WIDTH,
      padding: 16,
      gap: 16,
      borderRadius: 24,
      backgroundColor: colors.BgPrimary,
    },
    buttons: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 16,
    },
  });

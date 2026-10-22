import React from "react";

import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { useModal } from "@nihongo/core/shared/contexts/modal/modal-context";
import { AlertModal } from "@nihongo/core/shared/contexts/modal/presets/alert";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { CaretRightIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";

import { AccessibilityError } from "@/pages/education/practice/education-practice/helpers/is-available-practice";

interface PracticeCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
  title: string;
  subtitle: string;
  onClick: () => void;
  isAvailable: () => { message: AccessibilityError; count: number };
}

const PracticeCard: React.FC<PracticeCardProps> = ({
  title,
  subtitle,
  image,
  onClick,
  isAvailable,
}) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const { showModal, hideModal } = useModal();

  const callAlert = (title: string, subtitle: string) =>
    showModal({
      closeOnBackdrop: true,
      onClose: () => {},
      content: (
        <AlertModal title={title} subtitle={subtitle} button={t("alert.ok")} onPress={hideModal} />
      ),
    });

  const onPress = () => {
    const { message, count } = isAvailable();

    if (message === AccessibilityError.Available) {
      onClick();
    } else {
      if (message === AccessibilityError.insufficientKanaSelected) {
        callAlert(
          t("practice.alert.insufficientKanaSelected.title"),
          t("practice.alert.insufficientKanaSelected.subtitle").replaceAll(
            "{count}",
            count.toString(),
          ),
        );
      }

      if (message === AccessibilityError.insufficientWordsAvailable) {
        callAlert(
          t("practice.alert.insufficientWordsAvailable.title"),
          t("practice.alert.insufficientWordsAvailable.subtitle"),
        );
      }
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: pressed ? colors.BgLightGray : colors.BgPrimary },
      ]}
    >
      <View style={styles.content}>
        {image && (
          <Image style={[styles.image, { borderColor: colors.BorderDefault }]} source={image} />
        )}

        <View style={styles.description}>
          <Text style={[{ color: colors.TextPrimary }, Typography.boldDefault]}>{title}</Text>
          <Text style={[{ color: colors.TextSecondary }, Typography.regularLabel]}>{subtitle}</Text>
        </View>
      </View>

      <CaretRightIcon color={colors.BgGray} size={20} />
    </Pressable>
  );
};

export default PracticeCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    padding: 16,
    borderRadius: 12,

    height: 86,
    gap: 16,
    marginBottom: 8,

    width: "100%",
    maxWidth: TABLET_WIDTH,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    maxWidth: "70%",
  },
  image: {
    width: 54,
    height: 54,
    borderRadius: 100,
  },
  description: {
    flexDirection: "column",
    gap: 4,
  },
});

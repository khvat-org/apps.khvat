import React, { useRef } from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text } from "react-native";

import { requestHuaweiStoreReview } from "@/shared/lib/promotions/huawei-store-review";
import { requestRustoreStoreReview } from "@/shared/lib/promotions/rustore-store-review";
import { requestStoreReview } from "@/shared/lib/promotions/store-review";
import { useTelegramPromotion } from "@/shared/lib/promotions/use-telegram-promotion";

type FinishScreenProps = {
  next: () => void;
  retry: () => void;
};

const FinishScreen: React.FC<FinishScreenProps> = ({ next, retry }) => {
  const { showTelegramPromotionIfNeeded } = useTelegramPromotion();

  const { t } = useTranslation();
  const { colors } = useThemeContext();

  const locked = useRef(false);

  const onNext = async () => {
    if (locked.current) return;
    locked.current = true;

    try {
      await requestStoreReview();
      await requestHuaweiStoreReview();
      await requestRustoreStoreReview();
      await showTelegramPromotionIfNeeded();
    } catch (error) {
      locked.current = false;
      throw error;
    }

    next();
  };

  const onRetry = () => {
    if (locked.current) return;
    locked.current = true;

    retry();
  };

  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t("lesson.learningComplete")}</Text>
        <Text style={styles.subtitle}>{t("lesson.practiceEveryDay")}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          color="secondary"
          isHapticFeedback
          isFullWidth
          text={t("common.retry")}
          onClick={onRetry}
        />
        <Button
          color="primary"
          isHapticFeedback
          isFullWidth
          text={t("common.complete")}
          onClick={onNext}
        />
      </View>
    </View>
  );
};

export default FinishScreen;

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    titleContainer: {
      width: "100%",
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonsContainer: {
      width: "100%",
      gap: 8,

      height: 116,
    },

    title: {
      ...Typography.H3,
      marginBottom: 8,
      color: colors.TextPrimary,
      textAlign: "center",

      paddingHorizontal: 16,
    },
    subtitle: {
      ...Typography.regularDefault,
      color: colors.TextSecondary,
      textAlign: "center",

      paddingHorizontal: 16,
    },
  });

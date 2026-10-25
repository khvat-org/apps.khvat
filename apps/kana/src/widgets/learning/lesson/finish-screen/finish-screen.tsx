import React from "react";

import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { LearningTitle } from "../ui/title";

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

  const onNext = async () => {
    await requestStoreReview();
    await requestHuaweiStoreReview();
    await requestRustoreStoreReview();
    await showTelegramPromotionIfNeeded();
    next();
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <LearningTitle style={[Typography.H3, { marginBottom: 16 }]}>
          {t("lesson.learningComplete")}
        </LearningTitle>
        <LearningTitle style={[Typography.regularLabel, { color: colors.TextSecondary }]}>
          {t("lesson.practiceEveryDay")}
        </LearningTitle>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          color="secondary"
          isHapticFeedback
          isFullWidth
          text={t("common.retry")}
          onClick={retry}
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

const styles = StyleSheet.create({
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
    gap: 16,

    height: 116,
  },
});

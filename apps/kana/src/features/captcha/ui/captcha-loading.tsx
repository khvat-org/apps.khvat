import React from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import SafeLayout from "@nihongo/core/shared/ui/layouts/safe-layout";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const BAR_MAX_WIDTH = 240;

interface Props {
  done: number;
  total: number;
  isSlow: boolean;
  isFailed: boolean;
  onRetry: () => void;
  onClose: () => void;
}

const CaptchaLoading: React.FC<Props> = ({ done, total, isSlow, isFailed, onRetry, onClose }) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  if (isFailed) {
    return (
      <SafeLayout>
        <View style={styles.container}>
          <Text style={styles.text}>{t("practice.captcha.loadFailed")}</Text>
          <View style={styles.buttons}>
            <Button color="secondary" isHapticFeedback text={t("common.back")} onClick={onClose} />
            <Button color="primary" isHapticFeedback text={t("common.retry")} onClick={onRetry} />
          </View>
        </View>
      </SafeLayout>
    );
  }

  return (
    <SafeLayout>
      <View style={styles.container}>
        <ActivityIndicator color={colors.BgAccent} size="large" />
        <Text style={styles.text}>{t("practice.captcha.loading")}</Text>
        {total > 0 && (
          <View style={styles.progress}>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${(done / total) * 100}%` }]} />
            </View>
            <Text style={styles.text}>{`${done} / ${total}`}</Text>
          </View>
        )}
        {isSlow && <Text style={styles.text}>{t("practice.captcha.loadSlow")}</Text>}
        <Button color="secondary" isHapticFeedback text={t("alert.cancel")} onClick={onClose} />
      </View>
    </SafeLayout>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: 16,
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.BgPrimary,
    },
    text: {
      ...Typography.regularDefault,
      color: colors.TextPrimary,
      textAlign: "center",
    },
    buttons: {
      flexDirection: "row",
      gap: 16,
    },
    progress: {
      width: "100%",
      maxWidth: BAR_MAX_WIDTH,
      gap: 8,
    },
    track: {
      height: 8,
      borderRadius: 4,
      overflow: "hidden",
      backgroundColor: colors.BgSecondary,
    },
    fill: {
      height: "100%",
      backgroundColor: colors.BgAccent,
    },
  });

export default CaptchaLoading;

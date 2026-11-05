import React, { useEffect, useRef, useState } from "react";

import ReportFields from "@nihongo/core/features/report/report-fields";
import { useReportForm } from "@nihongo/core/features/report/use-report-form";
import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { useModal } from "@nihongo/core/shared/contexts/modal/modal-context";
import { AlertModal } from "@nihongo/core/shared/contexts/modal/presets/alert";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { usePagePadding } from "@nihongo/core/shared/lib/layout/use-page-padding";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import { ModalHeader } from "@nihongo/core/shared/ui/modal-header/modal-header";
import { ModelContainer } from "@nihongo/core/shared/ui/model-container/model-container";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAGS = ["grammatical_typo", "interface_error", "incorrect_information", "other"];
const REPORT_CONTEXT = "settings";
const SCROLL_TO_INPUT_DELAY = 250;

const SettingsReportPage: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const pagePadding = usePagePadding();
  const styles = makeStyles(colors, pagePadding);

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { showModal, hideModal } = useModal();

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  useEffect(() => {
    if (Platform.OS !== "ios") return;

    const show = Keyboard.addListener("keyboardWillShow", (event) =>
      setKeyboardHeight(event.endCoordinates.height),
    );
    const hide = Keyboard.addListener("keyboardWillHide", () => setKeyboardHeight(0));

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const form = useReportForm({
    context: REPORT_CONTEXT,
    onSent: () =>
      showModal({
        onClose: () => navigation.goBack(),
        content: (
          <AlertModal
            title={t("report.success.title")}
            subtitle={t("report.success.subtitle")}
            onPress={hideModal}
          />
        ),
      }),
  });

  const scrollToInput = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), SCROLL_TO_INPUT_DELAY);
  };

  return (
    <ModelContainer>
      <View style={{ flex: 1, paddingBottom: Math.max(keyboardHeight, insets.bottom) }}>
        <ModalHeader
          title={t("report.settings.title")}
          left={{
            text: t("common.back"),
            kind: "back",
            onPress: () => navigation.goBack(),
          }}
        />

        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subtitle}>{t("report.settings.subtitle")}</Text>

          <ReportFields form={form} tags={TAGS} onInputFocus={scrollToInput} />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            color="primary"
            isHapticFeedback
            isDisabled={!form.canSend}
            text={form.sending ? undefined : t("report.send")}
            content={form.sending ? <ActivityIndicator color={colors.TextContrast} /> : undefined}
            onClick={() => void form.submit()}
          />
        </View>
      </View>
    </ModelContainer>
  );
};

const makeStyles = (colors: ColorsType, pagePadding: number) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
    },
    content: {
      width: "100%",
      maxWidth: TABLET_WIDTH + 32,
      alignSelf: "center",
      paddingHorizontal: pagePadding,
    },
    subtitle: {
      ...Typography.regularDefault,
      color: colors.TextPrimary,
    },
    footer: {
      width: "100%",
      maxWidth: TABLET_WIDTH + 32,
      alignSelf: "center",
      paddingHorizontal: pagePadding,
      paddingTop: 16,
      paddingBottom: 16,
    },
  });

export default SettingsReportPage;

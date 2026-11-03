import React, { useEffect, useRef, useState } from "react";

import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ReportFields from "./report-fields";
import { useReportForm } from "./use-report-form";

const MODAL_VERTICAL_OFFSET = 80;
const SCROLL_TO_INPUT_DELAY = 250;

const SHOW_EVENT = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
const HIDE_EVENT = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

type ReportModalProps = {
  tags: string[];
  context: string;

  onClose: () => void;
  onSent: () => void;
};

const ReportModal: React.FC<ReportModalProps> = ({ tags, context, onClose, onSent }) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const form = useReportForm({ context, onSent });

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const isInputFocused = useRef(false);

  useEffect(() => {
    const show = Keyboard.addListener(SHOW_EVENT, (event) =>
      setKeyboardHeight(event.endCoordinates.height),
    );
    const hide = Keyboard.addListener(HIDE_EVENT, () => setKeyboardHeight(0));

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const maxHeight =
    height -
    keyboardHeight -
    MODAL_VERTICAL_OFFSET -
    insets.top -
    (keyboardHeight > 0 ? 0 : insets.bottom);

  const scrollToInput = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), SCROLL_TO_INPUT_DELAY);
  };

  return (
    <View style={[styles.modal, { maxHeight }]}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          if (isInputFocused.current) scrollRef.current?.scrollToEnd({ animated: false });
        }}
      >
        <Text style={styles.title}>{t("report.title")}</Text>
        <Text style={styles.subtitle}>{t("report.subtitle")}</Text>

        <ReportFields
          form={form}
          tags={tags}
          onInputFocus={() => {
            isInputFocused.current = true;
            scrollToInput();
          }}
          onInputBlur={() => {
            isInputFocused.current = false;
          }}
        />
      </ScrollView>

      <View style={styles.buttons}>
        <Button
          color="secondary"
          isHapticFeedback
          isFullWidth
          text={t("alert.cancel")}
          onClick={onClose}
        />
        <Button
          color="primary"
          isHapticFeedback
          isFullWidth
          isDisabled={!form.canSend}
          text={form.sending ? undefined : t("report.send")}
          content={form.sending ? <ActivityIndicator color={colors.TextContrast} /> : undefined}
          onClick={() => void form.submit()}
        />
      </View>
    </View>
  );
};

export default ReportModal;

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    modal: {
      backgroundColor: colors.BgPrimary,
      borderRadius: 24,
      overflow: "hidden",

      width: "100%",
      maxWidth: TABLET_WIDTH,
    },
    scroll: {
      flexGrow: 0,
      flexShrink: 1,
    },
    scrollContent: {
      paddingTop: 24,
      paddingHorizontal: 24,
    },
    title: {
      ...Typography.H4,
      color: colors.TextPrimary,
      textAlign: "center",
    },
    subtitle: {
      ...Typography.regularDefault,
      color: colors.TextPrimary,
      textAlign: "center",
      marginTop: 4,
    },
    buttons: {
      flexDirection: "row",
      gap: 16,
      padding: 24,
    },
  });

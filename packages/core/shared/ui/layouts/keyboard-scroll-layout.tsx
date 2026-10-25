import React, { ReactNode } from "react";

import { CaretLeftIcon } from "phosphor-react-native";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import { TABLET_WIDTH } from "../../constants/sizes";
import Button from "../button";

interface KeyboardScrollLayoutProps {
  children: ReactNode;
  onBack?: () => void;
}

const KeyboardScrollLayout: React.FC<KeyboardScrollLayoutProps> = ({ children, onBack }) => {
  const insets = useSafeAreaInsets();
  const styles = makeStyles(insets);

  return (
    <View style={styles.page}>
      {onBack && (
        <Button
          color="primary"
          variant="text"
          isHapticFeedback
          icon={<CaretLeftIcon size={32} />}
          onClick={onBack}
          style={styles.back}
        />
      )}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const makeStyles = (insets: EdgeInsets) =>
  StyleSheet.create({
    page: {
      paddingLeft: insets.left + 16,
      paddingRight: insets.right + 16,

      width: "100%",
      flex: 1,
    },

    back: {
      position: "absolute",
      left: insets.left + 16,
      top: insets.top + 16,

      // * Иначе скролл-контейнер, будучи поздним сиблингом, перекроет кнопку.
      zIndex: 1,
    },

    flex: {
      width: "100%",
      flex: 1,
    },
    content: {
      paddingTop: insets.top + 16,
      paddingBottom: insets.bottom + 16,

      flexGrow: 1,
      alignItems: "center",

      width: "100%",
      maxWidth: TABLET_WIDTH,
      alignSelf: "center",
    },
  });

export default KeyboardScrollLayout;

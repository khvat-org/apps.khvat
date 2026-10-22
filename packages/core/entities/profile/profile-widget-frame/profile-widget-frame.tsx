import React, { useState } from "react";

import { useHaptic } from "@nihongo/core/shared/contexts/haptic/haptic-context";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import PrimaryButton from "@nihongo/core/shared/ui/buttons/Primary/primary-button";
import SecondaryButton from "@nihongo/core/shared/ui/buttons/Secondary/secondary-button";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
  useLongPressGesture,
} from "react-native-gesture-handler";

interface ProfileWidgetFrameProps {
  children: React.ReactNode;
  onHide: () => void;
}

const LONG_PRESS_MS = 450;

const ProfileWidgetFrame: React.FC<ProfileWidgetFrameProps> = ({ children, onHide }) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const { triggerHaptic } = useHaptic();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const longPress = useLongPressGesture({
    minDuration: LONG_PRESS_MS,
    runOnJS: true,
    enabled: !isMenuOpen,
    onActivate: () => {
      triggerHaptic();
      setIsMenuOpen(true);
    },
  });

  const close = () => setIsMenuOpen(false);

  const hide = () => {
    setIsMenuOpen(false);
    onHide();
  };

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={longPress}>
        <View>
          {children}

          {isMenuOpen && (
            <View style={styles.overlay}>
              <BlurView
                intensity={30}
                tint={colors._theme === "dark" ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
              <Pressable style={StyleSheet.absoluteFill} onPress={close} />

              <View style={styles.actions}>
                <PrimaryButton
                  isHapticFeedback
                  width="100%"
                  text={t("profile.widgets.hide")}
                  onClick={hide}
                />
                <SecondaryButton
                  isHapticFeedback
                  width="100%"
                  text={t("alert.cancel")}
                  onClick={close}
                />
              </View>
            </View>
          )}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  actions: {
    gap: 8,
    width: "100%",
    maxWidth: 360,
  },
});

export default ProfileWidgetFrame;

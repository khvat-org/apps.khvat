import React from "react";

import { CaretLeftIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeContext } from "../../contexts/theme/theme-context";
import { getAsymmetricSide } from "../../lib/layout/get-asymmetric-side";

import SideRailButton from "./side-rail-button";
import { useHasSideRailActions, useSideRailInsets } from "./side-rail-insets-context";

const DEFAULT_TOP = 16;
const SENSOR_SIDE_PADDING = 12;

interface SideRailBackButtonProps {
  onPress: () => void;
}

const SideRailBackButton: React.FC<SideRailBackButtonProps> = ({ onPress }) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const insets = useSafeAreaInsets();
  const sideRail = useSideRailInsets();
  const hasActions = useHasSideRailActions();
  const side = getAsymmetricSide(insets);

  if (!hasActions || !side) return null;

  return (
    <View
      style={[
        styles.container,
        {
          [side]: 0,
          width: insets[side],
          top: sideRail?.top ?? DEFAULT_TOP,
          [side === "right" ? "paddingRight" : "paddingLeft"]: SENSOR_SIDE_PADDING,
        },
      ]}
    >
      <SideRailButton label={t("common.back")} onPress={onPress}>
        <CaretLeftIcon size={20} color={colors.TextPrimary} />
      </SideRailButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignItems: "center",
    zIndex: 9,
  },
});

export default SideRailBackButton;

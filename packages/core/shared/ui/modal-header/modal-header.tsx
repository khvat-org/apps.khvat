import React from "react";

import { usePagePadding } from "@nihongo/core/shared/lib/layout/use-page-padding";
import type { IconProps } from "phosphor-react-native";
import { ArrowUUpLeftIcon, CaretLeftIcon, CheckIcon, XIcon } from "phosphor-react-native";
import { View, StyleSheet, Text } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import { ColorsType, useThemeContext } from "../../contexts/theme/theme-context";
import { getAsymmetricSide } from "../../lib/layout/get-asymmetric-side";
import { Typography } from "../../typography";
import SideRailButton from "../bottom-tap/side-rail-button";
import { useHasSideRailActions, useSideRailInsets } from "../bottom-tap/side-rail-insets-context";
import Button, { ButtonColor } from "../button";
import { useInsideModelContainer } from "../model-container/model-container";

const RAIL_SHEET_TOP_MARGIN = 8;
const RAIL_DEFAULT_TOP = 16;
const RAIL_SENSOR_SIDE_PADDING = 12;

const LEFT_ICONS = { cancel: ArrowUUpLeftIcon, back: CaretLeftIcon, close: XIcon };

type ModalHeaderButtonKind = keyof typeof LEFT_ICONS;

interface ModalHeaderButton {
  onPress: () => void;
  text: string;
  kind?: ModalHeaderButtonKind;
  color?: ButtonColor;
  textColor?: string;
  isDisabled?: boolean;
}

interface RailButtonProps {
  button: ModalHeaderButton;
  Icon: React.ComponentType<IconProps>;
}

const RailButton: React.FC<RailButtonProps> = ({ button, Icon }) => {
  const { colors } = useThemeContext();

  return (
    <SideRailButton label={button.text} isDisabled={button.isDisabled} onPress={button.onPress}>
      <Icon size={20} color={button.isDisabled ? colors.BgGray : colors.TextPrimary} />
    </SideRailButton>
  );
};

interface ModalHeaderProps {
  title: string;
  titleColor?: string;

  left?: ModalHeaderButton;
  right?: ModalHeaderButton;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ left, title, titleColor, right }) => {
  const insets = useSafeAreaInsets();
  const pagePadding = usePagePadding();

  const { colors } = useThemeContext();
  const insideModelContainer = useInsideModelContainer();
  const sideRail = useSideRailInsets();
  const hasRailActions = useHasSideRailActions();
  const styles = makeStyles(
    colors,
    insideModelContainer ? { ...insets, left: 0, right: 0 } : insets,
    pagePadding,
  );

  const side = getAsymmetricSide(insets);

  if (insideModelContainer && side && hasRailActions) {
    const railTop = sideRail?.top ?? RAIL_DEFAULT_TOP + RAIL_SHEET_TOP_MARGIN;

    return (
      <View style={styles.header}>
        <Text style={[styles.railTitle, titleColor && { color: titleColor }]}>{title}</Text>

        <View
          style={[
            styles.rail,
            {
              [side]: -insets[side],
              width: insets[side],
              [side === "right" ? "paddingRight" : "paddingLeft"]: RAIL_SENSOR_SIDE_PADDING,
              top: railTop - RAIL_SHEET_TOP_MARGIN,
            },
          ]}
        >
          {left && <RailButton button={left} Icon={LEFT_ICONS[left.kind ?? "back"]} />}
          {right && <RailButton button={right} Icon={CheckIcon} />}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <Button
        color={left?.color ?? "secondary"}
        variant="text"
        isHapticFeedback={!!left}
        isDisabled={left?.isDisabled}
        text={left?.text}
        onClick={left?.onPress}
        style={[styles.button, { justifyContent: "flex-start" }]}
        textStyle={left?.textColor ? { color: left.textColor } : undefined}
      />

      <Text style={[styles.title, titleColor && { color: titleColor }]}>{title}</Text>

      <Button
        color={right?.color ?? "primary"}
        variant="text"
        isDisabled={right?.isDisabled}
        text={right?.text}
        onClick={right?.onPress}
        style={[styles.button, { justifyContent: "flex-end" }]}
        textStyle={right?.textColor ? { color: right.textColor } : undefined}
      />
    </View>
  );
};

const makeStyles = (colors: ColorsType, insets: EdgeInsets, pagePadding: number) =>
  StyleSheet.create({
    header: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",

      height: 54,

      paddingLeft: insets.left + pagePadding,
      paddingRight: insets.right + pagePadding,
    },
    title: {
      position: "absolute",
      width: "100%",
      textAlign: "center",
      ...Typography.boldDefault,
      color: colors.TextPrimary,

      left: 16,
    },
    railTitle: {
      ...Typography.boldDefault,
      color: colors.TextPrimary,
    },
    rail: {
      position: "absolute",
      alignItems: "center",
      gap: 8,
      zIndex: 9,
    },
    button: {
      width: "40%",
      height: 50,
      zIndex: 9,
    },
  });

import React, { ReactNode } from "react";

import { useHaptic } from "@nihongo/core/shared/contexts/haptic/haptic-context";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { ILetter } from "@nihongo/core/shared/data/lettersTable";
import useGetRomaji from "@nihongo/core/shared/lib/i18n/hooks/useKey";
import { Typography } from "@nihongo/core/shared/typography";
import { Pressable, StyleSheet, Text, View } from "react-native";

const CELL_GAP = 9;

import { StatisticLevel } from "@/pages/kana/kana-table-list-page/model/types";
import { KanaAlphabet } from "@/shared/constants/kana";
import getKana from "@/shared/helpers/getKanaKey";

interface CellProps {
  isLong: boolean;

  active?: boolean;
  isPlus?: boolean;

  onPress?: (id: string) => void;

  kana: KanaAlphabet.Hiragana | KanaAlphabet.Katakana;

  cell: ILetter | null | undefined;

  isStartOfLine?: string | null | undefined | false | ReactNode;

  indicator?: StatisticLevel;

  isTablet?: boolean;
  screenWidth?: number;
  screenHeight?: number;
}

const Cell: React.FC<CellProps> = ({
  onPress,

  isLong,
  kana,
  cell,
  isPlus,
  active,
  isStartOfLine,
  indicator,
  isTablet,
  screenWidth = 0,
  screenHeight = 0,
}) => {
  const { colors } = useThemeContext();
  const { getRomaji } = useGetRomaji();
  const { triggerHaptic } = useHaptic();

  let tabletCellSize = isTablet ? screenHeight / 6 - 50 : screenWidth / 6 - 14;

  if (tabletCellSize > 85) {
    tabletCellSize = 85;
  }

  const widthLong = (tabletCellSize * 5 + CELL_GAP * 2) / 3;

  const getFintSize = (type: "regularLabel" | "default") => {
    const x =
      tabletCellSize / 60 > 1.2 ? 1.2 : tabletCellSize / 60 < 0.6 ? 0.6 : tabletCellSize / 60;

    const base = type == "regularLabel" ? Typography.regularLabel : Typography.regularDefault;

    return {
      ...base,

      lineHeight: Math.round((base.lineHeight || 1) * x),
      fontSize: Math.round((base.fontSize || 1) * x),
    };
  };

  const getIndicatorColor = (indicator?: StatisticLevel) => {
    switch (indicator) {
      case StatisticLevel.Green:
        return colors.BgSuccess;
      case StatisticLevel.Yellow:
        return colors.BgWarning;
      case StatisticLevel.Red:
        return colors.BgDanger;
      default:
        return colors.transparent;
    }
  };

  if (isPlus) {
    return (
      <Pressable
        onPress={() => {
          triggerHaptic();
          onPress?.("");
        }}
        style={({ pressed }) => [
          styles.cell,
          { backgroundColor: pressed ? colors.BgContrastPressed : colors.BgContrast },
          !isTablet
            ? {
                width: isLong ? widthLong : tabletCellSize,
                height: tabletCellSize,
                backgroundColor: pressed ? colors.BgLightGray : colors.BgSecondary,
                borderColor: active ? colors.transparent : colors.BorderDefault,
              }
            : {},
          isTablet
            ? {
                width: tabletCellSize,
                height: tabletCellSize,
              }
            : {},
        ]}
      >
        {isStartOfLine as React.ReactElement}
      </Pressable>
    );
  }

  if (!cell) {
    return (
      <View
        style={[
          styles.cell,
          !isTablet
            ? {
                width: isLong ? widthLong : tabletCellSize,
                height: tabletCellSize,
                backgroundColor: colors.transparent,
                borderColor: colors.transparent,
              }
            : {},
          isTablet
            ? {
                width: tabletCellSize,
                height: tabletCellSize,
              }
            : {},
        ]}
      >
        <Text
          style={[getFintSize("regularLabel"), styles.cellText, { color: colors.TextSecondary }]}
        >
          {isStartOfLine}
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => {
        onPress?.(cell.id);
        triggerHaptic();
      }}
      style={({ pressed }) => [
        styles.cell,
        {
          width: isLong ? widthLong : tabletCellSize,
          height: tabletCellSize,
          backgroundColor: !active
            ? pressed
              ? colors.BgLightGray
              : colors.BgSecondary
            : pressed
              ? colors.BgAccentPressed
              : colors.BgAccent,
        },
        isTablet && {
          width: tabletCellSize,
          height: tabletCellSize,
        },
      ]}
    >
      <>
        {indicator && (
          <View style={[styles.cellIndicator, { backgroundColor: getIndicatorColor(indicator) }]} />
        )}

        <View
          style={[
            {
              alignItems: "center",
              justifyContent: "center",
            },
            {
              width: isLong ? widthLong : tabletCellSize,
              height: tabletCellSize,
            },
            isTablet && {
              width: tabletCellSize,
              height: tabletCellSize,
            },
          ]}
        >
          <Text
            style={[
              getFintSize("default"),
              styles.cellText,
              { color: active ? colors.TextWhite : colors.TextPrimary },
            ]}
          >
            {getKana(cell, kana)}
          </Text>

          <Text
            style={[
              getFintSize("regularLabel"),
              styles.cellText,
              { color: active ? colors.TextWhite : colors.TextPrimary },
            ]}
          >
            {getRomaji(cell).toUpperCase()}
          </Text>
        </View>
      </>
    </Pressable>
  );
};

export default Cell;

const styles = StyleSheet.create({
  cell: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    position: "relative",
  },
  cellText: {
    width: "100%",
    textAlign: "center",
  },
  cellIndicator: {
    position: "absolute",
    width: 6,
    height: 6,
    top: 5,
    right: 5,
    borderRadius: 100,
  },
});

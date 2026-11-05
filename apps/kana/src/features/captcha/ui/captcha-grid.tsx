import React from "react";

import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import CaptchaTile, { CaptchaTileState } from "@/features/captcha/ui/captcha-tile";
import { CaptchaTile as CaptchaTileData } from "@/pages/education/practice/education-practice/lib/types/questions";

const COLUMNS = 3;
const GAP = 8;

interface Props {
  tiles: CaptchaTileData[];
  stateOf: (tile: CaptchaTileData, index: number) => CaptchaTileState;
  onPress?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

const CaptchaGrid: React.FC<Props> = ({ tiles, stateOf, onPress, style }) => {
  const rowCount = Math.ceil(tiles.length / COLUMNS);
  const rows = Array.from({ length: rowCount }, (_, row) =>
    tiles.slice(row * COLUMNS, (row + 1) * COLUMNS),
  );

  return (
    <View style={[styles.grid, style]}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((tile, columnIndex) => {
            const index = rowIndex * COLUMNS + columnIndex;

            return (
              <CaptchaTile
                key={`${tile.text}:${tile.font}`}
                tile={tile}
                index={index}
                state={stateOf(tile, index)}
                onPress={onPress}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    gap: GAP,
  },
  row: {
    flexDirection: "row",
    gap: GAP,
  },
});

export default CaptchaGrid;

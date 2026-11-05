import React, { useMemo } from "react";

import { dakuon, handakuon, base, yoon, ILetter } from "@nihongo/core/shared/data/lettersTable";
import useGetRomaji from "@nihongo/core/shared/lib/i18n/hooks/useKey";
import { View, StyleSheet } from "react-native";

import Cell, { CELL_GAP, TABLET_HEADER_HEIGHT } from "@/entities/kana/cell/cell";
import { useStatisticsContext } from "@/pages/kana/kana-table-list-page/model/hooks";
import { Alphabet, KanaAlphabet } from "@/shared/constants/kana";
import { getColumnLabel, getRowLabel } from "@/shared/helpers/kana-letter";

const TABLE_ROWS = 5;
const TABLE_TOP_MARGIN = 24;
const MIN_CELL_SIZE = 24;

export const getKanaTableCellSize = (areaHeight: number, bottomMargin: number) => {
  const fixedHeight =
    TABLE_TOP_MARGIN + bottomMargin + TABLET_HEADER_HEIGHT + CELL_GAP * TABLE_ROWS;
  const available = areaHeight - fixedHeight;

  return Math.max(MIN_CELL_SIZE, available / TABLE_ROWS);
};

interface EducationKanaTableProps {
  kana: KanaAlphabet.Hiragana | KanaAlphabet.Katakana;
  type: Alphabet;
  cellSize: number;
  bottomMargin: number;
  onClick?: (id: string) => void;
  last?: boolean;
}

const EducationKanaTableForTablet: React.FC<EducationKanaTableProps> = ({
  kana,
  type,
  cellSize,
  bottomMargin,
  onClick = () => {},
}) => {
  const letters = useMemo(() => {
    switch (type) {
      case "base":
        return base;
      case "dakuon":
        return dakuon;
      case "handakuon":
        return handakuon;
      default:
        return yoon;
    }
  }, [type]);

  const { statistics, isEnabled: isEnabledStats } = useStatisticsContext();
  const levels = statistics[kana];

  const { getRomaji } = useGetRomaji();

  const getStartOfRow = (letter: ILetter) => getRowLabel(getRomaji(letter));

  const getEndOfColumn = (letter: ILetter) => getColumnLabel(getRomaji(letter));

  return (
    <View style={styles.container}>
      <View style={[styles.content, { marginBottom: bottomMargin }]}>
        <View style={styles.columnButtons}>
          <Cell
            isTablet
            cellSize={cellSize}
            key={"0/start_of_line"}
            isHeader
            isLong={false}
            kana={kana}
            cell={null}
            isStartOfLine={""}
          />
          {letters[0].map((cell, cellIndex) => (
            <Cell
              isTablet
              cellSize={cellSize}
              key={`${cellIndex}/start_of_column`}
              isLong={letters[0].length === 3}
              kana={kana}
              cell={null}
              isStartOfLine={getEndOfColumn(cell)}
            />
          ))}

          {letters[0].length === 3 && (
            <Cell
              isTablet
              cellSize={cellSize}
              key={`${4}/start_of_column`}
              isLong={letters[0].length === 3}
              kana={kana}
              cell={null}
            />
          )}
          {letters[0].length === 3 && (
            <Cell
              isTablet
              cellSize={cellSize}
              key={`${5}/start_of_column`}
              isLong={letters[0].length === 3}
              kana={kana}
              cell={null}
            />
          )}
        </View>

        {letters &&
          letters.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              <View style={styles.rowButtons}>
                <Cell
                  isTablet
                  cellSize={cellSize}
                  key={`${rowIndex}/start_of_line`}
                  isHeader
                  isLong={false}
                  kana={kana}
                  cell={null}
                  isStartOfLine={getStartOfRow(row[0])}
                />
              </View>
              {(rowIndex === 7 && type === "base"
                ? [row[0], null, row[1], null, row[2]]
                : rowIndex === 9 && type === "base"
                  ? [row[0], null, null, null, row[1]]
                  : rowIndex == 10 && type === "base"
                    ? [null, null, row[0], null, null]
                    : row
              ).map((cell, cellIndex) => (
                <Cell
                  isTablet
                  cellSize={cellSize}
                  key={`${rowIndex}/${cellIndex}`}
                  onPress={() => cell && onClick(cell.id)}
                  isLong={row.length === 3 && row[0].id !== "9e4e7b1b-2b3c-467d-8c24-be83a4ae5a89"}
                  kana={kana}
                  cell={cell}
                  indicator={cell && isEnabledStats ? levels[cell.id]?.level : undefined}
                />
              ))}
            </View>
          ))}
      </View>
    </View>
  );
};

export default EducationKanaTableForTablet;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: TABLE_TOP_MARGIN,

    gap: 9,
    flexDirection: "row",
    alignItems: "baseline",
  },
  row: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 9,
  },
  columnButtons: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  rowButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 9,
  },
});

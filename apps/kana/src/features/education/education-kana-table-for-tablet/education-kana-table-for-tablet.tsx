import React, { useMemo } from "react";

import { dakuon, handakuon, base, yoon, ILetter } from "@nihongo/core/shared/data/lettersTable";
import useGetRomaji from "@nihongo/core/shared/lib/i18n/hooks/useKey";
import { useWindowDimensions, View, StyleSheet } from "react-native";

import Cell from "@/entities/kana/cell/cell";
import { useStatisticsContext } from "@/pages/kana/kana-table-list-page/model/hooks";
import { Alphabet, KanaAlphabet } from "@/shared/constants/kana";
import { getColumnLabel, getRowLabel } from "@/shared/helpers/kana-letter";
interface EducationKanaTableProps {
  kana: KanaAlphabet.Hiragana | KanaAlphabet.Katakana;
  type: Alphabet;
  onClick?: (id: string) => void;
  last?: boolean;
}

const EducationKanaTableForTablet: React.FC<EducationKanaTableProps> = ({
  kana,
  type,
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

  const { width, height } = useWindowDimensions();

  const { statistics, isEnabled: isEnabledStats } = useStatisticsContext();
  const levels = statistics[kana];

  const { getRomaji } = useGetRomaji();

  const getStartOfRow = (letter: ILetter) => getRowLabel(getRomaji(letter));

  const getEndOfColumn = (letter: ILetter) => getColumnLabel(getRomaji(letter));

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.columnButtons}>
          <Cell
            isTablet
            screenWidth={width}
            screenHeight={height}
            key={"0/start_of_line"}
            isLong={false}
            kana={kana}
            cell={null}
            isStartOfLine={""}
          />
          {letters[0].map((cell, cellIndex) => (
            <Cell
              isTablet
              screenWidth={width}
              screenHeight={height}
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
              screenWidth={width}
              screenHeight={height}
              key={`${4}/start_of_column`}
              isLong={letters[0].length === 3}
              kana={kana}
              cell={null}
            />
          )}
          {letters[0].length === 3 && (
            <Cell
              isTablet
              screenWidth={width}
              screenHeight={height}
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
                  screenWidth={width}
                  screenHeight={height}
                  key={`${rowIndex}/start_of_line`}
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
                  screenWidth={width}
                  screenHeight={height}
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
    marginBottom: 16,
    marginTop: 20,

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

import React from "react";

import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { StyleSheet, Text, View } from "react-native";

import { parseString } from "../lib/parse-string";

interface TableProps {
  data: string[][];
}

const Table: React.FC<TableProps> = ({ data }) => {
  const { colors } = useThemeContext();

  const tableColors = { backgroundColor: colors.BgSecondary };
  const columnStyles = {
    borderColor: colors.BorderDefault,
    width: 100 / data.length + "%",
  };
  const cellStyles = { borderColor: colors.BorderDefault };

  return (
    <View style={[styles.table, tableColors]}>
      {data.map((column, idx) => (
        <View
          style={[styles.column, columnStyles, idx > 0 ? { borderLeftWidth: 1 } : {}]}
          key={idx}
        >
          {column.map((cell, index) => (
            <View
              style={[styles.cell, cellStyles, index > 0 ? { borderTopWidth: 1 } : {}]}
              key={`${idx}/${index}`}
            >
              <Text
                style={[
                  { color: colors.TextPrimary },
                  index === 0 ? Typography.boldDefault : Typography.regularDefault,
                ]}
              >
                {parseString(cell)}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default Table;

const styles = StyleSheet.create({
  table: {
    width: "100%",
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 16,
    marginBottom: 16,
  },
  column: {},
  cell: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 48,
  },
});

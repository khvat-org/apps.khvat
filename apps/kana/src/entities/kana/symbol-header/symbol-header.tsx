import React from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import {
  dakuonFlatLettersId,
  handakuonFlatLettersId,
  ILetter,
  yoonFlatLettersId,
} from "@nihongo/core/shared/data/lettersTable";
import useGetRomaji from "@nihongo/core/shared/lib/i18n/hooks/useKey";
import { Typography } from "@nihongo/core/shared/typography";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { StatisticLevel } from "@/pages/kana/kana-table-list-page/model/types";

interface SymbolHeaderProps {
  letter: ILetter;

  kana?: string;

  indicatorColor?: StatisticLevel | null;
}

const SymbolHeader: React.FC<SymbolHeaderProps> = ({ letter, kana, indicatorColor }) => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();
  const { getRomaji } = useGetRomaji();

  const styles = makeStyles(colors);

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

  const getTypeById = (id: string) => {
    if (yoonFlatLettersId.includes(id)) return "kana.yoon";
    if (handakuonFlatLettersId.includes(id)) return "kana.handakuon";
    if (dakuonFlatLettersId.includes(id)) return "kana.dakuon";

    return "kana.basic";
  };

  return (
    <View style={styles.titleContainer}>
      {indicatorColor && (
        <View
          style={{
            backgroundColor: getIndicatorColor(indicatorColor),
            position: "absolute",
            width: 6,
            height: 6,
            borderRadius: 6,
            top: 5,
            right: -10,
          }}
        />
      )}

      <Text style={[styles.subTitle, { color: colors.TextPrimary }]}>
        {getRomaji(letter).toUpperCase()}
      </Text>

      {kana && (
        <Text style={styles.kanaSub}>
          {t(`kana.${kana}`)} ({t(getTypeById(letter.id))})
        </Text>
      )}
    </View>
  );
};

export default SymbolHeader;

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    titleContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    subTitle: {
      ...Typography.H2,
    },
    kanaSub: {
      ...Typography.boldDefault,
      color: colors.TextSecondary,
    },
  });

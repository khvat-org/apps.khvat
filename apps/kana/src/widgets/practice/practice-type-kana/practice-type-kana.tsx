import React, { useEffect, useRef, useState } from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { useTransliterationsContext } from "@nihongo/core/shared/contexts/transliteration/transliteration";
import { ILetter } from "@nihongo/core/shared/data/lettersTable";
import { Typography } from "@nihongo/core/shared/typography";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Sequence from "./practice-type-kana-engine";

import CustomKeyboard from "@/entities/general/keyboard/keyboard";
import { OnSubmit } from "@/pages/education/practice/education-practice/lib/types/questions";
import { useStatisticsContext } from "@/pages/kana/kana-table-list-page/model/hooks";
import { Kana, KanaAlphabet, PracticeType } from "@/shared/constants/kana";
import { getTypeById } from "@/shared/helpers/kana-letter";
import Header from "@/shared/ui/practice-header/practice-header";

interface PracticeTypeKanaProps {
  symbol: ILetter;
  kana: Kana;
  onCompleted: OnSubmit;
}

const PracticeTypeKana: React.FC<PracticeTypeKanaProps> = ({ symbol, kana, onCompleted }) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();

  const styles = makeStyles(colors);

  const insets = useSafeAreaInsets();
  const { recalculateOnce } = useStatisticsContext();

  const [_, setTick] = useState(0);
  const updateTick = () => setTick((i) => i + 1);

  const questionRef = useRef({ symbol, kana, onCompleted, recalculateOnce });
  questionRef.current = { symbol, kana, onCompleted, recalculateOnce };

  const engineRef = useRef(
    new Sequence((isCorrect, typed) => {
      const question = questionRef.current;
      const typeOfChapter =
        question.kana === Kana.Hiragana ? KanaAlphabet.Hiragana : KanaAlphabet.Katakana;
      question.recalculateOnce(typeOfChapter, question.symbol.id, isCorrect);
      question.onCompleted?.({
        isCorrectAnswer: isCorrect,
        userSelect: { type: PracticeType.Typing, value: typed },
      });
    }),
  );

  const sequence = engineRef.current;

  const { transliterations } = useTransliterationsContext();

  const key = kana === Kana.Katakana ? "ka" : "hi";
  const title = symbol?.[key];

  useEffect(() => {
    const transliteration = symbol.transliterations[transliterations].toLowerCase();
    sequence.setNextWord(transliteration, updateTick);
  }, [sequence, symbol, kana, transliterations]);

  const setVal = (val: string) => {
    if (!val) return false;

    if (val === "del") {
      sequence.removeOne(updateTick);
      return true;
    }
    if (val === "del-long" || val === "space") return true;

    sequence.addItem(val, updateTick);
  };

  const getLetterStyle = (idx: number) => {
    const status = sequence.answerStatus[idx];
    if (status === true) return { borderColor: colors.BgSuccess };
    if (status === false) return { borderColor: colors.BgDanger };
    return { borderColor: colors.BgLightGray };
  };

  const subtitle = `${key === "hi" ? t("kana.hiragana") : t("kana.katakana")} (${t(getTypeById(symbol?.id))})`;

  return (
    <View style={styles.container}>
      <View style={{ height: "100%", flexDirection: "column", justifyContent: "space-between" }}>
        <View style={{ paddingLeft: insets.left + 16, paddingRight: insets.right + 16 }}>
          <Header title={title} subtitle={subtitle} />

          <TouchableOpacity
            onPress={() => sequence.removeOne(updateTick)}
            style={styles.wordContainer}
          >
            {sequence.sequence.map((letter, index) => (
              <View key={`letter-${index}`} style={[styles.letterContainer, getLetterStyle(index)]}>
                <Text style={[styles.letter, Typography.regularDefault]}>
                  {(letter ?? "").toUpperCase()}
                </Text>
              </View>
            ))}
          </TouchableOpacity>
        </View>

        <CustomKeyboard
          disable={sequence.sequence.every((item) => item !== null)}
          onSubmit={() => {}}
          setValue={setVal}
        />
      </View>
    </View>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    wordContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 5,
      marginTop: 32,
    },
    letterContainer: {
      minWidth: 22,
      height: 36,
      borderBottomWidth: 2,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    letter: {
      color: colors.TextPrimary,
    },
  });

export default PracticeTypeKana;

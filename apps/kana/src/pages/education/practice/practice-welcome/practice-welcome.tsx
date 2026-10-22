import React from "react";

import { useHaptic } from "@nihongo/core/shared/contexts/haptic/haptic-context";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import PageTitle from "@nihongo/core/shared/ui/page-title/page-title";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SlidersHorizontalIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { ScrollView, View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  AccessibilityError,
  isAvailablePractice,
} from "../education-practice/helpers/is-available-practice";

import { ROUTES, RootStackParamList } from "@/app/routes.types";
import EducationKanaSelectedCard from "@/entities/education/practice/education-select-letters/education-select-letters";
import PracticeCard from "@/entities/education/practice/practice-card/practice-card";
import { usePracticePreferences } from "@/pages/education/practice/practice-preferences/model/hooks";
import { useKanaContext } from "@/pages/kana/kana-table-choice-letters-page/model/hooks";
import { PracticeType } from "@/shared/constants/kana";
import practiceImageMixed from "@/shared/resources/practice/1.jpg";
import practiceImageTesting from "@/shared/resources/practice/2.jpg";
import practiceImageDrawing from "@/shared/resources/practice/3.jpg";
import practiceImageListening from "@/shared/resources/practice/4.jpg";
import practiceImageMultipleChoice from "@/shared/resources/practice/5.jpg";
import practiceImageMatchingPairs from "@/shared/resources/practice/6.jpg";
import practiceImageWordBuilding from "@/shared/resources/practice/7.jpg";
import practiceImageTyping from "@/shared/resources/practice/8.jpg";

type PracticeNavigationProp = StackNavigationProp<RootStackParamList, typeof ROUTES.PRACTICE_ROOT>;

const PracticeWelcomePage: React.FC = () => {
  const { t } = useTranslation();

  const { triggerHaptic } = useHaptic();
  const navigation = useNavigation<PracticeNavigationProp>();

  const insets = useSafeAreaInsets();
  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const { selectedWords, selectedLettersHiragana, selectedLettersKatakana } = useKanaContext();

  const {
    preferences: { questionsCount, mixModes },
  } = usePracticePreferences();

  const wordsCount = selectedWords.hiragana.length + selectedWords.katakana.length;

  const hiraganaLength = selectedLettersHiragana;
  const katakanaLength = selectedLettersKatakana;

  const isAvailable = isAvailablePractice({
    questionsLength: questionsCount,
    hiraganaLength,
    katakanaLength,
    wordsCount,
  });

  const toChooseAlphabet = async () => {
    triggerHaptic();

    setTimeout(() => {
      navigation.navigate(ROUTES.KANA_SELECT, { title: "" });
    }, 0);
  };

  const start = (type?: PracticeType) => {
    triggerHaptic();

    let modes: PracticeType[] = [];

    if (type) {
      modes = Array.from({ length: questionsCount }, () => type);
    } else {
      const available = Object.values(PracticeType).filter(
        (practice) => isAvailable[practice]().message === AccessibilityError.Available,
      );
      const mixed = available.filter((practice) => mixModes.includes(practice));
      const allModes = mixed.length > 0 ? mixed : available;

      modes = Array.from(
        { length: questionsCount },
        () => allModes[Math.floor(Math.random() * allModes.length)],
      );
    }

    navigation.navigate(ROUTES.PRACTICE_TESTING, { mode: modes });
  };

  return (
    <View style={styles.main}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <PageTitle
          icon={
            <Pressable
              onPress={() => {
                triggerHaptic();
                navigation.navigate(ROUTES.PRACTICE_PREFERENCES);
              }}
            >
              <SlidersHorizontalIcon size={32} color={colors.BgContrast} />
            </Pressable>
          }
        >
          {t("tabs.practice")}
        </PageTitle>

        <EducationKanaSelectedCard onSelectKana={toChooseAlphabet} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >
        <PracticeCard
          onClick={() => start()}
          isAvailable={isAvailable[PracticeType.Testing]}
          title={t("practice.modes.mixed.title")}
          subtitle={t("practice.modes.mixed.subtitle")}
          image={practiceImageMixed}
        />
        <PracticeCard
          onClick={() => start(PracticeType.Testing)}
          isAvailable={isAvailable[PracticeType.Testing]}
          title={t("practice.modes.testing.title")}
          subtitle={t("practice.modes.testing.subtitle")}
          image={practiceImageTesting}
        />
        <PracticeCard
          onClick={() => start(PracticeType.Drawing)}
          isAvailable={isAvailable[PracticeType.Drawing]}
          title={t("practice.modes.drawing.title")}
          subtitle={t("practice.modes.drawing.subtitle")}
          image={practiceImageDrawing}
        />
        <PracticeCard
          onClick={() => start(PracticeType.Listening)}
          isAvailable={isAvailable[PracticeType.Listening]}
          title={t("practice.modes.listening.title")}
          subtitle={t("practice.modes.listening.subtitle")}
          image={practiceImageListening}
        />
        <PracticeCard
          onClick={() => start(PracticeType.MultipleChoice)}
          isAvailable={isAvailable[PracticeType.MultipleChoice]}
          title={t("practice.modes.multipleChoice.title")}
          subtitle={t("practice.modes.multipleChoice.subtitle")}
          image={practiceImageMultipleChoice}
        />
        <PracticeCard
          onClick={() => start(PracticeType.MatchingPairs)}
          isAvailable={isAvailable[PracticeType.MatchingPairs]}
          title={t("practice.modes.matchingPairs.title")}
          subtitle={t("practice.modes.matchingPairs.subtitle")}
          image={practiceImageMatchingPairs}
        />
        <PracticeCard
          onClick={() => start(PracticeType.WordBuilding)}
          isAvailable={isAvailable[PracticeType.WordBuilding]}
          title={t("practice.modes.wordBuilding.title")}
          subtitle={t("practice.modes.wordBuilding.subtitle")}
          image={practiceImageWordBuilding}
        />
        <PracticeCard
          onClick={() => start(PracticeType.Typing)}
          isAvailable={isAvailable[PracticeType.Typing]}
          title={t("practice.modes.typing.title")}
          subtitle={t("practice.modes.typing.subtitle")}
          image={practiceImageTyping}
        />
      </ScrollView>
    </View>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    main: {
      flex: 1,
      backgroundColor: colors.BgSecondary,
    },
    container: {
      paddingLeft: 16,
      paddingRight: 16,
      paddingBottom: 16,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      backgroundColor: colors.BgPrimary,
    },
    scroll: {
      paddingLeft: 16,
      paddingRight: 16,
    },
    scrollContainer: {
      paddingTop: 16,
      paddingBottom: 8,

      flexDirection: "column",
      alignItems: "center",
    },
  });

export default PracticeWelcomePage;

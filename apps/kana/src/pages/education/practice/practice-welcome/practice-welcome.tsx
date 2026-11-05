import React from "react";

import { CAPTCHA_DOWNLOAD_ACCEPTED } from "@nihongo/core/shared/constants/storageKeys";
import { useHaptic } from "@nihongo/core/shared/contexts/haptic/haptic-context";
import { useModal } from "@nihongo/core/shared/contexts/modal/modal-context";
import { ConfirmationModal } from "@nihongo/core/shared/contexts/modal/presets/confirmation";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { usePagePadding } from "@nihongo/core/shared/lib/layout/use-page-padding";
import { openSheet } from "@nihongo/core/shared/lib/navigation/sheet-transition-guard";
import { useTabContentBottomInset } from "@nihongo/core/shared/ui/bottom-tap/tab-screen-insets";
import { useTabBarLayout } from "@nihongo/core/shared/ui/bottom-tap/use-tab-bar-layout";
import Button from "@nihongo/core/shared/ui/button";
import SafeLayout from "@nihongo/core/shared/ui/layouts/safe-layout";
import PageTitle from "@nihongo/core/shared/ui/page-title/page-title";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SlidersHorizontalIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { ScrollView, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  AccessibilityError,
  isAvailablePractice,
} from "../education-practice/helpers/is-available-practice";

import { ROUTES, RootStackParamList } from "@/app/routes.types";
import EducationKanaSelectedCard from "@/entities/education/practice/education-select-letters/education-select-letters";
import PracticeCard from "@/entities/education/practice/practice-card/practice-card";
import { useCaptchaFonts } from "@/features/captcha/model/use-captcha-fonts";
import { usePracticePreferences } from "@/pages/education/practice/practice-preferences/model/hooks";
import { useKanaContext } from "@/pages/kana/kana-table-choice-letters-page/model/hooks";
import { MIX_PRACTICE_TYPES, PracticeType } from "@/shared/constants/kana";
import practiceImageMixed from "@/shared/resources/practice/1.jpg";
import practiceImageTesting from "@/shared/resources/practice/2.jpg";
import practiceImageDrawing from "@/shared/resources/practice/3.jpg";
import practiceImageListening from "@/shared/resources/practice/4.jpg";
import practiceImageMultipleChoice from "@/shared/resources/practice/5.jpg";
import practiceImageMatchingPairs from "@/shared/resources/practice/6.jpg";
import practiceImageWordBuilding from "@/shared/resources/practice/7.jpg";
import practiceImageTyping from "@/shared/resources/practice/8.jpg";
import practiceImageCaptcha from "@/shared/resources/practice/9.jpg";

type PracticeNavigationProp = StackNavigationProp<RootStackParamList, typeof ROUTES.PRACTICE_ROOT>;

const PracticeWelcomePage: React.FC = () => {
  const { t } = useTranslation();

  const { triggerHaptic } = useHaptic();
  const navigation = useNavigation<PracticeNavigationProp>();

  const insets = useSafeAreaInsets();
  const tabContentBottomInset = useTabContentBottomInset();
  const { colors } = useThemeContext();
  const pagePadding = usePagePadding();
  const styles = makeStyles(colors, pagePadding);

  const { selectedWords, selectedLettersHiragana, selectedLettersKatakana } = useKanaContext();

  const {
    preferences: { questionsCount, mixModes },
  } = usePracticePreferences();

  const captchaFonts = useCaptchaFonts();
  const { position: tabBarPosition } = useTabBarLayout();
  const { showModal, hideModal } = useModal();

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
      openSheet(() => navigation.navigate(ROUTES.KANA_SELECT, { title: "" }));
    }, 0);
  };

  const start = (type?: PracticeType) => {
    triggerHaptic();

    let modes: PracticeType[] = [];

    if (type) {
      modes = Array.from({ length: questionsCount }, () => type);
    } else {
      const available = MIX_PRACTICE_TYPES.filter(
        (practice) => isAvailable[practice]().message === AccessibilityError.Available,
      );
      const mixed = available.filter((practice) => mixModes.includes(practice));
      const allModes = mixed.length > 0 ? mixed : available;

      modes = Array.from(
        { length: questionsCount },
        () => allModes[Math.floor(Math.random() * allModes.length)],
      );
    }

    navigation.navigate(ROUTES.PRACTICE_PAGE, { mode: modes });
  };

  const startCaptcha = async () => {
    const isAccepted = await AsyncStorage.getItem(CAPTCHA_DOWNLOAD_ACCEPTED).catch(() => null);

    if (isAccepted) {
      start(PracticeType.Captcha);
      return;
    }

    showModal({
      closeOnBackdrop: true,
      content: (
        <ConfirmationModal
          title={t("practice.captcha.consentTitle")}
          subtitle={t("practice.captcha.consentText")}
          confirmText={t("common.start")}
          onCancel={hideModal}
          onConfirm={() => {
            hideModal();
            AsyncStorage.setItem(CAPTCHA_DOWNLOAD_ACCEPTED, "1").catch(() => {});
            start(PracticeType.Captcha);
          }}
        />
      ),
    });
  };

  return (
    <SafeLayout disableTop disableButton style={styles.main}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <PageTitle
          icon={
            tabBarPosition === "bottom" ? (
              <Button
                color="primary"
                variant="text"
                isHapticFeedback
                icon={<SlidersHorizontalIcon size={32} />}
                onClick={() => openSheet(() => navigation.navigate(ROUTES.PRACTICE_PREFERENCES))}
              />
            ) : undefined
          }
        >
          {t("tabs.practice")}
        </PageTitle>

        <EducationKanaSelectedCard onSelectKana={toChooseAlphabet} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: 8 + tabContentBottomInset },
        ]}
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
        {captchaFonts && (
          <PracticeCard
            isNew
            onClick={startCaptcha}
            isAvailable={isAvailable[PracticeType.Captcha]}
            title={t("practice.modes.captcha.title")}
            subtitle={t("practice.modes.captcha.subtitle")}
            image={practiceImageCaptcha}
          />
        )}
      </ScrollView>
    </SafeLayout>
  );
};

const makeStyles = (colors: ColorsType, pagePadding: number) =>
  StyleSheet.create({
    main: {
      backgroundColor: colors.BgSecondary,
    },
    container: {
      paddingLeft: pagePadding,
      paddingRight: pagePadding,
      paddingBottom: 16,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      backgroundColor: colors.BgPrimary,
    },
    scrollContainer: {
      paddingTop: 16,
      paddingBottom: 8,
      paddingLeft: pagePadding,
      paddingRight: pagePadding,

      flexDirection: "column",
      alignItems: "center",
    },
  });

export default PracticeWelcomePage;

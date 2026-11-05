import React, { useCallback, useMemo, useState } from "react";

import { useHaptic } from "@nihongo/core/shared/contexts/haptic/haptic-context";
import { useModal } from "@nihongo/core/shared/contexts/modal/modal-context";
import { AlertModal } from "@nihongo/core/shared/contexts/modal/presets/alert";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { ILetter } from "@nihongo/core/shared/data/lettersTable";
import useGetRomaji from "@nihongo/core/shared/lib/i18n/hooks/useKey";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import { InfoIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import CaptchaGrid from "@/features/captcha/ui/captcha-grid";
import { CaptchaTileState } from "@/features/captcha/ui/captcha-tile";
import {
  CaptchaTile as CaptchaTileData,
  OnSubmit,
} from "@/pages/education/practice/education-practice/lib/types/questions";
import { useStatisticsContext } from "@/pages/kana/kana-table-list-page/model/hooks";
import { Kana, KanaAlphabet, PracticeType } from "@/shared/constants/kana";

const GAP = 8;
const MAX_WIDTH = 480;

interface Props {
  question: ILetter;
  tiles: CaptchaTileData[];
  onCompleted: OnSubmit;
}

const PracticeCaptcha: React.FC<Props> = ({ question, tiles, onCompleted }) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const { getRomaji } = useGetRomaji();
  const { triggerHaptic } = useHaptic();
  const { showModal, hideModal } = useModal();
  const { recalculateOnce } = useStatisticsContext();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [selected, setSelected] = useState<number[]>([]);
  const [isVerified, setIsVerified] = useState(false);

  const toggle = useCallback(
    (index: number) => {
      triggerHaptic();
      setSelected((current) =>
        current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
      );
    },
    [triggerHaptic],
  );

  const verify = () => {
    if (isVerified) return;

    const isCorrect = tiles.every((tile, index) => tile.isCorrect === selected.includes(index));
    const alphabets = new Set(
      tiles
        .filter((tile) => tile.isCorrect)
        .map((tile) =>
          tile.kana === Kana.Hiragana ? KanaAlphabet.Hiragana : KanaAlphabet.Katakana,
        ),
    );

    alphabets.forEach((alphabet) => recalculateOnce(alphabet, question.id, isCorrect));
    setIsVerified(true);
    onCompleted({
      isCorrectAnswer: isCorrect,
      userSelect: { type: PracticeType.Captcha, value: selected },
    });
  };

  const showInfo = () =>
    showModal({
      closeOnBackdrop: true,
      onClose: () => {},
      content: (
        <AlertModal
          title={t("practice.modes.captcha.title")}
          subtitle={t("practice.captcha.info")}
          button={t("alert.ok")}
          onPress={hideModal}
        />
      ),
    });

  const stateOf = (tile: CaptchaTileData, index: number): CaptchaTileState => {
    const isSelected = selected.includes(index);

    if (!isVerified) return isSelected ? "selected" : "idle";
    if (isSelected) return tile.isCorrect ? "correct" : "wrong";

    return tile.isCorrect ? "missed" : "idle";
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.header__symbol}>{getRomaji(question)}</Text>
          <Text style={styles.header__text}>{t("practice.captcha.instruction")}</Text>
        </View>

        <CaptchaGrid
          style={styles.grid}
          tiles={tiles}
          stateOf={stateOf}
          onPress={isVerified ? undefined : toggle}
        />

        <View style={styles.footer}>
          <Pressable
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t("practice.captcha.info")}
            onPress={showInfo}
          >
            <InfoIcon size={32} color={colors.TextPrimary} />
          </Pressable>
          <Button
            color="primary"
            isHapticFeedback
            isDisabled={selected.length === 0}
            text={t("practice.captcha.verify")}
            onClick={verify}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    scroll: {
      width: "100%",
    },
    scrollContent: {
      alignItems: "center",
    },
    card: {
      width: "100%",
      maxWidth: MAX_WIDTH,
      borderRadius: 16,
      backgroundColor: colors.BgSecondary,
    },
    header: {
      margin: GAP,
      marginBottom: 0,
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.BgAccent,
    },
    header__text: {
      ...Typography.regularDefault,
      color: colors.TextWhite,
    },
    header__symbol: {
      ...Typography.H2,
      color: colors.TextWhite,
    },
    grid: {
      padding: GAP,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: GAP,
      paddingTop: 0,
    },
  });

export default PracticeCaptcha;

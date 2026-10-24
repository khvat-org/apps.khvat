import React, { useState } from "react";

import SettingItem from "@nihongo/core/entities/setting/setting-item/setting-item";
import SettingsSection from "@nihongo/core/entities/setting/setting-section/settings-section";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import Chip from "@nihongo/core/shared/ui/chip/chip";
import { ModalHeader } from "@nihongo/core/shared/ui/modal-header/modal-header";
import { ModelContainer } from "@nihongo/core/shared/ui/model-container/model-container";
import Slider from "@nihongo/core/shared/ui/slider/slider";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  GitCommitIcon,
  HourglassIcon,
  PlayCircleIcon,
  SquaresFourIcon,
  SwatchesIcon,
  TimerIcon,
} from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PracticePreferences, QUESTIONS_COUNT, TIMER_SECONDS } from "./model/context";
import { usePracticePreferences } from "./model/hooks";

import { RootStackParamList, ROUTES } from "@/app/routes.types";
import { useKanaContext } from "@/pages/kana/kana-table-choice-letters-page/model/hooks";
import { PracticeType } from "@/shared/constants/kana";

interface PreferenceBlockProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  isLast?: boolean;
  children: React.ReactNode;
}

const PreferenceBlock: React.FC<PreferenceBlockProps> = ({
  icon,
  title,
  value,
  isLast,
  children,
}) => {
  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  return (
    <View style={[styles.block, !isLast && styles.blockBorder]}>
      <View style={styles.blockHeader}>
        {icon}
        <Text style={styles.blockTitle}>{title}</Text>
        <Text style={styles.blockValue}>{value}</Text>
      </View>
      {children}
    </View>
  );
};

interface ModeChipsProps {
  selected: PracticeType[];
  onToggle: (mode: PracticeType) => void;
}

const ModeChips: React.FC<ModeChipsProps> = ({ selected, onToggle }) => {
  const { t } = useTranslation();

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {Object.values(PracticeType).map((mode) => (
        <Chip
          key={mode}
          text={t(`practice.modes.${mode}.title`)}
          active={selected.includes(mode)}
          onPress={() => onToggle(mode)}
        />
      ))}
    </View>
  );
};

export const PracticePreferencesPage: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const insets = useSafeAreaInsets();

  const { preferences, update } = usePracticePreferences();
  const { selectedLettersHiragana, selectedLettersKatakana } = useKanaContext();

  const selectedKana =
    selectedLettersHiragana + selectedLettersKatakana === 0
      ? t("selectKana.nothingSelected")
      : `${selectedLettersHiragana} ${t("kana.hiragana")}, ${selectedLettersKatakana} ${t("kana.katakana")}`;

  const [draft, setDraft] = useState(preferences);

  const change = (patch: Partial<PracticePreferences>) =>
    setDraft((prev) => ({ ...prev, ...patch }));

  const isDirty = JSON.stringify(draft) !== JSON.stringify(preferences);

  const save = () => {
    if (!isDirty) return;

    update(draft);
    navigation.goBack();
  };

  const { autoplaySound, questionsCount, timerModes, timerSeconds, mixModes } = draft;

  const toggle = (list: PracticeType[], mode: PracticeType) =>
    list.includes(mode) ? list.filter((item) => item !== mode) : [...list, mode];

  const toggleMixMode = (mode: PracticeType) => {
    const next = toggle(mixModes, mode);
    if (next.length > 0) change({ mixModes: next });
  };

  const iconProps = { size: 20, color: colors.BgContrast };

  return (
    <ModelContainer>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ModalHeader
          title={t("practice.preferences.title")}
          left={{
            text: t("alert.cancel"),
            onPress: navigation.goBack,
          }}
          right={{
            text: t("common.save"),
            onPress: save,
            color: isDirty ? colors.TextPrimary : colors.TextDisabled,
          }}
        />

        <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: insets.bottom + 16 }}>
          <SettingsSection>
            <SettingItem
              leftIcon={<SwatchesIcon {...iconProps} />}
              text={t("selectKana.chooseKana")}
              subText={selectedKana}
              onClick={() => navigation.navigate(ROUTES.KANA_SELECT, { title: "" })}
              isLast
            />
          </SettingsSection>

          <SettingsSection>
            <SettingItem
              leftIcon={<PlayCircleIcon {...iconProps} />}
              text={t("practice.preferences.autoplaySound")}
              isEnable={autoplaySound}
              onValueChange={() => change({ autoplaySound: !autoplaySound })}
            />

            <PreferenceBlock
              icon={<GitCommitIcon {...iconProps} />}
              title={t("practice.preferences.questionsCount")}
              value={questionsCount}
            >
              <Slider
                value={questionsCount}
                min={QUESTIONS_COUNT.min}
                max={QUESTIONS_COUNT.max}
                step={QUESTIONS_COUNT.step}
                onChange={(value) => change({ questionsCount: value })}
              />
            </PreferenceBlock>

            <PreferenceBlock
              icon={<TimerIcon {...iconProps} />}
              title={t("practice.preferences.timer")}
              value={timerModes.length}
            >
              <ModeChips
                selected={timerModes}
                onToggle={(mode) => change({ timerModes: toggle(timerModes, mode) })}
              />
            </PreferenceBlock>

            <PreferenceBlock
              icon={<HourglassIcon {...iconProps} />}
              title={t("practice.preferences.timerSeconds")}
              value={t("practice.preferences.seconds", { count: timerSeconds })}
            >
              <Slider
                value={timerSeconds}
                min={TIMER_SECONDS.min}
                max={TIMER_SECONDS.max}
                step={TIMER_SECONDS.step}
                onChange={(value) => change({ timerSeconds: value })}
              />
            </PreferenceBlock>

            <PreferenceBlock
              icon={<SquaresFourIcon {...iconProps} />}
              title={t("practice.preferences.mixMode")}
              value={mixModes.length}
              isLast
            >
              <ModeChips selected={mixModes} onToggle={toggleMixMode} />
            </PreferenceBlock>
          </SettingsSection>
        </ScrollView>
      </GestureHandlerRootView>
    </ModelContainer>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    block: {
      paddingVertical: 16,
      paddingRight: 16,
      gap: 12,
    },
    blockBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.BorderDefault,
    },
    blockHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    blockTitle: {
      ...Typography.boldDefault,
      color: colors.TextPrimary,
      flex: 1,
    },
    blockValue: {
      ...Typography.boldDefault,
      color: colors.TextPrimary,
    },
  });

export default PracticePreferencesPage;

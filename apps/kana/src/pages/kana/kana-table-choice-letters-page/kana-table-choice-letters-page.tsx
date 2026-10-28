import React, { useEffect, useMemo, useRef, useState } from "react";

import { isIOS } from "@nihongo/core/shared/constants/platformUtil";
import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { ModalHeader } from "@nihongo/core/shared/ui/modal-header/modal-header";
import Switcher from "@nihongo/core/shared/ui/switcher/switcher";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { View, Text, SectionList, StyleSheet } from "react-native";
import { StatusBar } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useKanaContext } from "./model/hooks";

import { ROUTES, RootStackParamList } from "@/app/routes.types";
import EducationKanaTableSelected from "@/features/education/education-kana-table-selected/education-kana-table";
import { Alphabet, KanaAlphabet } from "@/shared/constants/kana";

type ScreenNavigationProps = StackNavigationProp<RootStackParamList, typeof ROUTES.KANA_SELECT>;

const KanaTableChoiceLettersPage: React.FC = () => {
  const navigation = useNavigation<ScreenNavigationProps>();
  const { colors } = useThemeContext();

  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { selected, selectedLettersHiragana, selectedLettersKatakana, replaceSelected } =
    useKanaContext();

  const [activeTab, setActiveTab] = useState<KanaAlphabet>(KanaAlphabet.Hiragana);

  const sections = useMemo(
    () => [
      { title: t("kana.basic"), type: "base", data: ["base"] },
      { title: t("kana.dakuon"), type: "dakuon", data: ["dakuon"] },
      { title: t("kana.handakuon"), type: "handakuon", data: ["handakuon"] },
      { title: t("kana.yoon"), type: "yoon", data: ["yoon"] },
    ],
    [t],
  );

  const initial = useRef(selected);
  const isSaved = useRef(false);

  const isDirty = selected !== initial.current;

  useEffect(
    () => () => {
      if (!isSaved.current) replaceSelected(initial.current);
    },
    [replaceSelected],
  );

  const cancel = () => navigation.goBack();

  const done = () => {
    if (!isDirty) return;

    isSaved.current = true;
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <ModalHeader
        title={t("tabs.kana")}
        left={{
          text: t("alert.cancel"),
          onPress: cancel,
        }}
        right={{
          text: t("common.save"),
          onPress: done,
          isDisabled: !isDirty,
        }}
      />

      {isIOS && (
        <SectionList
          sections={sections}
          style={{ flex: 1 }}
          keyExtractor={(item, index) => item + index}
          renderItem={({ section }) => (
            <React.Suspense fallback={<View />}>
              <EducationKanaTableSelected
                alphabetType={section.type as Alphabet}
                kana={activeTab}
                last={section.type === "yoon"}
              />
            </React.Suspense>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={[styles.nameContainer, { backgroundColor: colors.BgPrimary }]}>
              <Text style={[Typography.H4, styles.name, { color: colors.TextPrimary }]}>
                {title}
              </Text>
            </View>
          )}
        />
      )}

      {!isIOS && (
        <FlatList
          data={sections}
          style={{ flex: 1 }}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <React.Suspense fallback={<View />}>
              <View style={[styles.nameContainer]}>
                <Text style={[Typography.H4, styles.name, { color: colors.TextPrimary }]}>
                  {item.title}
                </Text>
              </View>

              <EducationKanaTableSelected
                alphabetType={item.type as Alphabet}
                kana={activeTab}
                last={item.type === "yoon"}
              />
            </React.Suspense>
          )}
        />
      )}

      <View
        style={[
          styles.switcherContainer,
          {
            paddingBottom: 15 + insets.bottom,
            backgroundColor: colors.BgPrimary,
            borderColor: colors.BorderDefault,
          },
        ]}
      >
        <Switcher<KanaAlphabet>
          isFullWidth
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          options={[KanaAlphabet.Hiragana, KanaAlphabet.Katakana]}
          translate={[
            `${t("kana.hiragana")} (${selectedLettersHiragana})`,
            `${t("kana.katakana")} (${selectedLettersKatakana})`,
          ]}
          customStyles={{
            flex: 1,
          }}
        />
      </View>
    </View>
  );
};

export default KanaTableChoiceLettersPage;

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    height: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
  },
  nameContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 8,
    height: 46,
  },
  name: {
    width: "100%",
    maxWidth: TABLET_WIDTH,
    alignSelf: "center",
  },
  lineContainer: {
    width: "100%",

    zIndex: 1,
    height: 1,
  },
  switcherContainer: {
    paddingTop: 15,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    paddingHorizontal: 16,
  },
});

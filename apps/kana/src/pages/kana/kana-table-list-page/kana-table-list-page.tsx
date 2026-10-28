import React, { useCallback, useEffect, useMemo, useState } from "react";

import { isAndroid } from "@nihongo/core/shared/constants/platformUtil";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import PageTitle from "@nihongo/core/shared/ui/page-title/page-title";
import Switcher from "@nihongo/core/shared/ui/switcher/switcher";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { SectionList, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { ROUTES, RootStackParamList } from "@/app/routes.types";
import EducationKanaTable from "@/features/education/education-kana-table/education-kana-table";
import EducationKanaTableForTablet from "@/features/education/education-kana-table-for-tablet/education-kana-table-for-tablet";
import { Alphabet, KanaAlphabet } from "@/shared/constants/kana";
import { getTypeById } from "@/shared/helpers/kana-letter";

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, typeof ROUTES.KANA_TABLE_ROOT>;

const MemoizedEducationKanaTable = React.memo(EducationKanaTable);
const MemoizedEducationKanaTableForTablet = React.memo(EducationKanaTableForTablet);
interface KanaInfoProps {
  route: RouteProp<RootStackParamList, typeof ROUTES.KANA_INFO>;
  navigation: StackNavigationProp<RootStackParamList, typeof ROUTES.KANA_INFO>;
}

export const KanaTableListPage: React.FC<KanaInfoProps> = () => {
  const { width, height } = useWindowDimensions();

  const isHorizontal = width > height;

  const { colors } = useThemeContext();

  const navigation = useNavigation<ScreenNavigationProp>();

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<KanaAlphabet>(KanaAlphabet.Hiragana);

  const openModal = useCallback(
    (id: string) => {
      const modalTitle = `${activeTab === KanaAlphabet.Hiragana ? t("kana.hiragana") : t("kana.katakana")} (${t(getTypeById(id))})`;

      navigation.navigate(ROUTES.KANA_INFO, {
        id: id,
        kana: activeTab,
        title: modalTitle,
      });
    },
    [activeTab, navigation, t],
  );

  const sections = useMemo(
    () => [
      { title: t("kana.basic"), data: ["base"] },
      { title: t("kana.dakuon"), data: ["dakuon"] },
      { title: t("kana.handakuon"), data: ["handakuon"] },
      { title: t("kana.yoon"), data: ["yoon"] },
    ],
    [t],
  );

  return (
    <>
      <PageTitle isSaveArea>{t("tabs.kana")}</PageTitle>

      <View style={{ flex: 1, backgroundColor: colors.BgPrimary }}>
        <View style={{ paddingBottom: isAndroid ? 20 : 6, paddingHorizontal: 16 }}>
          <Switcher<KanaAlphabet>
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            options={[KanaAlphabet.Hiragana, KanaAlphabet.Katakana]}
            translate={[t("kana.hiragana"), t("kana.katakana")]}
          />
        </View>

        {isHorizontal && (
          <SectionList
            sections={sections}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item + index}
            horizontal={isHorizontal}
            renderItem={({ item }) => (
              <React.Suspense fallback={<View />}>
                {isHorizontal && (
                  <MemoizedEducationKanaTableForTablet
                    type={item as Alphabet}
                    kana={activeTab}
                    onClick={openModal}
                    last={item === "yoon"}
                  />
                )}
              </React.Suspense>
            )}
          />
        )}

        {!isHorizontal && (
          <SectionList
            sections={sections}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item + index}
            horizontal={isHorizontal}
            renderItem={({ item }) => (
              <React.Suspense fallback={<View />}>
                <MemoizedEducationKanaTable
                  type={item as Alphabet}
                  kana={activeTab}
                  onClick={openModal}
                  last={item === "yoon"}
                />
              </React.Suspense>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View style={[styles.nameContainer, { backgroundColor: colors.BgPrimary }]}>
                <Text style={[Typography.H4, { color: colors.TextPrimary }]}>{title}</Text>
              </View>
            )}
          />
        )}
      </View>
    </>
  );
};

export default KanaTableListPage;

const styles = StyleSheet.create({
  title: {
    marginLeft: 20,
  },
  nameContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
  },
  lineContainer: {
    width: "100%",
    height: 1,
    position: "absolute",
    zIndex: 999,
  },
});

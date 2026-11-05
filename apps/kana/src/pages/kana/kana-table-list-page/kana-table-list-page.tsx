import React, { useCallback, useEffect, useMemo, useState } from "react";

import { isAndroid } from "@nihongo/core/shared/constants/platformUtil";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { usePagePadding } from "@nihongo/core/shared/lib/layout/use-page-padding";
import { openSheet } from "@nihongo/core/shared/lib/navigation/sheet-transition-guard";
import { Typography } from "@nihongo/core/shared/typography";
import { useTabContentBottomInset } from "@nihongo/core/shared/ui/bottom-tap/tab-screen-insets";
import SafeLayout from "@nihongo/core/shared/ui/layouts/safe-layout";
import PageTitle from "@nihongo/core/shared/ui/page-title/page-title";
import Switcher from "@nihongo/core/shared/ui/switcher/switcher";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import {
  LayoutChangeEvent,
  SectionList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { ROUTES, RootStackParamList } from "@/app/routes.types";
import EducationKanaTable from "@/features/education/education-kana-table/education-kana-table";
import EducationKanaTableForTablet, {
  getKanaTableCellSize,
} from "@/features/education/education-kana-table-for-tablet/education-kana-table-for-tablet";
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
  const pagePadding = usePagePadding();
  const tabContentBottomInset = useTabContentBottomInset();

  const [activeTab, setActiveTab] = useState<KanaAlphabet>(KanaAlphabet.Hiragana);
  const [tableAreaHeight, setTableAreaHeight] = useState(0);

  const onTableAreaLayout = (event: LayoutChangeEvent) => {
    const { height: next } = event.nativeEvent.layout;
    setTableAreaHeight((prev) => (prev === next ? prev : next));
  };

  const tableBottomMargin = Math.max(TABLE_BOTTOM_MARGIN, tabContentBottomInset);
  const tableCellSize = getKanaTableCellSize(tableAreaHeight, tableBottomMargin);

  const openModal = useCallback(
    (id: string) => {
      const modalTitle = `${activeTab === KanaAlphabet.Hiragana ? t("kana.hiragana") : t("kana.katakana")} (${t(getTypeById(id))})`;

      openSheet(() =>
        navigation.navigate(ROUTES.KANA_INFO, {
          id: id,
          kana: activeTab,
          title: modalTitle,
        }),
      );
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
    <SafeLayout disableButton>
      <PageTitle padded>{t("tabs.kana")}</PageTitle>

      <View style={{ flex: 1, backgroundColor: colors.BgPrimary }}>
        <View
          style={{
            paddingBottom: isHorizontal ? 0 : isAndroid ? 20 : 6,
            paddingHorizontal: pagePadding,
          }}
        >
          <Switcher<KanaAlphabet>
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            options={[KanaAlphabet.Hiragana, KanaAlphabet.Katakana]}
            translate={[t("kana.hiragana"), t("kana.katakana")]}
          />
        </View>

        {isHorizontal && (
          <View style={{ flex: 1 }} onLayout={onTableAreaLayout}>
            {tableAreaHeight > 0 && (
              <SectionList
                sections={sections}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => item + index}
                horizontal={isHorizontal}
                renderItem={({ item }) => (
                  <React.Suspense fallback={<View />}>
                    <MemoizedEducationKanaTableForTablet
                      type={item as Alphabet}
                      kana={activeTab}
                      cellSize={tableCellSize}
                      bottomMargin={tableBottomMargin}
                      onClick={openModal}
                      last={item === "yoon"}
                    />
                  </React.Suspense>
                )}
              />
            )}
          </View>
        )}

        {!isHorizontal && (
          <SectionList
            sections={sections}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item + index}
            horizontal={isHorizontal}
            contentContainerStyle={{ paddingBottom: tabContentBottomInset }}
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
              <View
                style={[
                  styles.nameContainer,
                  {
                    paddingLeft: pagePadding,
                    paddingRight: pagePadding,
                    backgroundColor: colors.BgPrimary,
                  },
                ]}
              >
                <Text style={[Typography.H4, { color: colors.TextPrimary }]}>{title}</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeLayout>
  );
};

export default KanaTableListPage;

const TABLE_BOTTOM_MARGIN = 32;

const styles = StyleSheet.create({
  title: {
    marginLeft: 20,
  },
  nameContainer: {
    paddingTop: 10,
    paddingBottom: 16,
  },
  lineContainer: {
    width: "100%",
    height: 1,
    position: "absolute",
    zIndex: 999,
  },
});

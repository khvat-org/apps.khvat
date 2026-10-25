import React, { useMemo, useState } from "react";

import { getCanvasSize } from "@nihongo/core/shared/constants/sizes";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import {
  baseFlatLettersId,
  dakuonFlatLettersId,
  handakuonFlatLettersId,
  lettersTableById,
  yoonFlatLettersId,
} from "@nihongo/core/shared/data/lettersTable";
import Button from "@nihongo/core/shared/ui/button";
import { ModalHeader } from "@nihongo/core/shared/ui/modal-header/modal-header";
import { RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CaretLeftIcon, CaretRightIcon, PencilSimpleIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  View,
  StatusBar,
  useWindowDimensions,
  ScrollView,
  LayoutChangeEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ROUTES, RootStackParamList } from "@/app/routes.types";
import SoundLetter from "@/entities/kana/sound-letter/sound-letter";
import Symbol from "@/entities/kana/symbol/symbol";
import SymbolHeader from "@/entities/kana/symbol-header/symbol-header";
import Draw, { DRAW_CONTROLS_HEIGHT, MIN_FIT_CANVAS_SIZE } from "@/features/drawing/ui/draw/draw";
import { useStatisticsContext } from "@/pages/kana/kana-table-list-page/model/hooks";
import { KanaAlphabet } from "@/shared/constants/kana";

interface KanaInfoProps {
  route: RouteProp<RootStackParamList, typeof ROUTES.KANA_INFO>;
  navigation: StackNavigationProp<RootStackParamList, typeof ROUTES.KANA_INFO>;

  customProps?: {
    id: string;
    kana: KanaAlphabet;
  };

  isOnlyDrawing?: boolean;
}

enum Screen {
  Symbol,
  Draw,
}

const KanaLetterPage: React.FC<KanaInfoProps> = ({ route, customProps, isOnlyDrawing }) => {
  const navigation = useNavigation();

  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { colors } = useThemeContext();

  const { width, height } = useWindowDimensions();
  const canvasSize = getCanvasSize(width, height);

  const [viewportHeight, setViewportHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  const onViewportLayout = (event: LayoutChangeEvent) => {
    const { height: next } = event.nativeEvent.layout;
    setViewportHeight((prev) => (prev === next ? prev : next));
  };

  const onHeaderLayout = (event: LayoutChangeEvent) => {
    const { height: next } = event.nativeEvent.layout;
    setHeaderHeight((prev) => (prev === next ? prev : next));
  };

  const { id: LetterIdFromParams, kana: kanaFromParams } = route.params || customProps;

  const [letterId, setLetterId] = useState(LetterIdFromParams);
  const [letterKana, setLetterKana] = useState(kanaFromParams);
  const [currentScreen, setCurrentScreen] = useState(isOnlyDrawing ? Screen.Draw : Screen.Symbol);

  const leftIcon = <CaretLeftIcon size={20} />;

  const rightIcon = <CaretRightIcon size={20} />;

  const pencilIcon = <PencilSimpleIcon size={20} />;

  const flatLetters = useMemo(
    () => [
      ...baseFlatLettersId,
      ...dakuonFlatLettersId,
      ...handakuonFlatLettersId,
      ...yoonFlatLettersId,
    ],
    [],
  );

  const { statistics, isEnabled: isEnabledStats } = useStatisticsContext();
  const letterStat = statistics[letterKana][letterId];

  const headerTitle =
    letterKana === KanaAlphabet.Hiragana ? t("kana.hiragana") : t("kana.katakana");

  const switchButtonText = `${letterKana === KanaAlphabet.Hiragana ? t("kana.katakana") : t("kana.hiragana")}`;

  const active = lettersTableById[letterId];
  const activeIndex = flatLetters.findIndex((element) => element === active.id);

  const prevLetter = () => activeIndex !== 0 && setLetterId(flatLetters[activeIndex - 1]);

  const nextLetter = () =>
    flatLetters.length !== activeIndex + 1 && setLetterId(flatLetters[activeIndex + 1]);

  const letter = lettersTableById[letterId];

  const goToDrawScreen = () => setCurrentScreen(Screen.Draw);

  const switchScreen = () => {
    if (currentScreen) {
      return setCurrentScreen(Screen.Symbol);
    }

    navigation.goBack();
  };

  const switchKana = () => {
    if (letterKana === KanaAlphabet.Hiragana) {
      return setLetterKana(KanaAlphabet.Katakana);
    }

    setLetterKana(KanaAlphabet.Hiragana);
  };

  const controlsHeight =
    currentScreen === Screen.Draw ? DRAW_CONTROLS_HEIGHT : SYMBOL_BUTTONS_HEIGHT;
  const fitSize =
    viewportHeight > 0
      ? Math.max(
          MIN_FIT_CANVAS_SIZE,
          Math.min(canvasSize, viewportHeight - headerHeight - CONTENT_GAP * 2 - controlsHeight),
        )
      : canvasSize;

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ModalHeader
        left={{
          text: currentScreen === Screen.Draw ? t("common.back") : t("common.close"),
          onPress: switchScreen,
        }}
        title={headerTitle}
      />
      <View style={styles.container}>
        <ScrollView onLayout={onViewportLayout}>
          <View style={styles.symbolContainer}>
            <View
              onLayout={onHeaderLayout}
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SymbolHeader
                indicatorColor={isEnabledStats ? letterStat?.level : null}
                letter={letter}
              />
            </View>

            <View style={{ marginTop: CONTENT_GAP, justifyContent: "center" }}>
              {currentScreen === Screen.Symbol && (
                <View
                  style={{
                    backgroundColor: colors.BgSecondary,
                    borderRadius: 24,
                  }}
                >
                  <Symbol id={letter.id} kana={letterKana} size={fitSize} />
                </View>
              )}

              {currentScreen === Screen.Draw && (
                <Draw kana={letterKana} letter={letter} isTextRecognition maxCanvasSize={fitSize} />
              )}
            </View>

            <View
              style={{
                width: "100%",
                maxWidth: width > fitSize ? fitSize : width - 32,
                marginTop: CONTENT_GAP,
              }}
            >
              <View style={styles.buttonContainer}>
                {currentScreen === Screen.Symbol && (
                  <View style={[styles.buttons, { paddingLeft: 0, paddingRight: 0 }]}>
                    <SoundLetter id={letter.id} />

                    <Button
                      color="secondary"
                      isHapticFeedback
                      icon={pencilIcon}
                      isFullWidth
                      onClick={goToDrawScreen}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            paddingBottom: insets.bottom,
            paddingLeft: 16,
            paddingRight: 16,
            marginTop: 16,
          }}
        >
          <View style={{ width: "100%", maxWidth: width > canvasSize ? canvasSize : width - 32 }}>
            {!isOnlyDrawing && (
              <View style={[styles.buttons]}>
                <Button
                  color="secondary"
                  isHapticFeedback
                  icon={leftIcon}
                  onClick={() => prevLetter()}
                />

                <Button
                  color="secondary"
                  isHapticFeedback
                  text={switchButtonText}
                  isFullWidth
                  onClick={switchKana}
                />

                <Button
                  color="secondary"
                  isHapticFeedback
                  icon={rightIcon}
                  onClick={() => nextLetter()}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export default KanaLetterPage;

const CONTENT_GAP = 16;
const SYMBOL_BUTTONS_HEIGHT = 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  symbolContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,

    flex: 1,
  },
  buttonContainer: {
    width: "100%",

    flexDirection: "column",
    justifyContent: "flex-start",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
});

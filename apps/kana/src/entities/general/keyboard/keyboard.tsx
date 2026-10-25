import React, { useState } from "react";

import { useHaptic } from "@nihongo/core/shared/contexts/haptic/haptic-context";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import {
  Transliterations,
  useTransliterationsContext,
} from "@nihongo/core/shared/contexts/transliteration/transliteration";
import { Typography } from "@nihongo/core/shared/typography";
import { ArrowFatLineUpIcon, BackspaceIcon, SmileyMeltingIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text, useWindowDimensions, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface KeyboardProps {
  onSubmit: () => void;
  setValue: (val: string) => void;

  disable?: boolean;
}

const english = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["keyboard-caps", "z", "x", "c", "v", "b", "n", "m", "del"],
];

const russion = [
  ["ё", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х"],
  ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"],
  ["keyboard-caps", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "del"],
];

const CustomKeyboard: React.FC<KeyboardProps> = ({ setValue, onSubmit, disable }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const styles = makeStyles();
  const { triggerHaptic } = useHaptic();
  const { transliterations } = useTransliterationsContext();

  const keyboard = transliterations === Transliterations.POL ? russion : english;

  const [isCaps, setIsCaps] = useState(true);

  const onPress = (item: string) => {
    if (disable) return;

    triggerHaptic();

    if (item === "keyboard-caps") {
      setIsCaps((val) => !val);
      return;
    }

    if (item === "del") {
      setValue("del");
      return;
    }

    if (item === "del-long") {
      setValue("del-long");
      return;
    }

    if (item === "space") {
      setValue("space");
      return;
    }

    if (item === "enter") {
      onSubmit();
      return;
    }

    if (isCaps) {
      setValue(item.toUpperCase());
    } else {
      setValue(item);
    }
  };

  const getWidthItem = (rowLength: number) => width / rowLength - 5;

  return (
    <View
      style={[
        styles.container,
        {
          width: "100%",
          paddingBottom: 30 + insets.bottom,
          marginBottom: -(16 + insets.bottom),
        },
      ]}
    >
      {keyboard.map((row, index) => (
        <View style={styles.row} key={`keyboard_row/${index}`}>
          {row.map((item) => (
            <Pressable
              onPress={() => onPress(item)}
              onLongPress={() => {
                if (item === "del") onPress("del-long");
              }}
              style={({ pressed }) => [
                styles.button,
                {
                  width: getWidthItem(row.length),
                  backgroundColor: disable
                    ? colors.BgSecondary
                    : item === "del"
                      ? pressed
                        ? colors.BgPrimary
                        : colors.BgLightGray
                      : item === "null"
                        ? colors.transparent
                        : pressed
                          ? colors.BgLightGray
                          : colors.BgSecondary,
                },
              ]}
              key={`keyboard_button/${item}`}
            >
              {item === "del" && <BackspaceIcon size={20} color={colors.BgContrast} />}
              {item === "keyboard-caps" && (
                <ArrowFatLineUpIcon size={20} color={colors.BgContrast} />
              )}

              {item.length === 1 && (
                <Text style={[{ color: colors.TextPrimary }, Typography.H4]}>
                  {isCaps ? item.toUpperCase() : item}
                </Text>
              )}
            </Pressable>
          ))}
        </View>
      ))}
      <View style={styles.row}>
        <View style={{ width: width / 4.6 + 8, flexDirection: "row", gap: 4 }}>
          <View
            style={[styles.button, { width: width / 9.2 + 2, backgroundColor: colors.BgLightGray }]}
          >
            <Text style={[{ color: colors.TextDisabled }, Typography.regularDefault]}>123</Text>
          </View>
          <View
            style={[styles.button, { width: width / 9.2 + 2, backgroundColor: colors.BgLightGray }]}
          >
            <SmileyMeltingIcon size={20} color={colors.BgDisabled} />
          </View>
        </View>
        <Pressable
          onPress={() => {
            onPress("space");
          }}
          style={({ pressed }) => [
            styles.button,
            {
              width: width / 2.08,
              backgroundColor: pressed ? colors.BgLightGray : colors.BgSecondary,
            },
          ]}
        >
          <Text style={[{ color: colors.TextPrimary }, Typography.regularDefault]}>
            {t("common.space")}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onPress("enter")}
          style={({ pressed }) => [
            styles.button,
            {
              width: width / 4.6 + 8,
              backgroundColor: pressed ? colors.BgPrimary : colors.BgLightGray,
            },
          ]}
        >
          <Text style={[{ color: colors.TextPrimary }, Typography.regularDefault]}>
            {t("common.done")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    container: {
      marginTop: 0,
    },

    row: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 8,
      gap: 4,
    },
    button: {
      justifyContent: "center",
      alignItems: "center",
      height: 48,
      borderRadius: 6,
    },
  });

export default CustomKeyboard;

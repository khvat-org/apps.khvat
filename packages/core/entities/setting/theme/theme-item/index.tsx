import React from "react";

import { MoonIcon, SunIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Text, Pressable } from "react-native";

import { ColorsType, useThemeContext } from "../../../../shared/contexts/theme/theme-context";
import { Typography } from "../../../../shared/typography";
import Tag from "../../../../shared/ui/tag/tag";

import ThemeIcon from "./components/theme-icon";

export enum ThemeType {
  Dark = "dark",
  Light = "light",
}

interface ThemeItemProps {
  name: string;
  // ? 3 colors
  icon: string[];
  author: string;
  type: ThemeType;
  downloads: number;
  // ? Array of URLs
  screenshots: string[];

  isOpen: boolean;

  isLast: boolean;

  active: boolean;

  onPress: () => void;
}

const ThemeItem: React.FC<ThemeItemProps> = (props) => {
  const { name, icon, isOpen, isLast, type, active } = props;

  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const styles = makeStyles(colors, active);

  if (isOpen) {
    return <View></View>;
  }

  return (
    <Pressable onPress={props.onPress} style={[styles.conteiner, isLast && styles.conteinerLast]}>
      <View style={styles.icon}>
        <ThemeIcon colors={icon} active={active} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{name}</Text>
        <View style={styles.tags}>
          {type === ThemeType.Light && (
            <Tag
              primary={active}
              icon={<SunIcon color={active ? colors.BgPrimary : colors.BgContrast} size={12} />}
              text={t("settings.theme.light")}
            />
          )}
          {type === ThemeType.Dark && (
            <Tag
              primary={active}
              icon={<MoonIcon color={active ? colors.BgPrimary : colors.BgContrast} size={12} />}
              text={t("settings.theme.dark")}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
};

const makeStyles = (colors: ColorsType, active: boolean) =>
  StyleSheet.create({
    conteiner: {
      backgroundColor: active ? colors.BgContrast : colors.BgSecondary,
      borderRadius: 12,

      marginBottom: 8,

      flexDirection: "row",

      paddingHorizontal: 16,
      paddingVertical: 16,

      gap: 12,
    },

    conteinerLast: {
      borderBottomWidth: 0,
    },

    info: {
      gap: 4,
    },

    icon: {
      width: 48,
      height: 48,
    },
    title: {
      color: active ? colors.TextContrast : colors.TextPrimary,

      ...Typography.boldDefault,
    },
    tags: {
      flexDirection: "row",
      gap: 4,

      width: "100%",
    },
  });

export default ThemeItem;

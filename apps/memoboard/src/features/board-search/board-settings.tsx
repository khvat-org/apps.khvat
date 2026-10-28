import React, { ReactNode, useMemo } from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { fonts, Typography } from "@nihongo/core/shared/typography";
import {
  EyeIcon,
  EyeSlashIcon,
  ImageIcon,
  SquaresFourIcon,
  TranslateIcon,
} from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";

import { useBoard } from "@/shared/contexts/board/board-context";
import { CardMode, Columns } from "@/shared/contexts/board/board-preference";
import SegmentedControl from "@/shared/ui/segmented-control/segmented-control";

export type BoardSetting = "cardMode" | "tags" | "images" | "columns";

// * По этим словам настройка находится в поиске
export const BOARD_SETTINGS_KEYWORDS: Record<BoardSetting, string[]> = {
  cardMode: ["вид", "карточки", "режим", "перевод", "фуригана", "card", "view", "mode", "translate"],
  tags: ["теги", "метки", "показывать", "скрыть", "tags"],
  images: ["картинки", "изображения", "фото", "показывать", "скрыть", "images", "pictures"],
  columns: ["колонки", "сетка", "ряд", "columns", "grid", "row"],
};

export const BOARD_SETTINGS: BoardSetting[] = ["cardMode", "tags", "images", "columns"];

// * Мини-превью карточки: 字 — японское слово, じ — фуригана, A — перевод
const CardModeIcon: React.FC<{ mode: CardMode; color: string }> = ({ mode, color }) => (
  <View style={styles.modeIcon}>
    {mode !== CardMode.Translate && (
      <View style={styles.modeKanji}>
        {mode === CardMode.Both && <Text style={[styles.modeFurigana, { color }]}>じ</Text>}
        <Text style={[styles.modeTitle, { color }]}>字</Text>
      </View>
    )}

    {mode !== CardMode.Japan && <Text style={[styles.modeTranslate, { color }]}>A</Text>}
  </View>
);

const ColumnsIcon: React.FC<{ count: number; color: string }> = ({ count, color }) => (
  <View style={styles.columnsIcon}>
    {Array.from({ length: count }, (_, index) => (
      <View key={index} style={[styles.column, { backgroundColor: color }]} />
    ))}
  </View>
);

const CARD_MODES = [CardMode.Japan, CardMode.NoFurigana, CardMode.Both, CardMode.Translate];
const COLUMNS: Columns[] = [2, 3];

interface SettingRowProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

const SettingRow: React.FC<SettingRowProps> = ({ icon, title, children }) => {
  const { colors } = useThemeContext();
  const rowStyles = useMemo(() => makeRowStyles(colors), [colors]);

  return (
    <View style={rowStyles.row}>
      {icon}

      <Text numberOfLines={1} style={rowStyles.title}>
        {title}
      </Text>

      {children}
    </View>
  );
};

export const BoardSettingItem: React.FC<{ setting: BoardSetting }> = ({ setting }) => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  const { preference, setPreference } = useBoard();

  const iconColor = colors.TextSecondary;

  if (setting === "cardMode") {
    return (
      <SettingRow icon={<TranslateIcon size={22} color={iconColor} />} title={t("board.cardView")}>
        <SegmentedControl
          value={preference.mode}
          onChange={(mode) => setPreference({ mode })}
          options={CARD_MODES.map((mode) => ({
            value: mode,
            render: (color) => <CardModeIcon mode={mode} color={color} />,
          }))}
        />
      </SettingRow>
    );
  }

  if (setting === "tags") {
    return (
      <SettingRow icon={<EyeIcon size={22} color={iconColor} />} title={t("board.tags")}>
        <SegmentedControl
          value={preference.showTags}
          onChange={(showTags) => setPreference({ showTags })}
          options={[
            { value: true, render: (color) => <EyeIcon size={20} color={color} /> },
            { value: false, render: (color) => <EyeSlashIcon size={20} color={color} /> },
          ]}
        />
      </SettingRow>
    );
  }

  if (setting === "images") {
    return (
      <SettingRow icon={<ImageIcon size={22} color={iconColor} />} title={t("board.images")}>
        <SegmentedControl
          value={preference.showImages}
          onChange={(showImages) => setPreference({ showImages })}
          options={[
            { value: true, render: (color) => <EyeIcon size={20} color={color} /> },
            { value: false, render: (color) => <EyeSlashIcon size={20} color={color} /> },
          ]}
        />
      </SettingRow>
    );
  }

  return (
    <SettingRow icon={<SquaresFourIcon size={22} color={iconColor} />} title={t("board.columns")}>
      <SegmentedControl
        value={preference.columns}
        onChange={(columns) => setPreference({ columns })}
        options={COLUMNS.map((count) => ({
          value: count,
          render: (color) => <ColumnsIcon count={count} color={color} />,
        }))}
      />
    </SettingRow>
  );
};

const makeRowStyles = (colors: ColorsType) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,

      paddingHorizontal: 16,
      paddingVertical: 6,
    },
    title: {
      ...Typography.regularDefault,
      color: colors.TextPrimary,

      flex: 1,
    },
  });

const styles = StyleSheet.create({
  modeIcon: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  modeKanji: {
    alignItems: "center",
  },
  modeFurigana: {
    ...fonts.regular,
    fontSize: 8,
    lineHeight: 9,
  },
  modeTitle: {
    ...fonts.medium,
    fontSize: 17,
    lineHeight: 20,
  },
  modeTranslate: {
    ...fonts.medium,
    fontSize: 11,
    lineHeight: 14,
  },
  columnsIcon: {
    flexDirection: "row",
    gap: 2,
  },
  column: {
    width: 5,
    height: 16,
    borderRadius: 2,
  },
});

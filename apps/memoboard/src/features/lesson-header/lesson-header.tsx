import React, { useMemo } from "react";

import { useHaptic } from "@nihongo/core/shared/contexts/haptic/haptic-context";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { ShuffleIcon, SortAscendingIcon, XIcon } from "phosphor-react-native";
import { View, Text, StyleSheet, Pressable } from "react-native";

const FIRST_SECTION_GAP = 8;
const SECTION_GAP = 32;
const PLATE_HEIGHT = 64;
const PLATE_MARGIN_BOTTOM = 4;

// * Высота шапки вместе с отступом от предыдущего урока — нужна для getItemLayout
export const getLessonHeaderHeight = (sectionIndex: number) =>
  (sectionIndex === 0 ? FIRST_SECTION_GAP : SECTION_GAP) + PLATE_HEIGHT + PLATE_MARGIN_BOTTOM;

interface LessonHeaderProps {
  title: string;
  isFirst: boolean;
  isShuffled: boolean;
  // * Нет — кнопки перемешки нет (например, у результатов поиска)
  onToggleShuffle?: () => void;
  // * Кнопка выхода из раздела (сохранённые)
  onClose?: () => void;
}

const LessonHeaderComponent: React.FC<LessonHeaderProps> = ({
  title,
  isFirst,
  isShuffled,
  onToggleShuffle,
  onClose,
}) => {
  const { colors } = useThemeContext();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { triggerHaptic } = useHaptic();

  return (
    <View style={{ paddingTop: isFirst ? FIRST_SECTION_GAP : SECTION_GAP }}>
      <View style={styles.plate}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>

        {onToggleShuffle && (
          <Pressable
            onPress={() => {
              triggerHaptic();
              onToggleShuffle();
            }}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            {isShuffled ? (
              <SortAscendingIcon size={20} color={colors.TextPrimary} />
            ) : (
              <ShuffleIcon size={20} color={colors.TextPrimary} />
            )}
          </Pressable>
        )}

        {onClose && (
          <Pressable
            onPress={() => {
              triggerHaptic();
              onClose();
            }}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <XIcon size={20} color={colors.TextPrimary} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export const LessonHeader = React.memo(LessonHeaderComponent);

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    plate: {
      height: PLATE_HEIGHT,
      marginHorizontal: 12,
      marginBottom: PLATE_MARGIN_BOTTOM,
      paddingLeft: 16,
      paddingRight: 12,

      flexDirection: "row",
      alignItems: "center",
      gap: 12,

      backgroundColor: colors.BgPrimary,
      borderRadius: 12,
    },
    title: {
      ...Typography.boldDefault,
      color: colors.TextPrimary,
      textTransform: "capitalize",

      flex: 1,
    },
    button: {
      width: 40,
      height: 40,

      alignItems: "center",
      justifyContent: "center",

      backgroundColor: colors.BgLightGray,
      borderRadius: 10,
    },
    buttonPressed: {
      opacity: 0.7,
    },
  });

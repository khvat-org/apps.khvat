import React from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { useFileUrl } from "@nihongo/core/shared/lib/api-gateway";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View, Image, ImageStyle, Pressable } from "react-native";

const isImageIcon = (icon: string) =>
  /^https?:\/\//i.test(icon) || /\.(png|jpe?g|webp|gif)$/i.test(icon);

const IconImage: React.FC<{ src: string; style: ImageStyle }> = ({ src, style }) => {
  const uri = useFileUrl(src);

  return <Image style={style} source={uri ? { uri } : undefined} />;
};

interface TopicItemProps {
  isPassed?: boolean;
  isOpened?: boolean;
  isLast: boolean;

  icon?: string;
  title: string;
  subtitle: string;
  infoTitle: string;
  infoSubTitle: string;

  onClick?: () => void;
  onStartLesson?: () => void;
}

const TopicItem: React.FC<TopicItemProps> = ({
  icon = "?",
  isPassed,
  title,
  subtitle,
  infoTitle,
  infoSubTitle,
  isOpened,
  isLast,
  onClick,
  onStartLesson,
}) => {
  const { colors } = useThemeContext();
  const { t } = useTranslation();

  const styles = makeStyles(colors);

  const getIcon = (link: string) => {
    if (isImageIcon(link)) {
      return <IconImage style={styles.icon} src={link} />;
    }

    return (
      <View style={[styles.indicatorIcon]}>
        <Text style={styles.indicatorText}>{link}</Text>
      </View>
    );
  };

  return (
    <Pressable
      style={[styles.container, isOpened && styles.containerOpened, isLast && { marginBottom: 10 }]}
      onPress={() => onClick?.()}
    >
      <View style={styles.row}>
        <View style={[styles.indicator]}>
          <View
            style={[
              styles.indicatorRound,
              {
                borderColor: isPassed ? colors.BgSuccess : colors.BgLightGray,
              },
            ]}
          />

          {getIcon(icon)}
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      {isOpened && (
        <View style={styles.expanded}>
          <View
            style={[
              styles.expandedLine,
              { backgroundColor: isPassed ? colors.BgSuccess : colors.BgLightGray },
            ]}
          />

          <View style={styles.expandedContent}>
            <Text style={styles.expandedTitle}>{infoTitle}</Text>
            <Text style={styles.expandedSubtitle}>{infoSubTitle}</Text>

            <Button
              color="primary"
              size="sm"
              onClick={onStartLesson}
              text={isPassed ? t("common.retry") : t("common.start")}
              style={styles.buttonStartLesson}
            />
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default TopicItem;

const INDICATOR_SIZE = 72;
const ICON_SIZE = 56;
const ICON_OFFSET = (70 - ICON_SIZE) / 2;
const LINE_WIDTH = 4;
const TEXT_GAP = 12;

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 8,
      paddingHorizontal: 8,
      borderRadius: 16,

      paddingVertical: 8,
    },
    containerOpened: {
      backgroundColor: colors.BgSecondary,

      paddingVertical: 8,
    },
    row: {
      flexDirection: "row",
      gap: TEXT_GAP,
    },
    indicator: {
      position: "relative",
      width: INDICATOR_SIZE,
      height: 70,
    },
    indicatorText: {
      ...Typography.regularLabel,
      color: colors.BgContrast,
    },
    info: {
      flex: 1,
    },
    title: {
      ...Typography.boldDefault,
      color: colors.TextPrimary,
      marginTop: 12,
    },
    subtitle: {
      ...Typography.regularLabel,
      color: colors.TextSecondary,
    },
    expanded: {
      flexDirection: "row",
      marginTop: 8,
    },
    expandedLine: {
      width: LINE_WIDTH,
      borderRadius: LINE_WIDTH,
      marginLeft: (70 - LINE_WIDTH) / 2,
    },
    expandedContent: {
      flex: 1,
      paddingLeft: INDICATOR_SIZE + TEXT_GAP - (70 - LINE_WIDTH) / 2 - LINE_WIDTH,
    },
    expandedTitle: {
      ...Typography.boldLabel,
      color: colors.TextPrimary,
    },
    expandedSubtitle: {
      ...Typography.regularLabel,
      color: colors.TextSecondary,
    },
    buttonStartLesson: {
      alignSelf: "flex-start",

      marginTop: 16,
    },
    indicatorRound: {
      backgroundColor: colors.transparent,
      borderRadius: 70,
      width: 70,
      height: 70,
      borderWidth: 4,
    },
    icon: {
      width: ICON_SIZE,
      height: ICON_SIZE,
      position: "absolute",
      borderRadius: ICON_SIZE,
      left: ICON_OFFSET,
      top: ICON_OFFSET,
    },
    indicatorIcon: {
      width: ICON_SIZE,
      height: ICON_SIZE,
      position: "absolute",
      borderRadius: ICON_SIZE,
      left: ICON_OFFSET,
      top: ICON_OFFSET,

      justifyContent: "center",
      alignItems: "center",
    },
  });

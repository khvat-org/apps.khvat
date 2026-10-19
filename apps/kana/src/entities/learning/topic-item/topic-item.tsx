import React from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { useFileUrl } from "@nihongo/core/shared/lib/api-gateway";
import { Typography } from "@nihongo/core/shared/typography";
import { CheckIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Image,
  ImageStyle,
  Pressable,
} from "react-native";

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
  isLast,
  isOpened,
  onClick,
  onStartLesson,
}) => {
  const { width } = useWindowDimensions();
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
      style={[styles.container, { marginBottom: !isLast ? 8 : isOpened ? 32 : 16 }]}
      onPress={() => onClick?.()}
    >
      <View style={styles.content}>
        <View
          style={[
            {
              width: "100%",
              flexDirection: "column",
              gap: 8,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 16,
              position: "relative",
            }}
          >
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

              {isPassed && (
                <View style={[styles.indicatorCheck]}>
                  <CheckIcon weight="bold" size={12} color={colors.BgWhite} />
                </View>
              )}
            </View>

            <View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                backgroundColor: isPassed ? colors.BgSuccess : colors.BgLightGray,
                height: isOpened ? "100%" : 16,
                borderRadius: 4,
                width: 4,
                marginLeft: 34,
                opacity: !isLast || isOpened ? 1 : 0,
              }}
            />

            <View
              style={{
                height: isOpened ? "auto" : 0,
                overflow: "hidden",
              }}
            >
              <View style={{ paddingLeft: 50, maxWidth: width - 80 }}>
                <View>
                  {<View style={[styles.infoLine, { opacity: isOpened ? 1 : 0 }]} />}
                  <Text style={styles.expandedTitle}>{infoTitle}</Text>
                  <Text style={styles.expandedSubtitle}>{infoSubTitle}</Text>
                </View>

                {isOpened && (
                  <Pressable onPress={onStartLesson} style={styles.buttonStartLesson}>
                    <Text style={styles.buttonStartLessonText}>
                      {isPassed ? t("common.retry") : t("common.start")}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default TopicItem;

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      width: "100%",
      position: "relative",
      paddingLeft: 16,
      paddingRight: 16,
      flex: 1,
    },
    content: {
      width: "100%",
      flexDirection: "row",
      height: "100%",
      alignItems: "flex-start",
      gap: 16,
    },
    indicator: {
      position: "relative",
      width: 72,
      height: 72,
    },
    indicatorText: {
      ...Typography.regularLabel,
      color: colors.BgContrast,
    },
    info: {
      gap: 5,
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
    expandedTitle: {
      ...Typography.boldDefault,
      color: colors.TextPrimary,
      marginTop: 16,
    },
    expandedSubtitle: {
      ...Typography.regularLabel,
      color: colors.TextSecondary,
      marginTop: 4,
      marginBottom: 32,
    },
    buttonStartLesson: {
      backgroundColor: colors.BgContrast,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      height: 40,
      width: "auto",
      alignSelf: "flex-start",
      paddingLeft: 24,
      paddingRight: 24,
    },
    buttonStartLessonText: {
      ...Typography.boldDefault,
      color: colors.TextContrast,
    },
    infoLine: {
      width: "100%",
      height: 1,
      backgroundColor: colors.BorderDefault,
    },
    indicatorRound: {
      backgroundColor: colors.transparent,
      borderRadius: 70,
      width: 70,
      height: 70,
      borderWidth: 4,
    },
    icon: {
      width: 54,
      height: 54,
      position: "absolute",
      borderRadius: 54,
      left: 8,
      top: 8,
    },
    indicatorIcon: {
      width: 54,
      height: 54,
      position: "absolute",
      borderRadius: 54,
      left: 8,
      top: 8,

      justifyContent: "center",
      alignItems: "center",
    },
    indicatorCheck: {
      borderColor: colors.BgPrimary,
      backgroundColor: colors.BgSuccess,
      position: "absolute",
      bottom: -5,
      left: 26,
      width: 20,
      height: 20,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
    },
  });

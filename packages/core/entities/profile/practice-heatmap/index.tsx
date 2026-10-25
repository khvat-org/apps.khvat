import React, { useMemo, useState } from "react";

import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { toDateKey } from "@nihongo/core/shared/contexts/study-activity/study-activity-context";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, LayoutChangeEvent, useWindowDimensions } from "react-native";

const DAY_SIZE = 14;
const GAP = 2.5;
const DAYS_IN_WEEK = 7;
const MAX_WEEKS = 53;
const PAGE_PADDING = 16;
const CONTAINER_PADDING = 16;

function withAlpha(hex: string, alpha: number) {
  const raw = hex.replace("#", "").trim();
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw.slice(0, 6);

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function makeHeatmapColors(hex: string) {
  return [withAlpha(hex, 0.25), withAlpha(hex, 0.5), withAlpha(hex, 0.75), hex];
}

function getLevel(count: number, max: number) {
  if (count <= 0 || max <= 0) return 0;
  return Math.min(4, Math.ceil((count / max) * 4));
}

function buildWeeks(weeksCount: number, today: Date) {
  const mondayOffset = (today.getDay() + 6) % 7;
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - mondayOffset);
  start.setDate(start.getDate() - (weeksCount - 1) * DAYS_IN_WEEK);

  const todayKey = toDateKey(today);
  const weeks: string[][] = [];

  for (let w = 0; w < weeksCount; w++) {
    const week: string[] = [];
    for (let d = 0; d < DAYS_IN_WEEK; d++) {
      const date = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + w * DAYS_IN_WEEK + d,
      );
      const key = toDateKey(date);
      week.push(key);
      if (key === todayKey) break;
    }
    weeks.push(week);
  }

  return weeks;
}

interface PracticeHeatmapProps {
  // { "2026-09-14": 12, "2026-09-10": 2 }
  data?: {
    [key: string]: number;
  };
}

export const PracticeHeatmap: React.FC<PracticeHeatmapProps> = ({ data = {} }) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const { width: windowWidth } = useWindowDimensions();
  const [measuredWidth, setMeasuredWidth] = useState(0);

  const width =
    measuredWidth > 0
      ? measuredWidth
      : Math.min(windowWidth - PAGE_PADDING * 2, TABLET_WIDTH) - CONTAINER_PADDING * 2;

  const styles = makeStyles(colors);
  const mapColors = makeHeatmapColors(colors.BgAccent);

  const weeksCount = Math.min(MAX_WEEKS, Math.floor((width + GAP) / (DAY_SIZE + GAP)));

  const daySize =
    weeksCount > 0 && weeksCount < MAX_WEEKS
      ? (width - (weeksCount - 1) * GAP) / weeksCount
      : DAY_SIZE;
  const graphHeight = DAYS_IN_WEEK * daySize + (DAYS_IN_WEEK - 1) * GAP;

  const weeks = useMemo(
    () => (weeksCount > 0 ? buildWeeks(weeksCount, new Date()) : []),
    [weeksCount],
  );

  const { max, daysCount, practiceCount } = useMemo(() => {
    const values = Object.values(data).filter((v) => v > 0);
    return {
      max: values.length ? Math.max(...values) : 0,
      daysCount: values.length,
      practiceCount: values.reduce((sum, v) => sum + v, 0),
    };
  }, [data]);

  const onLayout = (e: LayoutChangeEvent) => {
    const next = e.nativeEvent.layout.width;
    if (next > 0 && next !== measuredWidth) setMeasuredWidth(next);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.graphWrapper, { height: graphHeight }]} onLayout={onLayout}>
        <View style={styles.graph}>
          {weeks.map((week) => (
            <View key={week[0]} style={styles.week}>
              {week.map((key) => {
                const level = getLevel(data[key] ?? 0, max);
                return (
                  <View
                    key={key}
                    style={[
                      styles.day,
                      { width: daySize, height: daySize },
                      level > 0 && { backgroundColor: mapColors[level - 1] },
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>
      <View style={styles.info}>
        <View style={styles.infoItem}>
          <Text style={styles.infoTextAccent}>{daysCount} </Text>
          <Text style={styles.infoText}>{t("profile.stats.daysOfStudy")}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoTextAccent}>{practiceCount} </Text>
          <Text style={styles.infoText}>{t("profile.stats.timesOfPractice")}</Text>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.BgPrimary,
      borderRadius: 12,
      padding: CONTAINER_PADDING,
      gap: 12,
    },
    info: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    infoText: {
      color: colors.TextPrimary,

      ...Typography.boldLabel,
    },
    infoTextAccent: {
      color: colors.TextAccent,

      ...Typography.boldLabel,
    },
    graphWrapper: {
      alignItems: "flex-end",
    },
    graph: {
      flexDirection: "row",
      gap: GAP,
    },
    week: {
      flexDirection: "column",
      gap: GAP,
    },
    day: {
      width: DAY_SIZE,
      height: DAY_SIZE,

      borderRadius: 2.5,

      backgroundColor: colors.BgSecondary,
    },
  });

export default PracticeHeatmap;

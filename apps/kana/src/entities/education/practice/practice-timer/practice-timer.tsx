import React, { useEffect, useRef, useState } from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { View, Text, StyleSheet, Animated } from "react-native";

interface EducationPracticeTimerProps {
  onTimerEnd?: () => void;
  initial: number;
  index: number;
  isFreeze?: boolean;
}

const EducationPracticeTimer: React.FC<EducationPracticeTimerProps> = ({
  initial = 5,
  index,
  onTimerEnd,
  isFreeze = false,
}) => {
  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const animatedValue = useRef(new Animated.Value(1)).current;
  const [timeLeft, setTimeLeft] = useState(initial);

  const isFreezeRef = useRef(isFreeze);
  const lastWholeSecondsRef = useRef(initial);
  const remainingRef = useRef(initial * 1000);
  const lastFrameTime = useRef(Date.now());

  useEffect(() => {
    isFreezeRef.current = isFreeze;
  }, [isFreeze]);

  useEffect(() => {
    let rafId: number;
    let isActive = true;
    remainingRef.current = initial * 1000;
    lastWholeSecondsRef.current = initial;
    setTimeLeft(initial);
    animatedValue.setValue(1);

    const tick = () => {
      if (!isActive) return;

      const now = Date.now();
      const delta = now - lastFrameTime.current;
      lastFrameTime.current = now;

      if (!isFreezeRef.current) {
        remainingRef.current = Math.max(0, remainingRef.current - delta);
        const progress = remainingRef.current / (initial * 1000);
        animatedValue.setValue(progress);

        const secondsLeft = Math.ceil(remainingRef.current / 1000);
        if (secondsLeft !== lastWholeSecondsRef.current) {
          lastWholeSecondsRef.current = secondsLeft;
          setTimeLeft(secondsLeft);
        }

        if (remainingRef.current <= 0) {
          setTimeLeft(0);
          onTimerEnd?.();
          return;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(() => {
      if (!isActive) return;
      lastFrameTime.current = Date.now();
      rafId = requestAnimationFrame(tick);
    });

    return () => {
      isActive = false;
      cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial, index]);

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Animated.View
          style={{
            ...styles.timerStroke,
            width: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
            backgroundColor: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [colors.BgDanger, colors.BgSuccess],
            }),
          }}
        />
      </View>
      <View style={styles.timerTextContainer}>
        <Text style={styles.timerTime}>{formatTime(timeLeft)}</Text>
      </View>
    </View>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 16,
      marginTop: 8,
    },
    timerContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      height: 10,
      borderRadius: 33,
      backgroundColor: colors.BgSecondary,
    },
    timerStroke: {
      height: 10,
      borderRadius: 33,
    },
    timerTextContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    timerTime: {
      ...Typography.boldDefault,
      color: colors.BgContrast,

      marginTop: -2,
    },
  });

export default EducationPracticeTimer;

import React, { useEffect, useRef, useState } from "react";

import { StyleSheet, View } from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";

import { useHaptic } from "../../contexts/haptic/haptic-context";
import { ColorsType, useThemeContext } from "../../contexts/theme/theme-context";

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  onSlideStart?: () => void;
  onSlideEnd?: () => void;
}

const THUMB_SIZE = 24;

const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  onSlideStart,
  onSlideEnd,
}) => {
  const { colors } = useThemeContext();
  const { triggerHaptic } = useHaptic();
  const styles = makeStyles(colors);

  const [width, setWidth] = useState(0);

  const latest = useRef({
    width,
    min,
    max,
    step,
    value,
    onChange,
    onSlideStart,
    onSlideEnd,
    triggerHaptic,
  });

  useEffect(() => {
    Object.assign(latest.current, {
      width,
      min,
      max,
      step,
      value,
      onChange,
      onSlideStart,
      onSlideEnd,
      triggerHaptic,
    });
  });

  const select = (x: number) => {
    const s = latest.current;
    const ratio = Math.min(Math.max((x - THUMB_SIZE / 2) / (s.width - THUMB_SIZE), 0), 1);
    const next = s.min + Math.round((ratio * (s.max - s.min)) / s.step) * s.step;

    if (next === s.value) return;

    s.value = next;
    s.triggerHaptic();
    s.onChange(next);
  };

  const pan = usePanGesture({
    minDistance: 0,
    maxPointers: 1,
    runOnJS: true,
    onBegin: ({ x }) => {
      latest.current.onSlideStart?.();
      select(x);
    },
    onUpdate: ({ x }) => select(x),
    onFinalize: () => latest.current.onSlideEnd?.(),
  });

  const ratio = max > min ? (value - min) / (max - min) : 0;
  const left = ratio * Math.max(width - THUMB_SIZE, 0);

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.container} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: left + THUMB_SIZE / 2 }]} />
        </View>
        <View style={[styles.thumb, { left }]} />
      </View>
    </GestureDetector>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      height: 32,
      justifyContent: "center",
    },
    track: {
      height: 4,
      borderRadius: 2,
      overflow: "hidden",
      backgroundColor: colors.BgLightGray,
      pointerEvents: "none",
    },
    fill: {
      height: "100%",
      backgroundColor: colors.BgAccent,
    },
    thumb: {
      position: "absolute",
      top: (32 - THUMB_SIZE) / 2,
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      borderRadius: THUMB_SIZE / 2,
      backgroundColor: colors.BgAccent,
      pointerEvents: "none",
    },
  });

export default Slider;

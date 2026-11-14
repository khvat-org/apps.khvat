import React, { useId } from "react";

import { StyleSheet, View } from "react-native";
import { Circle, Defs, LinearGradient, Path, Stop, Svg } from "react-native-svg";

import { DrawingPath, generatePathDAttribute } from "../../lib/svg-path";

export const STROKE_GRADIENTS: [string, string][] = [
  ["#D6771C", "#FFCB9A"],
  ["#2F91CD", "#ABD8F3"],
  ["#FCC429", "#FBE29E"],
  ["#CE52D0", "#EEB8EF"],
  ["#A1C018", "#D2DE9B"],
  ["#4557C8", "#BDC2E3"],
  ["#FA8953", "#FDD3BF"],
  ["#8A4FC8", "#CCB8E2"],
  ["#94603C", "#D4BDAD"],
  ["#4D803E", "#B2D7A8"],
];

const gradientEnd = (stroke: DrawingPath, minDistance: number) => {
  const start = stroke[0];
  const last = stroke[stroke.length - 1];
  const distance = (point: { x: number; y: number }) =>
    Math.hypot(point.x - start.x, point.y - start.y);

  if (distance(last) >= minDistance) return last;

  return stroke.reduce((farthest, point) =>
    distance(point) > distance(farthest) ? point : farthest,
  );
};

const PADDING_RATIO = 0.1;

interface StrokesCanvasProps {
  strokes: DrawingPath[];

  viewBoxSize: number;

  size: number;

  additionalPadding?: number;

  strokeScale?: number;
}

const StrokesCanvas: React.FC<StrokesCanvasProps> = ({
  strokes,
  viewBoxSize,
  size,
  additionalPadding = 0,
  strokeScale = 1,
}) => {
  const strokeWidth = (viewBoxSize / 40) * strokeScale;
  const gradientPrefix = useId().replace(/:/g, "");

  const padding = viewBoxSize * (PADDING_RATIO + additionalPadding);
  const viewBox = `${-padding} ${-padding} ${viewBoxSize + padding * 2} ${viewBoxSize + padding * 2}`;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={viewBox}>
        {strokes.map((stroke, index) => {
          const [startColor, endColor] = STROKE_GRADIENTS[index % STROKE_GRADIENTS.length];

          if (stroke.length < 2) {
            if (stroke.length === 0) return null;

            return (
              <Circle
                key={`stroke-${index}`}
                cx={stroke[0].x}
                cy={stroke[0].y}
                r={strokeWidth}
                fill={startColor}
              />
            );
          }

          const gradientId = `${gradientPrefix}-stroke-${index}`;
          const end = gradientEnd(stroke, strokeWidth);

          return (
            <React.Fragment key={`stroke-${index}`}>
              <Defs>
                <LinearGradient
                  id={gradientId}
                  gradientUnits="userSpaceOnUse"
                  x1={stroke[0].x}
                  y1={stroke[0].y}
                  x2={end.x}
                  y2={end.y}
                >
                  <Stop offset="0" stopColor={startColor} />
                  <Stop offset="1" stopColor={endColor} />
                </LinearGradient>
              </Defs>
              <Path
                d={generatePathDAttribute(stroke)}
                stroke={`url(#${gradientId})`}
                fill="none"
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});

export default StrokesCanvas;

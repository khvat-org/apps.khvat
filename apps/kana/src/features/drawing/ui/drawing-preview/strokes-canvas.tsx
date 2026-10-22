import React from "react";

import { StyleSheet, View } from "react-native";
import { Circle, Path, Svg } from "react-native-svg";

import { DrawingPath, generatePathDAttribute } from "../../lib/svg-path";

export const STROKE_COLORS = [
  "#E2725B",
  "#8A9A5B",
  "#4E9B9B",
  "#6F8ECF",
  "#B07AA1",
  "#BF8F3A",
  "#5C9E75",
  "#8C7BC0",
  "#C96B8E",
  "#7F9BA6",
];

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

  const padding = viewBoxSize * (PADDING_RATIO + additionalPadding);
  const viewBox = `${-padding} ${-padding} ${viewBoxSize + padding * 2} ${viewBoxSize + padding * 2}`;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={viewBox}>
        {strokes.map((stroke, index) => {
          const color = STROKE_COLORS[index % STROKE_COLORS.length];

          // * из одной точки путь не построить, показываем её точкой
          if (stroke.length < 2) {
            if (stroke.length === 0) return null;

            return (
              <Circle
                key={`stroke-${index}`}
                cx={stroke[0].x}
                cy={stroke[0].y}
                r={strokeWidth}
                fill={color}
              />
            );
          }

          return (
            <Path
              key={`stroke-${index}`}
              d={generatePathDAttribute(stroke)}
              stroke={color}
              fill="none"
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
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

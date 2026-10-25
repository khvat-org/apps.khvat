import React from "react";

import { StyleSheet, View } from "react-native";
import { Circle, Path, Svg } from "react-native-svg";

import { DrawingPath, generatePathDAttribute } from "../../lib/svg-path";

export const STROKE_COLORS = [
  "#E69F5D",
  "#72ADD2",
  "#F6D067",
  "#DA96DB",
  "#BBD05C",
  "#8791D4",
  "#FAB18D",
  "#AC85D7",
  "#CB9F80",
  "#8BC47B",
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

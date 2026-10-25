import { TextStyle, StyleSheet } from "react-native";

import { isAndroid } from "../constants/platformUtil";

const regular = isAndroid ? "IBMPlexSans-Regular" : "System";
const medium = isAndroid ? "IBMPlexSans-Medium" : "System";
const mediumWeight = isAndroid ? "500" : "600";

export const fonts = {
  regular: { fontFamily: regular, fontWeight: "400" },
  medium: { fontFamily: medium, fontWeight: mediumWeight },
  bold: { fontFamily: medium, fontWeight: mediumWeight },
  heavy: { fontFamily: medium, fontWeight: mediumWeight },
} as const;

const gts = (
  fontFamily: string,
  fontSize: number,
  lineHeight: number,
  fontWeight: TextStyle["fontWeight"],
): TextStyle => {
  const style: TextStyle = { fontFamily, fontSize, lineHeight, fontWeight };
  return style;
};

export const Typography = StyleSheet.create({
  H1: gts(medium, 96, 114, mediumWeight),
  H2: gts(medium, 40, 48, mediumWeight),
  H3: gts(medium, 28, 32, mediumWeight),
  H4: gts(medium, 22, 28, mediumWeight),

  boldDefault: gts(medium, 17, 24, mediumWeight),
  boldLabel: gts(medium, 15, 20, mediumWeight),

  regularDefault: gts(regular, 17, 24, "400"),
  regularLabel: gts(regular, 15, 20, "400"),
  regularCaption: gts(regular, 13, 16, "400"),
});

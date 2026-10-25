import { TextStyle, StyleSheet } from "react-native";

import { isAndroid } from "../constants/platformUtil";

const regular = isAndroid ? "IBMPlexSans-Regular" : "SFProText-Regular";
const medium = isAndroid ? "IBMPlexSans-Medium" : "SFProDisplay-Semibold";

export const fonts = {
  regular: { fontFamily: regular, fontWeight: "400" },
  medium: { fontFamily: medium, fontWeight: "500" },
  bold: { fontFamily: medium, fontWeight: "500" },
  heavy: { fontFamily: medium, fontWeight: "500" },
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
  H1: gts(medium, 96, 114, "500"),
  H2: gts(medium, 40, 48, "500"),
  H3: gts(medium, 28, 32, "500"),
  H4: gts(medium, 22, 28, "500"),

  boldDefault: gts(medium, 17, 24, "500"),
  boldLabel: gts(medium, 15, 20, "500"),

  regularDefault: gts(regular, 17, 24, "400"),
  regularLabel: gts(regular, 15, 20, "400"),
  regularCaption: gts(regular, 13, 16, "400"),
});

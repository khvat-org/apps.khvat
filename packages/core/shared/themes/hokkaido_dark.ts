import { darkTheme } from "./dark";

type Colors = typeof darkTheme;

const hokkaidoDarkTheme: Colors = {
  // Background
  BgPrimary: "#141B1E",
  BgSecondary: "#1F292D",
  BgLightGray: "#27363B",
  BgGray: "#82ADBA",
  BgDarkGray: "#CBE3EA",
  BgDisabled: "#506D75",
  BgContrast: "#FFFFFF",
  BgContrastPressed: "#CBE3EA",
  BgContrastSecondary: "#EDF3F4",
  BgWhite: "#FFFFFF",
  BgModal: "#00000080",
  BgAccent: "#EA8C5D",
  BgAccentPressed: "#B25020",
  BgSuccess: "#84BB51",
  BgWarning: "#EFB34C",
  BgWarningPressed: "#F6BF6D",
  BgDanger: "#EF6557",
  BgOrange: "#EA8C5D",
  BgBlue: "#52C9EB",

  // Border
  BorderDefault: "#27363B",
  BorderContrast: "#CBE3EA",
  BorderWarning: "#EFB34C",

  // Text
  TextPrimary: "#FFFFFF",
  TextPrimaryPressed: "#CBE3EA",
  TextSecondary: "#82ADBA",
  TextSecondaryPressed: "#506D75",
  TextDisabled: "#506D75",
  TextContrast: "#141B1E",
  TextWhite: "#FFFFFF",
  TextAccent: "#EA8C5D",
  TextAccentPressed: "#B25020",
  TextSuccess: "#84BB51",
  TextWarning: "#EFB34C",
  TextWarningPressed: "#F6BF6D",
  TextDanger: "#EF6557",

  // system
  primary: "#EA8C5D", // BgAccent
  background: "#141B1E", // BgPrimary
  card: "#141B1E", // BgPrimary
  text: "#FFFFFF", // TextPrimary
  border: "#27363B", // BorderDefault
  notification: "#FFFFFF", // BgContrast

  // transparent
  transparent: "transparent",

  _theme: "dark",
};

export { hokkaidoDarkTheme };

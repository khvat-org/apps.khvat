import { darkTheme } from "./dark";

type Colors = typeof darkTheme;

const sakuraLightTheme: Colors = {
  // Background
  BgPrimary: "#FFFFFF",
  BgSecondary: "#F5EDED",
  BgLightGray: "#EACBCA",
  BgGray: "#76504F",
  BgDarkGray: "#392626",
  BgDisabled: "#BA9695",
  BgContrast: "#2D2424",
  BgContrastPressed: "#392626",
  BgContrastSecondary: "#1F1717",
  BgWhite: "#FFFFFF",
  BgModal: "#00000080",
  BgAccent: "#85543F",
  BgAccentPressed: "#5A3628",
  BgSuccess: "#ABBF76",
  BgWarning: "#F5D170",
  BgWarningPressed: "#F1C855",
  BgDanger: "#F27578",
  BgOrange: "#F3946C",
  BgBlue: "#71BFF0",

  // Border
  BorderDefault: "#EACBCA",
  BorderContrast: "#392626",

  // Text
  TextPrimary: "#2D2424",
  TextPrimaryPressed: "#76504F",
  TextSecondary: "#76504F",
  TextSecondaryPressed: "#392626",
  TextDisabled: "#BA9695",
  TextContrast: "#FFFFFF",
  TextWhite: "#FFFFFF",
  TextAccent: "#85543F",
  TextAccentPressed: "#5A3628",
  TextSuccess: "#ABBF76",
  TextWarning: "#F5D170",
  TextWarningPressed: "#F1C855",
  TextDanger: "#F27578",

  // system
  primary: "#85543F", // BgAccent
  background: "#FFFFFF", // BgPrimary
  card: "#FFFFFF", // BgPrimary
  text: "#2D2424", // TextPrimary
  border: "#EACBCA", // BorderDefault
  notification: "#2D2424", // BgContrast

  // transparent
  transparent: "transparent",

  _theme: "light",
};

export { sakuraLightTheme };

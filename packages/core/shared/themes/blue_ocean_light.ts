import { darkTheme } from "./dark";

type Colors = typeof darkTheme;

const blueOceanLightTheme: Colors = {
  // Background
  BgPrimary: "#FFFFFF",
  BgSecondary: "#ECF1F5",
  BgLightGray: "#D6DFE9",
  BgGray: "#5B6877",
  BgDarkGray: "#242E3A",
  BgDisabled: "#A5AFBA",
  BgContrast: "#141E2B",
  BgContrastPressed: "#242E3A",
  BgContrastSecondary: "#0A141E",
  BgWhite: "#FFFFFF",
  BgModal: "#00000080",
  BgAccent: "#55BBEA",
  BgAccentPressed: "#007DBD",
  BgSuccess: "#76C076",
  BgWarning: "#F5DD64",
  BgWarningPressed: "#F2D752",
  BgDanger: "#F17375",
  BgOrange: "#F4AB67",
  BgBlue: "#78CBF1",

  // Border
  BorderDefault: "#D6DFE9",
  BorderContrast: "#242E3A",

  // Text
  TextPrimary: "#141E2B",
  TextPrimaryPressed: "#5B6877",
  TextSecondary: "#5B6877",
  TextSecondaryPressed: "#242E3A",
  TextDisabled: "#A5AFBA",
  TextContrast: "#FFFFFF",
  TextWhite: "#FFFFFF",
  TextAccent: "#55BBEA",
  TextAccentPressed: "#007DBD",
  TextSuccess: "#76C076",
  TextWarning: "#F5DD64",
  TextWarningPressed: "#F2D752",
  TextDanger: "#F17375",

  // system
  primary: "#55BBEA", // BgAccent
  background: "#FFFFFF", // BgPrimary
  card: "#FFFFFF", // BgPrimary
  text: "#141E2B", // TextPrimary
  border: "#D6DFE9", // BorderDefault
  notification: "#141E2B", // BgContrast

  // transparent
  transparent: "transparent",

  _theme: "light",
};

export { blueOceanLightTheme };

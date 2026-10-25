import { darkTheme } from "./dark";

type Colors = typeof darkTheme;

const lightTheme: Colors = {
  // Background
  BgPrimary: "#FFFFFF",
  BgSecondary: "#F6F6F6",
  BgLightGray: "#ECECEC",
  BgGray: "#757575",
  BgDarkGray: "#363636",
  BgDisabled: "#BBBBBB",
  BgContrast: "#2A2A2A",
  BgContrastPressed: "#363636",
  BgContrastSecondary: "#1E1E1E",
  BgWhite: "#FFFFFF",
  BgModal: "#00000080",
  BgAccent: "#9A7861",
  BgAccentPressed: "#856753",
  BgSuccess: "#7ABC71",
  BgWarning: "#F6CF6C",
  BgWarningPressed: "#F2C450",
  BgDanger: "#F4817D",
  BgOrange: "#F6AD6E",
  BgBlue: "#7DA5F4",

  // Border
  BorderDefault: "#ECECEC",
  BorderContrast: "#363636",

  // Text
  TextPrimary: "#2A2A2A",
  TextPrimaryPressed: "#757575",
  TextSecondary: "#757575",
  TextSecondaryPressed: "#363636",
  TextDisabled: "#BBBBBB",
  TextContrast: "#FFFFFF",
  TextWhite: "#FFFFFF",
  TextAccent: "#9A7861",
  TextAccentPressed: "#856753",
  TextSuccess: "#7ABC71",
  TextWarning: "#F6CF6C",
  TextWarningPressed: "#F2C450",
  TextDanger: "#F4817D",

  // system
  primary: "#9A7861", // BgAccent
  background: "#FFFFFF", // BgPrimary
  card: "#FFFFFF", // BgPrimary
  text: "#2A2A2A", // TextPrimary
  border: "#ECECEC", // BorderDefault
  notification: "#2A2A2A", // BgContrast

  // transparent
  transparent: "transparent",

  _theme: "light",
};

export { lightTheme };

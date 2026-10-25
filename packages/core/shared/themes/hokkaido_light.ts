import { darkTheme } from "./dark";

type Colors = typeof darkTheme;

const hokkaidoLightTheme: Colors = {
  // Background
  BgPrimary: "#FFFFFF",
  BgSecondary: "#EDF3F4",
  BgLightGray: "#CBE3EA",
  BgGray: "#506D75",
  BgDarkGray: "#27363B",
  BgDisabled: "#82ADBA",
  BgContrast: "#1F292D",
  BgContrastPressed: "#27363B",
  BgContrastSecondary: "#141B1E",
  BgWhite: "#FFFFFF",
  BgModal: "#00000080",
  BgAccent: "#E97237",
  BgAccentPressed: "#B25020",
  BgSuccess: "#97BD73",
  BgWarning: "#F6BF6D",
  BgWarningPressed: "#EFB34C",
  BgDanger: "#F2857A",
  BgOrange: "#F29B70",
  BgBlue: "#77D6F1",

  // Border
  BorderDefault: "#CBE3EA",
  BorderContrast: "#27363B",

  // Text
  TextPrimary: "#1F292D",
  TextPrimaryPressed: "#506D75",
  TextSecondary: "#506D75",
  TextSecondaryPressed: "#27363B",
  TextDisabled: "#82ADBA",
  TextContrast: "#FFFFFF",
  TextWhite: "#FFFFFF",
  TextAccent: "#E97237",
  TextAccentPressed: "#B25020",
  TextSuccess: "#97BD73",
  TextWarning: "#F6BF6D",
  TextWarningPressed: "#EFB34C",
  TextDanger: "#F2857A",

  // system
  primary: "#E97237", // BgAccent
  background: "#FFFFFF", // BgPrimary
  card: "#FFFFFF", // BgPrimary
  text: "#1F292D", // TextPrimary
  border: "#CBE3EA", // BorderDefault
  notification: "#1F292D", // BgContrast

  // transparent
  transparent: "transparent",

  _theme: "light",
};

export { hokkaidoLightTheme };

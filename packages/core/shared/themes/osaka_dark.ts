import { darkTheme } from "./dark";

type Colors = typeof darkTheme;

const osakaDarkTheme: Colors = {
  // Background
  BgPrimary: "#1F1F1B",
  BgSecondary: "#2C2C26",
  BgLightGray: "#3A3B28",
  BgGray: "#BBB681",
  BgDarkGray: "#EBE8CA",
  BgDisabled: "#76724F",
  BgContrast: "#FFFFFF",
  BgContrastPressed: "#EBE8CA",
  BgContrastSecondary: "#F5F4EE",
  BgWhite: "#FFFFFF",
  BgModal: "#00000080",
  BgAccent: "#E0AA53",
  BgAccentPressed: "#B47C23",
  BgSuccess: "#8EBA4D",
  BgWarning: "#F0CE4F",
  BgWarningPressed: "#F5D76C",
  BgDanger: "#ED586B",
  BgOrange: "#EA9E4F",
  BgBlue: "#5B85EE",

  // Border
  BorderDefault: "#3A3B28",
  BorderContrast: "#EBE8CA",
  BorderWarning: "#F0CE4F",

  // Text
  TextPrimary: "#FFFFFF",
  TextPrimaryPressed: "#EBE8CA",
  TextSecondary: "#BBB681",
  TextSecondaryPressed: "#76724F",
  TextDisabled: "#76724F",
  TextContrast: "#1F1F1B",
  TextWhite: "#FFFFFF",
  TextAccent: "#E0AA53",
  TextAccentPressed: "#B47C23",
  TextSuccess: "#8EBA4D",
  TextWarning: "#F0CE4F",
  TextWarningPressed: "#F5D76C",
  TextDanger: "#ED586B",

  // system
  primary: "#E0AA53", // BgAccent
  background: "#1F1F1B", // BgPrimary
  card: "#1F1F1B", // BgPrimary
  text: "#FFFFFF", // TextPrimary
  border: "#3A3B28", // BorderDefault
  notification: "#FFFFFF", // BgContrast

  // transparent
  transparent: "transparent",

  _theme: "dark",
};

export { osakaDarkTheme };

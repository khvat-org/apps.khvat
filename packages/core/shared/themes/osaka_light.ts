import { darkTheme } from "./dark";

type Colors = typeof darkTheme;

const osakaLightTheme: Colors = {
  // Background
  BgPrimary: "#FFFFFF",
  BgSecondary: "#F5F4EE",
  BgLightGray: "#EBE8CA",
  BgGray: "#76724F",
  BgDarkGray: "#3A3B28",
  BgDisabled: "#BBB681",
  BgContrast: "#2C2C26",
  BgContrastPressed: "#3A3B28",
  BgContrastSecondary: "#1F1F1B",
  BgWhite: "#FFFFFF",
  BgModal: "#00000080",
  BgAccent: "#DE9B2F",
  BgAccentPressed: "#B47C23",
  BgSuccess: "#A1C074",
  BgWarning: "#F5D76C",
  BgWarningPressed: "#F0CE4F",
  BgDanger: "#F17C8B",
  BgOrange: "#F4B16A",
  BgBlue: "#7899F0",

  // Border
  BorderDefault: "#EBE8CA",
  BorderContrast: "#3A3B28",

  // Text
  TextPrimary: "#2C2C26",
  TextPrimaryPressed: "#76724F",
  TextSecondary: "#76724F",
  TextSecondaryPressed: "#3A3B28",
  TextDisabled: "#BBB681",
  TextContrast: "#FFFFFF",
  TextWhite: "#FFFFFF",
  TextAccent: "#DE9B2F",
  TextAccentPressed: "#B47C23",
  TextSuccess: "#A1C074",
  TextWarning: "#F5D76C",
  TextWarningPressed: "#F0CE4F",
  TextDanger: "#F17C8B",

  // system
  primary: "#DE9B2F", // BgAccent
  background: "#FFFFFF", // BgPrimary
  card: "#FFFFFF", // BgPrimary
  text: "#2C2C26", // TextPrimary
  border: "#EBE8CA", // BorderDefault
  notification: "#2C2C26", // BgContrast

  // transparent
  transparent: "transparent",

  _theme: "light",
};

export { osakaLightTheme };

import { darkTheme } from "./dark";

type Colors = typeof darkTheme;

const jiraiKeiDark: Colors = {
  // Background
  BgPrimary: "#1C1A1B",
  BgSecondary: "#2B282A",
  BgLightGray: "#3A3538",
  BgGray: "#B8A8AE",
  BgDarkGray: "#EADFE3",
  BgDisabled: "#776F72",
  BgContrast: "#FFFFFF",
  BgContrastPressed: "#EADFE3",
  BgContrastSecondary: "#F5EFF1",
  BgWhite: "#FFFFFF",
  BgModal: "#00000080",
  BgAccent: "#A38BAD",
  BgAccentPressed: "#4E4153",
  BgSuccess: "#66BC74",
  BgWarning: "#F2CF73",
  BgWarningPressed: "#F2D383",
  BgDanger: "#EF8080",
  BgOrange: "#ECB17E",
  BgBlue: "#80A5EF",

  // Border
  BorderDefault: "#3A3538",
  BorderContrast: "#EADFE3",
  BorderWarning: "#F2CF73",

  // Text
  TextPrimary: "#FFFFFF",
  TextPrimaryPressed: "#EADFE3",
  TextSecondary: "#B8A8AE",
  TextSecondaryPressed: "#776F72",
  TextDisabled: "#776F72",
  TextContrast: "#1C1A1B",
  TextWhite: "#FFFFFF",
  TextAccent: "#A38BAD",
  TextAccentPressed: "#4E4153",
  TextSuccess: "#66BC74",
  TextWarning: "#F2CF73",
  TextWarningPressed: "#F2D383",
  TextDanger: "#EF8080",

  // system
  primary: "#A38BAD", // BgAccent
  background: "#1C1A1B", // BgPrimary
  card: "#1C1A1B", // BgPrimary
  text: "#FFFFFF", // TextPrimary
  border: "#3A3538", // BorderDefault
  notification: "#FFFFFF", // BgContrast

  // transparent
  transparent: "transparent",

  _theme: "dark",
};

export { jiraiKeiDark };

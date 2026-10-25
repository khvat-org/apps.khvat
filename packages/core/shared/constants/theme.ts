export enum Theme {
  Auto = "auto",
  Dark = "dark",
  Light = "light",

  HokkaidoDark = "hokkaido_dark",
  HokkaidoLight = "hokkaido_light",

  OsakaDark = "osaka_dark",
  OsakaLight = "osaka_light",

  SakuraLight = "sakura_light",

  JiraiKeiDark = "jirai_kei_dark",

  BlueOceanDark = "blue_ocean_dark",
  BlueOceanLight = "blue_ocean_light",
}

export const THEME_TITLES: Record<Exclude<Theme, Theme.Auto>, string> = {
  [Theme.Light]: "Default Light",
  [Theme.Dark]: "Default Dark",
  [Theme.OsakaLight]: "Osaka Light",
  [Theme.OsakaDark]: "Osaka Dark",
  [Theme.HokkaidoLight]: "Hokkaido Light",
  [Theme.HokkaidoDark]: "Hokkaido Dark",
  [Theme.SakuraLight]: "Sakura Light",
  [Theme.JiraiKeiDark]: "Jirai Kei Dark",
  [Theme.BlueOceanLight]: "Blue Ocean Light",
  [Theme.BlueOceanDark]: "Blue Ocean Dark",
};

export const getThemeTitle = (theme: string): string =>
  THEME_TITLES[theme as keyof typeof THEME_TITLES] ??
  theme
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

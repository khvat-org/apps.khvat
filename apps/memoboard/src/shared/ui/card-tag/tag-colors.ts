export type TagColor =
  | "magenta"
  | "red"
  | "volcano"
  | "orange"
  | "gold"
  | "lime"
  | "green"
  | "cyan"
  | "blue"
  | "geekblue"
  | "purple";

interface TagPalette {
  color: string;
  background: string;
  borderColor: string;
}

// * Те же цвета, что и на сайте (ui/shared/styles/root.css)
const dark: Record<TagColor, TagPalette> = {
  magenta: { color: "#ffadd2", background: "#3a1c2b", borderColor: "#c41d7f" },
  red: { color: "#ff7875", background: "#3a1c1c", borderColor: "#cf1322" },
  volcano: { color: "#ff9c6e", background: "#3b1e17", borderColor: "#d4380d" },
  orange: { color: "#ffd591", background: "#3a2611", borderColor: "#d46b08" },
  gold: { color: "#ffe58f", background: "#3a2a0a", borderColor: "#d48806" },
  lime: { color: "#eaff8f", background: "#2a3300", borderColor: "#7cb305" },
  green: { color: "#b7eb8f", background: "#1f2b1a", borderColor: "#389e0d" },
  cyan: { color: "#87e8de", background: "#123231", borderColor: "#08979c" },
  blue: { color: "#91caff", background: "#102841", borderColor: "#0958d9" },
  geekblue: { color: "#adc6ff", background: "#1a1f4a", borderColor: "#1d39c4" },
  purple: { color: "#d3adf7", background: "#2c1a3d", borderColor: "#531dab" },
};

const light: Record<TagColor, TagPalette> = {
  magenta: { color: "#c41d7f", background: "#fff0f6", borderColor: "#ffadd2" },
  red: { color: "#cf1322", background: "#fff1f0", borderColor: "#ffa39e" },
  volcano: { color: "#d4380d", background: "#fff2e8", borderColor: "#ffbb96" },
  orange: { color: "#d46b08", background: "#fff7e6", borderColor: "#ffd591" },
  gold: { color: "#d48806", background: "#fffbe6", borderColor: "#ffe58f" },
  lime: { color: "#7cb305", background: "#fcffe6", borderColor: "#eaff8f" },
  green: { color: "#389e0d", background: "#f6ffed", borderColor: "#b7eb8f" },
  cyan: { color: "#08979c", background: "#e6fffb", borderColor: "#87e8de" },
  blue: { color: "#0958d9", background: "#e6f4ff", borderColor: "#91caff" },
  geekblue: { color: "#1d39c4", background: "#f0f5ff", borderColor: "#adc6ff" },
  purple: { color: "#531dab", background: "#f9f0ff", borderColor: "#d3adf7" },
};

export const getTagPalette = (color: TagColor, theme: string): TagPalette =>
  theme === "dark" ? dark[color] : light[color];

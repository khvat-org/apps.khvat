import { EdgeInsets } from "react-native-safe-area-context";

const MIN_DIFFERENCE = 40;

export type InsetSide = "left" | "right";

export const getAsymmetricSide = (insets: EdgeInsets): InsetSide | null => {
  if (insets.right - insets.left >= MIN_DIFFERENCE) return "right";
  if (insets.left - insets.right >= MIN_DIFFERENCE) return "left";
  return null;
};

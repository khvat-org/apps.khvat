import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useContentDimensions = () => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return { width: width - insets.left - insets.right, height };
};

import * as Font from "expo-font";
import { Platform } from "react-native";

import IBMPlexSansMedium from "./IBMPlexSans/IBMPlexSans-Medium.ttf";
import IBMPlexSansRegular from "./IBMPlexSans/IBMPlexSans-Regular.ttf";

interface LoadFontsProps {
  successful?: () => void | Promise<void>;
  error?: (e: unknown) => void | Promise<void>;
  finallyCallback?: () => void | Promise<void>;
}

export const loadFonts = async ({ successful, error, finallyCallback }: LoadFontsProps) => {
  try {
    const fonts = Platform.select<Record<string, Font.FontSource>>({
      android: {
        "IBMPlexSans-Regular": IBMPlexSansRegular,
        "IBMPlexSans-Medium": IBMPlexSansMedium,
      },
      default: {},
    })!;

    await Font.loadAsync(fonts);
    await successful?.();
  } catch (e) {
    await error?.(e);
  } finally {
    await finallyCallback?.();
  }
};

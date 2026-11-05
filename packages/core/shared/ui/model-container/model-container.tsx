import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

import { StatusBar, StyleSheet, View, useWindowDimensions } from "react-native";
import {
  EdgeInsets,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { getAsymmetricSide } from "../../lib/layout/get-asymmetric-side";
import SafeLayout from "../layouts/safe-layout";

const REGULAR_SHEET_MIN_SHORT_SIDE = 600;
const COMPACT_SHEET_SIDE_MARGIN = 16;

const ModelContainerContext = createContext(false);

export const getSheetInsets = (
  insets: EdgeInsets,
  frame: { x: number; width: number } | null,
  windowWidth: number,
  windowHeight: number,
): EdgeInsets => {
  if (!frame || frame.width >= windowWidth) {
    if (getAsymmetricSide(insets) !== "right") return insets;

    const isRegularSheet = Math.min(windowWidth, windowHeight) >= REGULAR_SHEET_MIN_SHORT_SIDE;

    return {
      ...insets,
      right: isRegularSheet ? 0 : Math.max(0, insets.right - COMPACT_SHEET_SIDE_MARGIN),
    };
  }

  return {
    ...insets,
    left: Math.max(0, insets.left - frame.x),
    right: Math.max(0, frame.x + frame.width - (windowWidth - insets.right)),
  };
};

export const useInsideModelContainer = () => useContext(ModelContainerContext);

interface ModelContainerProps {
  children: React.ReactNode;
}

export const ModelContainer: React.FC<ModelContainerProps> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const containerRef = useRef<React.ComponentRef<typeof View>>(null);
  const [frame, setFrame] = useState<{ x: number; width: number } | null>(null);

  const onLayout = useCallback(() => {
    containerRef.current?.measureInWindow((x, _y, width) => {
      setFrame((prev) => (prev?.x === x && prev?.width === width ? prev : { x, width }));
    });
  }, []);

  const sheetInsets = useMemo(
    () => getSheetInsets(insets, frame, windowWidth, windowHeight),
    [frame, insets, windowWidth, windowHeight],
  );

  return (
    <View ref={containerRef} style={styles.container} onLayout={onLayout}>
      <SafeAreaInsetsContext.Provider value={sheetInsets}>
        <SafeLayout disableTop disableButton style={styles.container}>
          <StatusBar barStyle="light-content" />
          <ModelContainerContext.Provider value={true}>{children}</ModelContainerContext.Provider>
        </SafeLayout>
      </SafeAreaInsetsContext.Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

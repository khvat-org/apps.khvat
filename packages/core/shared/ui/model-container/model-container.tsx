import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

import { StatusBar, StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaInsetsContext, useSafeAreaInsets } from "react-native-safe-area-context";

import SafeLayout from "../layouts/safe-layout";

const ModelContainerContext = createContext(false);

export const useInsideModelContainer = () => useContext(ModelContainerContext);

interface ModelContainerProps {
  children: React.ReactNode;
}

export const ModelContainer: React.FC<ModelContainerProps> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const containerRef = useRef<React.ComponentRef<typeof View>>(null);
  const [frame, setFrame] = useState<{ x: number; width: number } | null>(null);

  const onLayout = useCallback(() => {
    containerRef.current?.measureInWindow((x, _y, width) => {
      setFrame((prev) => (prev?.x === x && prev?.width === width ? prev : { x, width }));
    });
  }, []);

  const sheetInsets = useMemo(() => {
    if (!frame) return insets;

    return {
      ...insets,
      left: Math.max(0, insets.left - frame.x),
      right: Math.max(0, frame.x + frame.width - (windowWidth - insets.right)),
    };
  }, [frame, insets, windowWidth]);

  // * flex: 1 обязателен — без него высота контейнера равна контенту, и вложенные
  // * FlatList/ScrollView не получают границы, по которой могли бы скроллиться
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

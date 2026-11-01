import React, { useEffect, useState } from "react";

import { isAndroid, isIOS } from "@nihongo/core/shared/constants/platformUtil";
import { IS_WELCOME_PAGE } from "@nihongo/core/shared/constants/storageKeys";
import { ResetContext } from "@nihongo/core/shared/contexts/reset-context/reset-context";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { initTransliterationMap } from "@nihongo/core/shared/data/lettersTable";
import { loadFonts } from "@nihongo/core/shared/fonts/load-fonts";
import { fonts } from "@nihongo/core/shared/typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar, View } from "react-native";

import {
  AndroidAuthNavigation,
  AndroidRootNavigation,
  IOSAuthNavigation,
  IOSRootNavigation,
} from "./routes";

import { useOrientationLock } from "@/shared/lib/orientation/use-orientation-lock";

SplashScreen.preventAutoHideAsync();

if (Constants.executionEnvironment !== "storeClient") {
  SplashScreen.setOptions({
    duration: 500,
    fade: true,
  });
}

const Layout: React.FC = () => {
  const [resetKey, setResetKey] = useState(0);

  const forceReset = () => {
    setResetKey((prev) => prev + 1);
  };

  const [appIsReady, setAppIsReady] = useState(false);

  const { colors } = useThemeContext();

  useOrientationLock();

  const [isAuthorization, setIsAuthorization] = useState<boolean>(false);

  const checkAuth = async () => {
    const isWelcome = await AsyncStorage.getItem(IS_WELCOME_PAGE);

    if ((isWelcome && JSON.parse(isWelcome)) === true) {
      setIsAuthorization(false);
    } else {
      setIsAuthorization(true);
    }
  };

  useEffect(() => {
    const prepareApp = async () => {
      try {
        const loadAllFonts = async () =>
          new Promise<void>((resolve, reject) => {
            loadFonts({
              successful: async () => {
                await new Promise((r) => setTimeout(r, 100));
                resolve();
              },
              error: (e) => {
                console.warn("Error loading fonts:", e);
                reject(e);
              },
              finallyCallback: () => {},
            });
          });

        await loadAllFonts();

        initTransliterationMap();
      } catch (error) {
        console.log("Application initialization error ", error);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  useEffect(() => {
    checkAuth();
  }, [resetKey]);

  const currentTheme = colors._theme.includes("dark")
    ? { dark: true, colors: colors, fonts: fonts }
    : { dark: false, colors: colors, fonts: fonts };

  const barStyle = colors._theme === "dark" ? "light-content" : "dark-content";

  if (!appIsReady) {
    return (
      <View>
        <StatusBar barStyle={barStyle} />
      </View>
    );
  }

  return (
    <ResetContext.Provider value={{ forceReset }}>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle={barStyle} />

        {!isAuthorization && isAndroid && <AndroidRootNavigation theme={currentTheme} />}
        {!isAuthorization && isIOS && <IOSRootNavigation theme={currentTheme} />}

        {isAuthorization && isAndroid && <AndroidAuthNavigation theme={currentTheme} />}
        {isAuthorization && isIOS && <IOSAuthNavigation theme={currentTheme} />}
      </View>
    </ResetContext.Provider>
  );
};

export default Layout;

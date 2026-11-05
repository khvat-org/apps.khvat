// * Initialization of i18n (side-effect) - before other modules
import "@nihongo/core/shared/lib/i18n/index";

import React, { StrictMode } from "react";

import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { BottomTabVisibilityProvider } from "@nihongo/core/shared/contexts/bottom-tab-visibility";
import { DeviceRegistrationProvider } from "@nihongo/core/shared/contexts/device-registration";
import { EraseDataProvider } from "@nihongo/core/shared/contexts/erase-data/erase-data-context";
import { HapticProvider } from "@nihongo/core/shared/contexts/haptic/haptic-context";
import { ModalProvider } from "@nihongo/core/shared/contexts/modal/modal-context";
import { RemoteConfigProvider } from "@nihongo/core/shared/contexts/remote-config/remote-config-context";
import { StudyActivityProvider } from "@nihongo/core/shared/contexts/study-activity/study-activity-context";
import { ThemeProvider } from "@nihongo/core/shared/contexts/theme/theme-context";
import { UiStateProvider } from "@nihongo/core/shared/contexts/ui-state/ui-state-context";
import { ApiGatewayProvider } from "@nihongo/core/shared/lib/api-gateway";
import { SavedLanguageGate } from "@nihongo/core/shared/lib/i18n/saved-language-gate";
import { PageInsetsProvider } from "@nihongo/core/shared/lib/layout/page-insets-provider";
import NotificationsWrapper from "@nihongo/core/shared/lib/notifications";
import AppWrapper from "@nihongo/core/shared/ui/layouts/app-wrapper";
import { Providers } from "@nihongo/core/shared/ui/providers";
import { AppRegistry } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";

import Layout from "@/app/layout";
import { BoardProvider } from "@/shared/contexts/board/board-context";

enableScreens();

const App: React.FC = () => {
  return (
    <StrictMode>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Providers
          providers={[
            [ThemeProvider],
            [AppWrapper],
            [ApiGatewayProvider],
            [SavedLanguageGate],
            [RemoteConfigProvider],
            [SafeAreaProvider],
            [PageInsetsProvider],
            [EraseDataProvider],
            [StudyActivityProvider],
            [ModalProvider],
            [BottomTabVisibilityProvider],
            [NotificationsWrapper],
            [DeviceRegistrationProvider],
            [ActionSheetProvider],
            [HapticProvider],
            [UiStateProvider],
            [BoardProvider],
          ]}
        >
          <Layout />
        </Providers>
      </GestureHandlerRootView>
    </StrictMode>
  );
};

AppRegistry.registerComponent("main", () => App);
export default App;

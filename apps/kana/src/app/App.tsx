// * Initialization of i18n (side-effect) - before other modules
import "@nihongo/core/shared/lib/i18n/index";
// * Configuration of the audio session (side-effect) - before any player is created
import "@/shared/lib/audio";

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
import { TransliterationsProvider } from "@nihongo/core/shared/contexts/transliteration/transliteration";
import { ApiGatewayProvider } from "@nihongo/core/shared/lib/api-gateway";
import { SavedLanguageGate } from "@nihongo/core/shared/lib/i18n/saved-language-gate";
import { PageInsetsProvider } from "@nihongo/core/shared/lib/layout/page-insets-provider";
import NotificationsWrapper from "@nihongo/core/shared/lib/notifications";
import AppWrapper from "@nihongo/core/shared/ui/layouts/app-wrapper";
import { Providers } from "@nihongo/core/shared/ui/providers";
import { AppRegistry, View } from "react-native";
import { ReservedRegionsProvider } from "react-native-reserved-regions";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";

import Layout from "@/app/layout";
import { DrawProvider } from "@/features/drawing/model/context";
import { LessonsProvider } from "@/pages/education/learning/model/context";
import { PracticePreferencesProvider } from "@/pages/education/practice/practice-preferences/model/context";
import { KanaProvider } from "@/pages/kana/kana-table-choice-letters-page/model/context";
import { StatisticsProvider } from "@/pages/kana/kana-table-list-page/model/context";
import { SideRailInsetsProvider } from "@/shared/lib/layout/side-rail-insets-provider";

enableScreens();

const App: React.FC = () => {
  return (
    <StrictMode>
      <View style={{ flex: 1 }}>
        <Providers
          providers={[
            [ThemeProvider],
            [AppWrapper],
            [ApiGatewayProvider],
            [SavedLanguageGate],
            [RemoteConfigProvider],
            [SafeAreaProvider],
            [PageInsetsProvider],
            [ReservedRegionsProvider, { style: { flex: 1 } }],
            [SideRailInsetsProvider],
            [EraseDataProvider],
            [StudyActivityProvider],
            [TransliterationsProvider],
            [HapticProvider],
            [ModalProvider],
            [BottomTabVisibilityProvider],
            [NotificationsWrapper],
            [DeviceRegistrationProvider],
            [ActionSheetProvider],
            [StatisticsProvider],
            [DrawProvider],
            [KanaProvider],
            [LessonsProvider],
            [PracticePreferencesProvider],
          ]}
        >
          <Layout />
        </Providers>
      </View>
    </StrictMode>
  );
};

AppRegistry.registerComponent("main", () => App);
export default App;

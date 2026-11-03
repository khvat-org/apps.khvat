import React from "react";

import { ResetPasswordAskEmailPage } from "@nihongo/core/pages/auth/password-reset/ask-email";
import { ResetPasswordPage } from "@nihongo/core/pages/auth/password-reset/reset-password";
import { ResetPasswordSubmitCodePage } from "@nihongo/core/pages/auth/password-reset/submit-code";
import { LoginPage } from "@nihongo/core/pages/auth/preview";
import { SignInPage } from "@nihongo/core/pages/auth/sign-in";
import { SignUpPage } from "@nihongo/core/pages/auth/sign-up";
import { SubmitCode } from "@nihongo/core/pages/auth/submit-code";
import ProfilePage from "@nihongo/core/pages/profile";
import ProfileEditPage from "@nihongo/core/pages/profile/edit";
import ProfileChangeNamePage from "@nihongo/core/pages/profile/edit/change-name";
import ProfileChangePasswordPage from "@nihongo/core/pages/profile/edit/change-password";
import SettingsLanguagePage from "@nihongo/core/pages/settings/settings-language/settings-language";
import SettingsThemePage from "@nihongo/core/pages/settings/settings-theme/settings-theme";
import SettingsTransliterationsPage from "@nihongo/core/pages/settings/settings-transliterations/settings-transliterations";
import SettingsWidgetsPage from "@nihongo/core/pages/settings/settings-widgets/settings-widgets";
import WelcomePage from "@nihongo/core/pages/welcome/welcome";
import { isAndroid } from "@nihongo/core/shared/constants/platformUtil";
import { ModalProvider } from "@nihongo/core/shared/contexts/modal/modal-context";
import { TabBarButton } from "@nihongo/core/shared/ui/bottom-tap";
import { TabScreenInsets } from "@nihongo/core/shared/ui/bottom-tap/tab-screen-insets";
import {
  BottomTabBarProps,
  BottomTabTypeBag,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { createStaticNavigation, StaticConfig } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { CardsThreeIcon, GraduationCapIcon, SwatchesIcon, UserIcon } from "phosphor-react-native";

import { ROUTES } from "./routes.types";

import LearningList from "@/pages/education/learning/learning-list-page/learning-list-page";
import LessonPage from "@/pages/education/learning/lesson-page/lesson-page";
import EducationPracticePage from "@/pages/education/practice/education-practice";
import EducationResultPage from "@/pages/education/practice/education-result-page/education-result-page";
import PracticePreferencesPage from "@/pages/education/practice/practice-preferences";
import PracticeWelcomePage from "@/pages/education/practice/practice-welcome/practice-welcome";
import KanaLetterPage from "@/pages/kana/kana-letter-page/kana-letter-page";
import KanaTableChoiceLettersPage from "@/pages/kana/kana-table-choice-letters-page/kana-table-choice-letters-page";
import KanaTableListPage from "@/pages/kana/kana-table-list-page/kana-table-list-page";
import SettingsPage from "@/pages/settings/settings-page";

const screenOptions = { headerShown: false };

const modal = <P extends object>(Component: React.ComponentType<P>) => ({
  screen: (props: P) => (
    <ModalProvider>
      <Component {...props} />
    </ModalProvider>
  ),
  options: {
    presentation: "modal",
    headerShadowVisible: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(isAndroid && ({ ...TransitionPresets.ModalPresentationIOS } as any)),
    gestureEnabled: true,
    ...screenOptions,
  } as const,
});

const tabBar = (props: BottomTabBarProps) => (
  <TabBarButton
    {...props}
    allowSide
    tabs={{
      [ROUTES.LEARNING_ROOT]: { title: "tabs.learning", icon: GraduationCapIcon },
      [ROUTES.PRACTICE_ROOT]: { title: "tabs.practice", icon: CardsThreeIcon },
      [ROUTES.KANA_TABLE_ROOT]: { title: "tabs.kana", icon: SwatchesIcon },
      [ROUTES.PROFILE_ROOT]: { title: "tabs.profile", icon: UserIcon },
    }}
  />
);

type TabScreens = NonNullable<StaticConfig<BottomTabTypeBag>["screens"]>;

const tabNavigator = (screens: TabScreens) => {
  return {
    screen: createBottomTabNavigator({
      tabBar,
      screens,
      screenOptions,
      screenLayout: ({ children }) => <TabScreenInsets>{children}</TabScreenInsets>,
    }),
    options: screenOptions,
  };
};

const RootStack = {
  screenOptions,
  screens: {
    [ROUTES.HOME]: tabNavigator({
      [ROUTES.PRACTICE_ROOT]: PracticeWelcomePage,
      [ROUTES.LEARNING_ROOT]: LearningList,
      [ROUTES.KANA_TABLE_ROOT]: KanaTableListPage,
      [ROUTES.PROFILE_ROOT]: ProfilePage,
    }),

    [ROUTES.SETTINGS_ROOT]: SettingsPage,

    [ROUTES.PRACTICE_PAGE]: EducationPracticePage,
    [ROUTES.LESSON_PAGE]: LessonPage,

    [ROUTES.RESULTS]: EducationResultPage,

    [ROUTES.KANA_INFO]: modal(KanaLetterPage),
    [ROUTES.KANA_SELECT]: modal(KanaTableChoiceLettersPage),

    [ROUTES.PRACTICE_PREFERENCES]: modal(PracticePreferencesPage),

    // ? pages from @nihongo/core
    [ROUTES.SETTINGS_LANGUAGE]: modal(SettingsLanguagePage),
    [ROUTES.SETTINGS_TRANSLITERATION]: modal(SettingsTransliterationsPage),
    [ROUTES.SETTINGS_THEME]: modal(SettingsThemePage),
    [ROUTES.SETTINGS_WIDGETS]: modal(SettingsWidgetsPage),

    [ROUTES.PROFILE_EDIT]: modal(ProfileEditPage),
    [ROUTES.PROFILE_EDIT_NAME]: modal(ProfileChangeNamePage),
    [ROUTES.PROFILE_EDIT_PASSWORD]: modal(ProfileChangePasswordPage),
  },
};

const AuthStack = {
  screenOptions,
  screens: {
    [ROUTES.WELCOME]: WelcomePage,
    [ROUTES.AUTH_PREVIEW]: LoginPage,

    [ROUTES.SIGN_UP_PAGE]: SignUpPage,
    [ROUTES.SIGN_IN_PAGE]: SignInPage,

    [ROUTES.SUBMIT_CODE]: SubmitCode,

    // ? Reset password
    [ROUTES.RESET_PASSWORD_ASK_EMAIL]: ResetPasswordAskEmailPage,
    [ROUTES.RESET_PASSWORD_SUBMIT_CODE]: ResetPasswordSubmitCodePage,
    [ROUTES.RESET_PASSWORD_CONFIRM]: ResetPasswordPage,
  },
};

export const AndroidRootNavigation = createStaticNavigation(createStackNavigator(RootStack));
export const IOSRootNavigation = createStaticNavigation(createNativeStackNavigator(RootStack));

export const AndroidAuthNavigation = createStaticNavigation(createStackNavigator(AuthStack));
export const IOSAuthNavigation = createStaticNavigation(createNativeStackNavigator(AuthStack));

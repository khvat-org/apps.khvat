import { Lesson } from "@/pages/education/learning/model/types";
import { PracticeResultData } from "@/pages/education/practice/education-practice/lib/types/questions";
import { KanaAlphabet, PracticeType } from "@/shared/constants/kana";

export enum ROUTES {
  ROOT = "Root",
  HOME = "HOME",

  // Info kana and draw kana
  KANA_INFO = "KANA_INFO",

  // Select alphabet
  KANA_SELECT = "KanaSelect",

  // Lesson page
  LESSON_PAGE = "LessonPage",

  // practice
  PRACTICE_PAGE = "EducationPractice",

  // results of practice
  RESULTS = "Results",

  // bottom tab navigator
  PRACTICE_ROOT = "Practice",
  LEARNING_ROOT = "Learning",
  KANA_TABLE_ROOT = "KanaTable",

  PROFILE_ROOT = "Profile",
  SETTINGS_ROOT = "Settings",

  PRACTICE_PREFERENCES = "PracticePreferences",
  SETTINGS_LANGUAGE = "SettingLanguage",
  SETTINGS_TRANSLITERATION = "SettingTransliterations",
  SETTINGS_THEME = "SettingTheme",
  SETTINGS_WIDGETS = "SettingWidgets",

  // * Auth section
  WELCOME = "WelcomePage",
  AUTH_PREVIEW = "AUTH_PREVIEW",
  SIGN_UP_PAGE = "SIGN_UP_PAGE",
  SIGN_IN_PAGE = "SIGN_IN_PAGE",
  SUBMIT_CODE = "SUBMIT_CODE",

  // ? reset password
  RESET_PASSWORD_ASK_EMAIL = "RESET_PASSWORD_ASK_EMAIL",
  RESET_PASSWORD_SUBMIT_CODE = "RESET_PASSWORD_SUBMIT_CODE",
  RESET_PASSWORD_CONFIRM = "RESET_PASSWORD_CONFIRM",

  PROFILE_EDIT = "PROFILE_EDIT",
  PROFILE_EDIT_NAME = "PROFILE_EDIT_NAME",
  PROFILE_EDIT_PASSWORD = "PROFILE_EDIT_PASSWORD",
}

export type RootStackParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.ROOT]: undefined;
  // Info kana and draw kana
  [ROUTES.KANA_INFO]: { id: string; kana: KanaAlphabet; title: string };
  // Select alphabet
  [ROUTES.KANA_SELECT]: { title: string };
  // Lesson page
  [ROUTES.LESSON_PAGE]: { lesson: Lesson };
  // practice
  [ROUTES.PRACTICE_PAGE]: { mode: PracticeType[] };
  // results of practice
  [ROUTES.RESULTS]: PracticeResultData;
  // bottom tab navigator
  [ROUTES.PROFILE_ROOT]: undefined;
  [ROUTES.PRACTICE_ROOT]: undefined;
  // [ROUTES.LEARNING_ROOT]: undefined;
  [ROUTES.SETTINGS_ROOT]: undefined;
  [ROUTES.KANA_TABLE_ROOT]: undefined;

  [ROUTES.PRACTICE_PREFERENCES]: undefined;
  [ROUTES.SETTINGS_LANGUAGE]: undefined;
  [ROUTES.SETTINGS_TRANSLITERATION]: undefined;
  [ROUTES.SETTINGS_THEME]: undefined;
  [ROUTES.SETTINGS_WIDGETS]: undefined;

  // * Auth section
  [ROUTES.WELCOME]: undefined;
  [ROUTES.AUTH_PREVIEW]: undefined;
  [ROUTES.SIGN_UP_PAGE]: undefined;
  [ROUTES.SIGN_IN_PAGE]: undefined;
  [ROUTES.SUBMIT_CODE]: { email: string; region: string };

  // ? reset password
  [ROUTES.RESET_PASSWORD_ASK_EMAIL]: undefined;
  [ROUTES.RESET_PASSWORD_SUBMIT_CODE]: { email: string; region: string };
  [ROUTES.RESET_PASSWORD_CONFIRM]: { email: string; region: string; resetToken: string };

  [ROUTES.PROFILE_EDIT]: undefined;
  [ROUTES.PROFILE_EDIT_NAME]: undefined;
  [ROUTES.PROFILE_EDIT_PASSWORD]: undefined;
};

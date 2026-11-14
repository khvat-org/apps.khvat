import "dotenv/config";

const IS_DEV = process.env.APP_VARIANT === "development";

const name = IS_DEV ? `${process.env.APP_NAME} (Dev)` : process.env.APP_NAME;

// * Redirect-схема для Google OAuth = reversed client id.
// * 268156862431-xxxx.apps.googleusercontent.com -> com.googleusercontent.apps.268156862431-xxxx
// * Схема намеренно отличается от deep-link навигации, чтобы не конфликтовать intent-filter.
// * Рантайм-redirect в googleAuth.ts — каноничный одинарный слеш (:/), матчинг идёт по схеме.
const reversedScheme = (clientId) => `com.googleusercontent.apps.${clientId.split(".")[0]}`;

// * ВАЖНО: из redirectUrls плагин react-native-app-auth берёт ТОЛЬКО [0] и ставит одну и ту же
// * схему в Info.plist и в gradle. У iOS и Android разные client id -> разные схемы, поэтому
// * отдаём явные пер-платформенные пропсы: плагин спредит их поверх своих дефолтов.
// * Android-клиентов два: OAuth-клиент привязан к паре (package, SHA-1), а Play App Signing
// * переподписывает бандл своим ключом. Профиль production_google в eas.json подставляет свой
// * client id через env — реальный process.env приоритетнее .env и в dotenv/config (здесь),
// * и в react-native-dotenv (рантайм), поэтому схема в манифесте и client id всегда из одного.
const androidClientId = process.env.GOOGLE_OAUTH_ANDROID_CLIENT_ID;
const iosClientId = process.env.GOOGLE_OAUTH_IOS_CLIENT_ID;

// * Фолбэк на схему соседней платформы — чтобы не записать undefined в Info.plist/gradle,
// * если client id для одной из платформ ещё не заведён.
const iosScheme = iosClientId && reversedScheme(iosClientId);
const androidScheme = androidClientId && reversedScheme(androidClientId);

const appAuthProps = {
  ios: { urlScheme: iosScheme || androidScheme },
  android: { appAuthRedirectScheme: androidScheme || iosScheme },
};

const config = {
  name: name,
  slug: "kana-master",
  scheme: "nihongokana",
  version: process.env.VERSION,
  orientation: "default",
  githubUrl: process.env.GITHUB_LINK,
  icon: "./src/shared/assets/icon.png",
  userInterfaceStyle: "automatic",
  assetBundlePatterns: ["**/*"],
  ios: {
    appStoreUrl: process.env.APP_STORE_URL,
    supportsTablet: process.env.SUPPORT_TABLET === "true",
    userInterfaceStyle: "automatic",
    bundleIdentifier: process.env.IOS_BUNDLE_ID,
    usesAppleSignIn: true,
    buildNumber: process.env.BUILD_NUMBER,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./src/shared/assets/adaptive-icon.png",
      backgroundColor: "#1F1F1F",
    },
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON_PATH,
    package: process.env.ANDROID_PACKAGE,
    versionCode: parseInt(process.env.BUILD_NUMBER),
    blockedPermissions: ["android.permission.RECORD_AUDIO"],
    version: process.env.VERSION,
  },
  web: {
    favicon: "./src/shared/assets/favicon.png",
  },
  extra: {
    eas: {
      projectId: "0c96ff0c-f16f-48ba-ac2f-b768df7666c3",
    },
  },
  owner: "nikkhvat",
  plugins: [
    [
      "expo-build-properties",
      {
        android: {
          newArchEnabled: true,
          edgeToEdgeEnabled: true,
        },
        ios: {
          newArchEnabled: true,
        },
      },
    ],
    "expo-font",
    "expo-apple-authentication",
    ["expo-audio", { enableBackgroundPlayback: false, recordAudioAndroid: false }],
    [
      "expo-splash-screen",
      {
        image: "./src/shared/assets/splash.png",
        backgroundColor: "#FFFFFF",
        dark: {
          image: "./src/shared/assets/splash-dark.png",
          backgroundColor: "#1F1F1F",
        },
        imageWidth: 200,
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./src/shared/assets/notification-icon.png",
        color: "#1E1E1E",
      },
    ],
    "expo-asset",
    [
      "expo-image-picker",
      {
        photosPermission: "$(PRODUCT_NAME) needs access to your photos so you can set an avatar.",
        cameraPermission: "$(PRODUCT_NAME) needs access to your camera so you can take an avatar.",
        microphonePermission: false,
      },
    ],
    ["react-native-app-auth", appAuthProps],
  ],
};

export default config;

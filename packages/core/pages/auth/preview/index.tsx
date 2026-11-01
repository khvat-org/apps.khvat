import React, { useEffect, useState } from "react";

import {
  checkGoogleOAuthAvailability,
  GOOGLE_OAUTH_BLOCKED,
  oauthApple,
  oauthGoogle,
} from "@nihongo/core/features/auth/api";
import {
  appleSignIn,
  isAppleSignInAvailable,
  isAppleSignInCancelled,
} from "@nihongo/core/features/auth/lib/appleAuth";
import { completeAuth } from "@nihongo/core/features/auth/lib/completeAuth";
import { googleSignIn } from "@nihongo/core/features/auth/lib/googleAuth";
import { commonAuthError } from "@nihongo/core/features/auth/lib/serverError";
import { AUTH_ROUTES, AuthParamList } from "@nihongo/core/features/auth/routes";
import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { IS_WELCOME_PAGE } from "@nihongo/core/shared/constants/storageKeys";
import { useModal } from "@nihongo/core/shared/contexts/modal/modal-context";
import { AlertModal } from "@nihongo/core/shared/contexts/modal/presets/alert";
import { useResetApp } from "@nihongo/core/shared/contexts/reset-context/reset-context";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { useGatewayUrl } from "@nihongo/core/shared/lib/api-gateway";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CaretLeftIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import appleLogoBlack from "../../../shared/assets/auth/apple-logo-black.png";
import appleLogoWhite from "../../../shared/assets/auth/apple-logo-white.png";
import authLogo from "../../../shared/assets/auth/avatar.jpg";
import googleIcon from "../../../shared/assets/auth/google.png";

type LoginNavigationProp = StackNavigationProp<AuthParamList, typeof AUTH_ROUTES.PREVIEW>;

// ! Нужно тут вынести компонент Google OAuth кнопка и логика, что бы я мог вставить кнопку входа по google и в другой экран

export const LoginPage: React.FC = () => {
  const navigation = useNavigation<LoginNavigationProp>();

  const { forceReset } = useResetApp();
  const { showModal, hideModal } = useModal();

  const { colors } = useThemeContext();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const imageSize = width > TABLET_WIDTH ? 344 : 192;
  const styles = makeStyles(colors, insets, imageSize);
  const onDarkTheme = isDarkColor(colors.BgPrimary);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
    });
  }, [navigation]);

  const goBack = () => navigation.goBack();

  const skipAuth = async () => {
    await AsyncStorage.setItem(IS_WELCOME_PAGE, "true");
    forceReset();
  };

  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);

  useEffect(() => {
    isAppleSignInAvailable().then(setAppleAvailable);
  }, []);

  const showGoogleUnavailable = (ip?: string) =>
    showModal({
      closeOnBackdrop: true,
      onClose: () => {},
      content: (
        <AlertModal
          title={t("auth.googleUnavailable.title")}
          subtitle={t("auth.googleUnavailable.subtitle", { ip: ip ?? "—" })}
          button={t("alert.ok")}
          onPress={hideModal}
        />
      ),
    });

  const showGoogleFailed = (reason: string) =>
    showModal({
      closeOnBackdrop: true,
      onClose: () => {},
      content: (
        <AlertModal
          title={t("auth.googleFailed")}
          subtitle={t(`auth.errors.${reason}`)}
          button={t("alert.ok")}
          onPress={hideModal}
        />
      ),
    });

  const continueWithGoogle = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);

    try {
      const availability = await checkGoogleOAuthAvailability().catch(() => null);

      if (availability && !availability.available) {
        showGoogleUnavailable(availability.ip);
        return;
      }

      const idToken = await googleSignIn();

      const result = await oauthGoogle(idToken).catch(() => null);
      if (!result) {
        showGoogleFailed("requestFailed");
        return;
      }
      const { ok, status, body } = result;

      if (body.error === GOOGLE_OAUTH_BLOCKED) {
        showGoogleUnavailable(availability?.ip);
        return;
      }

      if (ok && body.access_token && body.refresh_token) {
        await completeAuth(body.access_token, body.refresh_token);
        forceReset();
        return;
      }

      showGoogleFailed(commonAuthError(status, body.error) ?? "somethingWrong");
    } catch (error) {
      if (error instanceof Error && error.message === "User cancelled flow") return;
    } finally {
      setGoogleLoading(false);
    }
  };

  const showAppleFailed = (reason: string) =>
    showModal({
      closeOnBackdrop: true,
      onClose: () => {},
      content: (
        <AlertModal
          title={t("auth.appleFailed")}
          subtitle={t(`auth.errors.${reason}`)}
          button={t("alert.ok")}
          onPress={hideModal}
        />
      ),
    });

  const continueWithApple = async () => {
    if (appleLoading || googleLoading) return;
    setAppleLoading(true);

    try {
      const credential = await appleSignIn();

      const result = await oauthApple({
        id_token: credential.idToken,
        authorization_code: credential.authorizationCode,
        nonce: credential.nonce,
        name: credential.name || undefined,
      }).catch(() => null);
      if (!result) {
        showAppleFailed("requestFailed");
        return;
      }
      const { ok, status, body } = result;

      if (ok && body.access_token && body.refresh_token) {
        await completeAuth(body.access_token, body.refresh_token);
        forceReset();
        return;
      }

      showAppleFailed(commonAuthError(status, body.error) ?? "somethingWrong");
    } catch (error) {
      if (isAppleSignInCancelled(error)) return;
      showAppleFailed("somethingWrong");
    } finally {
      setAppleLoading(false);
    }
  };

  const privacyPolicyUrl = useGatewayUrl(
    `/${i18n.language}/docs/${process.env.DOCS_SLUG}/privacy_policy`,
  );
  const termsUrl = useGatewayUrl(
    `/${i18n.language}/docs/${process.env.DOCS_SLUG}/terms_conditions`,
  );

  return (
    <View style={styles.page}>
      <Button
        color="primary"
        variant="text"
        isHapticFeedback
        icon={<CaretLeftIcon size={32} />}
        onClick={goBack}
        style={{
          position: "absolute",
          left: insets.left + 16,
          top: insets.top + 16,
          zIndex: 1,
        }}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image style={styles.image} source={authLogo} />
        <Text style={styles.title}>{t("auth.welcome.firstStep")}</Text>

        <View style={styles.subtitle}>
          <Text
            style={{
              height: 20,
              margin: 0,
              padding: 0,
              alignItems: "center",
              color: colors.TextPrimary,
              ...Typography.regularLabel,
            }}
          >
            {t("auth.agreement.prefix")}
          </Text>

          <Button
            color="primary"
            variant="text"
            size="sm"
            isHapticFeedback
            text={t("auth.agreement.terms")}
            onClick={() => {
              if (termsUrl) Linking.openURL(termsUrl);
            }}
            style={{ height: 20 }}
          />

          <Text
            style={{
              height: 20,
              margin: 0,
              padding: 0,
              alignItems: "center",
              color: colors.TextPrimary,
              ...Typography.regularLabel,
            }}
          >
            {" & "}
          </Text>

          <Button
            color="primary"
            variant="text"
            size="sm"
            isHapticFeedback
            text={t("auth.agreement.privacy")}
            onClick={() => {
              if (privacyPolicyUrl) Linking.openURL(privacyPolicyUrl);
            }}
            style={{ height: 20 }}
          />
        </View>

        <View style={styles.buttons}>
          <Pressable
            onPress={continueWithGoogle}
            disabled={googleLoading}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.providerButton,
              onDarkTheme ? styles.googleButtonLight : styles.googleButtonDark,
              (pressed || googleLoading) && styles.providerButtonPressed,
            ]}
          >
            <Image style={styles.googleLogo} source={googleIcon} />
            <Text
              style={[
                styles.button_text,
                onDarkTheme ? styles.googleTextLight : styles.googleTextDark,
              ]}
            >
              {t("auth.continueWithGoogle")}
            </Text>
          </Pressable>

          {appleAvailable && (
            <Pressable
              onPress={continueWithApple}
              disabled={appleLoading}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.providerButton,
                styles.appleButton,
                onDarkTheme ? styles.appleButtonWhite : styles.appleButtonBlack,
                (pressed || appleLoading) && styles.providerButtonPressed,
              ]}
            >
              <Image
                style={styles.appleLogo}
                source={onDarkTheme ? appleLogoBlack : appleLogoWhite}
              />
              <Text
                style={[
                  styles.button_text,
                  onDarkTheme ? styles.appleTextBlack : styles.appleTextWhite,
                ]}
              >
                {t("auth.continueWithApple")}
              </Text>
            </Pressable>
          )}

          <Button
            color="secondary"
            width="100%"
            onClick={() => {
              navigation.navigate(AUTH_ROUTES.SIGN_UP);
            }}
            style={{ marginTop: 8 }}
            text={t("auth.signUpWithEmail")}
          />

          <View style={styles.buttonLink}>
            <Text style={styles.buttonLinkText}>{t("auth.alreadyHaveAccount")}</Text>
            <Button
              color="primary"
              variant="text"
              isHapticFeedback
              text={t("auth.login")}
              onClick={() => {
                navigation.navigate(AUTH_ROUTES.SIGN_IN);
              }}
            />
          </View>
        </View>

        <View style={styles.spacer} />

        <Button
          color="primary"
          variant="text"
          isHapticFeedback
          text={t("auth.continueWithoutLogin")}
          onClick={skipAuth}
          style={[styles.buttonLink, styles.skipLink]}
        />
      </ScrollView>
    </View>
  );
};

const isDarkColor = (hex: string): boolean => {
  const value = hex.replace("#", "").slice(0, 6);
  if (value.length !== 6) return false;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b < 128;
};

const makeStyles = (colors: ColorsType, insets: EdgeInsets, imageSize: number) =>
  StyleSheet.create({
    page: {
      width: "100%",
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingTop: insets.top + 16,
      paddingBottom: insets.bottom + 16,
      paddingLeft: insets.left + 16,
      paddingRight: insets.right + 16,

      flexGrow: 1,
      alignItems: "center",
    },
    spacer: {
      flexGrow: 1,
    },
    skipLink: {
      marginTop: 32,
    },
    image: {
      width: imageSize,
      height: imageSize,
      borderRadius: imageSize,
    },
    title: {
      ...Typography.H3,

      marginTop: 32,

      color: colors.TextPrimary,

      textAlign: "center",

      maxWidth: TABLET_WIDTH,
    },
    subtitle: {
      ...Typography.regularLabel,

      color: colors.TextPrimary,

      marginTop: 8,

      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",

      // textAlign: 'center',
      // alignItems: 'center',

      maxWidth: TABLET_WIDTH,
    },
    buttons: {
      width: "100%",
      maxWidth: TABLET_WIDTH,

      marginTop: 32,
    },
    providerButton: {
      width: "100%",
      height: 48,
      paddingHorizontal: 16,
      borderRadius: 12,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    providerButtonPressed: {
      opacity: 0.8,
    },
    googleButtonLight: {
      backgroundColor: "#FFFFFF",
      borderWidth: 1,
      borderColor: "#747775",
    },
    googleButtonDark: {
      backgroundColor: "#131314",
      borderWidth: 1,
      borderColor: "#8E918F",
    },
    googleLogo: {
      width: 20,
      aspectRatio: 200 / 204,
      marginRight: 12,
    },
    googleTextLight: {
      color: "#1F1F1F",
    },
    googleTextDark: {
      color: "#E3E3E3",
    },
    appleButton: {
      marginTop: 8,
    },
    appleButtonWhite: {
      backgroundColor: "#FFFFFF",
    },
    appleButtonBlack: {
      backgroundColor: "#000000",
    },
    appleLogo: {
      width: 31,
      height: 44,
    },
    appleTextWhite: {
      color: "#FFFFFF",
    },
    appleTextBlack: {
      color: "#000000",
    },
    button_text: {
      ...Typography.boldDefault,

      color: colors.TextContrast,
    },
    buttonLink: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,

      marginTop: 16,
    },
    buttonLinkText: {
      ...Typography.regularDefault,
      color: colors.TextPrimary,
    },
  });

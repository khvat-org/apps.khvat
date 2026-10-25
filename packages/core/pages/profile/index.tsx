import React, { useCallback, useState } from "react";

import PracticeHeatmap from "@nihongo/core/entities/profile/practice-heatmap";
import ProfileItem from "@nihongo/core/entities/profile/profile-item/profile-item";
import ProfileWidgetFrame from "@nihongo/core/entities/profile/profile-widget-frame/profile-widget-frame";
import SocialMediaProfile from "@nihongo/core/entities/profile/social-media-profile/social-media-profile";
import { PROFILE_ROUTES, ProfileParamList } from "@nihongo/core/pages/profile/routes";
import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { IS_WELCOME_PAGE } from "@nihongo/core/shared/constants/storageKeys";
import { useHaptic } from "@nihongo/core/shared/contexts/haptic/haptic-context";
import { useResetApp } from "@nihongo/core/shared/contexts/reset-context/reset-context";
import { useStudyActivity } from "@nihongo/core/shared/contexts/study-activity/study-activity-context";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { loadProfile, ProfileState } from "@nihongo/core/shared/lib/auth";
import { useProfileWidgets } from "@nihongo/core/shared/lib/settings/useProfileWidgets";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import PageTitle from "@nihongo/core/shared/ui/page-title/page-title";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GearIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View, StyleSheet, Pressable, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavigationProp = StackNavigationProp<ProfileParamList, typeof PROFILE_ROUTES.PROFILE>;

const ProfilePage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const { t } = useTranslation();
  const { colors } = useThemeContext();

  const { forceReset } = useResetApp();
  const { days, sync } = useStudyActivity();
  const { widgets, loaded: widgetsLoaded, setWidget } = useProfileWidgets();

  const insets = useSafeAreaInsets();
  const { triggerHaptic } = useHaptic();

  const styles = makeStyles(colors);

  const toSettings = () => {
    triggerHaptic();
    navigation.navigate(PROFILE_ROUTES.SETTINGS);
  };

  const toEditProfile = () => {
    triggerHaptic();
    navigation.navigate(PROFILE_ROUTES.EDIT);
  };

  const [state, setState] = useState<ProfileState | null>(null);
  const [loading, setLoading] = useState(true);

  const profile = state?.kind === "ok" ? state.profile : null;
  const problem = state?.kind === "unavailable" || state?.kind === "offline" ? state.kind : null;

  const reload = useCallback(() => {
    setLoading(true);
    return loadProfile().then((next) => {
      setState(next);
      setLoading(false);
      return next;
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadProfile().then((next) => {
        if (!active) return;
        setState(next);
        setLoading(false);
      });
      void sync();
      return () => {
        active = false;
      };
    }, [sync]),
  );

  return (
    <View style={styles.main}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <PageTitle
          icon={
            <Button
              color="primary"
              variant="text"
              icon={<GearIcon size={32} />}
              onClick={toSettings}
            />
          }
        >
          {t("tabs.profile")}
        </PageTitle>

        {loading && (
          <ActivityIndicator
            size="large"
            color={colors.BgContrast}
            style={{ marginVertical: 24 }}
          />
        )}

        {!loading && problem && (
          <View>
            <Text style={styles.problemTitle}>{t(`profile.${problem}.title`)}</Text>
            <Text style={styles.problemText}>{t(`profile.${problem}.text`)}</Text>
            <Button
              color="primary"
              onClick={() => {
                triggerHaptic();
                void reload();
              }}
              text={t("common.retry")}
            />
          </View>
        )}

        {!loading && profile?.email && (
          <Pressable onPress={toEditProfile}>
            <ProfileItem
              avatar={profile?.avatar_url}
              name={profile?.name ?? ""}
              email={profile?.email ?? ""}
            />
          </Pressable>
        )}

        {!loading && state?.kind === "signedOut" && (
          <View>
            <Text
              style={{
                ...Typography.regularDefault,
                color: colors.TextSecondary,
                maxWidth: 300,
                marginBottom: 16,
              }}
            >
              {t("profile.signInPrompt", { app: process.env.APP_NAME })}
            </Text>

            <Button
              color="primary"
              onClick={() => {
                AsyncStorage.removeItem(IS_WELCOME_PAGE);
                forceReset();
              }}
              text={t("profile.signInButton")}
            />
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        style={styles.content}
      >
        {widgetsLoaded && process.env.APP_SLUG === "kana-master" && widgets.statistics && (
          <ProfileWidgetFrame onHide={() => setWidget("statistics", false)}>
            <PracticeHeatmap data={days} />
          </ProfileWidgetFrame>
        )}
        {widgetsLoaded && widgets.social && (
          <ProfileWidgetFrame onHide={() => setWidget("social", false)}>
            <SocialMediaProfile />
          </ProfileWidgetFrame>
        )}
      </ScrollView>
    </View>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    main: {
      flex: 1,
      backgroundColor: colors.BgSecondary,
    },
    container: {
      paddingLeft: 16,
      paddingRight: 16,
      paddingBottom: 16,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      backgroundColor: colors.BgPrimary,
    },
    problemTitle: {
      ...Typography.boldDefault,
      color: colors.TextPrimary,
      marginBottom: 8,
    },
    problemText: {
      ...Typography.regularDefault,
      color: colors.TextSecondary,
      maxWidth: 300,
      marginBottom: 16,
    },
    content: {
      paddingTop: 16,
      paddingHorizontal: 16,
    },
    contentContainer: {
      width: "100%",
      maxWidth: TABLET_WIDTH,
      alignSelf: "center",
      gap: 16,
    },
  });

export default ProfilePage;

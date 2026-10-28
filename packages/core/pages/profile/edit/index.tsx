import React, { useCallback, useState } from "react";

import SettingItem from "@nihongo/core/entities/setting/setting-item/setting-item";
import SettingsSection from "@nihongo/core/entities/setting/setting-section/settings-section";
import { useChangeAvatar } from "@nihongo/core/features/profile/change-avatar/use-change-avatar";
import AccountActions from "@nihongo/core/features/settings/account-actions/account-actions";
import { PROFILE_ROUTES, ProfileParamList } from "@nihongo/core/pages/profile/routes";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { useUserGatewayUrl } from "@nihongo/core/shared/lib/api-gateway";
import { getProfile, Profile } from "@nihongo/core/shared/lib/auth";
import { Typography } from "@nihongo/core/shared/typography";
import { ModalHeader } from "@nihongo/core/shared/ui/modal-header/modal-header";
import { ModelContainer } from "@nihongo/core/shared/ui/model-container/model-container";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CameraIcon, PasswordIcon, UserIcon, UserListIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Image, ActivityIndicator, Pressable, Text } from "react-native";

type NavigationProp = StackNavigationProp<ProfileParamList, typeof PROFILE_ROUTES.EDIT>;

const ProfileEditPage: React.FC = () => {
  const { t } = useTranslation();

  const navigation = useNavigation<NavigationProp>();
  const { colors } = useThemeContext();

  const styles = makeStyles(colors);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const avatarUri = useUserGatewayUrl(profile?.avatar_url || "");

  const {
    open: openAvatarActions,
    cancel: cancelAvatarUpload,
    uploading,
  } = useChangeAvatar({
    hasAvatar: Boolean(profile?.avatar_url),
    onUpdated: setProfile,
  });

  useFocusEffect(
    useCallback(() => {
      let active = true;

      getProfile().then((data) => {
        if (!active) return;
        setProfile(data);
        setLoading(false);
      });

      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <ModelContainer>
      <View style={{ flex: 1 }}>
        <ModalHeader
          title={t("profile.edit.title")}
          left={{
            text: t("common.back"),
            onPress: () => navigation.goBack(),
          }}
        />

        <Pressable
          style={styles.avatarBlock}
          onPress={openAvatarActions}
          disabled={loading || uploading}
        >
          <View style={styles.avatar}>
            {avatarUri && <Image source={{ uri: avatarUri }} style={styles.avatarImage} />}
            {!avatarUri && <UserIcon size={48} color={colors.BgContrast} />}

            {uploading && (
              <View style={styles.avatarOverlay}>
                <ActivityIndicator color={colors.BgContrast} />
              </View>
            )}
          </View>

          <View style={styles.avatarBadge}>
            <CameraIcon size={16} color={colors.TextContrast} />
          </View>
        </Pressable>

        {uploading && (
          <Pressable style={styles.cancel} onPress={cancelAvatarUpload}>
            <Text style={styles.cancelText}>{t("alert.cancel")}</Text>
          </Pressable>
        )}

        {loading && (
          <ActivityIndicator size="large" color={colors.BgContrast} style={styles.loader} />
        )}

        {!loading && (
          <SettingsSection>
            <SettingItem
              leftIcon={<UserListIcon size={20} color={colors.BgContrast} />}
              text={t("profile.edit.name")}
              subText={profile?.name}
              onClick={() => navigation.navigate(PROFILE_ROUTES.EDIT_NAME)}
            />
            <SettingItem
              leftIcon={<PasswordIcon size={20} color={colors.BgContrast} />}
              text={t("profile.edit.password")}
              onClick={() => navigation.navigate(PROFILE_ROUTES.EDIT_PASSWORD)}
              isLast
            />
          </SettingsSection>
        )}

        {!loading && (
          <View style={{ marginTop: 16 }}>
            <SettingsSection>
              <AccountActions />
            </SettingsSection>
          </View>
        )}
      </View>
    </ModelContainer>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    avatarBlock: {
      alignSelf: "center",

      marginBottom: 16,

      position: "relative",
    },
    avatar: {
      width: 96,
      height: 96,

      backgroundColor: colors.BgLightGray,
      borderRadius: 96,

      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    avatarImage: {
      width: 96,
      height: 96,
    },
    avatarOverlay: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,

      backgroundColor: colors.BgPrimary,
      opacity: 0.6,

      alignItems: "center",
      justifyContent: "center",
    },
    avatarBadge: {
      position: "absolute",
      right: 0,
      bottom: 0,

      width: 32,
      height: 32,
      borderRadius: 32,

      backgroundColor: colors.BgContrast,

      alignItems: "center",
      justifyContent: "center",
    },
    loader: {
      marginVertical: 24,
    },
    cancel: {
      alignSelf: "center",

      marginTop: -8,
      marginBottom: 16,
    },
    cancelText: {
      ...Typography.regularDefault,

      color: colors.TextSecondary,
    },
  });

export default ProfileEditPage;

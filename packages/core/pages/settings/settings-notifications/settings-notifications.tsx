import React, { useEffect, useRef, useState } from "react";

import SettingItem from "@nihongo/core/entities/setting/setting-item/setting-item";
import SettingsSection from "@nihongo/core/entities/setting/setting-section/settings-section";
import {
  isKindOn,
  NotificationKind,
  useNotificationsState,
} from "@nihongo/core/features/settings/settings-notifications/use-notifications-state";
import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { saveNotificationsSettings } from "@nihongo/core/shared/contexts/device-registration/api";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { usePagePadding } from "@nihongo/core/shared/lib/layout/use-page-padding";
import { useNotificationsContext } from "@nihongo/core/shared/lib/notifications";
import { Typography } from "@nihongo/core/shared/typography";
import { ModalHeader } from "@nihongo/core/shared/ui/modal-header/modal-header";
import { ModelContainer } from "@nihongo/core/shared/ui/model-container/model-container";
import { useNavigation } from "@react-navigation/native";
import { AlarmIcon, MegaphoneIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { AppState, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SettingsNotificationsPage: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const pagePadding = usePagePadding();
  const styles = makeStyles(colors, pagePadding);

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const { requestPushNotificationsToken, requestPermission } = useNotificationsContext();
  const { state, refresh } = useNotificationsState();

  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const waitingForSystemSettings = useRef<NotificationKind | null>(null);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setFailed(false);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  const save = async (kind: NotificationKind, enabled: boolean, token?: string | null) => {
    if (!(await saveNotificationsSettings({ [kind]: enabled }, token))) setFailed(true);
    await refresh();
  };

  const enable = async (kind: NotificationKind) => {
    const { permission: current } = await refresh();
    const permission = current.granted ? current : await requestPermission();

    if (!permission.granted) {
      await refresh();
      return;
    }

    const token = await requestPushNotificationsToken();
    await save(kind, true, token);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (appState) => {
      const kind = waitingForSystemSettings.current;
      if (appState !== "active" || !kind) return;
      waitingForSystemSettings.current = null;

      void run(async () => {
        const { permission } = await refresh();
        if (permission.granted) await enable(kind);
      });
    });

    return () => subscription.remove();
  });

  const toggle = (kind: NotificationKind) => {
    if (!state || busy) return;

    void run(async () => {
      if (isKindOn(state, kind)) {
        await save(kind, false);
        return;
      }

      if (state.permission.granted || state.permission.canAskAgain) {
        await enable(kind);
        return;
      }

      waitingForSystemSettings.current = kind;
      await Linking.openSettings();
    });
  };

  const isBlocked = !!state && !state.permission.granted && !state.permission.canAskAgain;

  return (
    <ModelContainer>
      <View style={{ flex: 1, paddingBottom: insets.bottom }}>
        <ModalHeader
          title={t("settings.notifications.title")}
          left={{
            text: t("common.back"),
            kind: "back",
            onPress: () => navigation.goBack(),
          }}
        />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <SettingsSection>
            <SettingItem
              leftIcon={<AlarmIcon size={20} color={colors.BgContrast} />}
              text={t("settings.notifications.reminders")}
              subText={t("settings.notifications.remindersHint")}
              isEnable={isKindOn(state, "reminders")}
              onValueChange={() => toggle("reminders")}
            />
            <SettingItem
              isLast
              leftIcon={<MegaphoneIcon size={20} color={colors.BgContrast} />}
              text={t("settings.notifications.announcements")}
              subText={t("settings.notifications.announcementsHint")}
              isEnable={isKindOn(state, "announcements")}
              onValueChange={() => toggle("announcements")}
            />
          </SettingsSection>

          {(isBlocked || failed) && (
            <View style={styles.text}>
              {isBlocked && <Text style={styles.hint}>{t("settings.notifications.blocked")}</Text>}
              {failed && <Text style={styles.error}>{t("settings.notifications.error")}</Text>}
            </View>
          )}
        </ScrollView>
      </View>
    </ModelContainer>
  );
};

const makeStyles = (colors: ColorsType, pagePadding: number) =>
  StyleSheet.create({
    scroll: {
      gap: 16,
      paddingBottom: 32,
    },
    text: {
      width: "100%",
      maxWidth: TABLET_WIDTH + 32,
      alignSelf: "center",
      paddingHorizontal: pagePadding,
      gap: 8,
    },
    hint: {
      ...Typography.regularLabel,
      color: colors.TextSecondary,
    },
    error: {
      ...Typography.regularLabel,
      color: colors.TextDanger,
    },
  });

export default SettingsNotificationsPage;

import { useCallback, useEffect, useState } from "react";

import {
  getNotificationsSettings,
  NotificationsSettings,
} from "@nihongo/core/shared/contexts/device-registration/api";
import {
  NotificationPermission,
  useNotificationsContext,
} from "@nihongo/core/shared/lib/notifications";
import { useFocusEffect } from "@react-navigation/native";
import { AppState } from "react-native";

export type NotificationKind = keyof NotificationsSettings;

export type NotificationsState = {
  permission: NotificationPermission;
  settings: NotificationsSettings;
};

export const isKindOn = (state: NotificationsState | null, kind: NotificationKind): boolean =>
  !!state && state.permission.granted && state.settings[kind];

export const isAnyOn = (state: NotificationsState | null): boolean =>
  isKindOn(state, "reminders") || isKindOn(state, "announcements");

export const useNotificationsState = () => {
  const { getPermission } = useNotificationsContext();
  const [state, setState] = useState<NotificationsState | null>(null);

  const refresh = useCallback(async (): Promise<NotificationsState> => {
    const [permission, settings] = await Promise.all([getPermission(), getNotificationsSettings()]);
    const next = { permission, settings };
    setState(next);
    return next;
  }, [getPermission]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (appState) => {
      if (appState === "active") void refresh();
    });

    return () => subscription.remove();
  }, [refresh]);

  return { state, refresh };
};

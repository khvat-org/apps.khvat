import React, { ReactNode, useEffect, useRef } from "react";

import * as Notifications from "expo-notifications";
import { Linking, Platform } from "react-native";

import { notificationsConfig } from "./config";
import { registerPushToken } from "./register-push-token";

import { NotificationPermission, NotificationsContext, notificationDataSchema } from "./index";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const requestPushNotificationsToken = async (): Promise<string | null> => {
  try {
    return await registerPushToken();
  } catch {
    return null;
  }
};

const getPermission = async (): Promise<NotificationPermission> => {
  try {
    const permission = await Notifications.getPermissionsAsync();
    return { granted: permission.status === "granted", canAskAgain: permission.canAskAgain };
  } catch {
    return { granted: false, canAskAgain: false };
  }
};

const requestPermission = async (): Promise<NotificationPermission> => {
  try {
    const permission = await Notifications.requestPermissionsAsync();
    return { granted: permission.status === "granted", canAskAgain: permission.canAskAgain };
  } catch {
    return { granted: false, canAskAgain: false };
  }
};

const contextValue = { requestPushNotificationsToken, getPermission, requestPermission };

const setupAndroidChannel = () =>
  Notifications.setNotificationChannelAsync(notificationsConfig.channels.default.id, {
    name: notificationsConfig.channels.default.name,
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
  }).catch(() => {});

const NotificationsWrapperInner: React.FC<{ children: ReactNode }> = ({ children }) => {
  const handledResponseId = useRef<string | null>(null);
  const lastResponse = Notifications.useLastNotificationResponse();

  const handleResponse = (response: Notifications.NotificationResponse) => {
    if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;

    const responseId = response.notification.request.identifier;
    if (handledResponseId.current === responseId) return;
    handledResponseId.current = responseId;

    const data = notificationDataSchema.safeParse(response.notification.request.content.data);
    if (!data.success) return;

    Linking.openURL(data.data.url).catch(() => {});
  };

  useEffect(() => {
    if (lastResponse) handleResponse(lastResponse);
  }, [lastResponse]);

  useEffect(() => {
    if (Platform.OS === "android") setupAndroidChannel();

    const subscription = Notifications.addNotificationResponseReceivedListener(handleResponse);
    return () => subscription.remove();
  }, []);

  return (
    <NotificationsContext.Provider value={contextValue}>{children}</NotificationsContext.Provider>
  );
};

export default NotificationsWrapperInner;

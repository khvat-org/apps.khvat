import React, { createContext, useCallback, useContext, ReactNode, useEffect, useRef } from "react";

import { isAndroid } from "@nihongo/core/shared/constants/platformUtil";
import {
  APP_LANG,
  DEVICE_ID,
  FAILED_TO_REQUEST_NOTIFICATION_TOKEN,
  NOTIFICATION_TOKEN,
} from "@nihongo/core/shared/constants/storageKeys";
import { getAccessToken, subscribeToAuthChange } from "@nihongo/core/shared/lib/auth";
import { useNotificationsContext } from "@nihongo/core/shared/lib/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Platform, setDevice, setDeviceOnline } from "./api";

// * Контекст ничего не отдаёт (провайдер только запускает регистрацию девайса) — пустой объект.
type DeviceRegistrationContextType = Record<string, never>;

const DeviceRegistrationContext = createContext<DeviceRegistrationContextType | undefined>(
  undefined,
);

let creatingDevice: Promise<string | null> | null = null;

async function runCreateDevice(): Promise<string | null> {
  const existing = await AsyncStorage.getItem(DEVICE_ID);
  if (existing) return existing;

  const language = (await AsyncStorage.getItem(APP_LANG)) || "en";

  try {
    const response = await setDevice({
      platform: isAndroid ? Platform.Android : Platform.IOS,
      lang: language,
    });

    if (response.ok && response.id) {
      console.log(`[${+new Date()}] [LOG]: DEVICE CREATED`);

      await AsyncStorage.setItem(DEVICE_ID, response.id);
      return response.id;
    }
  } catch (error) {
    console.log(`[${+new Date()}] [ERROR]: ERROR CREATE DEVICE`, error);
  }

  return null;
}

function createDevice(): Promise<string | null> {
  if (!creatingDevice) {
    creatingDevice = runCreateDevice().finally(() => {
      creatingDevice = null;
    });
  }
  return creatingDevice;
}

async function registerDeviceImmediately() {
  let deviceId = await AsyncStorage.getItem(DEVICE_ID);

  if (!deviceId) {
    deviceId = await createDevice();
  } else {
    await setDeviceOnline();
    deviceId = await AsyncStorage.getItem(DEVICE_ID);
  }

  return deviceId;
}

async function syncDeviceUser(signedIn: boolean, onCreated: (deviceId: string) => void) {
  if (!(await AsyncStorage.getItem(DEVICE_ID))) {
    const created = await createDevice();
    if (created) onCreated(created);
    return;
  }

  const language = (await AsyncStorage.getItem(APP_LANG)) ?? "";
  const response = await setDevice(
    signedIn ? { lang: language } : { lang: language, signed_out: true },
  );

  if (!response.ok) {
    console.log(`[${+new Date()}] [ERROR]: CANNOT SYNC DEVICE USER`);
  }
}

async function tryRegisterPushTokenLater(
  deviceId: string,
  requestPushNotificationsToken: () => Promise<string | null>,
) {
  if (!deviceId) return;

  const language = (await AsyncStorage.getItem(APP_LANG)) || "en";
  const notificationToken = await AsyncStorage.getItem(NOTIFICATION_TOKEN);
  const failedBefore = await AsyncStorage.getItem(FAILED_TO_REQUEST_NOTIFICATION_TOKEN);

  if (failedBefore === "true") {
    return;
  }

  try {
    const token = await requestPushNotificationsToken();

    if (!token) {
      if (!notificationToken) {
        await AsyncStorage.setItem(FAILED_TO_REQUEST_NOTIFICATION_TOKEN, "true");
      }
      return;
    }

    if (token === notificationToken) {
      return;
    }

    const response = await setDevice({
      id: (await AsyncStorage.getItem(DEVICE_ID)) ?? deviceId,
      platform: isAndroid ? Platform.Android : Platform.IOS,
      lang: language,
      token,
    });

    if (response.ok && response.id) {
      await AsyncStorage.setItem(NOTIFICATION_TOKEN, token);
      console.log(`[${+new Date()}] [LOG]: UPDATED TOKEN`);
    } else {
      console.log(`[${+new Date()}] [ERROR]: CANNOT UPDATED TOKEN`);
    }
  } catch (error) {
    console.log(`[${+new Date()}] [ERROR]: CANNOT UPDATED TOKEN`, error);
  }
}

export const DeviceRegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { requestPushNotificationsToken } = useNotificationsContext();
  const pushTokenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const schedulePushToken = useCallback(
    (deviceId: string) => {
      if (pushTokenTimer.current) return;

      pushTokenTimer.current = setTimeout(() => {
        tryRegisterPushTokenLater(deviceId, requestPushNotificationsToken);
      }, 12000);
    },
    [requestPushNotificationsToken],
  );

  useEffect(() => {
    (async () => {
      const deviceId = await registerDeviceImmediately();

      if (deviceId) {
        schedulePushToken(deviceId);
      }
    })();

    return () => {
      if (pushTokenTimer.current) {
        clearTimeout(pushTokenTimer.current);
        pushTokenTimer.current = null;
      }
    };
  }, [schedulePushToken]);

  useEffect(() => {
    let signedIn: boolean | null = null;

    getAccessToken().then((token) => {
      if (signedIn === null) signedIn = !!token;
    });

    return subscribeToAuthChange(() => {
      void getAccessToken().then((token) => {
        const now = !!token;
        if (signedIn === now) return;

        signedIn = now;
        void syncDeviceUser(now, schedulePushToken);
      });
    });
  }, [schedulePushToken]);

  return (
    <DeviceRegistrationContext.Provider value={{}}>{children}</DeviceRegistrationContext.Provider>
  );
};

export const useDeviceRegistration = (): DeviceRegistrationContextType => {
  const context = useContext(DeviceRegistrationContext);
  if (undefined === context) {
    throw new Error("useDeviceRegistration must be used within a DeviceRegistrationProvider");
  }

  return context;
};

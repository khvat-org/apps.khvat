import React, { createContext, ReactNode, useContext } from "react";

import { isExpoGo } from "@nihongo/core/shared/constants/environment";
import { z } from "zod";

export const notificationDataSchema = z.object({
  action: z.literal("openUrl"),
  url: z.url({ protocol: /^https$/ }),
});

export type NotificationData = z.infer<typeof notificationDataSchema>;

export type NotificationPermission = { granted: boolean; canAskAgain: boolean };

interface NotificationsContextType {
  requestPushNotificationsToken: () => Promise<string | null>;
  getPermission: () => Promise<NotificationPermission>;
  requestPermission: () => Promise<NotificationPermission>;
}

export const NotificationsContext = createContext<NotificationsContextType>({
  requestPushNotificationsToken: async () => null,
  getPermission: async () => ({ granted: false, canAskAgain: false }),
  requestPermission: async () => ({ granted: false, canAskAgain: false }),
});

export const useNotificationsContext = () => useContext(NotificationsContext);

export const NotificationsWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  if (isExpoGo) return <>{children}</>;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const NotificationsWrapperInner = require("./notifications-inner").default;
  return <NotificationsWrapperInner>{children}</NotificationsWrapperInner>;
};

export default NotificationsWrapper;

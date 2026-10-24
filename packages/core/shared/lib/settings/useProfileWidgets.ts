import { useCallback, useState } from "react";

import { PROFILE_WIDGETS } from "@nihongo/core/shared/constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export type ProfileWidget = "statistics" | "social";

type ProfileWidgetsState = Record<ProfileWidget, boolean>;

const DEFAULT_WIDGETS: ProfileWidgetsState = { statistics: true, social: true };

const readWidgets = async (): Promise<ProfileWidgetsState> => {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_WIDGETS);
    return { ...DEFAULT_WIDGETS, ...(raw ? JSON.parse(raw) : {}) };
  } catch {
    return DEFAULT_WIDGETS;
  }
};

// * Какие виджеты вообще есть в профиле этого приложения на текущем языке
export const useAvailableProfileWidgets = (): ProfileWidget[] => {
  const { i18n } = useTranslation();

  const available: ProfileWidget[] = [];
  if (process.env.APP_SLUG === "kana-master") available.push("statistics");
  if (i18n.language === "ru") available.push("social");

  return available;
};

// * Включённость виджетов профиля. Перечитывается на фокусе экрана, поэтому профиль
// * подхватывает изменения из настроек, когда юзер возвращается назад
export const useProfileWidgets = () => {
  const [widgets, setWidgets] = useState<ProfileWidgetsState>(DEFAULT_WIDGETS);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      readWidgets().then((data) => {
        if (!active) return;
        setWidgets(data);
        setLoaded(true);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const setWidget = useCallback((key: ProfileWidget, value: boolean) => {
    setWidgets((prev) => {
      const next = { ...prev, [key]: value };
      AsyncStorage.setItem(PROFILE_WIDGETS, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const saveWidgets = useCallback((next: ProfileWidgetsState) => {
    setWidgets(next);
    AsyncStorage.setItem(PROFILE_WIDGETS, JSON.stringify(next)).catch(() => {});
  }, []);

  return { widgets, loaded, setWidget, saveWidgets };
};

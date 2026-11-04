import React, { createContext, ReactNode, useCallback, useEffect, useState } from "react";

import { PRACTICE_PREFERENCES } from "@nihongo/core/shared/constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { MIX_PRACTICE_TYPES, PracticeType } from "@/shared/constants/kana";

export const QUESTIONS_COUNT = { min: 8, max: 40, step: 4 };
export const TIMER_SECONDS = { min: 3, max: 12, step: 1 };

export type PracticePreferences = {
  autoplaySound: boolean;
  questionsCount: number;
  timerModes: PracticeType[];
  timerSeconds: number;
  mixModes: PracticeType[];
};

const DEFAULT_PREFERENCES: PracticePreferences = {
  autoplaySound: true,
  questionsCount: 16,
  timerModes: [PracticeType.Testing],
  timerSeconds: 5,
  mixModes: MIX_PRACTICE_TYPES,
};

type PracticePreferencesContextType = {
  preferences: PracticePreferences;
  update: (patch: Partial<PracticePreferences>) => void;
};

export const PracticePreferencesContext = createContext<PracticePreferencesContextType | null>(
  null,
);

export const PracticePreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  useEffect(() => {
    AsyncStorage.getItem(PRACTICE_PREFERENCES)
      .then((raw) => {
        if (raw) setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(raw) });
      })
      .catch(() => {});
  }, []);

  const update = useCallback((patch: Partial<PracticePreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(PRACTICE_PREFERENCES, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return (
    <PracticePreferencesContext.Provider value={{ preferences, update }}>
      {children}
    </PracticePreferencesContext.Provider>
  );
};

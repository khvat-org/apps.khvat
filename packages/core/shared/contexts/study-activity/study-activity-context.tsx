import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";

import { STUDY_ACTIVITY } from "@nihongo/core/shared/constants/storageKeys";
import { useRegisterEraseSource } from "@nihongo/core/shared/contexts/erase-data/erase-data-context";
import { getTokenUserId } from "@nihongo/core/shared/lib/auth/claims";
import { subscribeToAuthChange } from "@nihongo/core/shared/lib/auth/tokens";
import { getUserDataField, syncUserData } from "@nihongo/core/shared/lib/user-data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";

const FIELD_NAME = "practice_days";
const PUSH_DELAY = 3_000;

export type StudyDays = Record<string, number>;

interface StudyActivityState {
  days: StudyDays;
  synced: boolean;
  owner: string | null;
}

export interface StudyActivityContextType {
  days: StudyDays;
  registerStudyDay: () => void;
  sync: () => Promise<void>;
}

const initialState: StudyActivityState = { days: {}, synced: false, owner: null };

const StudyActivityContext = createContext<StudyActivityContextType | null>(null);

export const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const mergeSum = (base: StudyDays, extra: StudyDays): StudyDays => {
  const result: StudyDays = { ...base };
  for (const [day, count] of Object.entries(extra)) {
    result[day] = (result[day] ?? 0) + count;
  }
  return result;
};

const mergeMax = (base: StudyDays, extra: StudyDays): StudyDays => {
  const result: StudyDays = { ...base };
  for (const [day, count] of Object.entries(extra)) {
    result[day] = Math.max(result[day] ?? 0, count);
  }
  return result;
};

const addDelta = (base: StudyDays, before: StudyDays, after: StudyDays): StudyDays => {
  const result: StudyDays = { ...base };

  for (const [day, count] of Object.entries(after)) {
    const delta = count - (before[day] ?? 0);
    if (delta > 0) result[day] = (result[day] ?? 0) + delta;
  }

  return result;
};

const sameDays = (a: StudyDays, b: StudyDays) => {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((day) => a[day] === b[day]);
};

export const StudyActivityProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<StudyActivityState>(initialState);

  const stateRef = useRef(state);
  const restored = useRef(false);
  const syncing = useRef<Promise<void> | null>(null);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const epoch = useRef(0);

  const write = useCallback((next: StudyActivityState) => {
    stateRef.current = next;
    setState(next);
    AsyncStorage.setItem(STUDY_ACTIVITY, JSON.stringify(next));
  }, []);

  const sync = useCallback(async (): Promise<void> => {
    if (!restored.current) return;
    if (syncing.current) return syncing.current;

    syncing.current = (async () => {
      try {
        const userId = await getTokenUserId();
        if (!userId) return;

        const current = stateRef.current;
        const startedAt = epoch.current;
        const isOurs = current.owner === null || current.owner === userId;
        const local = isOurs ? current : initialState;

        const server = (await getUserDataField<StudyDays>(FIELD_NAME)) ?? {};
        const merged = local.synced ? mergeMax(server, local.days) : mergeSum(server, local.days);

        if (epoch.current !== startedAt) return;

        const latest = isOurs ? stateRef.current.days : local.days;

        write({ days: addDelta(merged, local.days, latest), synced: true, owner: userId });

        if (!sameDays(merged, server)) {
          await syncUserData({ [FIELD_NAME]: merged });
        }
      } catch {
        console.log("error study-activity sync");
      } finally {
        syncing.current = null;
      }
    })();

    return syncing.current;
  }, [write]);

  const push = useCallback(async () => {
    const current = stateRef.current;

    if (!current.synced) {
      await sync();
      return;
    }

    try {
      const userId = await getTokenUserId();
      if (!userId || userId !== current.owner) return;

      await syncUserData({ [FIELD_NAME]: current.days });
    } catch {
      console.log("error study-activity push");
    }
  }, [sync]);

  useEffect(() => {
    const restore = async () => {
      try {
        const raw = await AsyncStorage.getItem(STUDY_ACTIVITY);

        if (raw) {
          const parsed = JSON.parse(raw) as Partial<StudyActivityState>;
          const next: StudyActivityState = {
            days: parsed.days ?? {},
            synced: Boolean(parsed.synced),
            owner: parsed.owner ?? null,
          };
          stateRef.current = next;
          setState(next);
        }
      } catch {
        console.log("error restore");
      }

      restored.current = true;
      void sync();
    };

    restore();
  }, [sync]);

  useEffect(() => subscribeToAuthChange(() => void sync()), [sync]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void sync();
    });

    return () => {
      subscription.remove();
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
  }, [sync]);

  const registerStudyDay = useCallback(() => {
    const day = toDateKey(new Date());
    const current = stateRef.current;

    write({
      ...current,
      days: { ...current.days, [day]: (current.days[day] ?? 0) + 1 },
    });

    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => {
      pushTimer.current = null;
      void push();
    }, PUSH_DELAY);
  }, [push, write]);

  const dataSize = useMemo(() => new Blob([JSON.stringify(state.days)]).size, [state.days]);

  useRegisterEraseSource({
    clear: async () => {
      epoch.current += 1;
      stateRef.current = initialState;
      setState(initialState);
      await AsyncStorage.removeItem(STUDY_ACTIVITY);
    },
    getSize: () => dataSize,
  });

  const value = useMemo(
    () => ({ days: state.days, registerStudyDay, sync }),
    [state.days, registerStudyDay, sync],
  );

  return <StudyActivityContext.Provider value={value}>{children}</StudyActivityContext.Provider>;
};

export const useStudyActivity = () => {
  const context = useContext(StudyActivityContext);

  if (!context) throw new Error("StudyActivityProvider is missing");

  return context;
};

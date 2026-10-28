/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, FC, PropsWithChildren, useContext, useState } from "react";

import { InfoLessonScreen } from "@/shared/constants/lessons";

const FINISH_SCREEN: InfoLessonScreen = {
  id: "finish",
  screen_order: -1,
  title: "finish",
  blocks: [],
};

interface EducationLessonContextValue {
  init: (screens: InfoLessonScreen[]) => void;
  next: (hasError?: boolean) => void;
  back: () => void;
  retry: () => void;
  lessonScreens: InfoLessonScreen[];
  currentScreen: InfoLessonScreen | null;
  screen: number;
  furthestScreen: number;
}

export const EducationLessonContext = createContext<EducationLessonContextValue>({
  init: () => {},
  next: () => {},
  back: () => {},
  retry: () => {},
  lessonScreens: [],
  currentScreen: null,
  screen: 0,
  furthestScreen: 0,
});

export const useEducationLessonContext = () => useContext(EducationLessonContext);

export const EducationPracticeContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [screens, setScreens] = useState([] as InfoLessonScreen[]);
  const [screen, setScreen] = useState(0);
  const [furthestScreen, setFurthestScreen] = useState(0);

  const init = (infoScreens: InfoLessonScreen[]) => {
    setScreens([...infoScreens, FINISH_SCREEN]);
    setFurthestScreen(0);
  };

  const next = (hasError?: boolean) => {
    if (hasError) {
      if ((screens[screen] as any).retry !== 2) {
        setScreens((prev) => [
          ...prev.slice(0, -1),
          {
            ...screens[screen],
            retry: (screens[screen] as any)?.retry ? (screens[screen] as any)?.retry + 1 : 1,
          },
          FINISH_SCREEN,
        ]);
      }
    }

    if (screen + 1 !== screens.length) {
      setScreen((prev) => prev + 1);
      setFurthestScreen((prev) => Math.max(prev, screen + 1));
    }
  };

  const back = () => {
    setScreen((prev) => Math.max(prev - 1, 0));
  };

  const retry = () => {
    setScreen(0);
    setFurthestScreen(0);
  };

  return (
    <EducationLessonContext.Provider
      value={{
        init,
        next,
        back,
        retry,
        lessonScreens: screens,
        screen,
        furthestScreen,
        currentScreen: screens[screen],
      }}
    >
      {children}
    </EducationLessonContext.Provider>
  );
};

import { useCallback, useEffect, useState } from "react";

import { CaptchaFont, CaptchaPack, loadCaptchaPacks } from "./captcha-fonts";

const SLOW_AFTER = 10_000;
const STALL_TIMEOUT = 45_000;

interface CaptchaPacksState {
  packs: CaptchaPack[] | null;
  done: number;
  total: number;
  isSlow: boolean;
  isFailed: boolean;
}

const INITIAL_STATE: CaptchaPacksState = {
  packs: null,
  done: 0,
  total: 0,
  isSlow: false,
  isFailed: false,
};

export const useCaptchaPacks = (fonts: CaptchaFont[] | null, isEnabled: boolean) => {
  const [initialFonts] = useState(fonts);
  const [state, setState] = useState(INITIAL_STATE);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!isEnabled) return undefined;

    const controller = new AbortController();
    let isActive = true;
    let slowTimer: ReturnType<typeof setTimeout>;
    let stallTimer: ReturnType<typeof setTimeout>;

    const clearTimers = () => {
      clearTimeout(slowTimer);
      clearTimeout(stallTimer);
    };

    const startTimers = () => {
      clearTimers();
      slowTimer = setTimeout(
        () => setState((current) => ({ ...current, isSlow: true })),
        SLOW_AFTER,
      );
      stallTimer = setTimeout(() => controller.abort(), STALL_TIMEOUT);
    };

    loadCaptchaPacks(initialFonts ?? [], {
      signal: controller.signal,
      onProgress: (done, total) => {
        if (!isActive) return;

        startTimers();
        setState((current) => ({ ...current, done, total, isSlow: false }));
      },
    })
      .then((packs) => {
        if (isActive) setState((current) => ({ ...current, packs }));
      })
      .catch(() => {
        if (isActive) setState((current) => ({ ...current, isFailed: true }));
      })
      .finally(clearTimers);

    return () => {
      isActive = false;
      clearTimers();
      controller.abort();
    };
  }, [attempt, initialFonts, isEnabled]);

  const retry = useCallback(() => {
    setState(INITIAL_STATE);
    setAttempt((current) => current + 1);
  }, []);

  return { ...state, retry };
};

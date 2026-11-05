import { isIOS } from "../../constants/platformUtil";

const TRANSITION_WINDOW_MS = 600;

let transitionEndsAt = 0;

export const markTransition = () => {
  transitionEndsAt = Date.now() + TRANSITION_WINDOW_MS;
};

export const openSheet = (open: () => void) => {
  if (isIOS) {
    if (Date.now() < transitionEndsAt) return;

    markTransition();
  }

  open();
};

export const sheetTransitionListeners = {
  transitionStart: markTransition,
  beforeRemove: ({ data }: { data: { action: { type: string } } }) => {
    if (data.action.type !== "POP") markTransition();
  },
};

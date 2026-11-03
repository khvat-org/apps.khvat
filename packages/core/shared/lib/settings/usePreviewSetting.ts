import { useCallback, useEffect, useRef, useState } from "react";

import { useHaptic } from "@nihongo/core/shared/contexts/haptic/haptic-context";

interface PreviewSettingOptions<T> {
  current: T;
  preview: (value: T) => void;
  commit?: (value: T) => unknown;
}

const usePreviewSetting = <T>({ current, preview, commit }: PreviewSettingOptions<T>) => {
  const { triggerHaptic } = useHaptic();

  const initial = useRef(current);

  const [selected, setSelected] = useState<T>(current);

  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const previewRef = useRef(preview);
  previewRef.current = preview;

  const isSettled = useRef(false);

  const select = useCallback(
    (value: T) => {
      triggerHaptic();
      setSelected(value);
      previewRef.current(value);
    },
    [triggerHaptic],
  );

  const isDirty = selected !== initial.current;

  const confirm = useCallback(async () => {
    isSettled.current = true;

    if (selectedRef.current !== initial.current) {
      await commit?.(selectedRef.current);
    }
  }, [commit]);

  const cancel = useCallback(() => {
    isSettled.current = true;

    if (selectedRef.current !== initial.current) {
      setSelected(initial.current);
      previewRef.current(initial.current);
    }
  }, []);

  useEffect(() => {
    const initialValue = initial.current;

    return () => {
      if (isSettled.current) return;
      if (selectedRef.current === initialValue) return;

      previewRef.current(initialValue);
    };
  }, []);

  return { selected, select, isDirty, confirm, cancel };
};

export default usePreviewSetting;

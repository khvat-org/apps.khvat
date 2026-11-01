import { useEffect } from "react";

import { getAsymmetricSide } from "@nihongo/core/shared/lib/layout/get-asymmetric-side";
import * as Device from "expo-device";
import * as ScreenOrientation from "expo-screen-orientation";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LARGE_SCREEN_MIN_SIDE = 600;

export const useOrientationLock = () => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const canRotate =
    Device.deviceType === Device.DeviceType.TABLET ||
    Math.min(width, height) >= LARGE_SCREEN_MIN_SIDE ||
    getAsymmetricSide(insets) !== null;

  useEffect(() => {
    const change = canRotate
      ? ScreenOrientation.unlockAsync()
      : ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

    change.catch(() => {});
  }, [canRotate]);
};

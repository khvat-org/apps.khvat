import React from "react";

import { InsetSide } from "@nihongo/core/shared/lib/layout/get-asymmetric-side";
import Button from "@nihongo/core/shared/ui/button";
import { ArrowBendUpLeftIcon, ArrowCounterClockwiseIcon, ScanIcon } from "phosphor-react-native";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ToggleShowBorders from "../buttons/toggle-show-borders";
import ToggleShowLetter from "../buttons/toggle-show-letter";
import ToggleStrokeWidth from "../buttons/toggle-stroke-width";

interface DrawSideControlsProps {
  side: InsetSide;
  width: number;
  top?: number;
  onUndo: () => void;
  onClear: () => void;
  onScan?: () => void;
}

const DrawSideControls: React.FC<DrawSideControlsProps> = ({
  side,
  width,
  top,
  onUndo,
  onClear,
  onScan,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.column,
        { [side]: 0, width, paddingBottom: insets.bottom },
        top !== undefined
          ? { top, justifyContent: "flex-start" }
          : { top: 0, justifyContent: "center", paddingTop: insets.top },
      ]}
    >
      <Button
        color="secondary"
        isHapticFeedback
        icon={<ArrowBendUpLeftIcon size={20} />}
        onClick={onUndo}
      />
      <Button
        color="secondary"
        isHapticFeedback
        icon={<ArrowCounterClockwiseIcon size={20} />}
        onClick={onClear}
      />
      {onScan && (
        <Button color="secondary" isHapticFeedback icon={<ScanIcon size={20} />} onClick={onScan} />
      )}
      <ToggleShowBorders />
      <ToggleShowLetter />
      <ToggleStrokeWidth />
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    gap: 8,
  },
});

export default DrawSideControls;

import React from "react";

import { InsetSide } from "@nihongo/core/shared/lib/layout/get-asymmetric-side";
import Button from "@nihongo/core/shared/ui/button";
import { ArrowBendUpLeftIcon, ArrowCounterClockwiseIcon, ScanIcon } from "phosphor-react-native";
import { StyleSheet, View } from "react-native";

import ToggleShowBorders from "../buttons/toggle-show-borders";
import ToggleShowLetter from "../buttons/toggle-show-letter";
import ToggleStrokeWidth from "../buttons/toggle-stroke-width";

const GAP = 8;
const COMPACT_GAP = 4;

interface DrawSideControlsProps {
  side: InsetSide;
  width: number;
  bottomInset: number;
  isCompact: boolean;
  onUndo: () => void;
  onClear: () => void;
  onScan?: () => void;
}

const DrawSideControls: React.FC<DrawSideControlsProps> = ({
  side,
  width,
  bottomInset,
  isCompact,
  onUndo,
  onClear,
  onScan,
}) => {
  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.column,
        { [side]: 0, width, paddingBottom: bottomInset, gap: isCompact ? COMPACT_GAP : GAP },
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
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

export default DrawSideControls;

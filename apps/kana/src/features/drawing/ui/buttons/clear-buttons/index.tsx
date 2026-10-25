import React from "react";

import Button from "@nihongo/core/shared/ui/button";
import { ArrowBendUpLeftIcon, ArrowCounterClockwiseIcon } from "phosphor-react-native";
import { StyleSheet, View } from "react-native";

interface ClearButtonsProps {
  clearFull: () => void;
  clearStep: () => void;
}

const ClearButtons: React.FC<ClearButtonsProps> = ({ clearFull, clearStep }) => {
  return (
    <View style={styles.buttonsContainer}>
      <View style={{ flex: 1 }}>
        <Button
          color="secondary"
          isHapticFeedback
          width="100%"
          icon={<ArrowBendUpLeftIcon size={20} />}
          onClick={clearStep}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Button
          color="secondary"
          isHapticFeedback
          width="100%"
          icon={<ArrowCounterClockwiseIcon size={20} />}
          onClick={clearFull}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    marginTop: 16,
    gap: 16,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
});

export default ClearButtons;

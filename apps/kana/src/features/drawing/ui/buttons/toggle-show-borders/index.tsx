import React from "react";

import Button from "@nihongo/core/shared/ui/button";
import { SelectionIcon, SelectionSlashIcon } from "phosphor-react-native";

import { useDrawBorder } from "@/features/drawing/model/hooks";

const ToggleShowBorders: React.FC = () => {
  const { isShowBorder, toggleBorder } = useDrawBorder();

  return (
    <Button
      color={isShowBorder ? "accent" : "secondary"}
      isHapticFeedback
      icon={!isShowBorder ? <SelectionSlashIcon size={20} /> : <SelectionIcon size={20} />}
      onClick={toggleBorder}
    />
  );
};

export default ToggleShowBorders;

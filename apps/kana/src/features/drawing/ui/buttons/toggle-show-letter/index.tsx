import React from "react";

import Button from "@nihongo/core/shared/ui/button";
import { EyeIcon, EyeSlashIcon } from "phosphor-react-native";

import { useDrawLetter } from "@/features/drawing/model/hooks";

const ToggleShowLetter: React.FC = () => {
  const { isShowLetter, toggleLetter } = useDrawLetter();

  return (
    <Button
      color={isShowLetter ? "accent" : "secondary"}
      isHapticFeedback
      icon={isShowLetter ? <EyeIcon size={20} /> : <EyeSlashIcon size={20} />}
      onClick={toggleLetter}
    />
  );
};

export default ToggleShowLetter;

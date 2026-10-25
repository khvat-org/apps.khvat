import React from "react";

import Button from "@nihongo/core/shared/ui/button";
import {
  NumberCircleOneIcon,
  NumberCircleThreeIcon,
  NumberCircleTwoIcon,
} from "phosphor-react-native";

import { useDrawLineWidth } from "@/features/drawing/model/hooks";

const ToggleStrokeWidth: React.FC = () => {
  const { lineWidth, setLineWidth } = useDrawLineWidth();

  const BIG_WIDTH = 14;
  const MIDDLE_WIDTH = 10;
  const SMALL_WIDTH = 6;

  const onClick = () => {
    if (lineWidth === BIG_WIDTH) {
      return setLineWidth(SMALL_WIDTH);
    }

    if (lineWidth === SMALL_WIDTH) {
      return setLineWidth(MIDDLE_WIDTH);
    }

    if (lineWidth === MIDDLE_WIDTH) {
      return setLineWidth(BIG_WIDTH);
    }
  };

  const getIcon = () => {
    if (lineWidth === BIG_WIDTH) return <NumberCircleThreeIcon size={20} />;
    if (lineWidth === MIDDLE_WIDTH) return <NumberCircleTwoIcon size={20} />;

    return <NumberCircleOneIcon size={20} />;
  };

  return <Button color="secondary" isHapticFeedback onClick={onClick} icon={getIcon()} />;
};

export default ToggleStrokeWidth;

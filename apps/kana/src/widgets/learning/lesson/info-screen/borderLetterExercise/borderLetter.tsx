import React, { useRef, useState } from "react";

import { lettersTableBase } from "@nihongo/core/shared/data/lettersTable";
import { useWindowDimensions, View } from "react-native";

import LetterSoundHeader from "@/entities/education/letter/letter-sound-header/letter-sound-header";
import Draw, {
  DRAW_CONTROLS_HEIGHT,
  DrawHandle,
  getDrawCanvasSize,
  MIN_FIT_CANVAS_SIZE,
} from "@/features/drawing/ui/draw/draw";
import { KanaAlphabet } from "@/shared/constants/kana";

type borderLetterProps = {
  ref?: React.Ref<DrawHandle>;

  id: string;
  kana: KanaAlphabet;

  marginTop?: number;
  viewportBottom?: number | null;

  isStencil?: boolean;

  onComplete?: (hasError: boolean) => void;
};

const BorderLetterExercise: React.FC<borderLetterProps> = ({
  ref,
  id,
  kana,
  marginTop,
  viewportBottom,
  isStencil,
  onComplete,
}) => {
  const drawRef = useRef<React.ComponentRef<typeof View>>(null);
  const [drawTop, setDrawTop] = useState<number | null>(null);

  const measureDrawTop = () => {
    drawRef.current?.measureInWindow((_x, y) => setDrawTop((prev) => (prev === y ? prev : y)));
  };

  const maxCanvasSize =
    viewportBottom != null && drawTop !== null
      ? Math.max(MIN_FIT_CANVAS_SIZE, viewportBottom - drawTop - DRAW_CONTROLS_HEIGHT)
      : undefined;

  const { width, height } = useWindowDimensions();
  const canvasSize = getDrawCanvasSize(width, height, maxCanvasSize);

  return (
    <View>
      <LetterSoundHeader kana={kana} id={id} width={canvasSize} />

      <View
        ref={drawRef}
        onLayout={measureDrawTop}
        style={{
          borderRadius: 12,
          marginTop: marginTop !== undefined ? marginTop : 16,
        }}
      >
        <Draw
          ref={ref}
          maxCanvasSize={maxCanvasSize}
          isCheck
          isCheckButtonExternal
          isStencil={isStencil}
          onCompleted={(isError) => onComplete?.(isError)}
          letter={lettersTableBase[id]}
          kana={kana}
        />
      </View>
    </View>
  );
};

export default BorderLetterExercise;

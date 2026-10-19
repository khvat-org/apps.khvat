import React, { useRef, useState } from "react";

import { lettersTableBase, lettersTableById } from "@nihongo/core/shared/data/lettersTable";
import { View } from "react-native";

import SymbolHeader from "@/entities/kana/symbol-header/symbol-header";
import Draw, { DRAW_CONTROLS_HEIGHT, MIN_FIT_CANVAS_SIZE } from "@/features/drawing/ui/draw/draw";
import { KanaAlphabet } from "@/shared/constants/kana";

type borderLetterProps = {
  id: string;
  kana: KanaAlphabet;

  marginTop?: number;
  viewportBottom?: number | null;

  isStencil?: boolean;

  onComplete?: (hasError: boolean) => void;
};

const BorderLetterExercise: React.FC<borderLetterProps> = ({
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

  return (
    <View>
      <SymbolHeader kana={kana} letter={lettersTableById[id]} />

      <View
        ref={drawRef}
        onLayout={measureDrawTop}
        style={{
          borderRadius: 12,
          marginTop: marginTop !== undefined ? marginTop : 30,
        }}
      >
        <Draw
          maxCanvasSize={maxCanvasSize}
          isCheck
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

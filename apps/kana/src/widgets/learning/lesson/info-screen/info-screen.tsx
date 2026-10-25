import React, { useMemo, useRef, useState } from "react";

import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import Button from "@nihongo/core/shared/ui/button";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LearningTitle } from "../ui/title";

import BorderLetterExercise from "./borderLetterExercise/borderLetter";
import ImageBlock from "./image/image";
import Rules from "./rules/rules";
import Table from "./table/table";
import BlockText from "./text/text";
import Title from "./title/title";

import BorderLetter from "@/entities/education/letter/borderLetter/borderLetter";
import MatchPairs from "@/entities/education/practice/match-pairs/match-pairs";
import SelectAnswer from "@/entities/education/select-answer/select-answer";
import Sequence from "@/entities/education/sequence";
import { KanaAlphabet, TEST_DELAY } from "@/shared/constants/kana";
import {
  InfoLessonScreen,
  AnyLessonBlock,
  LessonBlockText,
  LessonBlockTable,
  LessonBlockRule,
  LessonBlockLetter,
  LessonBlockChoice,
  LessonBlockSequence,
  LessonBlockTitle,
  LessonBlockMatching,
  LessonBlockImage,
} from "@/shared/constants/lessons";
import { useFirstClickHandler } from "@/shared/helpers/firstClickHandler";
import { shuffleArray } from "@/shared/helpers/letters";

type InfoScreenProps = InfoLessonScreen & {
  next: () => void;
  finish: () => void;

  isLast?: boolean;
};

const blockType = {
  isText: (item: AnyLessonBlock): item is LessonBlockText => item.type === "text",
  isTable: (item: AnyLessonBlock): item is LessonBlockTable => item.type === "table",
  isRules: (item: AnyLessonBlock): item is LessonBlockRule => item.type === "rule",
  isLetterExercise: (item: AnyLessonBlock): item is LessonBlockLetter =>
    item.type === "letter" && item.content.exercise === true,
  isLetter: (item: AnyLessonBlock): item is LessonBlockLetter =>
    item.type === "letter" && item.content.exercise === false,
  isSelectAnswer: (item: AnyLessonBlock): item is LessonBlockChoice => item.type === "choice",
  isMatchAnswerBlock: (item: AnyLessonBlock): item is LessonBlockMatching =>
    item.type === "matching",
  isSequence: (item: AnyLessonBlock): item is LessonBlockSequence => item.type === "sequence",
  isTitleBlock: (item: AnyLessonBlock): item is LessonBlockTitle => item.type === "title",
  isImage: (item: AnyLessonBlock): item is LessonBlockImage => item.type === "image",
};

const InfoScreen: React.FC<InfoScreenProps> = ({ next, finish, title, blocks, isLast }) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { width } = useWindowDimensions();

  const containerRef = useRef<React.ComponentRef<typeof View>>(null);
  const [viewportBottom, setViewportBottom] = useState<number | null>(null);

  const measureViewport = () => {
    containerRef.current?.measureInWindow((_x, y, _width, height) => {
      const bottom = y + height - SCROLL_PADDING;
      setViewportBottom((prev) => (prev === bottom ? prev : bottom));
    });
  };

  const choiceAnswers = useMemo(
    () =>
      blocks.map((item) =>
        blockType.isSelectAnswer(item) ? shuffleArray(item.content.answers) : [],
      ),
    [blocks],
  );

  const interactiveBlocks = blocks.filter(
    (item) =>
      blockType.isSelectAnswer(item) ||
      blockType.isMatchAnswerBlock(item) ||
      blockType.isSequence(item) ||
      blockType.isLetterExercise(item),
  );

  function checkUnknown(arg: never): never {
    throw new Error(`not all blocks are processed: ${arg}`);
  }

  const nextScreen = () => {
    if (isLast && interactiveBlocks.length) {
      finish();
    } else {
      next();
    }
  };

  const getButtons = () => {
    if (interactiveBlocks.length) return <View></View>;

    return (
      <View
        style={{
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <View
          style={[
            styles.btnsContainer,
            {
              paddingLeft: width > TABLET_WIDTH ? 0 : insets.left + 16,
              paddingRight: width > TABLET_WIDTH ? 0 : insets.right + 16,

              width: "100%",
              maxWidth: TABLET_WIDTH,
            },
          ]}
        >
          {!isLast && (
            <Button
              color="primary"
              isHapticFeedback
              isFullWidth
              text={t("common.next")}
              onClick={nextScreen}
            />
          )}
          {isLast && (
            <Button color="primary" isFullWidth text={t("common.complete")} onClick={finish} />
          )}
        </View>
      </View>
    );
  };

  const nextDelayed = useFirstClickHandler(() => {
    setTimeout(() => {
      nextScreen();
    }, TEST_DELAY);
  }, TEST_DELAY + 100);

  return (
    <View style={styles.container} ref={containerRef} onLayout={measureViewport}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: SCROLL_PADDING,
          paddingBottom: SCROLL_PADDING,
        }}
        style={{
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
          width: "100%",
        }}
      >
        <LearningTitle>{title}</LearningTitle>

        <View style={styles.blocksContainer}>
          <View style={styles.blocks}>
            {blocks.map((block, idx) => {
              if (blockType.isText(block)) {
                return <BlockText text={block.content.text} key={idx} />;
              } else if (blockType.isTable(block)) {
                return <Table key={idx} data={block.content.table} />;
              } else if (blockType.isRules(block)) {
                return <Rules key={idx} rules={block.content.rules} />;
              } else if (blockType.isLetter(block) || blockType.isLetterExercise(block)) {
                const isExercise = block.content.exercise;
                const blockKana =
                  block.content.kana.toLowerCase() === "hiragana"
                    ? KanaAlphabet.Hiragana
                    : KanaAlphabet.Katakana;

                if (isExercise) {
                  return (
                    <BorderLetterExercise
                      viewportBottom={viewportBottom}
                      onComplete={() => nextDelayed()}
                      kana={blockKana}
                      key={idx}
                      id={block.content.id}
                      isStencil={block.content.stencil}
                    />
                  );
                } else {
                  return <BorderLetter kana={blockKana} key={idx} id={block.content.id} />;
                }
              } else if (blockType.isSelectAnswer(block)) {
                return (
                  <SelectAnswer
                    key={idx}
                    onFinish={(_) => nextDelayed()}
                    answers={choiceAnswers[idx]}
                  />
                );
              } else if (blockType.isMatchAnswerBlock(block)) {
                return (
                  <MatchPairs
                    onComplete={() => nextDelayed()}
                    pairs={{
                      data: block.content.pairs,
                    }}
                    key={idx}
                  />
                );
              } else if (blockType.isSequence(block)) {
                return (
                  <Sequence
                    onFinish={(_) => nextDelayed()}
                    sequence={block.content.sequence}
                    key={idx}
                  />
                );
              } else if (blockType.isImage(block)) {
                return <ImageBlock url={block.content.url} alt={block.content.alt} key={idx} />;
              } else if (blockType.isTitleBlock(block)) {
                return (
                  <Title title={block.content.title} subtitle={block.content.sub_title} key={idx} />
                );
              } else {
                checkUnknown(block);
              }
            })}
          </View>
        </View>
      </ScrollView>
      {getButtons()}
    </View>
  );
};

export default InfoScreen;

const SCROLL_PADDING = 22;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  btnsContainer: {
    width: "100%",
    height: 66,
    paddingTop: 16,
  },

  blocksContainer: {
    width: "100%",

    flexDirection: "column",
    alignItems: "center",
  },

  blocks: {
    width: "100%",
    maxWidth: TABLET_WIDTH,
  },
});

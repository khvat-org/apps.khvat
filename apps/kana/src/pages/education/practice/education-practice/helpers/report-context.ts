import { ILetter } from "@nihongo/core/shared/data/lettersTable";

import { PracticeQuestion } from "../lib/types/questions";

import { Kana, PracticeType } from "@/shared/constants/kana";

const toChar = (letter: ILetter, kana: Kana) => (kana === Kana.Hiragana ? letter.hi : letter.ka);

const getSubject = (question: PracticeQuestion): string => {
  switch (question.type) {
    case PracticeType.Testing:
      return question.testing
        ? `char:${toChar(question.testing.question, question.testing.questionKana)}`
        : "";
    case PracticeType.Drawing:
      return question.drawing
        ? `char:${toChar(question.drawing.question, question.drawing.questionKana)}`
        : "";
    case PracticeType.Typing:
      return question.typing
        ? `char:${toChar(question.typing.question, question.typing.questionKana)}`
        : "";
    case PracticeType.Listening:
      return question.listening
        ? `char:${toChar(question.listening.question, question.listening.answersKana)}`
        : "";
    case PracticeType.MultipleChoice:
      return question.multipleChoice ? `word:${question.multipleChoice.word.kana}` : "";
    case PracticeType.MatchingPairs:
      return question.matchingPairs
        ? `words:${question.matchingPairs.pairs.map((pair) => pair.kana).join(",")}`
        : "";
    case PracticeType.WordBuilding:
      return question.wordBuilding ? `word:${question.wordBuilding.sequence.join("")}` : "";
    case PracticeType.Captcha:
      return question.captcha
        ? `char:${question.captcha.question.hi}/fonts:${question.captcha.tiles
            .map((tile) => tile.font)
            .join(",")}`
        : "";
    default:
      return "";
  }
};

type PreviousQuestion = {
  question: PracticeQuestion;
  isCorrectAnswer?: boolean;
};

const getPreviousContext = ({ question, isCorrectAnswer }: PreviousQuestion) => {
  const result =
    isCorrectAnswer === undefined ? "" : `result:${isCorrectAnswer ? "correct" : "wrong"}`;

  return `prev:${[getSubject(question), `mode:${question.type}`, result].filter(Boolean).join(",")}`;
};

export const getPracticeReportContext = (question: PracticeQuestion, previous?: PreviousQuestion) =>
  [
    "practice:kana",
    getSubject(question),
    `mode:${question.type}`,
    previous ? getPreviousContext(previous) : "",
  ]
    .filter(Boolean)
    .join("/");

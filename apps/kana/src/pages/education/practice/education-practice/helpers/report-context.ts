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
    default:
      return "";
  }
};

export const getPracticeReportContext = (question: PracticeQuestion) =>
  ["practice:kana", getSubject(question), `mode:${question.type}`].filter(Boolean).join("/");

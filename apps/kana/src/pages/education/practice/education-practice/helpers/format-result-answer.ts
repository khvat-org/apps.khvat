import { ILetter } from "@nihongo/core/shared/data/lettersTable";

import { PracticeQuestion, PracticeUserSelect, UserSelectByType } from "../lib/types/questions";

import { Kana, PracticeType } from "@/shared/constants/kana";

interface FormatResultAnswerProps {
  question: PracticeQuestion;
  userSelect: PracticeUserSelect | null;
  transliterations: number;
}

export type ResultSegment = { text: string; isCorrect: boolean };

export type ResultLine = {
  question: string;
  answer: ResultSegment[];
  isCorrect: boolean;
  correct?: string;
};

export interface ResultAnswerView {
  question: PracticeQuestion | null;

  title: string;
  lines: ResultLine[];
  errors: number;
}

export const letterText = (letter: ILetter, kana: Kana, transliterations: number): string => {
  if (kana === Kana.Hiragana) return letter.hi;
  if (kana === Kana.Katakana) return letter.ka;
  return letter.transliterations[transliterations].toUpperCase();
};

const selectOf = <Type extends PracticeType>(
  userSelect: PracticeUserSelect | null,
  type: Type,
): UserSelectByType[Type] | null => {
  if (userSelect === null || userSelect.type !== type) return null;

  return userSelect.value as UserSelectByType[Type];
};

const NO_ANSWER = "—";

const missedLine = (question: string, correct: string): ResultLine => ({
  question,
  answer: [{ text: NO_ANSWER, isCorrect: false }],
  isCorrect: false,
  correct,
});

const compareSymbols = (answer: string[], correct: string[]) => {
  const segments = answer.map((text, index) => ({
    text,
    isCorrect: text.toLowerCase() === correct[index]?.toLowerCase(),
  }));
  const matches = segments.filter((segment) => segment.isCorrect).length;

  return { segments, errors: Math.max(answer.length, correct.length) - matches };
};

const formatResultAnswer = ({
  question,
  userSelect,
  transliterations,
}: FormatResultAnswerProps): ResultAnswerView => {
  const empty = { title: "", lines: [], errors: 0 };

  switch (question.type) {
    case PracticeType.Testing: {
      const data = question[PracticeType.Testing]!;

      return {
        ...empty,
        question: { type: PracticeType.Testing, [PracticeType.Testing]: data },
        title: letterText(data.question, data.questionKana, transliterations),
      };
    }

    case PracticeType.Drawing: {
      const data = question[PracticeType.Drawing]!;

      return {
        ...empty,
        question: { type: PracticeType.Drawing, [PracticeType.Drawing]: data },
        title: letterText(data.question, Kana.Romaji, transliterations),
      };
    }

    case PracticeType.Listening: {
      const data = question[PracticeType.Listening]!;

      return {
        ...empty,
        question: { type: PracticeType.Listening, [PracticeType.Listening]: data },
        title: letterText(data.question, Kana.Romaji, transliterations),
      };
    }

    case PracticeType.MultipleChoice: {
      const data = question[PracticeType.MultipleChoice]!;

      return {
        ...empty,
        question: { type: PracticeType.MultipleChoice, [PracticeType.MultipleChoice]: data },
        title: data.word.kana,
      };
    }

    case PracticeType.MatchingPairs: {
      const data = question[PracticeType.MatchingPairs]!;
      const attempts = selectOf(userSelect, PracticeType.MatchingPairs) ?? [];
      const missed = data.pairs.filter(
        (pair) => !attempts.some((attempt) => attempt.question === pair.kana),
      );

      return {
        ...empty,
        question: { type: PracticeType.MatchingPairs, [PracticeType.MatchingPairs]: data },
        lines: [
          ...attempts.map((attempt) => ({
            question: attempt.question,
            answer: [{ text: attempt.answer, isCorrect: attempt.isCorrect }],
            isCorrect: attempt.isCorrect,
            correct: attempt.isCorrect
              ? undefined
              : data.pairs.find((pair) => pair.kana === attempt.question)?.transliteration,
          })),
          ...missed.map((pair) => missedLine(pair.kana, pair.transliteration)),
        ],
        errors: attempts.filter((attempt) => !attempt.isCorrect).length + missed.length,
      };
    }

    case PracticeType.WordBuilding: {
      const data = question[PracticeType.WordBuilding]!;
      const picked = selectOf(userSelect, PracticeType.WordBuilding) ?? [];
      const { segments, errors } = compareSymbols(picked, data.sequence);

      return {
        ...empty,
        question: { type: PracticeType.WordBuilding, [PracticeType.WordBuilding]: data },
        lines:
          picked.length > 0
            ? [
                {
                  question: data.title,
                  answer: segments,
                  isCorrect: errors === 0,
                  correct: errors > 0 ? data.sequence.join("") : undefined,
                },
              ]
            : [missedLine(data.title, data.sequence.join(""))],
        errors,
      };
    }

    case PracticeType.Typing: {
      const data = question[PracticeType.Typing]!;
      const from = letterText(data.question, data.questionKana, transliterations);
      const to = letterText(data.question, Kana.Romaji, transliterations);
      const typed = (selectOf(userSelect, PracticeType.Typing) ?? "").toUpperCase();
      const { segments, errors } = compareSymbols(typed.split(""), to.split(""));

      return {
        ...empty,
        question: { type: PracticeType.Typing, [PracticeType.Typing]: data },
        lines:
          typed.length > 0
            ? [
                {
                  question: from,
                  answer: segments,
                  isCorrect: errors === 0,
                  correct: errors > 0 ? to : undefined,
                },
              ]
            : [missedLine(from, to)],
        errors,
      };
    }

    default:
      return { ...empty, question: null };
  }
};

export default formatResultAnswer;

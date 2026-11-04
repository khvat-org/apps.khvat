import { ShortLanguage } from "@nihongo/core/shared/constants/language";
import { ILetter } from "@nihongo/core/shared/data/lettersTable";

import { Kana, PracticeType } from "@/shared/constants/kana";
import { Word } from "@/shared/data/words";

export type Maybe<T> = T | null;

export type CaptchaTile = {
  letter: ILetter;
  kana: Kana;
  text: string;
  font: string;
  path: string;
  viewBox: number;
  isCorrect: boolean;
};

// * Practice Question
export type PracticeQuestion = {
  type: PracticeType;

  // * need to PracticeType.Testing
  [PracticeType.Testing]?: {
    question: ILetter;
    answers: ILetter[];
    questionKana: Kana;
    answersKana: Kana;
  };

  // * need to PracticeType.Drawing
  [PracticeType.Drawing]?: {
    question: ILetter;
    questionKana: Kana;
  };

  // * need to PracticeType.Listening
  [PracticeType.Listening]?: {
    question: ILetter;
    answers: ILetter[];
    answersKana: Kana;
  };

  // * need to PracticeType.MultipleChoice
  [PracticeType.MultipleChoice]?: {
    word: Word;
    answers: { title: string; isTrue: boolean }[];
    kana: Kana;
  };

  // * need to PracticeType.MatchingPairs
  [PracticeType.MatchingPairs]?: {
    pairs: {
      kana: string;
      translate: string;
      transliteration: string;
    }[];
    questionKana: Kana;
  };

  // * need to PracticeType.WordBuilding
  [PracticeType.WordBuilding]?: {
    sequence: string[];
    title: string;
    subtitle: string;
    kana: Kana;
  };

  // * need to PracticeType.Typing
  [PracticeType.Typing]?: {
    question: ILetter;
    questionKana: Kana;
    language: ShortLanguage;
  };

  // * need to PracticeType.Captcha
  [PracticeType.Captcha]?: {
    question: ILetter;
    tiles: CaptchaTile[];
  };
};

export type Result = {
  questions: {
    type: PracticeType;

    [PracticeType.Testing]?: {
      question: ILetter;
      answers: ILetter[];
      questionKana: Kana;
      answersKana: Kana;

      isCorrectAnswer: boolean;
      wrongAnswersId?: string;
    };
  }[];
};

export type DrawingStroke = { x: number; y: number }[];

export type DrawingUserSelect = {
  strokes: DrawingStroke[];
  canvasSize: number;
};

export type MatchingPairAttempt = {
  question: string;
  answer: string;
  translate: string;

  isCorrect: boolean;
};

export type UserSelectByType = {
  [PracticeType.Testing]: ILetter;
  [PracticeType.Drawing]: DrawingUserSelect;
  [PracticeType.Listening]: ILetter;
  [PracticeType.MultipleChoice]: string;
  [PracticeType.MatchingPairs]: MatchingPairAttempt[];
  [PracticeType.WordBuilding]: string[];
  [PracticeType.Typing]: string;
  [PracticeType.Captcha]: number[];
};

export type PracticeUserSelect = {
  [Type in PracticeType]: { type: Type; value: UserSelectByType[Type] };
}[PracticeType];

export type OnSubmit = (data: {
  isCorrectAnswer: boolean;
  userSelect?: PracticeUserSelect;
}) => void;

export type PracticeResultData = {
  questionsTime: {
    index: number;
    isCorrectAnswer: boolean;
    ms: number;
    userSelect: PracticeUserSelect | null;
  }[];
  questions: PracticeQuestion[];
};

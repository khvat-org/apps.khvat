import { PracticeType } from "@/shared/constants/kana";

interface isAvailablePracticeProps {
  questionsLength: number;

  hiraganaLength: number;
  katakanaLength: number;

  wordsCount: number;
}

export enum AccessibilityError {
  insufficientKanaSelected = "practice.alert.insufficientKanaSelected",
  insufficientWordsAvailable = "practice.alert.insufficientWordsAvailable",

  Available = "available",
}

/**
 * function responsible for the availability of verification in a particular practice
 *
 * The function returns a function object for each practice type,
 * Errors that can be returned (enum) *
 * @example
 * const isAvailable = isAvailablePractice({ questionsLength, hiraganaLength, katakanaLength });
 * isAvailable.isAvailableTesting() // If "true" means available, otherwise false.
 */
export const isAvailablePractice = (data: isAvailablePracticeProps) => {
  const { questionsLength, hiraganaLength, katakanaLength, wordsCount } = data;

  return {
    [PracticeType.Testing]: () => {
      if (hiraganaLength < questionsLength && katakanaLength < questionsLength) {
        return { message: AccessibilityError.insufficientKanaSelected, count: questionsLength };
      }

      return { message: AccessibilityError.Available, count: questionsLength };
    },

    [PracticeType.Drawing]: () => {
      if (hiraganaLength < questionsLength && katakanaLength < questionsLength) {
        return { message: AccessibilityError.insufficientKanaSelected, count: questionsLength };
      }

      return { message: AccessibilityError.Available, count: questionsLength };
    },

    [PracticeType.Listening]: () => {
      if (hiraganaLength < questionsLength && katakanaLength < questionsLength) {
        return { message: AccessibilityError.insufficientKanaSelected, count: questionsLength };
      }

      return { message: AccessibilityError.Available, count: questionsLength };
    },

    [PracticeType.MultipleChoice]: () => {
      if (wordsCount < questionsLength) {
        return { message: AccessibilityError.insufficientWordsAvailable, count: questionsLength };
      }

      return { message: AccessibilityError.Available, count: questionsLength };
    },

    [PracticeType.MatchingPairs]: () => {
      if (wordsCount < questionsLength) {
        return { message: AccessibilityError.insufficientWordsAvailable, count: questionsLength };
      }

      return { message: AccessibilityError.Available, count: questionsLength };
    },

    [PracticeType.WordBuilding]: () => {
      if (wordsCount < questionsLength) {
        return { message: AccessibilityError.insufficientWordsAvailable, count: questionsLength };
      }

      return { message: AccessibilityError.Available, count: questionsLength };
    },

    [PracticeType.Typing]: () => {
      if (hiraganaLength < questionsLength && katakanaLength < questionsLength) {
        return { message: AccessibilityError.insufficientKanaSelected, count: questionsLength };
      }

      return { message: AccessibilityError.Available, count: questionsLength };
    },
  };
};

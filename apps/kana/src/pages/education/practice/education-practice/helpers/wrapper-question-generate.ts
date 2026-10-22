import { ShortLanguage } from "@nihongo/core/shared/constants/language";
import { ILetter, lettersTableById } from "@nihongo/core/shared/data/lettersTable";

import { DEMO_QUESTION } from "../default_data/demo";

import questionGenerateDrawing from "./question-generate-drawing";
import questionGenerateListening from "./question-generate-listening";
import questionGenerateMatchingPairs from "./question-generate-matching-pairs";
import questionGenerateMultipleChoice from "./question-generate-multiple-choice";
import questionGenerateTesting from "./question-generate-testing";
import questionGenerateTyping from "./question-generate-typing";
import questionGenerateWordBuilding from "./question-generate-word-building";

import { composeReference } from "@/features/drawing/lib/hieroglyph-recognition/compose-reference";
import { PracticeQuestion } from "@/pages/education/practice/education-practice/lib/types/questions";
import { Kana, KanaAlphabet, PracticeType } from "@/shared/constants/kana";
import { Word } from "@/shared/data/words";
import { shuffleArray } from "@/shared/helpers/letters";

interface State {
  modes: PracticeType[];
  katakanaLetters: string[];
  hiraganaLetters: string[];
  selectedWords: {
    katakana: Word[];
    hiragana: Word[];
  };
  language: string;
  transliterations: number;
}

function generateWordsKanaTemplate(
  katakana: Word[],
  hiragana: Word[],
  questionsLength: number,
): Kana[] {
  return shuffleArray([
    ...Array(hiragana.length).fill(Kana.Hiragana),
    ...Array(katakana.length).fill(Kana.Katakana),
  ]).slice(0, questionsLength);
}

function generateKanaTemplate(
  availableHiraganaLetters: ILetter[],
  availableKatakanaLetters: ILetter[],
  modes: PracticeType[],
): [Kana, Kana][] {
  const questionsLength = modes.length;
  const pairs: [Kana, Kana][] = [];

  const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const hiraganaCount = availableHiraganaLetters.length;
  const katakanaCount = availableKatakanaLetters.length;

  if (hiraganaCount < questionsLength && katakanaCount < questionsLength) {
    return [];
  }

  const getAvailableDirections = (mode: PracticeType): [Kana, Kana][] => {
    const directions: [Kana, Kana][] = [];

    if (hiraganaCount >= questionsLength) {
      if (mode === PracticeType.Drawing || mode === PracticeType.Typing) {
        directions.push([Kana.Hiragana, Kana.Romaji]);
      } else if (mode === PracticeType.Listening) {
        directions.push([Kana.Romaji, Kana.Hiragana]);
      } else {
        directions.push([Kana.Hiragana, Kana.Romaji]);
        directions.push([Kana.Romaji, Kana.Hiragana]);
      }
    }

    if (katakanaCount >= questionsLength) {
      if (mode === PracticeType.Drawing || mode === PracticeType.Typing) {
        directions.push([Kana.Katakana, Kana.Romaji]);
      } else if (mode === PracticeType.Listening) {
        directions.push([Kana.Romaji, Kana.Katakana]);
      } else {
        directions.push([Kana.Katakana, Kana.Romaji]);
        directions.push([Kana.Romaji, Kana.Katakana]);
      }
    }

    if (
      katakanaCount >= questionsLength &&
      hiraganaCount >= questionsLength &&
      mode === PracticeType.Testing
    ) {
      directions.push([Kana.Katakana, Kana.Hiragana]);
      directions.push([Kana.Hiragana, Kana.Katakana]);
    }

    return directions;
  };

  for (let i = 0; i < questionsLength; i++) {
    const mode = modes[i];
    const availableDirections = getAvailableDirections(mode);

    if (availableDirections.length === 0) {
      return [];
    }

    pairs.push(randomChoice(availableDirections));
  }

  return shuffleArray(pairs);
}

const wrapperQuestionGenerate = ({
  modes,
  katakanaLetters,
  hiraganaLetters,
  selectedWords,
  language,
  transliterations,
}: State) => {
  const questions: PracticeQuestion[] = [];
  const questionsLength = modes.length;

  // * For all modes
  const availableHiraganaLetters: ILetter[] = [];
  const availableKatakanaLetters: ILetter[] = [];

  // * For drawing
  const availableDrawHiraganaLetters: ILetter[] = [];
  const availableDrawKatakanaLetters: ILetter[] = [];

  const addedHiraganaLetters: string[] = [];
  const addedKatakanaLetters: string[] = [];

  const addedKanaWords: string[] = [];

  hiraganaLetters.forEach((item) => {
    const letter = lettersTableById[item];
    availableHiraganaLetters.push(letter);
  });

  katakanaLetters.forEach((item) => {
    const letter = lettersTableById[item];
    availableKatakanaLetters.push(letter);
  });

  // * Drawing
  hiraganaLetters.forEach((item) => {
    const letter = lettersTableById[item];

    if (composeReference(letter.hi, "hiragana")) availableDrawHiraganaLetters.push(letter);
  });

  katakanaLetters.forEach((item) => {
    const letter = lettersTableById[item];
    if (composeReference(letter.ka, "katakana")) availableDrawKatakanaLetters.push(letter);
  });

  const questionKanaTemplate = generateKanaTemplate(
    availableHiraganaLetters,
    availableKatakanaLetters,
    modes,
  );
  const questionWordKanaTemplate = generateWordsKanaTemplate(
    selectedWords.katakana,
    selectedWords.hiragana,
    questionsLength,
  );

  const addLetterInAdded = (questionKana: Kana, letterId: string) => {
    if (questionKana === Kana.Hiragana) addedHiraganaLetters.push(letterId);
    if (questionKana === Kana.Katakana) addedKatakanaLetters.push(letterId);
  };

  for (let i = 0; i < questionsLength; i++) {
    const mode = modes[i];

    // * Test
    if (mode === PracticeType.Testing) {
      const questionKana = questionKanaTemplate[i][0];
      const answersKana = questionKanaTemplate[i][1];

      const question = questionGenerateTesting({
        availableHiraganaLetters: availableHiraganaLetters,
        availableKatakanaLetters: availableKatakanaLetters,
        addedHiraganaLetters: addedHiraganaLetters,
        addedKatakanaLetters: addedKatakanaLetters,
        questionKanaTemplate: [questionKana, answersKana],
      });

      if (question) {
        if (process.env.IS_DEMO === "true") {
          questions.push({ type: mode, [PracticeType.Testing]: DEMO_QUESTION });
        } else {
          addLetterInAdded(Kana.Hiragana, question?.question.id);
          addLetterInAdded(Kana.Katakana, question?.question.id);
          addLetterInAdded(Kana.Romaji, question?.question.id);
          questions.push({ type: mode, [PracticeType.Testing]: question });
        }
      }
    }

    // * Drawing
    if (mode === PracticeType.Drawing) {
      let questionKana = questionKanaTemplate[i][0];

      if (questionKana === Kana.Romaji && questionKanaTemplate[i][1] !== Kana.Romaji) {
        questionKana = questionKanaTemplate[i][1];
      }

      const question = questionGenerateDrawing({
        availableHiraganaLetters: availableDrawHiraganaLetters,
        availableKatakanaLetters: availableDrawKatakanaLetters,
        addedHiraganaLetters: addedHiraganaLetters,
        addedKatakanaLetters: addedKatakanaLetters,
        questionKana: questionKana,
      });

      if (question) {
        addLetterInAdded(questionKana, question?.question.id);
        questions.push({ type: mode, [PracticeType.Drawing]: question });
      }
    }

    // * Audio
    if (mode === PracticeType.Listening) {
      let questionKana = questionKanaTemplate[i][0];
      let answersKana = questionKanaTemplate[i][1];

      if (answersKana === Kana.Romaji && questionKana !== Kana.Romaji) {
        answersKana = questionKana;
        questionKana = Kana.Romaji;
      } else if (answersKana === Kana.Romaji && questionKana === Kana.Romaji) {
        answersKana = Kana.Hiragana;
      }

      const question = questionGenerateListening({
        availableHiraganaLetters: availableHiraganaLetters,
        availableKatakanaLetters: availableKatakanaLetters,
        addedHiraganaLetters: addedHiraganaLetters,
        addedKatakanaLetters: addedKatakanaLetters,
        questionKanaTemplate: [questionKana, answersKana],
      });

      if (question) {
        addLetterInAdded(answersKana, question?.question.id);
        questions.push({ type: mode, [PracticeType.Listening]: question });
      }
    }

    // * Select word
    if (mode === PracticeType.MultipleChoice) {
      const kana = questionWordKanaTemplate[i];

      const question = questionGenerateMultipleChoice({
        addedKanaWords,
        hiraganaWords: selectedWords.hiragana,
        katakanaWords: selectedWords.katakana,
        kana: kana === Kana.Hiragana ? KanaAlphabet.Hiragana : KanaAlphabet.Katakana,
        transliterations,
      });

      if (question) {
        addedKanaWords.push(question.word.kana);
        questions.push({ type: mode, [PracticeType.MultipleChoice]: question });
      }
    }

    // * Matching Pairs
    if (mode === PracticeType.MatchingPairs) {
      const kana = questionWordKanaTemplate[i];

      const question = questionGenerateMatchingPairs({
        hiraganaWords: selectedWords.hiragana,
        katakanaWords: selectedWords.katakana,
        kana: kana === Kana.Hiragana ? Kana.Hiragana : Kana.Katakana,
        lang: language === "ru" ? "ru" : "en",
        transliterations,
      });

      if (question) {
        questions.push({ type: mode, [PracticeType.MatchingPairs]: question });
      }
    }

    // * Word Building
    if (mode === PracticeType.WordBuilding) {
      const kana = questionWordKanaTemplate[i];

      const question = questionGenerateWordBuilding({
        addedKanaWords,
        hiraganaWords: selectedWords.hiragana,
        katakanaWords: selectedWords.katakana,
        kana: kana === Kana.Hiragana ? Kana.Hiragana : Kana.Katakana,
        lang: language === "ru" ? "ru" : "en",
        transliterations: transliterations,
      });

      if (question) {
        addedKanaWords.push(question.word.kana);
        questions.push({ type: mode, [PracticeType.WordBuilding]: question.question });
      }
    }

    // * Typing
    if (mode === PracticeType.Typing) {
      let questionKana = questionKanaTemplate[i][0];

      if (questionKana === Kana.Romaji && questionKanaTemplate[i][1] !== Kana.Romaji) {
        questionKana = questionKanaTemplate[i][1];
      }

      const question = questionGenerateTyping({
        availableHiraganaLetters: availableHiraganaLetters,
        availableKatakanaLetters: availableKatakanaLetters,
        addedHiraganaLetters: addedHiraganaLetters,
        addedKatakanaLetters: addedKatakanaLetters,
        questionKana: questionKana,

        language: ShortLanguage.EN,
      });

      if (question) {
        addLetterInAdded(questionKana, question?.question.id);
        questions.push({ type: mode, [PracticeType.Typing]: question });
      }
    }
  }

  return {
    questions,
  };
};

export default wrapperQuestionGenerate;

import { base, ILetter } from "@nihongo/core/shared/data/lettersTable";

import { CaptchaPack } from "@/features/captcha/model/captcha-fonts";
import {
  CaptchaTile,
  Maybe,
  PracticeQuestion,
} from "@/pages/education/practice/education-practice/lib/types/questions";
import { Kana, PracticeType } from "@/shared/constants/kana";
import { shuffleArray } from "@/shared/helpers/letters";

const TILES_COUNT = 9;
const CORRECT_MIN = 2;
const CORRECT_MAX = 4;

const CONFUSABLE_GROUPS = [
  "シツ",
  "ソン",
  "クケタ",
  "ウワフ",
  "ナメノ",
  "コユ",
  "チテ",
  "マム",
  "ヌス",
  "さちき",
  "ねれわ",
  "めぬ",
  "るろ",
  "はほ",
  "まも",
  "いり",
  "あお",
];

type TileKana = Kana.Hiragana | Kana.Katakana;
type Option = { letter: ILetter; kana: TileKana };

interface Props {
  hiraganaLetters: ILetter[];
  katakanaLetters: ILetter[];
  addedLetters: string[];
  packs: CaptchaPack[];
  transliterations: number;
}

const textOf = ({ letter, kana }: Option) => (kana === Kana.Hiragana ? letter.hi : letter.ka);

const baseChar = (text: string) => [...text][0].normalize("NFD")[0];

const isYoon = (text: string) => [...text].length > 1;

const isConfusable = (first: string, second: string) => {
  const a = baseChar(first);
  const b = baseChar(second);

  return a === b || CONFUSABLE_GROUPS.some((group) => group.includes(a) && group.includes(b));
};

const orderDistractors = (options: Option[], target: Option[]) => {
  const targetTexts = target.map(textOf);
  const similar = options.filter((option) =>
    targetTexts.some((text) => isConfusable(textOf(option), text)),
  );
  const sameShape = options.filter(
    (option) =>
      !similar.includes(option) &&
      targetTexts.some((text) => isYoon(text) === isYoon(textOf(option))),
  );
  const rest = options.filter((option) => !similar.includes(option) && !sameShape.includes(option));

  return [...shuffleArray(similar), ...shuffleArray(sameShape), ...shuffleArray(rest)];
};

const questionGenerateCaptcha = ({
  hiraganaLetters,
  katakanaLetters,
  addedLetters,
  packs,
  transliterations,
}: Props): Maybe<PracticeQuestion[PracticeType.Captcha]> => {
  if (packs.length === 0) return null;

  const options: Option[] = [
    ...hiraganaLetters.map((letter): Option => ({ letter, kana: Kana.Hiragana })),
    ...katakanaLetters.map((letter): Option => ({ letter, kana: Kana.Katakana })),
  ];

  const candidates = options.filter(({ letter }) => !addedLetters.includes(letter.id));
  if (candidates.length === 0) return null;

  const question = candidates[Math.floor(Math.random() * candidates.length)].letter;
  const romaji = question.transliterations[transliterations];

  const correctOptions = options.filter(({ letter }) => letter.id === question.id);
  const isDistractor = ({ letter }: Option) =>
    letter.id !== question.id && letter.transliterations[transliterations] !== romaji;

  const usedTiles = new Set<string>();

  const makeTile = (option: Option, isCorrect: boolean): CaptchaTile | null => {
    const text = textOf(option);

    for (const pack of shuffleArray(packs)) {
      const key = `${text}:${pack.font}`;
      const path = pack.glyphs[text];

      if (path && !usedTiles.has(key)) {
        usedTiles.add(key);
        return {
          letter: option.letter,
          kana: option.kana,
          text,
          font: pack.font,
          path,
          viewBox: pack.viewBox,
          isCorrect,
        };
      }
    }

    return null;
  };

  const tiles: CaptchaTile[] = [];

  const addTile = (option: Option, isCorrect: boolean) => {
    const tile = makeTile(option, isCorrect);
    if (tile) tiles.push(tile);
  };

  const correctCount = CORRECT_MIN + Math.floor(Math.random() * (CORRECT_MAX - CORRECT_MIN + 1));
  for (let index = 0; index < correctCount; index++) {
    addTile(correctOptions[index % correctOptions.length], true);
  }

  const fallback = base
    .flat()
    .flatMap((letter): Option[] => [
      { letter, kana: Kana.Hiragana },
      { letter, kana: Kana.Katakana },
    ])
    .filter(({ kana }) => correctOptions.some((option) => option.kana === kana));

  const queue = [
    ...orderDistractors(options.filter(isDistractor), correctOptions),
    ...orderDistractors(options.filter(isDistractor), correctOptions),
    ...shuffleArray(fallback.filter(isDistractor)),
  ];

  for (const option of queue) {
    if (tiles.length === TILES_COUNT) break;
    addTile(option, false);
  }

  if (tiles.length !== TILES_COUNT) return null;

  return { question, tiles: shuffleArray(tiles) };
};

export default questionGenerateCaptcha;

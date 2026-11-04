export enum PracticeType {
  Testing = "testing",
  Drawing = "drawing",
  Listening = "listening",
  MultipleChoice = "multipleChoice",
  MatchingPairs = "matchingPairs",
  WordBuilding = "wordBuilding",
  Typing = "typing",
  Captcha = "captcha",
}

export const MIX_PRACTICE_TYPES = Object.values(PracticeType).filter(
  (type) => type !== PracticeType.Captcha,
);

export enum Kana {
  Hiragana = "Hiragana",
  Katakana = "Katakana",
  Romaji = "Romaji",
}

export enum KanaAlphabet {
  Hiragana = "hiragana",
  Katakana = "katakana",
}

export enum KanaSection {
  BasicHiragana = "BasicHiragana",
  BasicKatakana = "BasicKatakana",
  DakuonHiragana = "DakuonHiragana",
  DakuonKatakana = "DakuonKatakana",
  HandakuonHiragana = "HandakuonHiragana",
  HandakuonKatakana = "HandakuonKatakana",
  YoonHiragana = "YoonHiragana",
  YoonKatakana = "YoonKatakana",
}

export const LETTERS_COUNT = {
  [KanaAlphabet.Hiragana]: 107,
  [KanaAlphabet.Katakana]: 107,

  [KanaSection.BasicHiragana]: 46,
  [KanaSection.BasicKatakana]: 46,

  basic: 46,

  [KanaSection.DakuonHiragana]: 20,
  [KanaSection.DakuonKatakana]: 20,

  dakuon: 20,

  [KanaSection.HandakuonHiragana]: 5,
  [KanaSection.HandakuonKatakana]: 5,

  handakuon: 5,

  [KanaSection.YoonHiragana]: 36,
  [KanaSection.YoonKatakana]: 36,

  yoon: 36,
};

export const TEST_DELAY = process.env.IS_DEMO === "true" ? 10000 : 400;

export type Alphabet = "base" | "dakuon" | "handakuon" | "yoon";

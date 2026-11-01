import {
  base,
  dakuon,
  dakuonFlatLettersId,
  handakuon,
  handakuonFlatLettersId,
  ILetter,
  yoon,
  yoonFlatLettersId,
} from "@nihongo/core/shared/data/lettersTable";

export const getTypeById = (id: string) => {
  if (handakuonFlatLettersId.includes(id)) return "kana.handakuon";
  if (yoonFlatLettersId.includes(id)) return "kana.yoon";
  if (dakuonFlatLettersId.includes(id)) return "kana.dakuon";

  return "kana.basic";
};

export const getRowLabel = (romaji: string) =>
  (romaji.length < 3 ? romaji[0] : romaji[0] + romaji[1]) + "-";

export const getColumnLabel = (romaji: string) =>
  "-" + (romaji.length === 2 ? romaji[1] : romaji.length === 1 ? romaji[0] : romaji[2]);

const BASE_CHAR_OFFSETS = [0, 1, 2];

export const getBaseRowFirstLetter = (letter: ILetter): ILetter | undefined => {
  const code = letter.hi.charCodeAt(0);

  for (const offset of BASE_CHAR_OFFSETS) {
    const char = String.fromCharCode(code - offset);
    const row = base.find((items) => items.some((item) => item.hi === char));
    if (row) return row[0];
  }

  return undefined;
};

export const getRowFirstLetterById = (id: string): ILetter | undefined =>
  [base, dakuon, handakuon, yoon].flat().find((row) => row.some((letter) => letter.id === id))?.[0];

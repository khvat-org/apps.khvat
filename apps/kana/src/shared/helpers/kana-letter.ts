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

export const getRowFirstLetterById = (id: string): ILetter | undefined =>
  [base, dakuon, handakuon, yoon].flat().find((row) => row.some((letter) => letter.id === id))?.[0];

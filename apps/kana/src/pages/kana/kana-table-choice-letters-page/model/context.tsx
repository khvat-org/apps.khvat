import React, { createContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";

import { SELECTED_KANA } from "@nihongo/core/shared/constants/storageKeys";
import { useRegisterEraseSource } from "@nihongo/core/shared/contexts/erase-data/erase-data-context";
import {
  baseFlatLettersId,
  dakuonFlatLettersId,
  handakuonFlatLettersId,
  yoonFlatLettersId,
  lettersTableById,
} from "@nihongo/core/shared/data/lettersTable";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { KanaSection } from "@/shared/constants/kana";
import { words, Word } from "@/shared/data/words";
import { findWordsFromArray } from "@/shared/helpers/word";
import { mergeWordsByKana } from "@/shared/helpers/words";

const uniqueWords = mergeWordsByKana(words);

export type Selected = {
  base: { katakana: string[]; hiragana: string[] };
  dakuon: { katakana: string[]; hiragana: string[] };
  handakuon: { katakana: string[]; hiragana: string[] };
  yoon: { katakana: string[]; hiragana: string[] };
};

export interface KanaContextType {
  selected: Selected;
  selectedWords: { katakana: Word[]; hiragana: Word[] };
  selectedLettersHiragana: number;
  selectedLettersKatakana: number;
  selectedLetters: number;
  fill: (ids: string[], key: KanaSection) => void;
  resetKanaSelected: () => void;
  replaceSelected: (value: Selected) => void;
}

const initialSelected: Selected = {
  base: { katakana: [...baseFlatLettersId], hiragana: [...baseFlatLettersId] },
  dakuon: { katakana: [...dakuonFlatLettersId], hiragana: [...dakuonFlatLettersId] },
  handakuon: { katakana: [...handakuonFlatLettersId], hiragana: [...handakuonFlatLettersId] },
  yoon: { katakana: [...yoonFlatLettersId], hiragana: [...yoonFlatLettersId] },
};

const KanaContext = createContext<KanaContextType | null>(null);

const save = (next: Selected) => {
  AsyncStorage.setItem(SELECTED_KANA, JSON.stringify({ selected: next }));
};

export const KanaProvider = ({ children }: { children: ReactNode }) => {
  const [selected, setSelected] = useState<Selected>(initialSelected);

  useEffect(() => {
    const restore = async () => {
      try {
        const raw = await AsyncStorage.getItem(SELECTED_KANA);
        if (raw) {
          const obj = JSON.parse(raw);

          setSelected(obj.selected ?? obj);
        }
      } catch {
        console.log("restore error");
      }
    };

    restore();
  }, []);

  const fill = useCallback((ids: string[], key: KanaSection) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (key === KanaSection.BasicHiragana) next.base = { ...next.base, hiragana: ids };
      else if (key === KanaSection.BasicKatakana) next.base = { ...next.base, katakana: ids };
      else if (key === KanaSection.DakuonHiragana) next.dakuon = { ...next.dakuon, hiragana: ids };
      else if (key === KanaSection.DakuonKatakana) next.dakuon = { ...next.dakuon, katakana: ids };
      else if (key === KanaSection.HandakuonHiragana)
        next.handakuon = { ...next.handakuon, hiragana: ids };
      else if (key === KanaSection.HandakuonKatakana)
        next.handakuon = { ...next.handakuon, katakana: ids };
      else if (key === KanaSection.YoonHiragana) next.yoon = { ...next.yoon, hiragana: ids };
      else if (key === KanaSection.YoonKatakana) next.yoon = { ...next.yoon, katakana: ids };
      save(next);
      return next;
    });
  }, []);

  const resetKanaSelected = useCallback(() => {
    const next: Selected = {
      base: { katakana: [], hiragana: [] },
      dakuon: { katakana: [], hiragana: [] },
      handakuon: { katakana: [], hiragana: [] },
      yoon: { katakana: [], hiragana: [] },
    };
    setSelected(next);
    save(next);
  }, []);

  const replaceSelected = useCallback((value: Selected) => {
    setSelected(value);
    save(value);
  }, []);

  const selectedLettersHiragana = useMemo(
    () => Object.values(selected).reduce((sum, group) => sum + group.hiragana.length, 0),
    [selected],
  );

  const selectedLettersKatakana = useMemo(
    () => Object.values(selected).reduce((sum, group) => sum + group.katakana.length, 0),
    [selected],
  );

  const selectedLetters = selectedLettersHiragana + selectedLettersKatakana;

  const selectedWords = useMemo(() => {
    const getLetters = (type: "katakana" | "hiragana") =>
      Object.values(selected)
        .flatMap((group) => group[type])
        .map((id) => lettersTableById[id]?.[type === "katakana" ? "ka" : "hi"]);

    return {
      katakana: findWordsFromArray(uniqueWords, getLetters("katakana")),
      hiragana: findWordsFromArray(uniqueWords, getLetters("hiragana")),
    };
  }, [selected]);

  const dataSize = useMemo(
    () => new Blob([JSON.stringify({ selected, selectedWords })]).size,
    [selected, selectedWords],
  );

  useRegisterEraseSource({
    clear: async () => {
      setSelected(initialSelected);
      await AsyncStorage.removeItem(SELECTED_KANA);
    },
    getSize: () => dataSize,
  });

  const value = useMemo(
    () => ({
      selected,
      selectedWords,
      selectedLettersHiragana,
      selectedLettersKatakana,
      selectedLetters,
      fill,
      resetKanaSelected,
      replaceSelected,
    }),
    [
      selected,
      selectedWords,
      selectedLettersHiragana,
      selectedLettersKatakana,
      selectedLetters,
      fill,
      resetKanaSelected,
      replaceSelected,
    ],
  );

  return <KanaContext.Provider value={value}>{children}</KanaContext.Provider>;
};

export { KanaContext };

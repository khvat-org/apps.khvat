import React, {
  createContext,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
  FunctionComponent,
} from "react";

import { BOARD_BOOKMARKS_PREFIX } from "@nihongo/core/shared/constants/storageKeys";
import { removeFurigana } from "@nihongo/core/shared/lib/furigana/remove-furigana";
import { replaceKanjiWithFurigana } from "@nihongo/core/shared/lib/furigana/replace-kanji-with-furigana";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useWindowDimensions } from "react-native";

import { getBoardMeta } from "@/shared/api/board-settings";
import { applyCardFields, BoardLesson, Card, CardFields, getCards } from "@/shared/api/get-cards";
import {
  BoardPreference,
  defaultPreference,
  getColumnsCount,
  loadPreference,
  savePreference,
} from "@/shared/contexts/board/board-preference";

export interface BoardSection {
  title: string;
  data: Card[][];
  // * null — секция результатов поиска или сохранённых, её нельзя перемешать
  lessonId: number | null;
  isShuffled: boolean;
  isBookmarks: boolean;
}

export interface BoardSearchResult {
  lessons: { title: string; sectionIndex: number }[];
  cards: Card[];
}

interface BoardContextType {
  boardId: string | null;
  isLoading: boolean;
  canEdit: boolean;
  loadBoard: (id: string) => Promise<void>;
  patchCard: (cardId: string, fields: CardFields) => void;
  toggleShuffle: (lessonId: number) => void;

  bookmarks: Set<string>;
  toggleBookmark: (cardId: string) => void;
  isBookmarksMode: boolean;
  openBookmarks: () => void;
  closeBookmarks: () => void;

  sections: BoardSection[];
  cards: Card[];
  hasQuery: boolean;
  findInBoard: (query: string) => BoardSearchResult;

  preference: BoardPreference;
  setPreference: (patch: Partial<BoardPreference>) => void;
  columnsCount: number;

  query: string;
  setQuery: (query: string) => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  currentCard: Card | null;
  selectCard: (card: Card) => void;
  next: () => void;
  prev: () => void;
  hasNext: boolean;
  hasPrev: boolean;

  registerScrollToSection: (handler: (sectionIndex: number) => void) => void;
  scrollToSection: (sectionIndex: number) => void;
}

const BoardContext = createContext<BoardContextType | null>(null);

const SEARCH_LESSONS_LIMIT = 50;
const SEARCH_CARDS_LIMIT = 100;

const chunk = (cards: Card[], size: number): Card[][] =>
  cards.reduce<Card[][]>((result, card, index) => {
    if (index % size === 0) {
      result.push([]);
    }

    result[result.length - 1].push(card);
    return result;
  }, []);

const shuffle = <T,>(items: T[]): T[] => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

// * Все варианты написания одной строки: как есть (来(く)る), только кандзи (来る), только чтение (くる)
const spellings = (text: string) => [text, removeFurigana(text), replaceKanjiWithFurigana(text)];

// * Одна строка на карточку, по которой идёт поиск: title/subtitle в трёх написаниях,
// * теги, примеры и все формы глагола
const buildHaystack = (card: Card) =>
  [
    ...spellings(card.title),
    ...spellings(card.subtitle),
    ...card.tags.map((tag) => tag.label),
    ...card.examples,
    ...card.verbForms.flatMap((form) => spellings(form.value)),
  ]
    .join(" ")
    .toLowerCase();

interface BoardProviderProps {
  children: ReactNode;
}

export const BoardProvider: FunctionComponent<BoardProviderProps> = ({ children }) => {
  const { t } = useTranslation();

  const { width } = useWindowDimensions();

  const [lessons, setLessons] = useState<BoardLesson[]>([]);
  const [boardId, setBoardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [currentCardId, setCurrentCardId] = useState<string | null>(null);

  // * Порядок карточек (id) в перемешанных уроках; нет записи — исходный порядок
  const [shuffledOrder, setShuffledOrder] = useState<Record<number, string[]>>({});

  // * Прошлая перемешка урока — новая не должна с ней совпасть
  const lastShuffleRef = useRef<Record<number, string>>({});

  // * Сохранённые карточки (id) — свои у каждой доски, хранятся на устройстве
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  // * Снимок сохранённых на момент открытия раздела: если убрать карточку из сохранённых,
  // * она не пропадёт из списка, по которому сейчас листают вперёд/назад
  const [bookmarksView, setBookmarksView] = useState<Set<string> | null>(null);
  const isBookmarksMode = bookmarksView !== null;

  const [preference, setPreferenceState] = useState<BoardPreference>(defaultPreference);

  useEffect(() => {
    loadPreference().then(setPreferenceState);
  }, []);

  const setPreference = useCallback((patch: Partial<BoardPreference>) => {
    setPreferenceState((prev) => {
      const next = { ...prev, ...patch };

      savePreference(next);
      return next;
    });
  }, []);

  const columnsCount = getColumnsCount(preference.columns, width);

  const deferredQuery = useDeferredValue(query);
  const search = deferredQuery.trim().toLowerCase();

  const loadBoard = useCallback(async (id: string) => {
    setIsLoading(true);
    setBoardId(id);
    setCanEdit(false);
    setShuffledOrder({});
    lastShuffleRef.current = {};
    setBookmarksView(null);
    setBookmarks(new Set());

    AsyncStorage.getItem(`${BOARD_BOOKMARKS_PREFIX}${id}`)
      .then((raw) => {
        const ids: unknown = JSON.parse(raw ?? "[]");

        if (Array.isArray(ids)) setBookmarks(new Set(ids.map(String)));
      })
      .catch(() => {});

    try {
      setLessons(await getCards(id));

      const meta = await getBoardMeta(id).catch(() => null);

      setCanEdit(Boolean(meta?.isOwner || meta?.isEditor));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // * Обновляем карточку на месте, чтобы не перезагружать всю доску после редактирования
  const patchCard = useCallback((cardId: string, fields: CardFields) => {
    setLessons((prev) =>
      prev.map((lesson) => ({
        ...lesson,
        cards: lesson.cards.map((card) =>
          card.id === cardId ? applyCardFields(card, fields) : card,
        ),
      })),
    );
  }, []);

  const toggleBookmark = useCallback(
    (cardId: string) => {
      setBookmarks((prev) => {
        const next = new Set(prev);

        if (next.has(cardId)) next.delete(cardId);
        else next.add(cardId);

        if (boardId) {
          AsyncStorage.setItem(`${BOARD_BOOKMARKS_PREFIX}${boardId}`, JSON.stringify([...next])).catch(
            () => {},
          );
        }

        return next;
      });
    },
    [boardId],
  );

  const openBookmarks = useCallback(() => setBookmarksView(bookmarks), [bookmarks]);
  const closeBookmarks = useCallback(() => setBookmarksView(null), []);

  const toggleShuffle = useCallback(
    (lessonId: number) => {
      if (shuffledOrder[lessonId]) {
        const { [lessonId]: _, ...rest } = shuffledOrder;
        setShuffledOrder(rest);
        return;
      }

      const lesson = lessons.find((item) => item.id === lessonId);

      if (!lesson) return;

      const ids = lesson.cards.map((card) => card.id);
      const banned = new Set([ids.join(), lastShuffleRef.current[lessonId]]);

      let order = shuffle(ids);

      // * У 2–3 карточек вариантов мало, поэтому пробуем ограниченное число раз
      for (let attempt = 0; attempt < 10 && banned.has(order.join()); attempt++) {
        order = shuffle(ids);
      }

      lastShuffleRef.current[lessonId] = order.join();
      setShuffledOrder({ ...shuffledOrder, [lessonId]: order });
    },
    [lessons, shuffledOrder],
  );

  const orderedLessons = useMemo(
    () =>
      lessons.map((lesson) => {
        const order = shuffledOrder[lesson.id];

        if (!order) return lesson;

        const byId = new Map(lesson.cards.map((card) => [card.id, card]));

        return {
          ...lesson,
          cards: order.map((id) => byId.get(id)).filter((card): card is Card => Boolean(card)),
        };
      }),
    [lessons, shuffledOrder],
  );

  const haystacks = useMemo(() => {
    const map = new Map<string, string>();

    for (const lesson of lessons) {
      for (const card of lesson.cards) {
        map.set(card.id, buildHaystack(card));
      }
    }

    return map;
  }, [lessons]);

  const filteredLessons = useMemo(() => {
    if (!search && !isBookmarksMode) return orderedLessons;

    return orderedLessons
      .map((lesson) => ({
        ...lesson,
        cards: lesson.cards.filter(
          (card) =>
            (!bookmarksView || bookmarksView.has(card.id)) &&
            (!search || haystacks.get(card.id)?.includes(search)),
        ),
      }))
      .filter((lesson) => lesson.cards.length > 0);
  }, [orderedLessons, haystacks, search, isBookmarksMode, bookmarksView]);

  const cards = useMemo(() => filteredLessons.flatMap((lesson) => lesson.cards), [filteredLessons]);

  // * Подсказки в поиске до нажатия Enter: уроки по названию и карточки по тексту
  const findInBoard = useCallback(
    (text: string): BoardSearchResult => {
      const q = text.trim().toLowerCase();

      if (!q) return { lessons: [], cards: [] };

      const foundLessons = lessons
        .map((lesson, sectionIndex) => ({ title: lesson.title, sectionIndex }))
        .filter((lesson) => lesson.title.toLowerCase().includes(q))
        .slice(0, SEARCH_LESSONS_LIMIT);

      const foundCards: Card[] = [];

      for (const lesson of lessons) {
        for (const card of lesson.cards) {
          if (foundCards.length >= SEARCH_CARDS_LIMIT) break;
          if (haystacks.get(card.id)?.includes(q)) foundCards.push(card);
        }
      }

      return { lessons: foundLessons, cards: foundCards };
    },
    [lessons, haystacks],
  );

  const sections = useMemo(() => {
    // * Секция сохранённых есть, даже когда пустая: в её шапке кнопка выхода
    if (isBookmarksMode) {
      return [
        {
          title: t("board.bookmarks"),
          data: chunk(cards, columnsCount),
          lessonId: null,
          isShuffled: false,
          isBookmarks: true,
        },
      ];
    }

    if (search) {
      return cards.length > 0
        ? [
            {
              title: t("board.searchResults"),
              data: chunk(cards, columnsCount),
              lessonId: null,
              isShuffled: false,
              isBookmarks: false,
            },
          ]
        : [];
    }

    return filteredLessons.map((lesson) => ({
      title: lesson.title,
      data: chunk(lesson.cards, columnsCount),
      lessonId: lesson.id,
      isShuffled: Boolean(shuffledOrder[lesson.id]),
      isBookmarks: false,
    }));
  }, [search, isBookmarksMode, filteredLessons, cards, t, columnsCount, shuffledOrder]);

  const cardsRef = useRef<Card[]>(cards);
  cardsRef.current = cards;

  const currentIndex = useMemo(
    () => cards.findIndex((card) => card.id === currentCardId),
    [cards, currentCardId],
  );

  const selectCard = useCallback((card: Card) => setCurrentCardId(card.id), []);

  const step = useCallback((offset: number) => {
    setCurrentCardId((id) => {
      const list = cardsRef.current;
      const index = list.findIndex((card) => card.id === id);
      const target = index + offset;

      return index === -1 || target < 0 || target > list.length - 1 ? id : list[target].id;
    });
  }, []);

  const next = useCallback(() => step(1), [step]);
  const prev = useCallback(() => step(-1), [step]);

  const scrollHandlerRef = useRef<(sectionIndex: number) => void>(() => {});

  const registerScrollToSection = useCallback((handler: (sectionIndex: number) => void) => {
    scrollHandlerRef.current = handler;
  }, []);

  const scrollToSection = useCallback(
    (sectionIndex: number) => scrollHandlerRef.current(sectionIndex),
    [],
  );

  const openSearch = useCallback(() => setIsSearchOpen(true), []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setQuery("");
  }, []);

  const value = useMemo(
    () => ({
      boardId,
      isLoading,
      canEdit,
      loadBoard,
      patchCard,
      toggleShuffle,

      bookmarks,
      toggleBookmark,
      isBookmarksMode,
      openBookmarks,
      closeBookmarks,

      sections,
      cards,
      hasQuery: search.length > 0,
      findInBoard,

      preference,
      setPreference,
      columnsCount,

      query,
      setQuery,
      isSearchOpen,
      openSearch,
      closeSearch,

      currentCard: currentIndex === -1 ? null : cards[currentIndex],
      selectCard,
      next,
      prev,
      hasPrev: currentIndex > 0,
      hasNext: currentIndex !== -1 && currentIndex < cards.length - 1,

      registerScrollToSection,
      scrollToSection,
    }),
    [
      boardId,
      isLoading,
      canEdit,
      loadBoard,
      patchCard,
      toggleShuffle,
      bookmarks,
      toggleBookmark,
      isBookmarksMode,
      openBookmarks,
      closeBookmarks,
      sections,
      cards,
      search,
      findInBoard,
      preference,
      setPreference,
      columnsCount,
      query,
      isSearchOpen,
      openSearch,
      closeSearch,
      currentIndex,
      selectCard,
      next,
      prev,
      registerScrollToSection,
      scrollToSection,
    ],
  );

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};

export const useBoard = () => {
  const context = useContext(BoardContext);

  if (!context) throw new Error("useBoard must be used within BoardProvider");

  return context;
};

import { memoboardFetch } from "@/shared/api/memoboard-fetch";
import getVerbForm, { VerbForm } from "@/shared/helpers/verb/get-verb-form";
import { TagColor } from "@/shared/ui/card-tag/tag-colors";

export function removeFurigana(text: string) {
  return text.replace(/\([^)]+\)/g, "");
}

export function replaceKanjiWithFurigana(text: string) {
  return text.replace(/([一-龯]+)\(([^)]+)\)/g, "$2");
}

interface ResponseLesson {
  t: string; // * Title
  g: string[]; // * Tags
  c: {
    id: string; // * Unique card id
    t: string; // * Title
    s: string; // * Subtitle
    g: string; // * Tags
    e: string[] | null; // * Examples
    i: string[] | null; // * Images
  }[]; // * Cards
}

export interface CardTag {
  label: string;
  color: TagColor;
}

export interface Card {
  id: string;
  title: string;
  subtitle: string;
  tags: CardTag[];
  examples: string[];
  index: number;

  images: string[] | null;

  // Lesson info
  lessonTitle: string;
  lessonId: number;

  // Additional fields
  titleWithoutFurigana: string;
  titleWithFurigana: string;

  subtitleNoFurigana: string;
  subtitleFurigana: string;

  // * Пусто для всего, что не глагол I/II/III группы
  verbForms: VerbForm[];
}

export interface BoardLesson {
  title: string;
  id: number;
  cards: Card[];
}

export interface CardFields {
  title: string;
  subtitle: string;
  examples: string[];
}

export const applyCardFields = (card: Card, fields: CardFields): Card => ({
  ...card,
  ...fields,

  titleWithoutFurigana: removeFurigana(fields.title),
  titleWithFurigana: replaceKanjiWithFurigana(fields.title),

  subtitleNoFurigana: removeFurigana(fields.subtitle),
  subtitleFurigana: replaceKanjiWithFurigana(fields.subtitle),

  verbForms: getVerbForm({ tags: card.tags.map((tag) => tag.label), title: fields.title }),
});

function decodeBitset(base64: string, tagsDictionary: string[]): string[] {
  if (!base64) {
    return [];
  }

  const bitset = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const tags: string[] = [];

  for (let i = 0; i < tagsDictionary.length && i < 56; i++) {
    const byteIdx = Math.floor(i / 8);
    const bitIdx = i % 8;
    if (bitset[byteIdx] & (1 << bitIdx)) {
      tags.push(tagsDictionary[i]);
    }
  }

  return tags;
}

const colors: TagColor[] = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];

const savedColors: { [key: string]: TagColor } = {
  i: "gold",
  ii: "gold",
  iii: "gold",

  な: "cyan",
  い: "cyan",

  "прил.": "blue",
  глагол: "magenta",
};

// * Новый тег получает следующий цвет по кругу, повторный — тот же, что и в первый раз
const getColors = () => {
  let nextIndex = colors.length - 1;

  return (name: string): TagColor => {
    name = name.toLowerCase();

    if (!savedColors[name]) {
      savedColors[name] = colors[nextIndex];
      nextIndex = (nextIndex + 1) % colors.length;
    }

    return savedColors[name];
  };
};
const colorUtil = getColors();

const count = () => {
  let counter = 0;

  return () => {
    const oldCount = counter;
    counter++;

    return oldCount;
  };
};

export const getCards = async (id: string): Promise<BoardLesson[]> => {
  const response = await memoboardFetch(`/api/board/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  const lessons: ResponseLesson[] = await response.json();
  const index = count();

  return lessons.map((lesson, i) => ({
    title: lesson.t,
    id: i,
    cards: lesson.c.map((card) => {
      const tags = decodeBitset(card.g, lesson.g).map((item) => item.toLowerCase());

      return {
        id: card.id,
        title: card.t,
        subtitle: card.s,
        tags: tags.map((label) => ({ label, color: colorUtil(label) })),
        examples: card.e || [],
        index: index(),

        lessonTitle: lesson.t,
        lessonId: i,

        images: card.i,

        titleWithoutFurigana: removeFurigana(card.t),
        titleWithFurigana: replaceKanjiWithFurigana(card.t),

        subtitleNoFurigana: removeFurigana(card.s),
        subtitleFurigana: replaceKanjiWithFurigana(card.s),

        verbForms: getVerbForm({ tags, title: card.t }),
      };
    }),
  }));
};

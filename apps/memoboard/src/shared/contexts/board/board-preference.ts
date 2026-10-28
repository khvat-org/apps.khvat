import { BOARD_PREFERENCE } from "@nihongo/core/shared/constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";

export enum CardMode {
  Japan = "japan",
  // * Слово и перевод, без фуриганы
  NoFurigana = "noFurigana",
  Both = "both",
  Translate = "translate",
}

export type Columns = 2 | 3;

export interface BoardPreference {
  mode: CardMode;
  showTags: boolean;
  // * Картинка в шапке открытой карточки
  showImages: boolean;
  // * На телефоне — ровно столько карточек в ряд, на планшете — крупные/мелкие карточки
  columns: Columns;
}

export const defaultPreference: BoardPreference = {
  mode: CardMode.Both,
  showTags: true,
  showImages: true,
  columns: 3,
};

const TABLET_MIN_WIDTH = 600;

// * Минимальная ширина карточки на планшете для "2" (крупные) и "3" (мелкие)
const TABLET_CARD_MIN_WIDTH: Record<Columns, number> = { 2: 180, 3: 120 };

export const getColumnsCount = (columns: Columns, width: number) => {
  if (width < TABLET_MIN_WIDTH) return columns;

  return Math.max(columns, Math.floor(width / TABLET_CARD_MIN_WIDTH[columns]));
};

const isCardMode = (value: unknown): value is CardMode =>
  Object.values(CardMode).includes(value as CardMode);

export const loadPreference = async (): Promise<BoardPreference> => {
  try {
    const raw = JSON.parse((await AsyncStorage.getItem(BOARD_PREFERENCE)) ?? "{}");
    const stored: Partial<BoardPreference> = {};

    if (isCardMode(raw.mode)) stored.mode = raw.mode;
    if (typeof raw.showTags === "boolean") stored.showTags = raw.showTags;
    if (typeof raw.showImages === "boolean") stored.showImages = raw.showImages;
    if (raw.columns === 2 || raw.columns === 3) stored.columns = raw.columns;

    return { ...defaultPreference, ...stored };
  } catch {
    return defaultPreference;
  }
};

export const savePreference = (preference: BoardPreference) =>
  AsyncStorage.setItem(BOARD_PREFERENCE, JSON.stringify(preference)).catch(() => {});

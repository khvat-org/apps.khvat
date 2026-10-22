import { dakuon, handakuon, yoon } from "@nihongo/core/shared/data/lettersTable";

import { normalizeCoordinates } from "./coordinates";
import Recognizer from "./recognizer";
import { kanaMarks, kanaReferences } from "./references";
import { kanaTemplates } from "./templates";

type Strokes = number[][][];

type Box = { minX: number; minY: number; maxX: number; maxY: number };

export type ReferenceKana = keyof typeof kanaReferences;

const DAKUTEN = "゙";
const HANDAKUTEN = "゚";

const VARIANT_SUFFIX = /v\d+$/;

const YOON_BOX: Box = { minX: 0.06, minY: 0.3, maxX: 0.48, maxY: 0.76 };

export const getBox = (strokes: Strokes): Box => {
  const points = strokes.flat();
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);

  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  };
};

const transform = (strokes: Strokes, scale: number, dx: number, dy: number): Strokes =>
  strokes.map((stroke) => stroke.map(([x, y]) => [x * scale + dx, y * scale + dy]));

const MARK_GAP = 0.02;
const MARK_STEP = 0.005;
const MARK_MAX_SHIFT = 0.1;

const segmentDistance = (point: number[], a: number[], b: number[]) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length = dx * dx + dy * dy;
  const t = length
    ? Math.max(0, Math.min(1, ((point[0] - a[0]) * dx + (point[1] - a[1]) * dy) / length))
    : 0;

  return Math.hypot(point[0] - (a[0] + t * dx), point[1] - (a[1] + t * dy));
};

const densify = (stroke: number[][], parts = 4) =>
  stroke.flatMap((point, index) => {
    if (index === 0) return [point];
    const prev = stroke[index - 1];

    return Array.from({ length: parts }, (_, part) => {
      const t = (part + 1) / parts;
      return [prev[0] + (point[0] - prev[0]) * t, prev[1] + (point[1] - prev[1]) * t];
    });
  });

const gapBetween = (base: Strokes, mark: Strokes) => {
  let gap = Infinity;

  for (const point of mark.flatMap((stroke) => densify(stroke))) {
    for (const stroke of base) {
      for (let index = 1; index < stroke.length; index++) {
        gap = Math.min(gap, segmentDistance(point, stroke[index - 1], stroke[index]));
      }
    }
  }

  return gap;
};

const addMark = (base: Strokes, mark: (typeof kanaMarks)[keyof typeof kanaMarks]): Strokes => {
  const anchor = getBox(kanaReferences.katakana[mark.source]);
  const box = getBox(base);

  const dx = box.maxX - anchor.maxX;
  const dy = box.minY - anchor.minY;

  let placed = transform(mark.strokes, 1, dx, dy);

  for (let shift = MARK_STEP; shift <= MARK_MAX_SHIFT; shift += MARK_STEP) {
    if (gapBetween(base, placed) >= MARK_GAP) break;
    placed = transform(mark.strokes, 1, dx + shift, dy - shift);
  }

  return [...base, ...placed];
};

const fitInto = (strokes: Strokes, target: Box): Strokes => {
  const box = getBox(strokes);
  const width = box.maxX - box.minX;
  const height = box.maxY - box.minY;

  const scale = Math.min(
    (target.maxX - target.minX) / (width || 1),
    (target.maxY - target.minY) / (height || 1),
  );

  const dx = (target.minX + target.maxX - width * scale) / 2 - box.minX * scale;
  const dy = (target.minY + target.maxY - height * scale) / 2 - box.minY * scale;

  return transform(strokes, scale, dx, dy);
};

type ResolveStrokes = (symbol: string) => Strokes | undefined;

const compose = (symbol: string, kana: ReferenceKana, resolve: ResolveStrokes): Strokes | null => {
  const own = resolve(symbol);
  if (own) return own;

  const chars = [...symbol];

  if (chars.length === 2) {
    const big = compose(chars[0], kana, resolve);
    const small = kanaReferences[kana][chars[1]];
    if (!big || !small) return null;

    return [...fitInto(big, YOON_BOX), ...small];
  }

  const [base, mark] = [...symbol.normalize("NFD")];
  const baseStrokes = mark ? resolve(base) : undefined;
  if (!baseStrokes) return null;

  if (mark === DAKUTEN) return addMark(baseStrokes, kanaMarks.dakuten);
  if (mark === HANDAKUTEN) return addMark(baseStrokes, kanaMarks.handakuten);

  return null;
};

export const composeReference = (symbol: string, kana: ReferenceKana): Strokes | null =>
  compose(symbol, kana, (char) => kanaReferences[kana][char]);

const baseOf = (symbol: string) => [...symbol][0].normalize("NFD")[0];

const templateVariants = (char: string, kana: ReferenceKana): Strokes[] => {
  const reference = kanaReferences[kana][char];
  if (!reference) return [];

  const box = getBox(reference);
  const templates = kanaTemplates[kana] as unknown as Record<string, Strokes>;

  return Object.keys(templates)
    .filter((name) => name.replace(VARIANT_SUFFIX, "") === char)
    .map((name) => templates[name])
    .filter((template) => template.length !== reference.length)
    .map((template) =>
      template.map((stroke) =>
        stroke.map(([x, y]) => [
          box.minX + x * (box.maxX - box.minX),
          box.minY + y * (box.maxY - box.minY),
        ]),
      ),
    );
};

const toTemplate = (strokes: Strokes) =>
  normalizeCoordinates(strokes.map((stroke) => stroke.map(([x, y]) => ({ x, y }))));

const composedTemplates: Partial<Record<ReferenceKana, { name: string; strokes: Strokes }[]>> = {};

const getComposedTemplates = (kana: ReferenceKana) => {
  const cached = composedTemplates[kana];
  if (cached) return cached;

  const templates: { name: string; strokes: Strokes }[] = [];

  for (const letter of [dakuon, handakuon, yoon].flatMap((table) => table.flat())) {
    const symbol = kana === "hiragana" ? letter.hi : letter.ka;

    const reference = composeReference(symbol, kana);
    if (!reference) continue;

    templates.push({ name: symbol, strokes: toTemplate(reference) });

    const base = baseOf(symbol);

    templateVariants(base, kana).forEach((variant, index) => {
      const strokes = compose(symbol, kana, (char) =>
        char === base ? variant : kanaReferences[kana][char],
      );

      if (strokes && strokes !== reference && strokes.length !== reference.length) {
        templates.push({ name: `${symbol}v${index + 2}`, strokes: toTemplate(strokes) });
      }
    });
  }

  composedTemplates[kana] = templates;

  return templates;
};

export const addComposedTemplates = (recognizer: Recognizer, kana: ReferenceKana) => {
  getComposedTemplates(kana).forEach(({ name, strokes }) => recognizer.addTemplate(name, strokes));
};

export const templateName = (name: string) => name.replace(VARIANT_SUFFIX, "");

import { Chapter } from "../types";

import { dumpDe } from "./de";
import { dumpEn } from "./en";
import { dumpEsES } from "./es-ES";
import { dumpEsMX } from "./es-MX";
import { dumpFr } from "./fr";
import { dumpId } from "./id";
import { dumpIt } from "./it";
import { dumpKo } from "./ko";
import { dumpPtBR } from "./pt-BR";
import { dumpPtPT } from "./pt-PT";
import { dumpRu } from "./ru";
import { dumpZhCN } from "./zh-CN";
import { dumpZhHK } from "./zh-HK";
import { dumpZhTW } from "./zh-TW";

const dumps: Record<string, { data: Chapter[] }> = {
  ru: dumpRu as unknown as { data: Chapter[] },
  en: dumpEn as unknown as { data: Chapter[] },
  de: dumpDe as unknown as { data: Chapter[] },
  fr: dumpFr as unknown as { data: Chapter[] },
  id: dumpId as unknown as { data: Chapter[] },
  ko: dumpKo as unknown as { data: Chapter[] },
  it: dumpIt as unknown as { data: Chapter[] },
  "es-ES": dumpEsES as unknown as { data: Chapter[] },
  "es-MX": dumpEsMX as unknown as { data: Chapter[] },
  "pt-BR": dumpPtBR as unknown as { data: Chapter[] },
  "pt-PT": dumpPtPT as unknown as { data: Chapter[] },
  "zh-CN": dumpZhCN as unknown as { data: Chapter[] },
  "zh-HK": dumpZhHK as unknown as { data: Chapter[] },
  "zh-TW": dumpZhTW as unknown as { data: Chapter[] },
};

export function getDump(lang: string): unknown[] | null {
  return dumps[lang]?.data ?? null;
}

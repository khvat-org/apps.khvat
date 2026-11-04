import { apiFetch } from "@nihongo/core/shared/lib/api-gateway";
import { Directory, File, Paths } from "expo-file-system";
import { z } from "zod";

import { shuffleArray } from "@/shared/helpers/letters";

const DIRECTORY_NAME = "captcha-fonts";
const MIN_PACKS = 4;
const SESSION_PACKS = 6;
const DOWNLOAD_TIMEOUT = 60_000;

export const captchaFontsSchema = z.object({
  fonts: z
    .array(
      z.object({
        font: z.string(),
        file: z.string().regex(/^[0-9a-f-]{36}\.json$/),
        size: z.number(),
      }),
    )
    .min(1),
});

const captchaPackSchema = z.object({
  font: z.string(),
  viewBox: z.number().positive(),
  glyphs: z.record(z.string(), z.string()),
});

export type CaptchaFont = z.infer<typeof captchaFontsSchema>["fonts"][number];
export type CaptchaPack = z.infer<typeof captchaPackSchema>;

const directory = () => new Directory(Paths.cache, DIRECTORY_NAME);
const packFile = ({ file }: CaptchaFont) => new File(directory(), file);

const abortable = <T>(promise: Promise<T>, signal: AbortSignal) =>
  new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(new Error("pack download aborted"));

    if (signal.aborted) {
      onAbort();
      return;
    }

    signal.addEventListener("abort", onAbort, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener("abort", onAbort));
  });

const prepareDirectory = (fonts: CaptchaFont[]) => {
  const dir = directory();

  if (!dir.exists) {
    dir.create({ intermediates: true, idempotent: true });
    return;
  }

  const names = new Set(fonts.map(({ file }) => file));
  dir.list().forEach((entry) => {
    if (!names.has(entry.name)) entry.delete();
  });
};

const downloadPack = async (font: CaptchaFont, signal: AbortSignal) => {
  const response = await abortable(
    apiFetch(`/file/${font.file}`, { signal }, { timeout: DOWNLOAD_TIMEOUT }),
    signal,
  );
  if (!response.ok) throw new Error(`pack download failed: ${response.status}`);

  const body = await abortable(response.text(), signal);
  captchaPackSchema.parse(JSON.parse(body));

  const file = packFile(font);
  file.create({ overwrite: true });
  file.write(body);
};

const readPack = async (font: CaptchaFont): Promise<CaptchaPack | null> => {
  const file = packFile(font);

  try {
    return captchaPackSchema.parse(JSON.parse(await file.text()));
  } catch {
    if (file.exists) file.delete();
    return null;
  }
};

let isBackgroundRunning = false;

const downloadInBackground = async (fonts: CaptchaFont[]) => {
  if (isBackgroundRunning) return;
  isBackgroundRunning = true;

  for (const font of fonts) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT);

    try {
      await downloadPack(font, controller.signal);
    } catch {
      break;
    } finally {
      clearTimeout(timer);
    }
  }

  isBackgroundRunning = false;
};

interface LoadOptions {
  signal: AbortSignal;
  onProgress: (done: number, total: number) => void;
}

export const loadCaptchaPacks = async (
  fonts: CaptchaFont[],
  { signal, onProgress }: LoadOptions,
): Promise<CaptchaPack[]> => {
  if (fonts.length === 0) throw new Error("no captcha fonts configured");

  prepareDirectory(fonts);

  const shuffled = shuffleArray(fonts);
  const missing = shuffled.filter((font) => !packFile(font).exists);
  const total = Math.min(MIN_PACKS, shuffled.length);
  const requiredCount = Math.max(total - (shuffled.length - missing.length), 0);

  let done = total - requiredCount;
  onProgress(done, total);

  await Promise.allSettled(
    missing.slice(0, requiredCount).map(async (font) => {
      await downloadPack(font, signal);
      if (signal.aborted) return;

      done += 1;
      onProgress(done, total);
    }),
  );

  if (signal.aborted) throw new Error("pack download aborted");

  const packs = await Promise.all(
    shuffled
      .filter((font) => packFile(font).exists)
      .slice(0, SESSION_PACKS)
      .map(readPack),
  );
  const loaded = packs.filter((pack): pack is CaptchaPack => pack !== null);

  if (loaded.length < total) throw new Error("not enough captcha packs");

  downloadInBackground(missing.slice(requiredCount));

  return loaded;
};

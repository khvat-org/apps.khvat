import { isAndroid } from "@nihongo/core/shared/constants/platformUtil";
import { DEVICE_ID } from "@nihongo/core/shared/constants/storageKeys";
import { apiFetch } from "@nihongo/core/shared/lib/api-gateway";
import { authFetch } from "@nihongo/core/shared/lib/auth";
import i18n from "@nihongo/core/shared/lib/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

export const REPORT_TEXT_MAX = 300;
export const REPORT_IMAGES_MAX = 9;
export const REPORT_TAGS_MAX = 5;

const REPORT_CONTEXT_MAX = 256;
const REPORT_UPLOAD_TIMEOUT = 60_000;
const REPORT_IMAGE_MAX_SIDE = 1600;
const REPORT_IMAGE_QUALITY = 0.7;

export type ReportImage = { uri: string; name: string; type: string };

export type SendReportParams = {
  tags: string[];
  text: string;
  context: string;
  images: ReportImage[];
};

export type SendReportError = "empty" | "too_large" | "rate_limited" | "unavailable" | "invalid";

export type SendReportResult = { ok: true; id: string } | { ok: false; error: SendReportError };

export const shrinkReportImage = async (
  asset: ImagePicker.ImagePickerAsset,
): Promise<ReportImage> => {
  const context = ImageManipulator.manipulate(asset.uri);

  try {
    if (Math.max(asset.width, asset.height) > REPORT_IMAGE_MAX_SIDE) {
      context.resize(
        asset.width >= asset.height
          ? { width: REPORT_IMAGE_MAX_SIDE }
          : { height: REPORT_IMAGE_MAX_SIDE },
      );
    }

    const image = await context.renderAsync();

    try {
      const { uri } = await image.saveAsync({
        format: SaveFormat.JPEG,
        compress: REPORT_IMAGE_QUALITY,
      });

      return { uri, name: `report-${Date.now()}.jpg`, type: "image/jpeg" };
    } finally {
      image.release();
    }
  } finally {
    context.release();
  }
};

const loadFileSystem = (): typeof import("expo-file-system") | null => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("expo-file-system") as typeof import("expo-file-system");
  } catch {
    return null;
  }
};

const toUploadPart = (image: ReportImage): Blob => {
  const fileSystem = loadFileSystem();
  if (!fileSystem) return image as unknown as Blob;

  return new fileSystem.File(image.uri) as unknown as Blob;
};

const buildData = async ({ tags, text, context }: SendReportParams) => ({
  tags: tags.slice(0, REPORT_TAGS_MAX),
  text: text.trim().slice(0, REPORT_TEXT_MAX),
  context: context.slice(0, REPORT_CONTEXT_MAX),
  app: process.env.APP_NAME,
  platform: isAndroid ? "android" : "IOS",
  app_version: process.env.VERSION,
  device_id: (await AsyncStorage.getItem(DEVICE_ID)) ?? undefined,
  lang: i18n.language,
});

const buildInit = async (params: SendReportParams): Promise<RequestInit> => {
  const data = await buildData(params);

  if (params.images.length === 0) {
    return {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  }

  const form = new FormData();
  form.append("data", JSON.stringify(data));
  params.images.forEach((image) => form.append("images", toUploadPart(image)));

  return { method: "POST", body: form };
};

const toResult = async (res: Response): Promise<SendReportResult> => {
  if (res.ok) {
    const body = (await res.json()) as { id: string };
    return { ok: true, id: body.id };
  }

  if (res.status === 413) return { ok: false, error: "too_large" };
  if (res.status === 429) return { ok: false, error: "rate_limited" };
  if (res.status >= 500) return { ok: false, error: "unavailable" };

  const body = (await res.json().catch(() => ({}))) as { error?: string };
  if (body.error === "image_too_large" || body.error === "invalid_image") {
    return { ok: false, error: "too_large" };
  }

  return { ok: false, error: "invalid" };
};

export const sendReport = async (params: SendReportParams): Promise<SendReportResult> => {
  if (params.tags.length === 0 && params.text.trim() === "") {
    return { ok: false, error: "empty" };
  }

  const options = { timeout: REPORT_UPLOAD_TIMEOUT, failover: false };

  try {
    let res = await authFetch("/api/v2/reports", await buildInit(params), options);

    if (res.status === 401) {
      res = await apiFetch("/api/v2/reports", await buildInit(params), options);
    }

    return await toResult(res);
  } catch {
    return { ok: false, error: "unavailable" };
  }
};

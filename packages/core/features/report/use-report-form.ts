import { useEffect, useRef, useState } from "react";

import {
  REPORT_IMAGES_MAX,
  REPORT_TAGS_MAX,
  ReportImage,
  SendReportError,
  sendReport,
  shrinkReportImage,
} from "@nihongo/core/shared/lib/reports";
import * as ImagePicker from "expo-image-picker";

type ReportFormOptions = {
  context: string;
  onSent: () => void;
};

export const useReportForm = ({ context, onSent }: ReportFormOptions) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [images, setImages] = useState<ReportImage[]>([]);
  const [processing, setProcessing] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<SendReportError | null>(null);

  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;

    return () => {
      alive.current = false;
    };
  }, []);

  const canAddImages = images.length + processing < REPORT_IMAGES_MAX;
  const canSend = (selected.length > 0 || text.trim() !== "") && processing === 0 && !sending;

  const toggleTag = (tag: string) => {
    setSelected((prev) => {
      if (prev.includes(tag)) return prev.filter((item) => item !== tag);
      if (prev.length >= REPORT_TAGS_MAX) return prev;

      return [...prev, tag];
    });
  };

  const pickImages = async () => {
    const limit = REPORT_IMAGES_MAX - images.length - processing;
    if (limit <= 0) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: limit,
      preferredAssetRepresentationMode:
        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
    });

    if (result.canceled || !alive.current) return;

    const assets = result.assets.slice(0, limit);
    setProcessing((prev) => prev + assets.length);

    await Promise.all(
      assets.map(async (asset) => {
        try {
          const image = await shrinkReportImage(asset);
          if (alive.current) setImages((prev) => [...prev, image]);
        } catch (_) {
          if (alive.current) setError("too_large");
        } finally {
          if (alive.current) setProcessing((prev) => prev - 1);
        }
      }),
    );
  };

  const removeImage = (uri: string) => {
    setImages((prev) => prev.filter((image) => image.uri !== uri));
  };

  const submit = async () => {
    if (!canSend) return;

    setSending(true);
    setError(null);

    const result = await sendReport({ tags: selected, text, context, images });

    if (!alive.current) return;

    setSending(false);

    if (result.ok) {
      onSent();
      return;
    }

    setError(result.error);
  };

  return {
    selected,
    toggleTag,
    text,
    setText,
    images,
    removeImage,
    processing,
    canAddImages,
    pickImages,
    canSend,
    sending,
    error,
    submit,
  };
};

export type ReportForm = ReturnType<typeof useReportForm>;

import { useEffect, useRef, useState } from "react";

import { useActionSheet } from "@expo/react-native-action-sheet";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import {
  AvatarFile,
  Profile,
  removeAvatar,
  UpdateProfileResult,
  uploadAvatar,
} from "@nihongo/core/shared/lib/auth";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import { Alert, Platform } from "react-native";

const AVATAR_MAX_SIDE = 1024;
const AVATAR_QUALITY = 0.8;

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
  presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
};

const LIBRARY_PICKER_OPTIONS: ImagePicker.ImagePickerOptions =
  Platform.OS === "ios"
    ? {
        ...PICKER_OPTIONS,
        allowsEditing: false,
        preferredAssetRepresentationMode:
          ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
      }
    : PICKER_OPTIONS;

const mapErrorCode = (code?: string): string | null => {
  switch (code) {
    case "file_too_large":
      return "fileTooLarge";
    case "invalid_image":
    case "file_required":
      return "invalidImage";
    case "storage_unavailable":
      return "storageUnavailable";
    default:
      return null;
  }
};

const mapServerError = (code: string | undefined, status: number): string =>
  mapErrorCode(code) ?? (status === 413 ? "fileTooLarge" : "failed");

const isRetryable = (messageKey: string): boolean =>
  messageKey === "storageUnavailable" || messageKey === "failed";

const toAvatarFile = async (asset: ImagePicker.ImagePickerAsset): Promise<AvatarFile> => {
  const context = ImageManipulator.manipulate(asset.uri);

  try {
    if (Math.max(asset.width, asset.height) > AVATAR_MAX_SIDE) {
      context.resize(
        asset.width >= asset.height ? { width: AVATAR_MAX_SIDE } : { height: AVATAR_MAX_SIDE },
      );
    }

    const image = await context.renderAsync();

    try {
      const { uri } = await image.saveAsync({ format: SaveFormat.JPEG, compress: AVATAR_QUALITY });
      return { uri, name: "avatar.jpg", type: "image/jpeg" };
    } finally {
      image.release();
    }
  } finally {
    context.release();
  }
};

type AvatarRequest = (signal: AbortSignal) => Promise<UpdateProfileResult>;

type UseChangeAvatarParams = {
  hasAvatar: boolean;
  onUpdated: (profile: Profile) => void;
};

export const useChangeAvatar = ({ hasAvatar, onUpdated }: UseChangeAvatarParams) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();

  const { showActionSheetWithOptions } = useActionSheet();

  const [uploading, setUploading] = useState(false);

  const alive = useRef(true);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    alive.current = true;

    return () => {
      alive.current = false;
      abort.current?.abort();
    };
  }, []);

  const showError = (messageKey: string) =>
    Alert.alert(t("profile.avatar.title"), t(`profile.avatar.errors.${messageKey}`), [
      { text: t("alert.ok") },
    ]);

  const showRetry = (messageKey: string, retry: () => void) =>
    Alert.alert(t("profile.avatar.title"), t(`profile.avatar.errors.${messageKey}`), [
      { text: t("alert.cancel"), style: "cancel" },
      { text: t("common.retry"), onPress: retry },
    ]);

  const submit = async (request: AvatarRequest) => {
    const controller = new AbortController();

    abort.current?.abort();
    abort.current = controller;

    setUploading(true);
    try {
      const { ok, error, status, profile } = await request(controller.signal);

      if (!alive.current || controller.signal.aborted) return;

      if (ok && profile) {
        onUpdated(profile);
        return;
      }

      const messageKey = mapServerError(error, status);
      if (isRetryable(messageKey)) {
        showRetry(messageKey, () => void submit(request));
        return;
      }

      showError(messageKey);
    } catch (_) {
      if (!alive.current || controller.signal.aborted) return;

      showRetry("failed", () => void submit(request));
    } finally {
      if (abort.current === controller) abort.current = null;
      if (alive.current) setUploading(false);
    }
  };

  const pick = async (source: "camera" | "library") => {
    try {
      if (source === "camera") {
        const { granted } = await ImagePicker.requestCameraPermissionsAsync();
        if (!granted) {
          showError("cameraPermission");
          return;
        }
      }

      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync(PICKER_OPTIONS)
          : await ImagePicker.launchImageLibraryAsync(LIBRARY_PICKER_OPTIONS);

      if (result.canceled) return;

      const asset = result.assets[0];
      if (!asset) return;

      let file: AvatarFile;
      try {
        file = await toAvatarFile(asset);
      } catch (_) {
        if (alive.current) showError("invalidImage");
        return;
      }

      await submit((signal) => uploadAvatar(file, signal));
    } catch (_) {
      if (alive.current) showError("failed");
    }
  };

  const open = () => {
    const actions: { label: string; run: () => void }[] = [
      { label: t("profile.avatar.takePhoto"), run: () => void pick("camera") },
      { label: t("profile.avatar.chooseFromLibrary"), run: () => void pick("library") },
    ];

    if (hasAvatar) {
      actions.push({
        label: t("profile.avatar.remove"),
        run: () => void submit((signal) => removeAvatar(signal)),
      });
    }

    const options = [...actions.map((action) => action.label), t("alert.cancel")];

    showActionSheetWithOptions(
      {
        title: t("profile.avatar.title"),
        options,
        cancelButtonIndex: actions.length,
        destructiveButtonIndex: hasAvatar ? actions.length - 1 : undefined,
        containerStyle: { backgroundColor: colors.BgPrimary },
        textStyle: { color: colors.TextPrimary },
        titleTextStyle: { color: colors.TextSecondary },
        destructiveColor: colors.TextDanger,
        userInterfaceStyle: colors._theme === "dark" ? "dark" : "light",
      },
      (index) => {
        if (index === undefined) return;
        actions[index]?.run();
      },
    );
  };

  const cancel = () => abort.current?.abort();

  return { open, cancel, uploading };
};

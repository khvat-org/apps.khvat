import React, { useEffect, useRef, useState } from "react";

import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import {
  REPORT_IMAGES_MAX,
  REPORT_TAGS_MAX,
  REPORT_TEXT_MAX,
  ReportImage,
  SendReportError,
  sendReport,
  shrinkReportImage,
} from "@nihongo/core/shared/lib/reports";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import Chip from "@nihongo/core/shared/ui/chip/chip";
import * as ImagePicker from "expo-image-picker";
import { ImageIcon, UploadSimpleIcon, XIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TILE_SIZE = 96;
const INPUT_MIN_HEIGHT = 120;
const INPUT_MAX_HEIGHT = 200;
const MODAL_VERTICAL_OFFSET = 80;
const SCROLL_TO_INPUT_DELAY = 250;

const SHOW_EVENT = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
const HIDE_EVENT = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

type ReportModalProps = {
  tags: string[];
  context: string;

  onClose: () => void;
  onSent: () => void;
};

const ReportModal: React.FC<ReportModalProps> = ({ tags, context, onClose, onSent }) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [selected, setSelected] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [images, setImages] = useState<ReportImage[]>([]);
  const [processing, setProcessing] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<SendReportError | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const alive = useRef(true);
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const isInputFocused = useRef(false);

  useEffect(() => {
    alive.current = true;

    const show = Keyboard.addListener(SHOW_EVENT, (event) =>
      setKeyboardHeight(event.endCoordinates.height),
    );
    const hide = Keyboard.addListener(HIDE_EVENT, () => setKeyboardHeight(0));

    return () => {
      alive.current = false;
      show.remove();
      hide.remove();
    };
  }, []);

  const maxHeight =
    height -
    keyboardHeight -
    MODAL_VERTICAL_OFFSET -
    insets.top -
    (keyboardHeight > 0 ? 0 : insets.bottom);

  const canAddImages = images.length + processing < REPORT_IMAGES_MAX;
  const canSend = (selected.length > 0 || text.trim() !== "") && processing === 0 && !sending;

  const scrollToInput = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), SCROLL_TO_INPUT_DELAY);
  };

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

  return (
    <View style={[styles.modal, { maxHeight }]}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          if (isInputFocused.current) scrollRef.current?.scrollToEnd({ animated: false });
        }}
      >
        <Text style={styles.title}>{t("report.title")}</Text>
        <Text style={styles.subtitle}>{t("report.subtitle")}</Text>

        {tags.length > 0 && (
          <View style={styles.tags}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                text={t(`report.tags.${tag}`, { defaultValue: tag })}
                active={selected.includes(tag)}
                onPress={() => toggleTag(tag)}
              />
            ))}
          </View>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.images}
          contentContainerStyle={styles.imagesContent}
          keyboardShouldPersistTaps="handled"
        >
          {images.map((image) => (
            <View key={image.uri} style={styles.tile}>
              <Image source={{ uri: image.uri }} style={styles.tileImage} />
              <Pressable style={styles.remove} onPress={() => removeImage(image.uri)} hitSlop={8}>
                <XIcon size={14} color={colors.TextContrast} />
              </Pressable>
            </View>
          ))}

          {Array.from({ length: processing }, (_, index) => (
            <View key={`processing-${index}`} style={[styles.tile, styles.tileProcessing]}>
              <ImageIcon size={20} color={colors.TextPrimary} />
              <ActivityIndicator size="small" color={colors.BgGray} />
            </View>
          ))}

          {canAddImages && (
            <Pressable
              style={({ pressed }) => [styles.tile, styles.upload, pressed && styles.uploadPressed]}
              onPress={() => void pickImages()}
            >
              <UploadSimpleIcon size={20} color={colors.TextPrimary} />
              <Text style={styles.uploadText}>{t("report.upload")}</Text>
            </Pressable>
          )}
        </ScrollView>

        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          onFocus={() => {
            isInputFocused.current = true;
            scrollToInput();
          }}
          onBlur={() => {
            isInputFocused.current = false;
          }}
          placeholder={t("report.placeholder")}
          placeholderTextColor={colors.TextSecondary}
          maxLength={REPORT_TEXT_MAX}
          multiline
          scrollEnabled
          textAlignVertical="top"
        />
        <Text style={styles.counter}>
          {text.length} / {REPORT_TEXT_MAX}
        </Text>

        {error && error !== "empty" && (
          <Text style={styles.error}>{t(`report.errors.${error}`)}</Text>
        )}
      </ScrollView>

      <View style={styles.buttons}>
        <Button
          color="secondary"
          isHapticFeedback
          isFullWidth
          text={t("alert.cancel")}
          onClick={onClose}
        />
        <Button
          color="primary"
          isHapticFeedback
          isFullWidth
          isDisabled={!canSend}
          text={sending ? undefined : t("report.send")}
          content={sending ? <ActivityIndicator color={colors.TextContrast} /> : undefined}
          onClick={() => void submit()}
        />
      </View>
    </View>
  );
};

export default ReportModal;

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    modal: {
      backgroundColor: colors.BgPrimary,
      borderRadius: 24,
      overflow: "hidden",

      width: "100%",
      maxWidth: TABLET_WIDTH,
    },
    scroll: {
      flexGrow: 0,
      flexShrink: 1,
    },
    scrollContent: {
      paddingTop: 24,
      paddingHorizontal: 24,
    },
    title: {
      ...Typography.H4,
      color: colors.TextPrimary,
      textAlign: "center",
    },
    subtitle: {
      ...Typography.regularDefault,
      color: colors.TextPrimary,
      textAlign: "center",
      marginTop: 4,
    },
    tags: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 24,
    },
    images: {
      marginTop: 16,
      flexGrow: 0,
    },
    imagesContent: {
      gap: 12,
    },
    tile: {
      width: TILE_SIZE,
      height: TILE_SIZE,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.BorderDefault,
      overflow: "hidden",
    },
    tileImage: {
      width: "100%",
      height: "100%",
    },
    tileProcessing: {
      backgroundColor: colors.BgSecondary,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
    remove: {
      position: "absolute",
      top: 6,
      right: 6,

      width: 28,
      height: 28,
      borderRadius: 14,

      backgroundColor: colors.BgContrast,
      alignItems: "center",
      justifyContent: "center",
    },
    upload: {
      borderStyle: "dashed",
      backgroundColor: colors.BgSecondary,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    uploadPressed: {
      backgroundColor: colors.BgLightGray,
    },
    uploadText: {
      ...Typography.boldLabel,
      color: colors.TextPrimary,
    },
    input: {
      ...Typography.regularDefault,
      color: colors.TextPrimary,
      backgroundColor: colors.BgSecondary,
      borderRadius: 12,

      minHeight: INPUT_MIN_HEIGHT,
      maxHeight: INPUT_MAX_HEIGHT,
      marginTop: 16,
      padding: 16,
      paddingTop: Platform.OS === "ios" ? 16 : 12,
    },
    counter: {
      ...Typography.regularCaption,
      color: colors.TextSecondary,
      textAlign: "right",
      marginTop: 8,
    },
    error: {
      ...Typography.regularLabel,
      color: colors.TextDanger,
      textAlign: "center",
      marginTop: 8,
    },
    buttons: {
      flexDirection: "row",
      gap: 16,
      padding: 24,
    },
  });

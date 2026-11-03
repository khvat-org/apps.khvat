import React from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { REPORT_TEXT_MAX } from "@nihongo/core/shared/lib/reports";
import { Typography } from "@nihongo/core/shared/typography";
import Chip from "@nihongo/core/shared/ui/chip/chip";
import { ImageIcon, UploadSimpleIcon, XIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ReportForm } from "./use-report-form";

const TILE_SIZE = 112;
const INPUT_MIN_HEIGHT = 120;
const INPUT_MAX_HEIGHT = 200;

type ReportFieldsProps = {
  form: ReportForm;
  tags: string[];

  onInputFocus?: () => void;
  onInputBlur?: () => void;
};

const ReportFields: React.FC<ReportFieldsProps> = ({ form, tags, onInputFocus, onInputBlur }) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  return (
    <>
      {tags.length > 0 && (
        <View style={styles.tags}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              text={t(`report.tags.${tag}`, { defaultValue: tag })}
              active={form.selected.includes(tag)}
              onPress={() => form.toggleTag(tag)}
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
        {form.images.map((image) => (
          <View key={image.uri} style={styles.tile}>
            <Image source={{ uri: image.uri }} style={styles.tileImage} />
            <Pressable
              style={styles.remove}
              onPress={() => form.removeImage(image.uri)}
              hitSlop={8}
            >
              <XIcon size={14} color={colors.TextContrast} />
            </Pressable>
          </View>
        ))}

        {Array.from({ length: form.processing }, (_, index) => (
          <View key={`processing-${index}`} style={[styles.tile, styles.tileProcessing]}>
            <ImageIcon size={20} color={colors.TextPrimary} />
            <ActivityIndicator size="small" color={colors.BgGray} />
          </View>
        ))}

        {form.canAddImages && (
          <Pressable
            style={({ pressed }) => [styles.tile, styles.upload, pressed && styles.uploadPressed]}
            onPress={() => void form.pickImages()}
          >
            <UploadSimpleIcon size={20} color={colors.TextPrimary} />
            <Text style={styles.uploadText}>{t("report.upload")}</Text>
          </Pressable>
        )}
      </ScrollView>

      <TextInput
        style={styles.input}
        value={form.text}
        onChangeText={form.setText}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        placeholder={t("report.placeholder")}
        placeholderTextColor={colors.TextSecondary}
        maxLength={REPORT_TEXT_MAX}
        multiline
        scrollEnabled
        textAlignVertical="top"
      />
      <Text style={styles.counter}>
        {form.text.length} / {REPORT_TEXT_MAX}
      </Text>

      {form.error && form.error !== "empty" && (
        <Text style={styles.error}>{t(`report.errors.${form.error}`)}</Text>
      )}
    </>
  );
};

export default ReportFields;

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
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
  });

import React from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import Input from "@nihongo/core/shared/ui/input";
import { ModalHeader } from "@nihongo/core/shared/ui/modal-header/modal-header";
import Tag from "@nihongo/core/shared/ui/tag/tag";
import { BookIcon, TagIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { View, ImageBackground, StyleSheet, Text } from "react-native";

import { CardEdit } from "@/features/card/edit/use-card-edit";
import { Card } from "@/shared/api/get-cards";
import Furigana from "@/shared/ui/furigana/furigana";

interface CardHeaderProps {
  card: Card;
  edit: CardEdit;
  goBack: () => void;
}

interface ImageContainerProps {
  children: React.ReactNode;
  image: string | null;
}

const ImageContainer: React.FC<ImageContainerProps> = ({ children, image }) => {
  return (
    <ImageBackground
      source={{ uri: image || "" }}
      style={{ width: "100%" }}
      resizeMode="cover"
      imageStyle={{
        resizeMode: "cover",
        alignSelf: "center",
      }}
    >
      <View
        style={{
          ...StyleSheet.absoluteFill,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
      />
      {children}
    </ImageBackground>
  );
};
interface ViewContainerProps {
  children: React.ReactNode;
  image: string | null;
}

const ViewContainer: React.FC<ViewContainerProps> = ({ children }) => {
  return <View>{children}</View>;
};

const CardHeader: React.FC<CardHeaderProps> = ({ card, edit, goBack }) => {
  const image = card?.images?.length
    ? card?.images?.[0].includes("https://") || card?.images?.[0].includes("http://")
      ? card?.images?.[0]
      : `${process.env.MEMOBOARD_API}${card?.images?.[0]}`
    : null;

  const { t } = useTranslation();

  const Container = image ? ImageContainer : ViewContainer;

  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const primaryColor = image ? colors.TextWhite : colors.TextPrimary;

  return (
    <View>
      <Container image={image}>
        <ModalHeader
          left={{
            textColor: primaryColor,
            text: edit.isEditing ? t("alert.cancel") : t("common.close"),
            onPress: edit.isEditing ? edit.cancel : goBack,
          }}
          title={card.titleWithoutFurigana}
          titleColor={primaryColor}
          right={
            edit.canEdit
              ? {
                  textColor: edit.isSaving ? undefined : primaryColor,
                  isDisabled: edit.isSaving,
                  text: edit.isEditing ? t("card.save") : t("card.edit"),
                  onPress: edit.isEditing ? edit.save : edit.start,
                }
              : undefined
          }
        />

        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            minHeight: 160,
          }}
        >
          {edit.isEditing ? (
            <View style={styles.form}>
              <Input
                placeholder={t("card.titlePlaceholder")}
                value={edit.title}
                onChange={edit.setTitle}
              />

              <Input
                placeholder={t("card.subtitlePlaceholder")}
                value={edit.subtitle}
                onChange={edit.setSubtitle}
                error={edit.hasError ? t("card.saveError") : undefined}
              />
            </View>
          ) : (
            <>
              <Furigana
                typography={{
                  ...Typography.H3,
                  color: primaryColor,
                }}
                text={card.title}
              />

              <Text style={[styles.card_subtitle, { color: primaryColor }]}>
                {card.subtitleNoFurigana}
              </Text>
            </>
          )}

          <View style={styles.tags}>
            <Tag text={card.lessonTitle} icon={<BookIcon size={12} color={colors.TextPrimary} />} />

            {card.tags.map((tag) => (
              <Tag
                key={tag.label}
                isUpperCase={tag.label === "iii" || tag.label === "ii" || tag.label === "i"}
                text={tag.label}
                icon={<TagIcon size={12} color={colors.TextPrimary} />}
              />
            ))}
          </View>
        </View>
      </Container>
    </View>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    container: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
    },
    content: {
      paddingHorizontal: 16,
      paddingBottom: 16,

      paddingTop: 16,
    },
    image: {
      resizeMode: "cover",
      alignSelf: "center",
    },
    overlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    card_subtitle: {
      color: colors.TextPrimary,
      ...Typography.H3,

      marginTop: 8,
    },
    form: {
      gap: 8,
    },

    buttonContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",

      paddingLeft: 12,
      paddingRight: 12,
    },
    buttons: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingLeft: 16,
      paddingRight: 16,
      marginTop: 16,
      gap: 16,
    },
    tags: {
      flexDirection: "row",
      marginTop: 16,
      gap: 4,
    },
    header: {
      backgroundColor: colors.BgContrast,
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 4,

      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    list: {
      flexDirection: "column",
      gap: 6,
    },
    item: {
      backgroundColor: colors.BgSecondary,
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 4,
    },
    itemLabel: {
      color: colors.TextSecondary,
      ...Typography.regularLabel,
    },
    itemValue: {
      color: colors.TextPrimary,
      ...Typography.regularDefault,
    },
  });

export default CardHeader;

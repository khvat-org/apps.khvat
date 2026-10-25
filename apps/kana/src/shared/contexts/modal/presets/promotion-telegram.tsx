import React, { useEffect } from "react";

import SettingItem from "@nihongo/core/entities/setting/setting-item/setting-item";
import { TABLET_WIDTH } from "@nihongo/core/shared/constants/sizes";
import { useModal } from "@nihongo/core/shared/contexts/modal/modal-context";
import { useRemoteConfig } from "@nihongo/core/shared/contexts/remote-config/remote-config-context";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import Button from "@nihongo/core/shared/ui/button";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { z } from "zod";

interface ConfirmationModalProps {
  onPress: () => void;
}

const socialMediaLinkSchema = z.object({
  icon: z.string().min(1),
  text: z.string(),
  link: z.url(),
  subtext: z.string(),
  name: z.string().min(1),
});

const socialMediaLinksSchema = z.array(socialMediaLinkSchema);

export const PromotionTelegram = (props: ConfirmationModalProps) => {
  const { t } = useTranslation();
  const { colors } = useThemeContext();

  const { onPress } = props;

  const styles = makeStyles(colors);

  const { getField, isReady } = useRemoteConfig();
  const { hideModal } = useModal();

  const parsed = socialMediaLinksSchema.safeParse(getField("social_media"));
  const socialMediaLinks = parsed.success ? parsed.data : [];

  useEffect(() => {
    if (!isReady) return;
    if (socialMediaLinks.length === 0) {
      hideModal();
    }
  }, [hideModal, isReady, socialMediaLinks.length]);

  const hasMultiple = socialMediaLinks.length > 1;
  const tg_channel_name = hasMultiple ? "Наши телеграм-каналы" : "Мой телеграм-канал";
  const tg_channel_name_1 = hasMultiple ? "мы будем" : "я буду";
  const tg_channel_name_2 = hasMultiple
    ? "В связи с тем, что в приложении стало не так много багов, намного меньше людей заходят к нам в тг-каналы, чтобы сообщить о проблемах, и намного меньше людей стали подписываться на нас"
    : "В связи с тем, что в приложении стало не так много багов, намного меньше людей заходят ко мне в тг-канал, чтобы сообщить о проблемах, и намного меньше людей стали подписываться на меня";

  return (
    <ScrollView style={styles.modal}>
      <Text
        style={{
          ...Typography.H4,
          color: colors.TextPrimary,
        }}
      >
        Поздравляю, вам попался счастливый баг!
      </Text>

      <Text
        style={{
          ...Typography.regularDefault,
          color: colors.TextPrimary,
          marginTop: 8,
        }}
      >
        {tg_channel_name_2}
      </Text>

      <Text
        style={{
          ...Typography.boldDefault,
          color: colors.TextPrimary,
          marginTop: 12,
        }}
      >
        Инструкция, что вам нужно сделать:
      </Text>

      <Text
        style={{
          ...Typography.regularDefault,
          color: colors.TextPrimary,
          marginTop: 8,
        }}
      >
        - Перейти на {tg_channel_name.toLowerCase()}
      </Text>
      <Text
        style={{
          ...Typography.regularDefault,
          color: colors.TextPrimary,
        }}
      >
        - Подписаться ({tg_channel_name_1} постить много чего интересного)
      </Text>

      <Text
        style={{
          ...Typography.regularDefault,
          color: colors.TextPrimary,
          marginTop: 8,
        }}
      >
        Не заставляйте добавлять настоящие баги :)
      </Text>

      <View style={styles.contrastContent}>
        {socialMediaLinks.length > 0 && <Text style={styles.title}>{tg_channel_name}</Text>}

        <View style={styles.items}>
          {socialMediaLinks.map((link, index) => (
            <SettingItem
              isContrast
              icon={link.icon}
              isBigIcon={true}
              key={index}
              text={link.name}
              subText={link.subtext}
              link={link.link}
              isLast={index === socialMediaLinks.length - 1}
            />
          ))}
        </View>
      </View>

      <View style={styles.buttons}>
        <Button
          color="secondary"
          onClick={onPress}
          isFullWidth
          text={t("promotionTelegram.fixMyself")}
        />
      </View>
    </ScrollView>
  );
};

const makeStyles = (color: ColorsType) =>
  StyleSheet.create({
    modal: {
      backgroundColor: color.BgPrimary,
      padding: 16,
      borderRadius: 24,

      width: "100%",
      maxWidth: TABLET_WIDTH,
    },
    buttons: {
      marginTop: 16,
      marginBottom: 16,
      flexDirection: "row",
      gap: 16,
    },
    contrastContent: {
      backgroundColor: color.BgContrast,
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
    },
    title: {
      ...Typography.H4,
      color: color.TextContrast,
      textAlign: "center",
    },
    items: {
      borderRadius: 12,
      padding: 0,
      paddingLeft: 16,
      paddingRight: 16,
      backgroundColor: color.BgContrastSecondary,
      marginTop: 16,
    },
  });

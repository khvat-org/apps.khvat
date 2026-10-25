import React from "react";

import SettingItem from "@nihongo/core/entities/setting/setting-item/setting-item";
import { useRemoteConfig } from "@nihongo/core/shared/contexts/remote-config/remote-config-context";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import { View, StyleSheet, Text } from "react-native";
import { z } from "zod";

const socialMediaLinkSchema = z.object({
  icon: z.string().min(1),
  text: z.string(),
  link: z.url(),
  subtext: z.string(),
  name: z.string().min(1),
});

const socialMediaLinksSchema = z.array(socialMediaLinkSchema);

const SocialMediaProfile: React.FC = () => {
  const { colors } = useThemeContext();

  const styles = makeStyles(colors);

  const { getField } = useRemoteConfig();

  const parsed = socialMediaLinksSchema.safeParse(getField("social_media"));
  const socialMediaLinks = parsed.success ? parsed.data : [];

  const hasMultiple = socialMediaLinks.length > 1;
  const tg_channel_name = hasMultiple ? "Наши телеграм-каналы" : "Мой телеграм-канал";

  if (socialMediaLinks.length === 0) return <View></View>;

  return (
    <View>
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
    </View>
  );
};

const makeStyles = (color: ColorsType) =>
  StyleSheet.create({
    contrastContent: {
      backgroundColor: color.BgContrast,
      borderRadius: 12,
      padding: 16,
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
      backgroundColor: color.BgContrastSecondary,
      marginTop: 16,
    },
  });

export default SocialMediaProfile;

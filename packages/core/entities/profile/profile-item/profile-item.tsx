import React from "react";

import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { useUserGatewayUrl } from "@nihongo/core/shared/lib/api-gateway";
import { Typography } from "@nihongo/core/shared/typography";
import { UserIcon } from "phosphor-react-native";
import { View, Text, StyleSheet, Image } from "react-native";

interface ProfileItemProps {
  avatar?: string | null;
  name: string;
  email: string;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ avatar, name, email }) => {
  const { colors } = useThemeContext();

  const userUrl = useUserGatewayUrl(avatar || "");

  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        {userUrl ? (
          <Image source={{ uri: userUrl }} style={styles.avatarImage} />
        ) : (
          <UserIcon size={32} color={colors.BgContrast} />
        )}
      </View>

      <View style={styles.desc}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {email}
        </Text>
      </View>
    </View>
  );
};

export default ProfileItem;

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: 12,
    },
    avatar: {
      width: 64,
      height: 64,

      backgroundColor: colors.BgLightGray,
      borderRadius: 64,

      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    avatarImage: {
      width: 64,
      height: 64,
    },
    desc: {
      // * Без flex колонка растёт по контенту и длинное имя вылезает за экран
      flex: 1,

      flexDirection: "column",
      justifyContent: "center",
    },
    name: {
      ...Typography.H4,

      color: colors.TextPrimary,
    },
    email: {
      ...Typography.regularDefault,

      color: colors.TextSecondary,
    },
  });

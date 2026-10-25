import React from "react";

import { CaretRightIcon } from "phosphor-react-native";
import { Image, StyleSheet, Text, View, Switch, Linking, Pressable } from "react-native";
import ToggleSwitch from "toggle-switch-react-native";

import { isAndroid } from "../../../shared/constants/platformUtil";
import { useHaptic } from "../../../shared/contexts/haptic/haptic-context";
import { useThemeContext } from "../../../shared/contexts/theme/theme-context";
import { Typography } from "../../../shared/typography";

interface SettingItemProps {
  icon?: string;
  leftIcon?: React.ReactNode;
  text: string;
  subText?: string;
  isEnable?: boolean;
  onValueChange?: () => void;
  onClick?: () => void;
  isLast?: boolean;
  link?: string;
  isContrast?: boolean;
  isBigIcon?: boolean;
  hideArrow?: boolean;

  isDanger?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  text,
  leftIcon,
  icon,
  subText,
  isEnable,
  onValueChange,
  isLast,
  onClick,
  link,
  isContrast,
  isBigIcon,
  hideArrow,
  isDanger,
}) => {
  const { colors } = useThemeContext();
  const { triggerHaptic } = useHaptic();

  return (
    <Pressable
      style={[
        styles.container,
        !isLast
          ? {
              borderBottomWidth: 1,
              borderBottomColor: colors.BorderDefault,
              borderColor: colors.BorderDefault,
            }
          : {},
        !subText ? { height: 56 } : { height: 76 },
        isContrast
          ? {
              backgroundColor: colors.BgContrastSecondary,
              height: 68,
            }
          : {},
        !isLast && isContrast
          ? {
              borderBottomColor: colors.BorderContrast,
              borderColor: colors.BorderContrast,
            }
          : {},
      ]}
      onPress={() => {
        if (link) {
          triggerHaptic();
          Linking.openURL(link);
        }

        if (onClick !== undefined) {
          triggerHaptic();
          onClick();
        }
      }}
    >
      {leftIcon && (
        <View
          style={{
            marginRight: 12,
          }}
        >
          {leftIcon}
        </View>
      )}
      {icon && (
        <Image
          style={[
            {
              width: isBigIcon ? 48 : 28,
              height: isBigIcon ? 48 : 28,
              borderRadius: 28,
              marginRight: 8,
              backgroundColor: colors.BgPrimary,
            },
          ]}
          source={{
            uri: icon,
          }}
        />
      )}

      <View
        style={{
          flexDirection: "column",
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            Typography.boldDefault,
            { color: colors.TextPrimary },
            isContrast ? { color: colors.TextContrast } : {},
            isDanger ? { color: colors.TextDanger } : {},
          ]}
        >
          {text}
        </Text>
        {subText && (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              Typography.regularLabel,
              { color: colors.TextSecondary },
              isDanger ? { color: colors.TextDanger } : {},
            ]}
          >
            {subText}
          </Text>
        )}
      </View>

      {isEnable !== undefined && onValueChange !== undefined && !isAndroid && (
        <View style={styles.switchContainer}>
          <Switch
            trackColor={{
              false: colors.BgAccent,
              true: colors.BgAccent,
            }}
            thumbColor={isEnable ? colors.BgPrimary : colors.BgPrimary}
            ios_backgroundColor={colors.BgLightGray}
            onValueChange={() => onValueChange?.()}
            value={isEnable}
          />
        </View>
      )}

      {isEnable !== undefined && onValueChange !== undefined && isAndroid && (
        <View style={styles.switchContainer}>
          <ToggleSwitch
            isOn={isEnable}
            onColor={colors.BgAccent}
            offColor={colors.BgPrimary}
            size="medium"
            onToggle={() => {
              triggerHaptic();
              onValueChange?.();
            }}
          />
        </View>
      )}

      {link && !hideArrow && (
        <CaretRightIcon color={colors.BgGray} size={20} style={styles.arrow} />
      )}

      {onClick !== undefined && !hideArrow && (
        <CaretRightIcon color={colors.BgGray} size={20} style={styles.arrow} />
      )}
    </Pressable>
  );
};

export default SettingItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 16,
  },
  arrow: {
    marginLeft: 16,
  },
  switchContainer: {
    marginLeft: 16,
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

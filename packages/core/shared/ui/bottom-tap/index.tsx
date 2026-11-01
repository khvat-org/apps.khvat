import React from "react";

import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import type { IconProps } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useBottomTabVisibility } from "../../contexts/bottom-tab-visibility";
import { useHaptic } from "../../contexts/haptic/haptic-context";
import { useThemeContext } from "../../contexts/theme/theme-context";
import { Typography } from "../../typography";

import { useTabBarLayout } from "./use-tab-bar-layout";

type IconComponent = React.ComponentType<IconProps>;

interface TabBarButtonProps extends BottomTabBarProps {
  allowSide?: boolean;
  tabs: {
    [key: string]: {
      title: string;
      icon: IconComponent;
    };
  };
}

export const TabBarButton = ({ state, navigation, tabs, allowSide }: TabBarButtonProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { isVisible } = useBottomTabVisibility();

  const { triggerHaptic } = useHaptic();

  const { colors } = useThemeContext();

  const layout = useTabBarLayout(!!allowSide);

  if (!isVisible) return;

  const side = layout.position === "bottom" ? null : layout.position;
  const outerPadding = layout.position === "bottom" ? 0 : layout.width - layout.reserve;

  return (
    <View
      style={
        side
          ? {
              position: "absolute",
              top: 0,
              bottom: 0,
              [side]: 0,
              width: layout.position === "bottom" ? 0 : layout.width,
              ...(side === "left" ? { paddingLeft: outerPadding } : { paddingRight: outerPadding }),
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              backgroundColor: colors.BgPrimary,
              ...(side === "right"
                ? { borderLeftColor: colors.BorderDefault, borderLeftWidth: 1 }
                : { borderRightColor: colors.BorderDefault, borderRightWidth: 1 }),
            }
          : {
              flexDirection: "row",
              paddingLeft: insets.left,
              paddingRight: insets.right,
              paddingBottom: insets.bottom,
              height: insets.bottom + 48,
              alignItems: "center",
              borderTopColor: colors.BorderDefault,
              borderTopWidth: 1,
            }
      }
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          triggerHaptic();

          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const Icon = tabs[route.name].icon;

        return (
          <Pressable
            key={route.name}
            onPress={onPress}
            style={
              side
                ? {
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 52,
                    paddingHorizontal: 4,
                  }
                : {
                    flex: 1,
                    alignItems: "center",
                    gap: 0,
                    justifyContent: "center",
                    height: 44,
                    marginTop: 4,
                  }
            }
          >
            <Icon size={20} color={isFocused ? colors.BgAccent : colors.BgGray} />

            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
              style={[
                Typography.regularCaption,
                {
                  color: isFocused ? colors.TextAccent : colors.TextSecondary,
                },
              ]}
            >
              {t(tabs[route.name].title)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

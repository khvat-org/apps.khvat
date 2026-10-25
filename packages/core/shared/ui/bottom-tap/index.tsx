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

type IconComponent = React.ComponentType<IconProps>;

interface TabBarButtonProps extends BottomTabBarProps {
  tabs: {
    [key: string]: {
      title: string;
      icon: IconComponent;
    };
  };
}

export const TabBarButton = ({ state, navigation, tabs }: TabBarButtonProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { isVisible } = useBottomTabVisibility();

  const { triggerHaptic } = useHaptic();

  const { colors } = useThemeContext();

  if (!isVisible) return;

  return (
    <View
      style={{
        flexDirection: "row",
        paddingLeft: insets.left,
        paddingRight: insets.right,
        paddingBottom: insets.bottom,
        height: insets.bottom + 48,
        alignItems: "center",
        borderTopColor: colors.BorderDefault,
        borderTopWidth: 1,
      }}
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
            style={{
              flex: 1,
              alignItems: "center",
              gap: 0,
              justifyContent: "center",
              height: 44,
              marginTop: 4,
            }}
          >
            <Icon size={20} color={isFocused ? colors.BgAccent : colors.BgGray} />

            <Text
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

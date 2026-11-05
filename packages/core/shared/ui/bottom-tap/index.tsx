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

const SIDE_ITEM_SIZE = 48;
const SIDE_BOTTOM_MARGIN = 24;
const SIDE_TOP_MARGIN = 16;
const SENSOR_SIDE_PADDING = 12;

type IconComponent = React.ComponentType<IconProps>;

interface TabBarButtonProps extends BottomTabBarProps {
  allowSide?: boolean;
  sideTopInset?: number;
  sideBottomInset?: number;
  tabs: {
    [key: string]: {
      title: string;
      icon: IconComponent;
      sideContent?: React.ReactNode;
    };
  };
}

export const TabBarButton = ({
  state,
  navigation,
  tabs,
  allowSide,
  sideTopInset,
  sideBottomInset,
}: TabBarButtonProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { isVisible } = useBottomTabVisibility();

  const { triggerHaptic } = useHaptic();

  const { colors } = useThemeContext();

  const layout = useTabBarLayout(!!allowSide);

  if (!isVisible) return;

  const side = layout.position === "bottom" ? null : layout.position;
  const getOuterPadding = () => {
    if (layout.position === "bottom") return 0;
    if (layout.reserve === 0) return SENSOR_SIDE_PADDING;

    return layout.width - layout.reserve;
  };
  const outerPadding = getOuterPadding();

  const buttons = state.routes.map((route, index) => {
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

    if (side) {
      return (
        <Pressable
          key={route.name}
          accessibilityRole="tab"
          accessibilityLabel={t(tabs[route.name].title)}
          accessibilityState={{ selected: isFocused }}
          onPress={onPress}
          style={{
            width: SIDE_ITEM_SIZE,
            height: SIDE_ITEM_SIZE,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={24} color={isFocused ? colors.BgAccent : colors.BgGray} />
        </Pressable>
      );
    }

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
  });

  if (side) {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          [side]: 0,
          width: layout.position === "bottom" ? 0 : layout.width,
          ...(side === "left" ? { paddingLeft: outerPadding } : { paddingRight: outerPadding }),
          paddingTop: sideTopInset ?? insets.top + SIDE_TOP_MARGIN,
          paddingBottom: sideBottomInset ?? Math.max(insets.bottom, SIDE_BOTTOM_MARGIN),
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: colors.BgPrimary,
          ...(side === "right"
            ? { borderLeftColor: colors.BorderDefault, borderLeftWidth: 1 }
            : { borderRightColor: colors.BorderDefault, borderRightWidth: 1 }),
        }}
      >
        <View>{tabs[state.routes[state.index].name].sideContent}</View>

        <View
          style={{
            width: SIDE_ITEM_SIZE,
            borderRadius: SIDE_ITEM_SIZE / 2,
            backgroundColor: colors.BgSecondary,
          }}
        >
          {buttons}
        </View>
      </View>
    );
  }

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
      {buttons}
    </View>
  );
};

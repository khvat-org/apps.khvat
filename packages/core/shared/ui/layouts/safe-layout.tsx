import React, { ReactNode } from "react";

import { StyleProp, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeLayoutProps {
  disableButton?: boolean;
  disableTop?: boolean;
  disableLeft?: boolean;
  disableRight?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  additionalPaddingTop?: number;
}

const SafeLayout: React.FC<SafeLayoutProps> = ({
  disableButton = false,
  disableTop = false,
  disableLeft = false,
  disableRight = false,
  additionalPaddingTop = 0,
  style = {},
  children,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          paddingTop: !disableTop ? insets.top + additionalPaddingTop : 0,
          paddingBottom: !disableButton ? insets.bottom : 0,
          paddingLeft: !disableLeft ? insets.left + 16 : 0,
          paddingRight: !disableRight ? insets.right + 16 : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default SafeLayout;

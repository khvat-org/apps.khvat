import React, { ReactNode } from "react";

import { StyleProp, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeLayoutProps {
  disableButton?: boolean;
  disableTop?: boolean;
  disableSides?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

const SafeLayout: React.FC<SafeLayoutProps> = ({
  disableButton = false,
  disableTop = false,
  disableSides = false,
  style = {},
  children,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: !disableTop ? insets.top : 0,
          paddingBottom: !disableButton ? insets.bottom : 0,
          paddingLeft: !disableSides ? insets.left : 0,
          paddingRight: !disableSides ? insets.right : 0,

          // borderWidth: 1,
          // borderColor: "red",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default SafeLayout;

import React, { useState } from "react";

import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { useFileUrl } from "@nihongo/core/shared/lib/api-gateway";
import { Typography } from "@nihongo/core/shared/typography";
import { Image, StyleSheet, Text, View } from "react-native";

type ImageBlockProps = {
  url: string;
  alt?: string;
};

const PLACEHOLDER_ASPECT_RATIO = 4 / 3;

const ImageBlock: React.FC<ImageBlockProps> = ({ url, alt }) => {
  const { colors } = useThemeContext();
  const uri = useFileUrl(url);

  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [isError, setIsError] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          aspectRatio: aspectRatio ?? PLACEHOLDER_ASPECT_RATIO,
          backgroundColor: aspectRatio ? colors.transparent : colors.BgSecondary,
        },
      ]}
    >
      {isError ? (
        <Text style={[styles.alt, { color: colors.TextSecondary }]}>{alt}</Text>
      ) : (
        <Image
          source={uri ? { uri } : undefined}
          accessible={!!alt}
          accessibilityLabel={alt}
          resizeMode="contain"
          style={styles.image}
          onLoad={({ nativeEvent: { source } }) => {
            if (source.width > 0 && source.height > 0) {
              setAspectRatio(source.width / source.height);
            }
          }}
          onError={() => setIsError(true)}
        />
      )}
    </View>
  );
};

export default ImageBlock;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  alt: {
    ...Typography.regularDefault,
    margin: "auto",
    padding: 16,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

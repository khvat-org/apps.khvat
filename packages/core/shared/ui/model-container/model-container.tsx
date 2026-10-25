import React from "react";

import { StatusBar, StyleSheet, View } from "react-native";

interface ModelContainerProps {
  children: React.ReactNode;
}

export const ModelContainer: React.FC<ModelContainerProps> = ({ children }) => {
  // * flex: 1 обязателен — без него высота контейнера равна контенту, и вложенные
  // * FlatList/ScrollView не получают границы, по которой могли бы скроллиться
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

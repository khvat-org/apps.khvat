import React, { useState } from "react";

import SettingItem from "@nihongo/core/entities/setting/setting-item/setting-item";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import Input from "@nihongo/core/shared/ui/input";
import { ModalHeader } from "@nihongo/core/shared/ui/modal-header/modal-header";
import { ModelContainer } from "@nihongo/core/shared/ui/model-container/model-container";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";

import { createBoard } from "@/shared/api/create-board";

const CreateBoardPage: React.FC = () => {
  const navigation = useNavigation();

  const { t } = useTranslation();
  const { colors } = useThemeContext();

  const styles = makeStyles(colors);

  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const canSubmit = title.trim().length > 0 && !isSending;

  const submit = async () => {
    if (!canSubmit) return;

    setIsSending(true);

    try {
      await createBoard(title.trim(), isPublic);
      navigation.goBack();
    } catch {
      setIsSending(false);
    }
  };

  return (
    <ModelContainer>
      <View style={styles.container}>
        <ModalHeader
          title={t("boards.newBoard")}
          left={{
            text: t("alert.cancel"),
            onPress: () => navigation.goBack(),
          }}
          right={{
            text: t("common.save"),
            onPress: submit,
            color: canSubmit ? colors.TextPrimary : colors.TextDisabled,
          }}
        />

        <View style={styles.content}>
          <Input
            placeholder={t("boards.namePlaceholder")}
            value={title}
            onChange={setTitle}
            autoFocus
          />

          <View style={styles.switch}>
            <SettingItem
              text={t("boards.isPublic")}
              isEnable={isPublic}
              onValueChange={() => setIsPublic((value) => !value)}
              isLast
            />
          </View>
        </View>
      </View>
    </ModelContainer>
  );
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 16,
      gap: 16,
    },
    switch: {
      backgroundColor: colors.BgSecondary,
      borderRadius: 12,
      paddingLeft: 16,
      overflow: "hidden",
    },
  });

export default CreateBoardPage;

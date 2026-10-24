import React, { useCallback, useEffect, useState } from "react";

import SettingItem from "@nihongo/core/entities/setting/setting-item/setting-item";
import { useModal } from "@nihongo/core/shared/contexts/modal/modal-context";
import { ConfirmationModal } from "@nihongo/core/shared/contexts/modal/presets/confirmation";
import { ColorsType, useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import { Typography } from "@nihongo/core/shared/typography";
import Input from "@nihongo/core/shared/ui/input";
import { ModalHeader } from "@nihongo/core/shared/ui/modal-header/modal-header";
import { ModelContainer } from "@nihongo/core/shared/ui/model-container/model-container";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, ScrollView, Pressable, Share } from "react-native";

import { RootStackParamList, ROUTES } from "@/app/routes.types";
import {
  EditorInfo,
  InviteInfo,
  createInvite,
  deleteBoard,
  getBoardMeta,
  getEditors,
  getInvites,
  removeEditor,
  revokeInvite,
  updateBoardMeta,
} from "@/shared/api/board-settings";

type BoardSettingsRouteProp = RouteProp<RootStackParamList, typeof ROUTES.BOARD_SETTINGS>;

const formatDate = (iso: string) => {
  const date = new Date(iso);

  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString();
};

const BoardSettingsPage: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<BoardSettingsRouteProp>();

  const { id } = route.params;

  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const { showModal, hideModal } = useModal();

  const styles = makeStyles(colors);

  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [editors, setEditors] = useState<EditorInfo[]>([]);
  const [invites, setInvites] = useState<InviteInfo[]>([]);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const canSubmit = title.trim().length > 0 && !isSending;

  const load = useCallback(async () => {
    const meta = await getBoardMeta(id);

    setTitle(meta.title);
    setIsPublic(meta.public);

    if (meta.isOwner) {
      setEditors(await getEditors(id));
      setInvites(await getInvites(id));
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async () => {
    if (!canSubmit) return;

    setIsSending(true);

    try {
      await updateBoardMeta(id, title.trim(), isPublic);
      navigation.goBack();
    } catch {
      setIsSending(false);
    }
  };

  const share = async (url: string) => {
    await Share.share({ message: url });
  };

  const addInvite = async () => {
    setError("");

    try {
      const invite = await createInvite(id);

      setInvites(await getInvites(id));
      share(invite.url);
    } catch {
      setError(t("boards.inviteLimit"));
    }
  };

  const dropInvite = async (inviteId: string) => {
    await revokeInvite(id, inviteId);
    setInvites(await getInvites(id));
  };

  const dropEditor = async (userId: string) => {
    await removeEditor(id, userId);
    setEditors(await getEditors(id));
  };

  const confirmDelete = () =>
    showModal({
      closeOnBackdrop: false,
      onClose: () => {},
      content: (
        <ConfirmationModal
          title={t("boards.deleteTitle")}
          subtitle={t("boards.deleteSubtitle")}
          cancelText={t("alert.cancel")}
          confirmText={t("alert.confirm")}
          onConfirm={async () => {
            hideModal();
            await deleteBoard(id);
            navigation.goBack();
          }}
          onCancel={hideModal}
        />
      ),
    });

  return (
    <ModelContainer>
      <View style={styles.container}>
        <ModalHeader
          title={t("boards.settingsTitle")}
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

        <ScrollView contentContainerStyle={styles.content}>
          <Input placeholder={t("boards.namePlaceholder")} value={title} onChange={setTitle} />

          <View style={styles.group}>
            <SettingItem
              text={t("boards.isPublic")}
              isEnable={isPublic}
              onValueChange={() => setIsPublic((value) => !value)}
              isLast
            />
          </View>

          <Text style={styles.sectionTitle}>{t("boards.editors")}</Text>

          <View style={styles.group}>
            {editors.length === 0 && <Text style={styles.empty}>{t("boards.noEditors")}</Text>}

            {editors.map((editor) => (
              <View style={styles.row} key={editor.id}>
                <Text style={styles.rowText}>{editor.email}</Text>

                <Pressable onPress={() => dropEditor(editor.id)}>
                  <Text style={styles.rowAction}>{t("boards.remove")}</Text>
                </Pressable>
              </View>
            ))}
          </View>

          {invites.map((invite) => (
            <View style={styles.group} key={invite.id}>
              <View style={styles.row}>
                <Text style={styles.rowText}>
                  {t("boards.inviteUntil", { date: formatDate(invite.expiresAt) })}
                </Text>

                <Pressable onPress={() => dropInvite(invite.id)}>
                  <Text style={styles.rowAction}>{t("boards.revoke")}</Text>
                </Pressable>
              </View>
            </View>
          ))}

          <View style={styles.group}>
            <SettingItem text={t("boards.createInvite")} onClick={addInvite} isLast hideArrow />
          </View>

          {error.length > 0 && <Text style={styles.error}>{error}</Text>}

          <View style={styles.group}>
            <SettingItem
              text={t("boards.deleteBoard")}
              onClick={confirmDelete}
              isLast
              isDanger
              hideArrow
            />
          </View>
        </ScrollView>
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
      paddingBottom: 32,
      gap: 16,
    },
    group: {
      backgroundColor: colors.BgSecondary,
      borderRadius: 12,
      paddingLeft: 16,
      overflow: "hidden",
    },
    sectionTitle: {
      ...Typography.boldLabel,

      color: colors.TextPrimary,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingRight: 16,
      minHeight: 44,
      gap: 12,
    },
    rowText: {
      ...Typography.regularLabel,

      color: colors.TextPrimary,
      flex: 1,
    },
    rowAction: {
      ...Typography.regularLabel,

      color: colors.TextDanger,
    },
    empty: {
      ...Typography.regularLabel,

      color: colors.TextSecondary,
      paddingVertical: 12,
    },
    error: {
      ...Typography.regularLabel,

      color: colors.TextDanger,
    },
  });

export default BoardSettingsPage;

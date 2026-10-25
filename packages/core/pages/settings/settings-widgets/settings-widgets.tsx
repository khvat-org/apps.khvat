import React, { useState } from "react";

import SettingItem from "@nihongo/core/entities/setting/setting-item/setting-item";
import SettingsSection from "@nihongo/core/entities/setting/setting-section/settings-section";
import { useThemeContext } from "@nihongo/core/shared/contexts/theme/theme-context";
import {
  ProfileWidget,
  useAvailableProfileWidgets,
  useProfileWidgets,
} from "@nihongo/core/shared/lib/settings/useProfileWidgets";
import { ModalHeader } from "@nihongo/core/shared/ui/modal-header/modal-header";
import { ModelContainer } from "@nihongo/core/shared/ui/model-container/model-container";
import { useNavigation } from "@react-navigation/native";
import { CalendarDotsIcon, TelegramLogoIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SettingsWidgetsPage: React.FC = () => {
  const navigation = useNavigation();

  const { t } = useTranslation();
  const { colors } = useThemeContext();
  const insets = useSafeAreaInsets();

  const available = useAvailableProfileWidgets();
  const { widgets, loaded, saveWidgets } = useProfileWidgets();

  const [draft, setDraft] = useState<Partial<Record<ProfileWidget, boolean>>>({});

  const current = { ...widgets, ...draft };

  const isDirty = loaded && available.some((key) => current[key] !== widgets[key]);

  const save = () => {
    if (!isDirty) return;

    saveWidgets(current);
    navigation.goBack();
  };

  const items: Record<ProfileWidget, { title: string; icon: React.ReactNode }> = {
    statistics: {
      title: t("settings.widgets.statistics"),
      icon: <CalendarDotsIcon size={20} color={colors.BgContrast} />,
    },
    social: {
      title: t("settings.widgets.social"),
      icon: <TelegramLogoIcon size={20} color={colors.BgContrast} />,
    },
  };

  return (
    <ModelContainer>
      <View style={{ flex: 1, paddingBottom: insets.bottom }}>
        <ModalHeader
          title={t("settings.widgets.title")}
          left={{
            text: t("alert.cancel"),
            onPress: () => navigation.goBack(),
          }}
          right={{
            text: t("common.save"),
            onPress: save,
            isDisabled: !isDirty,
          }}
        />

        <View style={{ marginTop: 16 }}>
          <SettingsSection>
            {available.map((key, index) => (
              <SettingItem
                key={key}
                leftIcon={items[key].icon}
                text={items[key].title}
                isEnable={current[key]}
                onValueChange={() => setDraft((prev) => ({ ...prev, [key]: !current[key] }))}
                isLast={index === available.length - 1}
              />
            ))}
          </SettingsSection>
        </View>
      </View>
    </ModelContainer>
  );
};

export default SettingsWidgetsPage;

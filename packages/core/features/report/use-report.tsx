import React, { useCallback } from "react";

import { useModal } from "@nihongo/core/shared/contexts/modal/modal-context";
import { AlertModal } from "@nihongo/core/shared/contexts/modal/presets/alert";
import { useTranslation } from "react-i18next";

import ReportModal from "./report-modal";

export type OpenReportParams = {
  tags: string[];
  context: string;

  onClose?: () => void;
};

export const useReport = () => {
  const { t } = useTranslation();
  const { showModal, hideModal } = useModal();

  const openReport = useCallback(
    ({ tags, context, onClose }: OpenReportParams) => {
      const close = () => {
        hideModal();
        onClose?.();
      };

      showModal({
        closeOnBackdrop: false,
        onClose,
        content: (
          <ReportModal
            tags={tags}
            context={context}
            onClose={close}
            onSent={() =>
              showModal({
                onClose,
                content: (
                  <AlertModal
                    title={t("report.success.title")}
                    subtitle={t("report.success.subtitle")}
                    onPress={close}
                  />
                ),
              })
            }
          />
        ),
      });
    },
    [hideModal, showModal, t],
  );

  return { openReport };
};

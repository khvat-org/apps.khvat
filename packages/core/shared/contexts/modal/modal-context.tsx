import React, { createContext, useCallback, useContext, useState, ReactNode } from "react";

import { Modal, Pressable, StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";

import { useHaptic } from "../haptic/haptic-context";
import { ColorsType, useThemeContext } from "../theme/theme-context";

interface ModalOptions {
  content: ReactNode;
  onClose?: () => void;
  closeOnBackdrop?: boolean;
}

interface ModalContextType {
  showModal: (options: ModalOptions) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { triggerHaptic } = useHaptic();

  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ModalOptions | null>(null);

  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const showModal = useCallback((opts: ModalOptions) => {
    setOptions(opts);
    setVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    triggerHaptic();

    setVisible(false);
    options?.onClose?.();
    setOptions(null);
  }, [options, triggerHaptic]);

  const handleBackdropPress = useCallback(() => {
    if (options?.closeOnBackdrop !== false) {
      hideModal();
    }
  }, [options, hideModal]);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={hideModal}
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.overlay}>
            <Pressable style={styles.backdrop} onPress={handleBackdropPress} />
            <View style={styles.content} pointerEvents="box-none">
              {options?.content}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
};

const makeStyles = (colors: ColorsType) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    overlay: {
      flex: 1,
      backgroundColor: colors.BgModal,
      justifyContent: "center",
      alignItems: "center",

      paddingTop: 40,
      paddingBottom: 40,
    },
    backdrop: {
      ...StyleSheet.absoluteFill,
    },
    content: {
      width: "100%",
      alignItems: "center",
      paddingHorizontal: 16,
    },
  });

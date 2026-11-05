import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

import { Modal, Pressable, StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";

import { isIOS } from "../../constants/platformUtil";
import { markTransition } from "../../lib/navigation/sheet-transition-guard";
import SafeLayout from "../../ui/layouts/safe-layout";
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

const SHOW_TIMEOUT_MS = 1000;
const DISMISS_TIMEOUT_MS = 1000;
const MAX_SHOW_RETRIES = 2;

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { triggerHaptic } = useHaptic();

  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ModalOptions | null>(null);
  const [modalKey, setModalKey] = useState(0);
  const [isShown, setIsShown] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const optionsRef = useRef<ModalOptions | null>(null);
  const isOpenRef = useRef(false);
  const isDismissingRef = useRef(false);
  const showRetriesRef = useRef(0);

  const { colors } = useThemeContext();
  const styles = makeStyles(colors);

  const present = useCallback(() => {
    markTransition();
    isOpenRef.current = true;
    showRetriesRef.current = 0;
    setIsShown(false);
    setModalKey((key) => key + 1);
    setVisible(true);
  }, []);

  const showModal = useCallback(
    (opts: ModalOptions) => {
      optionsRef.current = opts;
      setOptions(opts);

      if (!isOpenRef.current && !isDismissingRef.current) {
        present();
      }
    },
    [present],
  );

  const close = useCallback(() => {
    const current = optionsRef.current;
    optionsRef.current = null;

    if (isIOS && isOpenRef.current) {
      markTransition();
      isDismissingRef.current = true;
      setIsDismissing(true);
    }

    isOpenRef.current = false;
    setVisible(false);
    setOptions(null);
    current?.onClose?.();
  }, []);

  const hideModal = useCallback(() => {
    triggerHaptic();
    close();
  }, [close, triggerHaptic]);

  const finishDismiss = useCallback(() => {
    if (!isDismissingRef.current) return;

    isDismissingRef.current = false;
    setIsDismissing(false);

    if (optionsRef.current) {
      present();
    }
  }, [present]);

  useEffect(() => {
    if (!isDismissing) return undefined;

    const timer = setTimeout(finishDismiss, DISMISS_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isDismissing, finishDismiss]);

  useEffect(() => {
    if (!isIOS || !visible || isShown) return undefined;

    const timer = setTimeout(() => {
      if (showRetriesRef.current < MAX_SHOW_RETRIES) {
        showRetriesRef.current += 1;
        setModalKey((key) => key + 1);
        return;
      }

      close();
    }, SHOW_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [visible, isShown, modalKey, close]);

  const handleBackdropPress = useCallback(() => {
    if (options?.closeOnBackdrop !== false) {
      hideModal();
    }
  }, [options, hideModal]);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal
        key={modalKey}
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={hideModal}
        onShow={() => setIsShown(true)}
        onDismiss={finishDismiss}
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <SafeLayout disableTop style={styles.overlay}>
            <Pressable style={styles.backdrop} onPress={handleBackdropPress} />
            <View style={styles.content} pointerEvents="box-none">
              {options?.content}
            </View>
          </SafeLayout>
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

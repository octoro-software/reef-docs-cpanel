import React from "react";
import { getAppDimensions } from "../utility/dimensions";
import { SlideInModal } from "../components/Modal/Modal";
import { ModalRegistry, ModalRegistryTypes } from "../registry/ModalRegistry";
import { APP_HEADER_HEIGHT, WHITE } from "../constants";
import { isEdgeToEdge } from "../utility/isEdgeToEdge";
import { Platform } from "react-native";

type HeightEnums = "small" | "medium" | "large" | "full";

type ModalState = {
  visible: boolean;
  height: HeightEnums;
  type: ModalRegistryTypes | null;
  modalTitle?: string;
  data?: any;
  onAfterClose?: () => void;
  canClose?: boolean;
  backgroundColor?: string;
};

type ModalContextType = {
  openModal: (modalState: Omit<ModalState, "visible">) => void;
  closeModal: (onAfterClose?: () => void) => void;
  closeAllModals: () => void;
  modalVisible: boolean;
};

export const ModalContext = React.createContext<ModalContextType>({} as any);

const { height: screenHeight } = getAppDimensions();

export const heightValues = {
  small: 300,
  medium: 500,
  large:
    screenHeight -
    (isEdgeToEdge()
      ? APP_HEADER_HEIGHT + 55
      : Platform.OS === "android"
        ? 30
        : 80),
  full: screenHeight,
};

export const ModalProvider: React.FC = ({ children }) => {
  const [modalStack, setModalStack] = React.useState<ModalState[]>([]);
  const [closingIndices, setClosingIndices] = React.useState<number[]>([]);

  // Remove closed modals after animation
  React.useEffect(() => {
    if (closingIndices.length > 0) {
      const timer = setTimeout(() => {
        setModalStack((prev) =>
          prev.filter((_, idx) => !closingIndices.includes(idx))
        );
        setClosingIndices([]);
      }, 300); // match animation
      return () => clearTimeout(timer);
    }
  }, [closingIndices]);

  const openModal = React.useCallback(
    ({
      height,
      type,
      data,
      modalTitle,
      canClose = true,
      backgroundColor,
    }: Omit<ModalState, "visible">) => {
      setModalStack((prev) => {
        // Prevent duplicate modals of the same type
        if (type && prev.some((modal) => modal.type === type)) {
          return prev;
        }
        return [
          ...prev,
          {
            visible: true,
            height,
            type,
            data,
            modalTitle,
            canClose,
            backgroundColor,
          },
        ];
      });
    },
    []
  );

  const closeModal = React.useCallback((onAfterClose?: () => void) => {
    setModalStack((prev) => {
      if (prev.length === 0) return prev;
      // Mark the top modal as closing (visible: false)
      const idx = prev.length - 1;
      setClosingIndices((ci) => [...ci, idx]);
      const newStack = prev.map((modal, i) =>
        i === idx ? { ...modal, visible: false } : modal
      );
      // Optionally call onAfterClose for the top modal
      const top = prev[idx];
      const cb = onAfterClose || top?.onAfterClose;
      if (typeof cb === "function") {
        setTimeout(() => {
          cb();
        }, 600);
      }
      return newStack;
    });
  }, []);

  // Close all modals simultaneously
  const closeAllModals = React.useCallback(() => {
    setModalStack((prev) => {
      if (prev.length === 0) return prev;
      // Mark all modals as closing (visible: false)
      setClosingIndices(Array.from({ length: prev.length }, (_, i) => i));
      return prev.map((modal) => ({ ...modal, visible: false }));
    });
  }, []);

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        closeAllModals,
        modalVisible: modalStack.length > 0,
      }}
    >
      {modalStack.map((modalState, idx) => {
        const Component = modalState.type
          ? ModalRegistry[modalState.type]
          : null;

        return (
          <SlideInModal
            key={idx}
            visible={modalState.visible}
            height={heightValues[modalState.height]}
            onClose={() => closeModal()}
            title={modalState.modalTitle}
            onAfterClose={modalState.onAfterClose}
            canClose={modalState.canClose}
            backgroundColor={modalState?.backgroundColor || WHITE}
          >
            {Component && (
              <Component
                {...modalState.data}
                height={heightValues[modalState.height]}
              />
            )}
          </SlideInModal>
        );
      })}
      {children}
    </ModalContext.Provider>
  );
};

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  View,
  Dimensions,
  Modal as RNModal,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { Heading } from "../Heading/Heading";
import { Grid, GridItem } from "../Grid/Grid";
import { Icon } from "../Icon/Icon";
import { INPUT_BORDER_COLOR, REEF_DOCS_BLUE } from "../../constants";
import { MODAL_TIMEOUT } from "../../constants/global";

export const SlideInModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onAfterClose?: () => void;
  children: React.ReactNode;
  height: number;
  title?: string;
  scrollView?: boolean;
  canClose?: boolean;
  legacy?: boolean;
}> = ({
  visible,
  onClose,
  onAfterClose,
  children,
  height,
  title,
  scrollView = false,
  canClose = true,
  legacy = true,
}) => {
  const [shouldRender, setShouldRender] = useState(visible);

  const translateY = useSharedValue(height);

  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const config = { duration: MODAL_TIMEOUT, easing: Easing.out(Easing.ease) };

    if (visible) {
      setShouldRender(true);
      translateY.value = withTiming(0, config);
      backdropOpacity.value = withTiming(1, config);
    } else {
      translateY.value = withTiming(height, config);
      backdropOpacity.value = withTiming(0, config);

      // Schedule cleanup after the animation finishes
      timeout = setTimeout(() => {
        setShouldRender(false);
        if (typeof onAfterClose === "function") {
          onAfterClose();
        }
      }, 600);
    }

    // Cleanup timer if effect re-runs or component unmounts
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [visible, height, onAfterClose]);

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!shouldRender) return null;

  // Custom modal: absolutely positioned overlay

  const bottomOffset = 0;

  if (legacy) {
    return (
      <RNModal
        transparent
        visible={shouldRender}
        animationType="none"
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback disabled={!canClose} onPress={onClose}>
          <Animated.View style={[styles.backdrop, animatedBackdropStyle]} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.modalContainer,
            { height, bottom: bottomOffset },
            animatedModalStyle,
          ]}
        >
          {scrollView ? (
            <>
              <ModalHeader
                title={title}
                onClose={onClose}
                canClose={canClose}
              />
              <ScrollView>{children}</ScrollView>
            </>
          ) : (
            <>
              <ModalHeader
                title={title}
                onClose={onClose}
                canClose={canClose}
              />
              {children}
            </>
          )}
        </Animated.View>
      </RNModal>
    );
  }

  return (
    <View style={styles.absoluteFill} pointerEvents="box-none">
      <TouchableWithoutFeedback disabled={!canClose} onPress={onClose}>
        <Animated.View style={[styles.backdrop, animatedBackdropStyle]} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.modalContainer,
          { height, bottom: bottomOffset },
          animatedModalStyle,
        ]}
      >
        {scrollView ? (
          <>
            <ModalHeader title={title} onClose={onClose} canClose={canClose} />
            <ScrollView>{children}</ScrollView>
          </>
        ) : (
          <>
            <ModalHeader title={title} onClose={onClose} canClose={canClose} />
            {children}
          </>
        )}
      </Animated.View>
    </View>
  );
};

const ModalHeader: React.FC<{
  title?: string;
  onClose: () => void;
  canClose: boolean;
}> = ({ title, onClose, canClose }) => (
  <Grid direction="row" style={styles.header}>
    <GridItem flex={1}>
      {title && (
        <Heading variant={5} weight="semiBold" style={styles.headerText}>
          {title}
        </Heading>
      )}
    </GridItem>
    <TouchableOpacity
      disabled={!canClose}
      style={styles.closeWrapper}
      onPress={onClose}
    >
      {canClose && (
        <GridItem>
          <Icon name="close" fill={REEF_DOCS_BLUE} />
        </GridItem>
      )}
    </TouchableOpacity>
  </Grid>
);

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const styles = StyleSheet.create({
  absoluteFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 9999,
    elevation: 9999,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  modalContainer: {
    position: "absolute",
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
    zIndex: 2,
  },
  header: {
    borderBottomWidth: 1,
    padding: 8,
    borderBottomColor: INPUT_BORDER_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  closeWrapper: { position: "absolute", right: 16, bottom: 8 },
  headerText: { textAlign: "center" },
});

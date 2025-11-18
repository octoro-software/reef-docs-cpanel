import React, { useRef, useState } from "react";
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Easing,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Icon } from "../Icon/Icon";
import { BLACK, INPUT_BORDER_COLOR } from "../../constants";
import { sendEvent } from "../../utility/analytics";
import { Skeleton } from "../Skeleton/Skeleton";
import { Heading } from "../Heading/Heading";
// import { ChevronDown } from "lucide-react-native";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const Accordion = ({
  title,
  children,
  initiallyOpen = false,
  liveStockId,
  analyticsEventId,
  loading = false,
  renderIf,
  header = false,
}) => {
  const [open, setOpen] = useState(initiallyOpen);
  const [contentHeight, setContentHeight] = useState(0);

  const animatedHeight = useRef(
    new Animated.Value(initiallyOpen ? 1 : 0)
  ).current;

  const toggleAccordion = () => {
    setOpen((prev) => !prev);
    Animated.timing(animatedHeight, {
      toValue: open ? 0 : 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();

    if (!open) {
      sendEvent(analyticsEventId, {
        title,
        liveStockId,
      });
    }
  };

  const heightInterpolation = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  const arrowRotate = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  if (!loading && !renderIf) return null;

  return (
    <View style={styles.container}>
      {!loading ? (
        <TouchableOpacity onPress={toggleAccordion} style={styles.header}>
          {header ? (
            <Heading variant={5} weight="semiBold">
              {title}
            </Heading>
          ) : (
            <Text style={styles.title}>{title}</Text>
          )}
          <Animated.View style={{ transform: [{ rotate: arrowRotate }] }}>
            <Icon name="chevronDown" fill={BLACK} />
          </Animated.View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          disabled
          onPress={toggleAccordion}
          style={styles.header}
        >
          <Skeleton height={18} marginBottom={0} marginTop={0} />
        </TouchableOpacity>
      )}

      {!loading && (
        <Animated.View
          style={{ height: heightInterpolation, overflow: "hidden" }}
        >
          <View
            style={styles.content}
            onLayout={(e) => {
              const height = e.nativeEvent.layout.height;
              setContentHeight(height);
            }}
          >
            {children}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    padding: 16,
    position: "absolute", // <-- Hidden while measured
    top: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: INPUT_BORDER_COLOR,
  },
});

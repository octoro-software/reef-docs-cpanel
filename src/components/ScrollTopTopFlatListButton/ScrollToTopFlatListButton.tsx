import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon } from "../Icon/Icon";
import { REEF_DOCS_BLUE, WHITE, Z_INDEX } from "../../constants";

export const ScrollToTopFlatListButton = ({ onPress, visible }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible && fadeAnim.__getValue() === 0) {
    // Not visible and already faded out → remove from tree
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.icon}>
          <Icon name="chevronDown" fill={WHITE} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 42,
    width: 42,
    backgroundColor: REEF_DOCS_BLUE,
    position: "absolute",
    bottom: 240,
    zIndex: Z_INDEX.scrollToTopFlatListButton,
    right: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    transform: [{ rotate: "180deg" }],
  },
});

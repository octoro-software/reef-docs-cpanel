import React, { useRef, useState, useMemo } from "react";
import {
  View,
  Pressable,
  Animated,
  ScrollView,
  StyleSheet,
  PanResponder,
} from "react-native";
import { Text } from "../../components";
import { REEF_DOCS_BLUE } from "../../constants";
import { getAppDimensions } from "../../utility/dimensions";

export const AnimatedTabs = ({ tabs = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const width = getAppDimensions().width;
  const horizontalPadding = 16;
  const paddedWidth = width - horizontalPadding * 2; // respect screen padding
  const TAB_WIDTH = paddedWidth / 2.5;

  const tabTranslate = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(0)).current;
  const panX = useRef(new Animated.Value(0)).current;

  const scrollViewRef = useRef(null);

  const combinedTranslate = Animated.add(contentTranslate, panX);

  const indicatorTranslate = Animated.add(
    tabTranslate,
    panX.interpolate({
      inputRange: [-paddedWidth, 0, paddedWidth],
      outputRange: [-TAB_WIDTH, 0, TAB_WIDTH],
      extrapolate: "clamp",
    })
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 10,
        onPanResponderMove: Animated.event([null, { dx: panX }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_, gestureState) => {
          const dx = gestureState.dx;
          const direction = dx > 0 ? -1 : 1;
          let newIndex = activeIndex + direction;
          newIndex = Math.max(0, Math.min(newIndex, tabs.length - 1));
          panX.setValue(0);
          handleTabPress(newIndex);
        },
      }),
    [activeIndex, tabs.length]
  );

  const handleTabPress = (index) => {
    const totalTabWidth = TAB_WIDTH * tabs.length;
    const maxScrollX = totalTabWidth - paddedWidth;
    const rawOffset = index * TAB_WIDTH;

    let targetScrollX = rawOffset - 16; // buffer to expose previous tab
    targetScrollX = Math.max(0, Math.min(targetScrollX, maxScrollX));

    scrollViewRef.current?.scrollTo({
      x: targetScrollX,
      animated: true,
    });

    Animated.spring(tabTranslate, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
    }).start();

    Animated.timing(contentTranslate, {
      toValue: -index * paddedWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setActiveIndex(index);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Tab Headers */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.tabContainer,
          { paddingRight: paddedWidth / 2 },
        ]}
      >
        {tabs.map((tab, index) => (
          <Pressable
            key={index}
            style={[styles.tab, { width: TAB_WIDTH }]}
            onPress={() => handleTabPress(index)}
          >
            <Text
              style={[
                styles.tabText,
                activeIndex === index && styles.tabTextActive,
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
        <Animated.View
          style={[
            styles.indicator,
            {
              width: TAB_WIDTH,
              transform: [{ translateX: indicatorTranslate }],
            },
          ]}
        />
      </ScrollView>

      {/* Tab Content */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          flexDirection: "row",
          width: paddedWidth * tabs.length,
          transform: [{ translateX: combinedTranslate }],
        }}
      >
        {tabs.map((tab, index) => (
          <View key={index} style={{ width: paddedWidth, paddingVertical: 16 }}>
            {tab.content}
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    position: "relative",
  },
  tab: {
    paddingVertical: 12,
    alignItems: "center",
  },
  tabText: {
    color: "#888",
    paddingHorizontal: 8,
  },
  tabTextActive: {
    color: REEF_DOCS_BLUE,
    fontWeight: "600",
  },
  indicator: {
    height: 3,
    backgroundColor: "#007AFF",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});

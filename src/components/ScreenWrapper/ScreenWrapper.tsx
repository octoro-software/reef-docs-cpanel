import React, { createContext, RefObject, useRef } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

import { getAppDimensions } from "../../utility/dimensions";

const ScrollRefContext = createContext<RefObject<ScrollView> | null>(null);

export const useScrollRef = () => {
  const scrollRef = React.useContext(ScrollRefContext);
  if (!scrollRef) {
    throw new Error("useScrollRef must be used within a ScrollRefProvider");
  }
  return scrollRef;
};

export const ScreenWrapper: React.FC<{
  children: React.ReactNode;
  scrollEnabled?: boolean;
  style?: any;
  disableMarginOffset?: boolean;
  insets?: number;
  persistTaps?: boolean;
  screenPadding?: number;
}> = ({
  children,
  scrollEnabled = true,
  style,
  disableMarginOffset = false,
  insets = 0,
  persistTaps = false,
  screenPadding = 16,
}) => {
  const { height, width } = getAppDimensions();

  const scrollRef = useRef(null);

  const screenHeight = height - insets;

  if (!scrollEnabled) {
    return (
      <View
        style={[
          styles.root,
          { minHeight: screenHeight, padding: screenPadding, paddingTop: 8 },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps={persistTaps ? "handled" : "never"}
        scrollEnabled={scrollEnabled}
        style={[
          styles.root,
          {
            minHeight: screenHeight,
            padding: screenPadding,
            paddingTop: 8,
          },
          style,
        ]}
      >
        <ScrollRefContext.Provider value={scrollRef}>
          {children}
        </ScrollRefContext.Provider>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    backgroundColor: "#EEF2F4",
    flex: 1,
    zIndex: 1,
  },
});

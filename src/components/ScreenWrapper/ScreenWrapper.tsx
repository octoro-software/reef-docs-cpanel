import React, { createContext, RefObject, useRef } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { IOScrollView } from "react-native-intersection-observer";

import { getAppDimensions } from "../../utility/dimensions";
import { useFooterHeight } from "../../hooks/useFooter";
import { APP_HEADER_HEIGHT } from "../../constants";

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

  const footerHeight = useFooterHeight();

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
      <IOScrollView
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
        contentContainerStyle={{
          paddingBottom: (footerHeight + 60 + APP_HEADER_HEIGHT) * 2,
        }}
      >
        <ScrollRefContext.Provider value={scrollRef}>
          {children}
        </ScrollRefContext.Provider>
      </IOScrollView>
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

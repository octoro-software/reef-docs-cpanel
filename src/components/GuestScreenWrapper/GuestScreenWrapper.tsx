import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const GuestScreenWrapper: React.FC<{
  children: React.ReactNode;
  scrollEnabled?: boolean;
  style?: any;
  disableMarginOffset?: boolean;
  insets?: number;
  persistTaps?: boolean;
}> = ({ children, scrollEnabled = true, style, persistTaps = false }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps={persistTaps ? "handled" : "never"}
        scrollEnabled={scrollEnabled}
        style={[styles.root, style]}
        contentContainerStyle={{ padding: 16 }}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    backgroundColor: "#EEF2F4",
    flex: 1,
    zIndex: 1,
    flexGrow: 1,
  },
});

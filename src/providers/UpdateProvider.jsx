import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import * as Updates from "expo-updates";
import { REEF_DOCS_BLUE, WHITE } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../components/Logo/Logo";

export const UpdateProvider = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);

  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = __DEV__ ? false : await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          setUpdateAvailable(true);

          if (!__DEV__) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync(); // restarts the app with new update
          }
        } else {
          setIsChecking(false); // No update, show app
        }
      } catch (e) {
        setIsChecking(false); // Allow app to load even if update fails
      }
    };

    checkForUpdates();
  }, []);

  if (isChecking) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Logo />
          <View style={{ marginTop: -32, marginBottom: 16 }}>
            <ActivityIndicator size="large" color={REEF_DOCS_BLUE} />
          </View>
          {updateAvailable && <Text>Please wait updating...</Text>}
        </View>
      </SafeAreaView>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: WHITE,
    gap: 8,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
  },
});

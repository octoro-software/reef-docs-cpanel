import React from "react";
import { Linking, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getAppDimensions } from "../../utility/dimensions";
import { Button, Heading, Icon, Text } from "../../components";

const height = getAppDimensions().height;

export const ForceUpgrade: React.FC = () => {
  const handleAppStoreLink = () => {
    const iosURL = "https://apps.apple.com/app/6746091301";
    const androidURL =
      "https://play.google.com/store/apps/details?id=com.octoro.aquadocs";

    Linking.openURL(Platform.OS === "ios" ? iosURL : androidURL);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Icon name="reefDocsUpdate" width={82} height={82} />
        <Heading variant={5} weight="semiBold">
          Update Required
        </Heading>
        <Text>
          {Platform.OS === "android"
            ? "Please Update Aqua Docs via the Play Store"
            : "Please Update Aqua Docs via the App Store"}
        </Text>
          <View style={{ marginBottom: 16, marginTop: 4 }}>
            <Button
              title="Update"
              variant="secondary"
              onPress={handleAppStoreLink}
            />
          </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: height,
  },
});

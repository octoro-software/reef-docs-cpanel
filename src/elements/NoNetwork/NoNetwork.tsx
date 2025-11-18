import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { REEF_DOCS_BLUE } from "../../constants";
import { getAppDimensions } from "../../utility/dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heading, Icon, Text } from "../../components";

const height = getAppDimensions().height;

export const NoNetwork: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Icon name="reefDocsWifi" width={82} height={82} />
        <Heading variant={5} weight="semiBold">
          No Network Connection
        </Heading>
        <Text>Checking....</Text>
        <View style={{ marginBottom: 16, marginTop: 4 }}>
          <ActivityIndicator size="large" color={REEF_DOCS_BLUE} />
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

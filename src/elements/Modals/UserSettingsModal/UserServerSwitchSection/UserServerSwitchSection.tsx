import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Button,
  Grid,
  GridItem,
  ModalComposition,
  ModalHeader,
  Select,
} from "../../../../components";

import { REEF_DOCS_GREY } from "../../../../constants";
import { SERVER_OPTIONS } from "../../../../constants/global";

export const UserServerSwitchSection = () => {
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [currentServer, setCurrentServer] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);

    await AsyncStorage.setItem(
      "usServer",
      currentServer === "us" ? "true" : "false"
    );

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 3000);

    setLoading(false);
  };

  const handleGetCurrentServer = async () => {
    const server =
      (await AsyncStorage.getItem("usServer")) === "true" ? "us" : "uk";

    setCurrentServer(server);
  };

  const handleOptionChange = (value: string) => {
    setCurrentServer(value);
  };

  useEffect(() => {
    handleGetCurrentServer();
  }, []);

  return (
    <ModalComposition
      footerStyle={{
        left: 1,
        paddingBottom: 32,
      }}
      renderFooter={() => (
        <Button
          onPress={handleSubmit}
          title={success ? "Preferences Saved !" : "Save Preferences"}
          isLoading={loading}
          variant={success ? "success" : "primary"}
        />
      )}
    >
      <View style={styles.wrapper}>
        <Grid gap={8}>
          <ModalHeader
            title="Region Settings"
            content="You can update your region preference here. We recommend using the region closest to your location for the best experience."
            icon="reefDocsServerChange"
            iconWidth={48}
            iconHeight={48}
          />

          <GridItem>
            <Select
              label="Server"
              title="Server"
              options={SERVER_OPTIONS}
              valueKey={"value"}
              labelKey={"label"}
              onConfirm={handleOptionChange}
              value={currentServer}
            />
          </GridItem>
        </Grid>
      </View>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    paddingTop: 0,
  },
  subText: {
    fontSize: 12,
    color: REEF_DOCS_GREY,
    textAlign: "center",
  },
});

import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import {
  CheckboxField,
  Grid,
  GridItem,
  ModalComposition,
  ModalHeader,
  Text,
} from "../../../../components";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { REEF_DOCS_GREY } from "../../../../constants";

export const UserSocialSection = () => {
  const [showSensitiveContent, setShowSensitiveContent] = useState(false);

  const handleCheck = async () => {
    const value = await AsyncStorage.getItem("alwaysShowSensitiveContent");

    setShowSensitiveContent(value === "true");
  };

  const handleSensitiveContentChange = async () => {
    const newValue = !showSensitiveContent;
    setShowSensitiveContent(newValue);

    await AsyncStorage.setItem(
      "alwaysShowSensitiveContent",
      newValue ? "true" : "false"
    );
  };

  useEffect(() => {
    handleCheck();
  }, []);

  return (
    <ModalComposition
      footerStyle={{
        left: 1,
        paddingBottom: 32,
      }}
    >
      <View style={styles.wrapper}>
        <Grid gap={8}>
          <ModalHeader
            title="Social Settings"
            content="You can update your social settings here."
            icon="reefDocsComment"
            iconWidth={48}
            iconHeight={48}
          />

          <Grid
            direction="row"
            gap={16}
            alignItems="center"
            style={{ flexWrap: "wrap" }}
          >
            <GridItem>
              <CheckboxField
                checked={showSensitiveContent}
                onChange={handleSensitiveContentChange}
              />
            </GridItem>
            <GridItem flex={1}>
              <Text>Always Show Sensitive Content</Text>
            </GridItem>
          </Grid>
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
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: REEF_DOCS_GREY,
    backgroundColor: "#EEF2F4",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  editIcon: {
    position: "absolute",
    right: -10,
    bottom: 0,
  },
});

import React from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";

import {
  Grid,
  GridItem,
  Heading,
  ModalComposition,
  ModalHeader,
  Text,
} from "../../../../components";

import { REEF_DOCS_GREY } from "../../../../constants";

export const UserDeveloperInformation = () => {
  const handleLinkPress = (link) => {
    if (Linking.canOpenURL(link)) {
      Linking.openURL(link);
    }
  };

  return (
    <ModalComposition footerFix>
      <View style={styles.wrapper}>
        <Grid gap={8}>
          <ModalHeader
            title="Contact"
            icon="reefDocsContact"
            iconHeight={48}
            iconWidth={48}
          />
          <Heading
            variant={5}
            weight="semiBold"
            style={{ textAlign: "center" }}
          >
            Octoro Software Solutions
          </Heading>

          <Heading variant={5} weight="semiBold">
            Development Enquiry
          </Heading>

          <GridItem>
            <TouchableOpacity
              onPress={() => handleLinkPress("mailto:hello@octoro.co.uk")}
            >
              <Text weight="bold">hello@octoro.co.uk</Text>
            </TouchableOpacity>
          </GridItem>

          <GridItem>
            <TouchableOpacity
              onPress={() => handleLinkPress("https://www.octoro.co.uk")}
            >
              <Text weight="bold">www.octoro.co.uk</Text>
            </TouchableOpacity>
          </GridItem>

          <Heading variant={5} weight="semiBold">
            Aqua Docs Enquiry
          </Heading>

          <GridItem>
            <TouchableOpacity
              onPress={() => handleLinkPress("mailto:support@aqua-docs.co.uk")}
            >
              <Text weight="bold">support@aqua-docs.co.uk</Text>
            </TouchableOpacity>
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

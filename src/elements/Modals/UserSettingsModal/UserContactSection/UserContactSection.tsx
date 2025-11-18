import React from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";

import {
  Grid,
  GridItem,
  ModalComposition,
  ModalHeader,
  Text,
} from "../../../../components";

import { REEF_DOCS_GREY } from "../../../../constants";

export const UserContactSection = () => {
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

          <Text>
            Please use the below email address to contact us. We aim to respond
            within 24 hours but we are a very small team so this can take
            longer. We appreciate your cooperation.
          </Text>

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

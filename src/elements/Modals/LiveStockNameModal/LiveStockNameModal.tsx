import React from "react";
import { StyleSheet, View } from "react-native";

import { useModal } from "../../../hooks/useModal";

import {
  Button,
  Grid,
  GridItem,
  Heading,
  ModalComposition,
  Text,
} from "../../../components";

export const LiveStockNameModal = ({
  name,
  scientificName,
  alternateNames,
}) => {
  const { closeModal } = useModal();

  const alternateNamesList = alternateNames?.length
    ? alternateNames.join(", ")
    : "None";

  return (
    <ModalComposition
      footerFix
      renderFooter={() => <Button title="Close" onPress={closeModal} />}
    >
      <View style={styles.container}>
        <Grid gap={8}>
          <GridItem>
            <Heading variant={5} weight="semiBold">
              Name
            </Heading>
            <Text>{name}</Text>
          </GridItem>
          <GridItem>
            <Heading variant={5} weight="semiBold">
              Scientific Name
            </Heading>
            <Text>{scientificName}</Text>
          </GridItem>
          <GridItem>
            <Heading variant={5} weight="semiBold">
              Alternate Names
            </Heading>
            <Text>{alternateNamesList}</Text>
          </GridItem>
        </Grid>
      </View>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

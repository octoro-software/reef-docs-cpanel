import React from "react";
import { StyleSheet, View } from "react-native";

import { LiveStockProfileCarousel } from "../../../components/LiveStockProfileCarousel/LiveStockProfileCarousel";
import {
  Button,
  Grid,
  Heading,
  ModalComposition,
  Text,
} from "../../../components";
import { useModal } from "../../../hooks/useModal";

export const RelatedProductModal = ({ images, name, description }) => {
  const { closeModal } = useModal();

  return (
    <ModalComposition
      footerFix
      renderFooter={() => <Button title="Close" onPress={closeModal} />}
    >
      <View style={styles.container}>
        <Grid gap={8}>
          <LiveStockProfileCarousel images={images} priority={"high"} />

          <Heading variant={4} weight="semiBold">
            {name}
          </Heading>

          <Text>{description}</Text>
        </Grid>
      </View>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
});

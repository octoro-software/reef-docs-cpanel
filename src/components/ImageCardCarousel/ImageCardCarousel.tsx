import React from "react";
import { Grid, GridItem } from "../Grid/Grid";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Heading } from "../Heading/Heading";
import { Text } from "../Text/Text";
import { AppImage } from "../AppImage/AppImage";

export const ImageCardCarousel: React.FC = ({ data, title, onPress }) => {
  return (
    <Grid gap={16}>
      <GridItem>
        <Grid
          direction="row"
          gap={8}
          justifyContent="space-between"
          alignItems="center"
        >
          <GridItem>
            <Heading variant={5} weight="semiBold">
              {title}
            </Heading>
          </GridItem>
          <GridItem>
            <Text weight="regular">Show All</Text>
          </GridItem>
        </Grid>
      </GridItem>

      <GridItem>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Grid gap={16} direction="row">
            {data?.map((card, key) => {
              const image = card?.images?.[0]?.url;
              return (
                <GridItem key={key}>
                  <TouchableOpacity onPress={() => onPress(card)}>
                    <AppImage style={styles.image} path={image} />
                  </TouchableOpacity>
                </GridItem>
              );
            })}
          </Grid>
        </ScrollView>
      </GridItem>
    </Grid>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
});

import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Grid, GridItem } from "../Grid/Grid";
import { Text } from "../Text/Text";
import { LiveStock } from "../../types";
import { AppImage } from "../AppImage/AppImage";

type ListingCardProps = {
  item: Pick<LiveStock, "name" | "scientific_name" | "images"> & {
    path: string;
  };
  handleNavigate: (path: string) => void;
  image: string;
};

export const ListingCard: React.FC<ListingCardProps> = ({
  item,
  image,
  handleNavigate,
}) => {
  return (
    <TouchableOpacity onPress={() => handleNavigate(item.path)}>
      <Grid style={styles.wrapper} direction="row" gap={16}>
        <GridItem>
          {image ? (
            <View style={{ backgroundColor: "white", borderRadius: 16 }}>
              <AppImage
                style={styles.image}
                source={{ uri: image }}
                width={72}
                height={72}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View style={{ width: 72, height: 72, ...styles.image }}></View>
          )}
        </GridItem>

        <GridItem>
          <Text style={styles.title} weight="bold">
            {item?.name}
          </Text>
          <Text style={styles.subTitle}>{item?.scientific_name}</Text>
        </GridItem>
      </Grid>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "white",
  },
  title: {
    fontSize: 16,
  },
  subTitle: {
    fontSize: 14,
    color: "#040D1666",
    marginTop: 2,
  },
  image: {
    borderRadius: 8,
  },
});

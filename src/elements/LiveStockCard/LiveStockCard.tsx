import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Grid, GridItem, Heading, Text } from "../../components";

import { REEF_DOCS_GREY, WHITE } from "../../constants";
import { AppImage } from "../../components/AppImage/AppImage";

type Props = {
  title: string;
  subtitle: string;
  image?: string;
  id: string;
  onPress: (id: string, payload?: object) => void;
  statePayload?: Record<string, any>;
  transition?: number;
  tankName?: string;
  alternate_names?: string[];
};

export const LiveStockCard: React.FC<Props> = ({
  id,
  title,
  subtitle,
  image,
  onPress,
  statePayload = {},
  transition,
  tankName,
  alternate_names,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(id, statePayload)}
      style={styles.wrapper}
    >
      <Grid direction="row" gap={8}>
        <GridItem>
          <AppImage
            path={image}
            style={styles.cardImage}
            width={64}
            height={64}
            transform
            transition={transition}
          />
        </GridItem>
        <GridItem flex={1}>
          <Heading variant={5} weight="semiBold">
            {title}
          </Heading>
          {alternate_names?.length > 0 && (
            <Text
              style={{
                fontSize: 10,
                marginBottom: 4,
              }}
            >
              {alternate_names?.join(", ")}
            </Text>
          )}
          <Heading style={styles.subHeading} variant={6} weight="semiBold">
            {subtitle}
          </Heading>

          {tankName && (
            <Grid direction="row" gap={4} alignItems="center">
              <Heading style={styles.subHeading} variant={6} weight="semiBold">
                Location: {tankName}
              </Heading>
            </Grid>
          )}
        </GridItem>
      </Grid>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    backgroundColor: WHITE,
    borderRadius: 8,
  },
  cardImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  subHeading: {
    color: REEF_DOCS_GREY,
  },
});

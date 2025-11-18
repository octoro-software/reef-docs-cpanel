import React from "react";
import { Grid, GridItem, Heading, Text } from "../../components";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Skeleton } from "../../components/Skeleton/Skeleton";
import { Pill } from "../../components/Pill/Pill";
import { WHITE } from "../../constants";

export const LiveStockProfileHeader = ({
  name,
  handleOpenNameModal,
  scientificName,
  alternateNames,
  tankExtraRole,
}) => {
  return (
    <GridItem>
      <GridItem>
        <Grid
          direction="row"
          alignItems="center"
          gap={8}
          style={{ flexWrap: "wrap" }}
        >
          <TouchableOpacity onPress={handleOpenNameModal}>
            {name ? (
              <Heading variant={4} weight="semiBold">
                {name}
              </Heading>
            ) : (
              <Skeleton marginBottom={8} height={18} width={200} />
            )}
          </TouchableOpacity>
        </Grid>
        <Grid direction="row" gap={8}>
          <TouchableOpacity style={{ flex: 1 }} onPress={handleOpenNameModal}>
            {scientificName ? (
              <GridItem>
                {alternateNames && <Text>{alternateNames}</Text>}
                <Text>{scientificName}</Text>
              </GridItem>
            ) : (
              <GridItem>
                <Skeleton marginBottom={8} height={15} width={180} />
                <Skeleton marginBottom={0} height={15} width={150} />
              </GridItem>
            )}
          </TouchableOpacity>
          <GridItem>
            <Grid direction="row" gap={4}>
              {tankExtraRole?.map((item) => (
                <Pill key={item}>
                  <Text style={style.pillText}>{item}</Text>
                </Pill>
              ))}
            </Grid>
          </GridItem>
        </Grid>
      </GridItem>
    </GridItem>
  );
};

const style = StyleSheet.create({
  pillText: {
    color: WHITE,
  },
});

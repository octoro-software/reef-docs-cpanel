import React from "react";
import { StyleSheet, View } from "react-native";
import { Grid, GridItem, Heading } from "../../components";

export const DosageCard = ({ dosage }) => {
  if (!dosage?.dosageRequired)
    return (
      <View style={styles.noDosageWrapper}>
        <Heading variant={5} weight="semiBold">
          No Dosage Required
        </Heading>
      </View>
    );

  return (
    <Grid
      gap={8}
      direction="column"
      justifyContent="center"
      style={{ flex: 1 }}
    >
      <Grid direction="row" gap={8} alignItems="center">
        <GridItem flex={1}>
          <Heading variant={6} weight="semiBold">
            Dosage Required
          </Heading>
        </GridItem>
        <GridItem flex={1}>
          <Heading variant={5} weight="semiBold">
            {dosage?.dailyDosage} {dosage?.unit}{" "}
            <Heading variant={6} weight="semiBold">
              {dosage?.type && `(${dosage?.type})`}
            </Heading>
          </Heading>
        </GridItem>
      </Grid>
      <Grid direction="row" gap={8} alignItems="center">
        <GridItem flex={1}>
          <Heading variant={6} weight="semiBold">
            Days Required
          </Heading>
        </GridItem>
        <GridItem flex={1}>
          <Heading variant={5} weight="semiBold">
            {dosage?.daysRequired}
          </Heading>
        </GridItem>
      </Grid>
      <Grid direction="row" gap={8} alignItems="center">
        <GridItem flex={1}>
          <Heading variant={6} weight="semiBold">
            Total Dosage
          </Heading>
        </GridItem>
        <GridItem flex={1}>
          <Heading variant={5} weight="semiBold">
            {dosage?.totalDosage} {dosage?.unit}{" "}
            <Heading variant={6} weight="semiBold">
              {dosage?.type && `(${dosage?.type})`}
            </Heading>
          </Heading>
        </GridItem>
      </Grid>
    </Grid>
  );
};

const styles = StyleSheet.create({
  noDosageWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

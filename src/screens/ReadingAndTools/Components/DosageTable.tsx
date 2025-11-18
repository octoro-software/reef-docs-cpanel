import React from "react";
import { Grid, GridItem, Text } from "../../../components";

import { WHITE } from "../../../constants";

export const DosageTable = ({
  doseCaps,
  doseLitres,
  doseMl,
  doseOz,
  disableCaps,
  dosageInstructions,
  grams,
}) => {
  if (!doseCaps && !doseLitres && !doseMl && !doseOz) {
    return <Text>Please select a tank and product.</Text>;
  }

  if (grams) {
    return (
      <Grid direction="column">
        {dosageInstructions && (
          <GridItem style={{ marginBottom: 8 }}>
            <Text>{dosageInstructions}</Text>
          </GridItem>
        )}

        <Grid
          direction="row"
          style={{ borderWidth: 1, padding: 8, backgroundColor: WHITE }}
        >
          <GridItem flex={1}>
            <Text>Grams</Text>
          </GridItem>
          <GridItem flex={1}>
            <Text weight="bold">{doseMl}</Text>
          </GridItem>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid direction="column">
      {dosageInstructions && (
        <GridItem style={{ marginBottom: 8 }}>
          <Text>{dosageInstructions}</Text>
        </GridItem>
      )}

      {!disableCaps && (
        <Grid
          direction="row"
          style={{ borderWidth: 1, padding: 8, backgroundColor: WHITE }}
        >
          <GridItem flex={1}>
            <Text>Caps</Text>
          </GridItem>
          <GridItem flex={1}>
            <Text weight="bold">{doseCaps}</Text>
          </GridItem>
        </Grid>
      )}
      <Grid
        direction="row"
        style={{
          borderWidth: 1,
          padding: 8,
          backgroundColor: WHITE,
          borderTopWidth: disableCaps ? 1 : 0,
        }}
      >
        <GridItem flex={1}>
          <Text>Litres</Text>
        </GridItem>
        <GridItem flex={1}>
          <Text weight="bold">{doseLitres}</Text>
        </GridItem>
      </Grid>
      <Grid
        direction="row"
        style={{
          borderWidth: 1,
          padding: 8,
          backgroundColor: WHITE,
          borderTopWidth: 0,
        }}
      >
        <GridItem flex={1}>
          <Text>Milliliters</Text>
        </GridItem>
        <GridItem flex={1}>
          <Text weight="bold">{doseMl}</Text>
        </GridItem>
      </Grid>
      <Grid
        direction="row"
        style={{
          borderWidth: 1,
          padding: 8,
          backgroundColor: WHITE,
          borderTopWidth: 0,
        }}
      >
        <GridItem flex={1}>
          <Text>Oz</Text>
        </GridItem>
        <GridItem flex={1}>
          <Text weight="bold">{doseOz}</Text>
        </GridItem>
      </Grid>
    </Grid>
  );
};

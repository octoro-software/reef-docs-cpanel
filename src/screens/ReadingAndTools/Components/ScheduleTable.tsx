import React from "react";
import { Grid, GridItem, Text } from "../../../components";
import { WHITE } from "../../../constants";

export const ScheduleTable = ({ doseDrops, doseMl }) => {
  return (
    <Grid direction="column">
      <Grid
        direction="row"
        style={{ borderWidth: 1, padding: 8, backgroundColor: WHITE }}
      >
        <GridItem flex={1}>
          <Text>Drops</Text>
        </GridItem>
        <GridItem flex={1}>
          <Text weight="bold">{doseDrops}</Text>
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
    </Grid>
  );
};

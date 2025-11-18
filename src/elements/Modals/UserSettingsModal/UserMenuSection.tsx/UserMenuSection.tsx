import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Grid, GridItem, Heading, Icon, Text } from "../../../../components";

import { getAppDimensions } from "../../../../utility/dimensions";

import { BLACK, INPUT_BORDER_COLOR } from "../../../../constants";

const SCREEN_WIDTH = getAppDimensions().width;

export const UserMenuSection = ({
  handleNextStep,
  spacer,
  label,
  index,
  icon,
}) => {
  if (spacer) {
    return (
      <GridItem style={[styles.menuHeading]}>
        <Heading variant={6} weight="semiBold">
          {label}
        </Heading>
      </GridItem>
    );
  }

  return (
    <Grid>
      <GridItem
        style={[
          styles.menuButton,
          index === 0
            ? {
                borderTopWidth: 1,
                borderTopColor: INPUT_BORDER_COLOR,
              }
            : {},
        ]}
      >
        <TouchableOpacity onPress={handleNextStep}>
          <Grid
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            style={{ paddingVertical: 8 }}
          >
            <Grid direction="row" alignItems="center" gap={8}>
              <Icon name={icon} fill={BLACK} />
              <Text style={styles.text}>{label}</Text>
            </Grid>
            <GridItem>
              <Icon name="chevronRight" />
            </GridItem>
          </Grid>
        </TouchableOpacity>
      </GridItem>
    </Grid>
  );
};

const styles = StyleSheet.create({
  text: {
    color: BLACK,
    fontSize: 12,
  },
  cardWrapper: {
    borderWidth: 1,
    borderColor: INPUT_BORDER_COLOR,
    alignItems: "center",
    padding: 16,
  },
  menuHeading: {
    borderBottomColor: INPUT_BORDER_COLOR,
    borderBottomWidth: 1,
    padding: 16,
  },
  menuButton: {
    borderBottomColor: INPUT_BORDER_COLOR,
    borderBottomWidth: 1,
    paddingLeft: 16,
    paddingRight: 16,
  },
  stepContainer: {
    width: SCREEN_WIDTH,
  },
  animatedContainer: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 4, // Total width for 4 steps
    height: "100%",
  },
});

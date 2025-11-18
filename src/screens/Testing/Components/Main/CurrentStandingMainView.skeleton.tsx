import React from "react";
import { Grid, GridItem } from "../../../../components";
import { View } from "react-native";
import { Skeleton } from "../../../../components/Skeleton/Skeleton";
import { WHITE } from "../../../../constants";
import { getAppDimensions } from "../../../../utility/dimensions";
import { ProgressChart } from "../../../../components/Charts/Core/ProgressChart/ProgressChart";

const width = getAppDimensions().width;

export const CurrentStandingMainViewSkeleton = ({
  isRoTank,
  displaySecondLine = true,
}) => {
  const records = Array.from({ length: 8 }, (_, index) => ({
    id: `skeleton-${index}`,
  }));

  return (
    <Grid direction="column" gap={8}>
      {!isRoTank && (
        <View
          style={{
            padding: 16,
            backgroundColor: "white",
            borderRadius: 8,
            marginBottom: 8,
            width: "100%",
            marginTop: -8,
          }}
        >
          <Skeleton height={54} marginBottom={0} marginTop={0} />
        </View>
      )}

      <GridItem
        flex={1}
        alignItems="center"
        justifyContent="center"
        style={[
          {
            padding: 8,
            backgroundColor: WHITE,
            borderRadius: 8,
            marginTop: -8,
          },
        ]}
      >
        <Skeleton height={14} marginBottom={0} marginTop={0} />
      </GridItem>

      <Grid
        direction="row"
        gap={8}
        justifyContent="space-between"
        style={{
          flexWrap: "wrap",
        }}
      >
        {records?.map((item, index) => (
          <GridItem key={item.id || index} style={{ width: width / 2 - 20 }}>
            <Grid direction="column" gap={8}>
              <GridItem flex={1} style={{ minWidth: width / 2 - 20 }}>
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 8,
                    borderRadius: 8,
                  }}
                >
                  <Skeleton height={14} marginBottom={8} />

                  <ProgressChart
                    percentage={0}
                    value={""}
                    size={width / 3 - 20}
                    label={""}
                    measurement={""}
                    target={""}
                  />
                  {displaySecondLine && (
                    <Skeleton height={14} marginTop={8} marginBottom={2} />
                  )}
                </View>
              </GridItem>
            </Grid>
          </GridItem>
        ))}
      </Grid>
    </Grid>
  );
};

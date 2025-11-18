import React from "react";
import { Grid, GridItem } from "../../../../components";
import { View } from "react-native";
import { Skeleton } from "../../../../components/Skeleton/Skeleton";
import { INPUT_BORDER_COLOR } from "../../../../constants";
import { getAppDimensions } from "../../../../utility/dimensions";
import { ProgressChart } from "../../../../components/Charts/Core/ProgressChart/ProgressChart";

const width = getAppDimensions().width;

export const HistoricMainViewSkeleton = ({}) => {
  const records = Array.from({ length: 8 }, (_, index) => ({
    id: `skeleton-${index}`,
  }));

  return (
    <Grid direction="column" gap={8}>
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

      <View
        style={{
          padding: 16,
          backgroundColor: "white",
          marginBottom: 8,
          borderRadius: 8,
          width: "100%",
          flex: 1,
          marginTop: -8,
        }}
      >
        <Grid direction="row" gap={8}>
          <GridItem
            alignItems="center"
            justifyContent="center"
            style={{
              borderRightWidth: 1,
              paddingRight: 8,
              borderRightColor: INPUT_BORDER_COLOR,
            }}
          >
            <Skeleton width={42} height={42} marginBottom={0} marginTop={0} />
            <Skeleton height={14} marginTop={8} />
            <Skeleton height={14} />
          </GridItem>

          <GridItem flex={1} gap={2}>
            <View>
              <Skeleton height={14} />
            </View>
            <View>
              <Skeleton height={14} />
              <Skeleton height={14} />
              <Skeleton height={14} />
            </View>
          </GridItem>
        </Grid>
      </View>

      <Grid
        direction="row"
        gap={8}
        justifyContent="space-between"
        style={{
          flexWrap: "wrap",
          marginTop: -8,
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
                  <Skeleton height={14} marginTop={8} marginBottom={2} />
                </View>
              </GridItem>
            </Grid>
          </GridItem>
        ))}
      </Grid>
    </Grid>
  );
};

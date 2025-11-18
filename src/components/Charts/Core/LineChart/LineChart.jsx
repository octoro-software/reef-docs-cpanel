import React, { useRef, useState } from "react";
import { View, Text } from "react-native";
import { debounce } from "lodash";

import RNLineChart from "./Test";
import { Grid, GridItem } from "../../../Grid/Grid";

import { getAppDimensions } from "../../../../utility/dimensions";

import { REEF_DOCS_BLUE } from "../../../../constants";

const { width } = getAppDimensions();

export const LineChart = ({ chartConfig, data }) => {
  const [dotPositions, setDotPositions] = useState([]); // Store dot positions
  const scrollViewRef = useRef(null);
  const dateRefs = useRef([]);

  const [closestDot, setClosestDot] = useState({});

  const chartWidth = Math.max(width); // Dynamically calculate width based on data points

  const labels = data?.reverse().map((item) => item.created_at);

  const chartData = data?.reverse().map((item) => item.result);

  const dataSets = [
    {
      data: chartData,
      color: (opacity = 1) => REEF_DOCS_BLUE, // Red line
      strokeWidth: 2, // Optional
    },
  ];

  const debouncedSetClosestDot = debounce((dot) => {
    setClosestDot(dot);
  }, 70); // Adjust debounce time as needed

  const handleDotScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;

    const closestDot = dotPositions.reduce((prev, current) => {
      return Math.abs(current.x - scrollX + 10) <
        Math.abs(prev.x - scrollX + 10)
        ? current
        : prev;
    });

    if (closestDot) {
      debouncedSetClosestDot(closestDot);
      const index = closestDot.index;

      if (dateRefs.current[index]) {
        dateRefs.current[index].measureLayout(scrollViewRef.current, (x) => {
          scrollViewRef.current.scrollTo({
            x: x - width / 2 + 50,
            animated: true,
          });
        });
      }
    }
  };

  const updateDotPositions = ({ x, y, index }) => {
    setDotPositions((prevState) => {
      const exists = prevState.find((dot) => dot.index === index);
      if (exists) return prevState; // Prevent duplicates
      return [...prevState, { x, y, index, value: chartData[index] }];
    });
  };

  const closestDotData = data?.[closestDot.index];

  return (
    <View>
      <Grid>
        <GridItem style={{ marginLeft: -16, marginRight: -16 }}></GridItem>
        <GridItem>
          <Text>{closestDotData?.result}</Text>
        </GridItem>
        <GridItem>
          <Text>{closestDotData?.element?.label}</Text>
        </GridItem>
      </Grid>
      <View style={{ marginLeft: -70, marginRight: -16 }}>
        <RNLineChart
          data={{
            datasets: dataSets,
          }}
          width={chartWidth + 70} // Dynamically adjust width
          height={220}
          withInnerLines={false}
          withHorizontalLabels={false}
          withVerticalLines={false}
          withHorizontalLines={false}
          withDots={true}
          withShadow={true}
          bezier
          withScrollableDot={true}
          withVerticalLabels={false}
          withOuterLines={false}
          yAxisInterval={1} // optional, defaults to 1
          yLabelsOffset={-9999} // Hide y-axis labels
          xLabelsOffset={-9999} // Hide x-axis labels
          onDotScroll={handleDotScroll}
          renderDotContent={({ x, y, index }) => {
            updateDotPositions({ x, y, index }); // Capture dot positions
            const currentValue = chartData[index];
            return <></>;
          }}
          chartConfig={{
            backgroundColor: "white",
            backgroundGradientFrom: "white", // Set the gradient start color to white
            backgroundGradientTo: "white", // Set the gradient end color to white
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => REEF_DOCS_BLUE,
            labelColor: (opacity = 1) => "#A0A0A0",
            linejoinType: "round",
            scrollableDotFill: "#fff",
            scrollableDotRadius: 6,
            scrollableDotStrokeColor: REEF_DOCS_BLUE,
            scrollableDotStrokeWidth: 3,
            scrollableInfoViewStyle: {
              justifyContent: "center",
              alignContent: "center",
              backgroundColor: "#121212",
              borderRadius: 2,
            },
            scrollableInfoTextStyle: {
              color: "#C4C4C4",
              marginHorizontal: 4,
              flex: 1,
              textAlign: "center",
            },
            scrollableInfoSize: { width: 0, height: 0 },
            scrollableInfoOffset: 0,
          }}
          style={{
            marginVertical: 8,
          }}
        />
      </View>
    </View>
  );
};

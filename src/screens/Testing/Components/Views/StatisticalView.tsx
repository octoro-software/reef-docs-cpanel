import React from "react";
import { StyleSheet, View } from "react-native";
import { parseISO } from "date-fns";

import { getAppDimensions } from "../../../../utility/dimensions";

import { Grid, GridItem, Heading, Text } from "../../../../components";
import { ProgressChart } from "../../../../components/Charts/Core/ProgressChart/ProgressChart";
import { AppImage } from "../../../../components/AppImage/AppImage";

const { width } = getAppDimensions();

export const StatisticalView = ({ data = [] }) => {
  // Group elements by elementId
  const groupedElements = {};

  if (!Array.isArray(data) || data.length === 0) return null;

  data?.forEach((record) => {
    record?.results?.forEach((item) => {
      if (!groupedElements[item.elementId]) {
        groupedElements[item.elementId] = [];
      }
      groupedElements[item.elementId].push({
        ...item,
        provider: record.provider,
        icpTestTypeId: record.icpTestTypeId,
        testDate: record?.icpTestResultDate,
      });
    });
  });

  return (
    <>
      <View style={{ padding: 16, backgroundColor: "white" }}>
        <Grid direction="row" gap={8} justifyContent="space-between">
          <GridItem alignItems="center">
            <AppImage
              source={{
                uri: data?.[0]?.provider?.image,
              }}
              width={48}
              height={48}
              style={{ borderRadius: 80 }}
            />

            <Heading variant={6} weight="semiBold">
              {data?.[0]?.provider?.name}
            </Heading>
          </GridItem>
          <GridItem alignItems="center">
            <AppImage
              source={{
                uri: data?.[0]?.provider?.image,
              }}
              width={48}
              height={48}
              style={{ borderRadius: 80 }}
            />

            <Heading variant={6} weight="semiBold">
              {data?.[0]?.provider?.name}
            </Heading>
          </GridItem>
          <GridItem alignItems="center">
            <AppImage
              source={{
                uri: data?.[0]?.provider?.image,
              }}
              width={48}
              height={48}
              style={{ borderRadius: 80 }}
            />

            <Heading variant={6} weight="semiBold">
              {data?.[0]?.provider?.name}
            </Heading>
          </GridItem>
        </Grid>
      </View>
      <Grid
        direction="column"
        gap={8}
        style={{ flexWrap: "wrap", alignItems: "center" }}
      >
        {Object.keys(groupedElements).map((elementId, index) => {
          const elementData = groupedElements[elementId];

          // Skip excluded elements based on the provider of the first record
          const excludedElements =
            data?.[0]?.provider?.products?.find(
              (p) => p.id === data?.[0]?.icpTestTypeId
            )?.excludedElements || [];

          if (excludedElements?.includes(elementId)) return null;

          return (
            <GridItem key={index} style={{ minWidth: width - 32 }}>
              <Grid direction="row" gap={8} style={{ flex: 1 }}>
                {elementData.map((item, idx) => {
                  const target =
                    item.provider?.elementTargets?.[item.elementId];
                  const percentage = (item.result / target) * 100;

                  // Parse the date string
                  const parsedDate = parseISO(item?.testDate);

                  // Convert to desired format

                  const labels = ["You", "Community", "AI"];

                  return (
                    <View
                      key={idx}
                      style={{ backgroundColor: "white", padding: 8, flex: 1 }}
                    >
                      <Text style={style.elementLabel}>
                        {item.element.label}
                      </Text>
                      <ProgressChart
                        percentage={percentage === 0 ? 100 : percentage}
                        value={item.result}
                        size={width / elementData.length - 20}
                        label={item.element.symbol}
                        measurement={"ppm"}
                        enableAnimation={false}
                        target={target}
                      />
                      <Text style={style.elementLabel}>{labels[idx]}</Text>
                    </View>
                  );
                })}
              </Grid>
            </GridItem>
          );
        })}
      </Grid>
    </>
  );
};

const style = StyleSheet.create({
  elementLabel: {
    textAlign: "center",
    marginBottom: 4,
  },
});

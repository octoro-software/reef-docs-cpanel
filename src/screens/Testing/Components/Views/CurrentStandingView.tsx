import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { getAppDimensions } from "../../../../utility/dimensions";
import { createAppDate } from "../../../../utility/date";

import { Grid, GridItem, Text } from "../../../../components";
import { ProgressChart } from "../../../../components/Charts/Core/ProgressChart/ProgressChart";
import { useAudience } from "../../../../hooks/useAudience";

const { width } = getAppDimensions();

export const CurrentStandingView = ({
  data,
  tank,
  onElementPress,
  elements,
  disabled = false,
  isRoTank = false,
  isShared = false,
}) => {
  const { isFresh } = useAudience();

  const element = elements?.find((e) => e.id === data?.elementId);

  const testConfiguration = tank?.testingConfig;

  const target = isRoTank
    ? 0
    : isShared
    ? data?.target
    : testConfiguration?.[data?.elementId]?.target ?? 0;

  const result = data.latestTest?.result ?? 0;

  const latestTestDate = createAppDate(data?.latestTest?.testDate);

  let percentage = 0;

  if (target > 0) {
    const maxDeviation = target * 1.0; // 100% deviation allowed
    const deviation = Math.abs(result - target);
    const clamped = Math.max(0, 1 - deviation / maxDeviation);
    percentage = Math.max(1, Math.round(clamped * 100));
  }

  const measurement = testConfiguration?.[data?.elementId];

  const label =
    element?.label === "Calcium Carbonate Equivalent" ? "CCE" : element?.label;

  const testTypeLabel = () => {
    if (isFresh) return "";
    if (data?.latestTest?.testType === "icp") return "( ICP )";
    if (data?.latestTest?.testType === "home") return "( Home Test )";
    if (data?.latestTest?.testType === "ndoc") return "( N-DOC )";
    return "";
  };

  return (
    <>
      <Grid direction="column" gap={8}>
        <GridItem flex={1} style={{ minWidth: width / 2 - 16 }}>
          <TouchableOpacity
            disabled={disabled}
            onPress={() =>
              onElementPress({ ...data, element }, data?.id, measurement?.unit)
            }
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 8,
                borderRadius: 8,
              }}
            >
              <Text style={style.elementLabel}>{label}</Text>
              <ProgressChart
                percentage={percentage === 0 ? 100 : percentage}
                value={result}
                size={width / 3 - 20}
                label={element?.symbol}
                measurement={measurement?.unit}
                target={target}
              />
              <Text style={{ textAlign: "center", marginTop: 4, fontSize: 12 }}>
                {`${latestTestDate} ${testTypeLabel()}`}
              </Text>
            </View>
          </TouchableOpacity>
        </GridItem>
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

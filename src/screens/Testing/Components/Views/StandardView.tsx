import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import { getAppDimensions } from "../../../../utility/dimensions";
import { createAppDate } from "../../../../utility/date";

import { Grid, GridItem, Heading, Icon, Text } from "../../../../components";
import { ProgressChart } from "../../../../components/Charts/Core/ProgressChart/ProgressChart";

import {
  INPUT_BORDER_COLOR,
  REEF_DOCS_BLUE,
  WHITE,
} from "../../../../constants";
import { OTHER_TEST_REASON_ID } from "../../../../constants/global";
import { useModal } from "../../../../hooks/useModal";

const { width } = getAppDimensions();

export const StandardView = ({
  data,
  tank,
  onElementPress,
  structuredConfiguration,
}) => {
  const { openModal } = useModal();

  const records = data?.results?.filter((item) => {
    const excludedElements =
      data?.provider?.products?.find((p) => p.id === data?.icpTestTypeId)
        ?.excludedElements || [];
    return !excludedElements.includes(item.elementId);
  });
  const isIcp = data?.test === "icp";

  const isNdoc = data?.test === "ndoc";

  const sectionTitle = isIcp ? "ICP Test" : isNdoc ? "N-DOC" : "Home Test";

  const testConfiguration = tank?.testingConfig;

  const testDate = createAppDate(data?.testResultDate);

  const testReason =
    data?.testReasonId === OTHER_TEST_REASON_ID
      ? `${data?.testReasonOther ?? "Not Specified"}`
      : structuredConfiguration?.testReason?.find(
          (s) => s.id === data?.testReasonId
        )?.name ?? "Not Specified";

  const testAction = data?.testAction
    ? `${data?.testAction}`
    : "Not Applicable";

  return (
    <>
      <View
        style={{
          backgroundColor: "white",
          marginBottom: 8,
          borderRadius: 8,
          width: "100%",
          flex: 1,
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
              padding: 16,
            }}
          >
            <Icon
              name={isIcp ? "reefDocsIcpTest" : "reefDocsHomeTest"}
              width={48}
              height={48}
            />
            <Heading variant={6} weight="semiBold">
              {sectionTitle}
            </Heading>
            <Text style={{ fontSize: 10 }}>{testDate}</Text>
          </GridItem>

          <GridItem flex={1} gap={2} style={{ padding: 16, paddingLeft: 8 }}>
            <View>
              <Text style={{ fontSize: 12 }} weight="semiBold">
                Reason
              </Text>
            </View>
            <View>
              <Text
                expandable
                showMoreButton={false}
                maxLength={80}
                style={{ fontSize: 10 }}
              >
                {testReason}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 12 }} weight="semiBold">
                Action
              </Text>
            </View>
            <View>
              <Text
                style={{ fontSize: 10 }}
                showMoreButton={false}
                maxLength={80}
                expandable
              >
                {testAction}
              </Text>
            </View>
          </GridItem>

          <TouchableOpacity
            style={{
              backgroundColor: REEF_DOCS_BLUE,
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
              width: 48,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() =>
              openModal({
                type: "testMoreOptionsModal",
                modalTitle: "Test Options",
                height: "small",
                data: { data, isIcp },
              })
            }
          >
            <Icon fill={WHITE} name="edit" />
          </TouchableOpacity>
        </Grid>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 8, // optional: spacing between groups
        }}
      >
        {records?.map((item, index) => {
          const measurement = testConfiguration?.[item?.elementId];
          const target = measurement?.target ?? 0;
          const result = item.result ?? 0;

          let percentage = 0;
          if (target > 0) {
            const maxDeviation = target * 1.0;
            const deviation = Math.abs(result - target);
            const clamped = Math.max(0, 1 - deviation / maxDeviation);
            percentage = Math.max(1, Math.round(clamped * 100));
          }

          const label =
            item?.element?.label === "Calcium Carbonate Equivalent"
              ? "CCE"
              : item?.element?.label;

          return (
            <View
              key={item.elementId || index}
              style={{ minWidth: width / 2 - 20 }}
            >
              <TouchableOpacity
                onPress={() =>
                  onElementPress(item, data?.id, measurement?.unit)
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
                    value={item.result}
                    size={width / 3 - 20}
                    label={item.element?.symbol}
                    measurement={measurement?.unit}
                    enableAnimation={false}
                    target={target}
                  />
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </>
  );
};

const style = StyleSheet.create({
  elementLabel: {
    textAlign: "center",
    marginBottom: 4,
  },
});

import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import {
  useCalculateDosageForActiveTank,
  useSalinityDosage,
} from "../../../../hooks/useDosage";
import { useModal } from "../../../../hooks/useModal";
import { useAppSelector } from "../../../../hooks/useRedux";

import { getAppDimensions } from "../../../../utility/dimensions";

import { selectUser } from "../../../../store/slices/globalSlice";

import { ProgressChart } from "../../../../components/Charts/Core/ProgressChart/ProgressChart";
import { Grid, GridItem, Heading, Icon, Text } from "../../../../components";
import { DosageCard } from "../../../../elements/DosageCard/DosageCard";
import { AppImage } from "../../../../components/AppImage/AppImage";

import { INPUT_BORDER_COLOR } from "../../../../constants";
import { createAppDate } from "../../../../utility/date";
import { OTHER_TEST_REASON_ID } from "../../../../constants/global";
import { selectStructuredConfiguration } from "../../../../store/slices/structuredConfigurationSlice";

const { width } = getAppDimensions();

export const DosingView = ({ data, tank }) => {
  // Group elements by elementId
  const structuredConfiguration = useAppSelector(selectStructuredConfiguration);

  const { preferences } = useAppSelector(selectUser);

  const [calculateDosage] = useCalculateDosageForActiveTank();
  const [calculateSalinityDosage] = useSalinityDosage();

  const { openModal } = useModal();

  const isIcp = data?.test === "icp" || data?.test === "ro";

  const sectionTitle = isIcp ? `${data?.provider?.name} ICP` : "Home Test";

  const testDate = createAppDate(data?.testResultDate);

  const testConfiguration = tank?.testingConfig;

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
          padding: 16,
          backgroundColor: "white",
          marginBottom: 8,
          borderRadius: 8,
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
            {isIcp ? (
              <AppImage
                path={data?.provider?.image}
                width={48}
                height={48}
                style={{ borderRadius: 80 }}
              />
            ) : (
              <Icon name="reefDocsHomeTest" width={48} height={48} />
            )}
            <Heading variant={6} weight="semiBold">
              {sectionTitle}
            </Heading>
            <Text style={{ fontSize: 10 }}>{testDate}</Text>
          </GridItem>

          <GridItem flex={1} gap={2}>
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
        </Grid>
      </View>
      <Grid direction="column" gap={8}>
        {data?.results?.map((item, index) => {
          const excludedElements =
            data?.provider?.products?.find((p) => p.id === data?.icpTestTypeId)
              ?.excludedElements || [];

          if (excludedElements?.includes(item.elementId) && isIcp) return;

          const target = testConfiguration?.[item?.elementId]?.target ?? 0;

          const result = item.result ?? 0;

          let percentage = 0;

          if (target > 0) {
            const maxDeviation = target * 1.0; // 100% deviation allowed
            const deviation = Math.abs(result - target);
            const clamped = Math.max(0, 1 - deviation / maxDeviation);
            percentage = Math.max(1, Math.round(clamped * 100));
          }

          const measurement =
            item?.testKitType === "ICP"
              ? data?.provider?.elementMeasurements[item.elementId]
              : preferences?.homeTestMeasurements?.[item.elementId];

          const elementBuffer = item?.element?.element_buffer;

          let dosage;

          if (item.elementId === "678150bf2366748b5678e24b") {
            dosage = calculateSalinityDosage({
              current: item.result,
              target: target,
              usePPT: measurement === "ppt" ? true : false,
            });
          } else {
            dosage = calculateDosage({
              currentConcentration: item.result,
              targetConcentation: target,
              productVolume: elementBuffer?.calcVolume,
              increasePerLitre: elementBuffer?.calcIncreases,
              increaseVolume: 100,
              maxDailyDosage: elementBuffer?.maxDailyDosage,
            });
          }

          return (
            <TouchableOpacity
              onPress={() =>
                openModal({
                  type: "dosingCardModal",
                  height: "small",
                  modalTitle: item?.element?.label,
                  data: item,
                })
              }
            >
              <Grid
                style={{
                  backgroundColor: "white",
                  padding: 8,
                  width: width - 32,
                }}
                direction="row"
                gap={16}
              >
                <GridItem>
                  <Text style={style.elementLabel}>{item.element.label}</Text>
                  <ProgressChart
                    percentage={percentage === 0 ? 100 : percentage}
                    value={item.result}
                    size={width / 3 - 20}
                    label={item.element.symbol}
                    measurement={measurement}
                    enableAnimation={false}
                    target={target}
                  />
                </GridItem>
                <GridItem flex={1}>
                  <DosageCard dosage={dosage} />
                </GridItem>
              </Grid>
            </TouchableOpacity>
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

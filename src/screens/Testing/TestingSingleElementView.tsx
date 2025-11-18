import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import {
  Grid,
  GridItem,
  Heading,
  Icon,
  RichText,
  Text,
} from "../../components";

import { ProgressChart } from "../../components/Charts/Core/ProgressChart/ProgressChart";

import { Accordion } from "../../components/Accordion/Accordion";
import { useModal } from "../../hooks/useModal";
import { TestHistoryChart } from "./Components/Chart/Chart";
import { useGetActiveTank } from "../../hooks/useTanks";

import apiClient from "../../api/apiClient";

import {
  getConsistencyScores,
  getRangeConsistencyText,
  getStabilityConsistencyText,
  getTargetConsistencyText,
} from "./Utility/getConsistencyScores";

import { WHITE } from "../../constants";
import { resultActions } from "./Utility/actions";
import { createAppDate } from "../../utility/date";
import { NoDataFallbackCard } from "../../elements/NoDataFallbackCard/NoDataFallbackCard";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  selectElementViewData,
  setElementViewData,
} from "../../store/slices/testingSlice";

export const TestingSingleElementView = () => {
  const activeTank = useGetActiveTank();

  const isRoTank = activeTank?.type === "rodi_reservoir";

  const dispatch = useAppDispatch();

  const getViewData = async () => {
    const response = await apiClient.post("/tests/getElementViewData", {
      tankId: activeTank?.id,
      elementId: chosenElement?.element?.id,
    });

    dispatch(setElementViewData(response?.data?.data || []));
  };

  useEffect(() => {
    getViewData();
  }, []);

  const viewData = useAppSelector(selectElementViewData);

  const location = useLocation();

  const { openModal } = useModal();

  const chosenElement = location.state?.data || null;

  const latestTest = viewData?.testingData?.[0];

  let percentage = 0;

  if (chosenElement?.element?.target > 0) {
    const maxDeviation = chosenElement?.element?.target * 1.0; // 100% deviation allowed

    const deviation = Math.abs(
      latestTest?.result - chosenElement?.element?.target
    );

    const clamped = Math.max(0, 1 - deviation / maxDeviation);
    percentage = Math.max(1, Math.round(clamped * 100));
  }

  const {
    rangeHigh,
    rangeLow,
    id: elementId,
    target,
  } = chosenElement?.element || {};

  const result = latestTest?.result;

  const consistencyScores = getConsistencyScores(
    viewData?.testingData,
    chosenElement
  );

  const isHigh = result > rangeHigh;

  const isLow = result < rangeLow;

  const accessKey = isLow ? "low" : isHigh ? "high" : "normal";

  const content = resultActions[elementId];

  const contentData = content ? content(chosenElement) : null;

  const tabNames = !isRoTank
    ? ["Overview", "History", "Dosing"]
    : ["Overview", "History"];
  const [activeTab, setActiveTab] = useState("Overview");

  const handleTabPress = (index, name) => {
    setActiveTab(name);
  };

  return (
    <Grid direction="column" gap={16}>
      <View style={{ marginHorizontal: -16 }}>
        <TestHistoryChart
          elementId={chosenElement?.element?.id}
          tankId={activeTank?.id}
          elementName={chosenElement?.element?.label}
          measurementUnit={chosenElement?.unit}
          activeTab={activeTab}
        />
      </View>

      <Grid direction="row" gap={2}>
        {tabNames.map((name, index) => (
          <TouchableOpacity
            key={name}
            style={[
              { flex: 1, paddingVertical: 12, backgroundColor: WHITE },
              index === 0 && {
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              },
              index === tabNames?.length - 1 && {
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              },
            ]}
            onPress={() => handleTabPress(index, name)}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: activeTab === name ? "bold" : "normal",
              }}
            >
              {name}
            </Text>
          </TouchableOpacity>
        ))}
      </Grid>

      {activeTab === "History" && (
        <Grid direction="column">
          {viewData?.testingData?.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  marginBottom: 16,
                  backgroundColor: WHITE,
                  padding: 16,
                  borderRadius: 8,
                }}
              >
                <Grid direction="row" gap={8}>
                  <GridItem flex={1}>
                    <Heading variant={5} weight="semiBold">
                      {createAppDate(item?.testDate)}
                    </Heading>
                    <Text>Comments: {item?.comments ?? "N/A"}</Text>
                  </GridItem>
                  <ProgressChart
                    percentage={percentage === 0 ? 100 : percentage}
                    value={item?.result}
                    label={chosenElement?.element?.symbol}
                    measurement={chosenElement?.element?.unit}
                    enableAnimation={false}
                    target={isRoTank ? 0 : chosenElement?.element?.target}
                  />
                </Grid>
              </View>
            );
          })}
        </Grid>
      )}
      {activeTab === "Dosing" && (
        <Grid direction="column">
          {viewData?.dosingData?.length > 0 ? (
            viewData?.dosingData?.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    openModal({
                      type: "dosingCreateModal",
                      modalTitle: "Edit Dosing",
                      height: "large",
                      data: {
                        edit: true,
                        id: item?.dosageTestId,
                        recordId: item?.id,
                      },
                    })
                  }
                  key={index}
                  style={{
                    marginBottom: 16,
                    backgroundColor: WHITE,
                    padding: 16,
                    borderRadius: 8,
                  }}
                >
                  <Grid direction="row" gap={8}>
                    <GridItem flex={1}>
                      <Heading variant={5} weight="semiBold">
                        {createAppDate(item?.dosageDate)}
                      </Heading>
                      <Text>Dose: {item?.result ?? "N/A"} ml</Text>
                    </GridItem>
                  </Grid>
                </TouchableOpacity>
              );
            })
          ) : (
            <NoDataFallbackCard
              title="No dosing data added yet"
              icon="reefDocsTesting"
            />
          )}
        </Grid>
      )}

      {activeTab === "Overview" && (
        <Grid direction="column" gap={16}>
          <GridItem flex={1} style={styles.stabilityIndicatorWrapper}>
            <Grid direction="row" gap={8}>
              <GridItem flex={1}>
                <Heading variant={5} weight="semiBold">
                  Latest Result
                </Heading>
                <RichText
                  html={
                    contentData?.text?.[accessKey] ?? "Your latest test result."
                  }
                />
              </GridItem>
              <ProgressChart
                percentage={percentage === 0 ? 100 : percentage}
                value={latestTest?.result}
                label={chosenElement?.element?.symbol}
                measurement={chosenElement?.element?.unit}
                enableAnimation={true}
                target={chosenElement?.element?.target}
              />
            </Grid>
          </GridItem>

          {accessKey !== "normal" &&
            contentData?.suggestions?.[accessKey] &&
            !isRoTank && (
              <Accordion header title="Suggestions" renderIf={true}>
                <Grid gap={8}>
                  {contentData?.suggestions?.[accessKey]?.map((item, key) => {
                    return (
                      <>
                        <Text weight="bold">{item?.title}</Text>
                        <Text>{item?.content}</Text>
                      </>
                    );
                  })}
                </Grid>
              </Accordion>
            )}

          <GridItem flex={1} style={styles.stabilityIndicatorWrapper}>
            <Grid direction="row" gap={8}>
              <GridItem flex={1}>
                <Heading variant={5} weight="semiBold">
                  Target Consistency
                </Heading>
                <RichText
                  html={getTargetConsistencyText(
                    consistencyScores?.targetConsistency
                  )}
                />
              </GridItem>
              <GridItem>
                <ProgressChart
                  label="Target"
                  target="%"
                  percentage={consistencyScores?.targetConsistency ?? 0}
                  value={consistencyScores?.targetConsistency ?? 0}
                  enableAnimation={true}
                />
                <TouchableOpacity
                  style={styles.helpButton}
                  onPress={() =>
                    openModal({
                      type: "richTextModal",
                      modalTitle: "Target Consistency",
                      height: "small",
                      data: {
                        richText:
                          "Target consistency is a measurement of how often your results are matching your target. <br /> The higher the number, the more consistent your results are with your set target.",
                      },
                    })
                  }
                >
                  <Icon name="reefDocsHelp" width={28} />
                </TouchableOpacity>
              </GridItem>
            </Grid>
          </GridItem>

          <GridItem flex={1} style={styles.stabilityIndicatorWrapper}>
            <Grid direction="row" gap={8}>
              <GridItem flex={1}>
                <Heading variant={5} weight="semiBold">
                  Range Consistency
                </Heading>
                <RichText
                  html={getRangeConsistencyText(
                    consistencyScores?.rangeConsistency
                  )}
                />
              </GridItem>
              <GridItem>
                <ProgressChart
                  label="Range"
                  target="%"
                  percentage={consistencyScores?.rangeConsistency ?? 0}
                  value={consistencyScores?.rangeConsistency ?? 0}
                  enableAnimation={true}
                />
                <TouchableOpacity
                  style={styles.helpButton}
                  onPress={() =>
                    openModal({
                      type: "richTextModal",
                      modalTitle: "Range Consistency",
                      height: "small",
                      data: {
                        richText:
                          "Range consistency is a measurement of how often your results are within your set range. <br /> The higher the number, the more consistent your results are within your range.",
                      },
                    })
                  }
                >
                  <Icon name="reefDocsHelp" width={28} />
                </TouchableOpacity>
              </GridItem>
            </Grid>
          </GridItem>

          <GridItem flex={1} style={styles.stabilityIndicatorWrapper}>
            <Grid direction="row" gap={8}>
              <GridItem flex={1}>
                <Heading variant={5} weight="semiBold">
                  Stability Consistency
                </Heading>
                <RichText
                  html={getStabilityConsistencyText(
                    consistencyScores?.stabilityConsistency
                  )}
                />
              </GridItem>
              <GridItem>
                <ProgressChart
                  label="Stability"
                  target="%"
                  percentage={consistencyScores?.stabilityConsistency ?? 0}
                  value={consistencyScores?.stabilityConsistency ?? 0}
                  enableAnimation={true}
                />
                <TouchableOpacity
                  style={styles.helpButton}
                  onPress={() =>
                    openModal({
                      type: "richTextModal",
                      modalTitle: "Stability Consistency",
                      height: "small",
                      data: {
                        richText:
                          "Stability consistency is a measurement of how close your results are to each other. <br /> The higher the number, the more consistent your results are regardless of targets.",
                      },
                    })
                  }
                >
                  <Icon name="reefDocsHelp" width={28} />
                </TouchableOpacity>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
      )}
    </Grid>
  );
};

const styles = StyleSheet.create({
  stabilityIndicatorWrapper: {
    backgroundColor: WHITE,
    padding: 16,
    borderRadius: 8,
  },
  stabilityIndicatorTitle: {
    textAlign: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
  },
  helpButton: {
    position: "absolute",
    top: -16,
    right: -12,
  },
});

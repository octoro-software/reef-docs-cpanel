import React, { Fragment } from "react";
import { View } from "react-native";
import { CurrentStandingView } from "../Views/CurrentStandingView";

import { Grid, GridItem, Select, Text } from "../../../../components";

import { NoDataFallbackCard } from "../../../../elements/NoDataFallbackCard/NoDataFallbackCard";

import { useModal } from "../../../../hooks/useModal";
import { useAppDispatch, useAppSelector } from "../../../../hooks/useRedux";

import {
  selectCurrentStandingFilter,
  setCurrentStandingFilter,
} from "../../../../store/slices/userConfigSlice";

import { getAppDimensions } from "../../../../utility/dimensions";

import { useTestingData } from "./useTestingData";

import { WHITE } from "../../../../constants";
import { useAudience } from "../../../../hooks/useAudience";
import { CurrentStandingMainViewSkeleton } from "./CurrentStandingMainView.skeleton";

const width = getAppDimensions().width - 32;

export const CurrentStandingMainView = ({
  data,
  tank,
  onElementPress,
  elements,
  getTestHistoryForTankLoading,
}) => {
  const { openModal } = useModal();
  const dispatch = useAppDispatch();

  const { isFresh } = useAudience();

  const isRoTank = tank?.type === "rodi_reservoir";

  const activeTestType = isFresh
    ? "all"
    : isRoTank
    ? "icpTest"
    : useAppSelector(selectCurrentStandingFilter) || "all";

  const handleAddTest = () => {
    openModal({
      type: "homeTestCreateModal",
      modalTitle: "Home Test",
      height: "large",
    });
  };

  const handleAddIcpTest = () => {
    openModal({
      type: "icpTestCreateModal",
      modalTitle: "ICP Test",
      height: "large",
    });
  };

  const handleTestModalOpen = () => {
    if (activeTestType === "homeTest" || activeTestType === "all")
      handleAddTest();
    else if (activeTestType === "icpTest") handleAddIcpTest();
  };

  const localData = useTestingData({
    data,
    testType: activeTestType,
    grouped: true,
  });

  const renderHeader = () => (
    <>
      {!isRoTank && !isFresh && (
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
          <Grid direction="row">
            <GridItem flex={1}>
              <Select
                labelKey="label"
                valueKey="value"
                title="Test Type"
                value={activeTestType}
                onConfirm={(value) => dispatch(setCurrentStandingFilter(value))}
                options={[
                  { label: "All", value: "all" },
                  {
                    label: "Show Home Testable Parameters Only",
                    value: "homeTest",
                  },
                  {
                    label: "Show ICP Testable Parameters Only",
                    value: "icpTest",
                  },
                  {
                    label: "Show N-DOC Parameters Only",
                    value: "ndoc",
                  },
                ]}
              />
            </GridItem>
          </Grid>
        </View>
      )}

      {localData?.length === 0 && !getTestHistoryForTankLoading && (
        <NoDataFallbackCard
          title="No Test Data Yet!"
          icon="reefDocsTesting"
          description={`You have not yet logged test data for ${
            activeTestType === "homeTest"
              ? "Home Test"
              : activeTestType === "icpTest"
              ? "ICP Test"
              : activeTestType === "all"
              ? "Any Test"
              : "N-DOC"
          }`}
          buttonTitle={
            activeTestType !== "ndoc" &&
            `Add ${
              ["homeTest", "all"].includes(activeTestType)
                ? "Home Test"
                : "ICP Test"
            }`
          }
          onPress={handleTestModalOpen}
        />
      )}
    </>
  );

  if (getTestHistoryForTankLoading && localData?.length === 0) {
    return <CurrentStandingMainViewSkeleton isRoTank={isRoTank} />;
  }

  return (
    <View style={{ marginTop: isFresh ? -8 : 0 }}>
      {renderHeader()}
      {localData?.map((group, index) => (
        <Fragment
            key={group.group || index}
        >
          <GridItem
            flex={1}
            style={[
              {
                padding: 8,
                backgroundColor: WHITE,
                borderRadius: 8,
                marginVertical: 8,
              },
              index === 0 && { marginTop: 0 },
            ]}
          >
            <Text style={{ fontWeight: "bold" }}>{group.group}</Text>
          </GridItem>
          <Grid
            direction="row"
            gap={8}
            justifyContent="space-between"
            style={{
              flexWrap: "wrap",
            }}
          >
            {group?.records?.map((item, index) => (
              <GridItem key={item.id || index} style={{ width: width / 2 - 8 }}>
                <CurrentStandingView
                  data={item}
                  tank={tank}
                  onElementPress={onElementPress}
                  elements={elements}
                  isRoTank={isRoTank}
                />
              </GridItem>
            ))}
          </Grid>
        </Fragment>
      ))}
    </View>
  );
};

import React from "react";
import { View } from "react-native";
import { Grid, GridItem, Select } from "../../../../components";
import { useAppDispatch } from "../../../../hooks/useRedux";
import { setLatestTestMonth } from "../../../../store/slices/testingSlice";
import { NoDataFallbackCard } from "../../../../elements/NoDataFallbackCard/NoDataFallbackCard";
import { StandardView } from "../Views/StandardView";
import { FadeInItem } from "../../../../elements/FadeInItem/FadeInItem";
import { HistoricMainViewSkeleton } from "./HistoricMainView.skeleton";

export const HistoricMainView = ({
  data,
  tank,
  onElementPress,
  monthOptions,
  selectedMonth,
  getTestHistoryForTankLoading,
  handleAddTest,
  structuredConfiguration,
}) => {
  const dispatch = useAppDispatch();

  if (getTestHistoryForTankLoading && data?.length === 0) {
    return <HistoricMainViewSkeleton />;
  }

  return (
    <>
      <View>
        <View
          style={{
            padding: 16,
            backgroundColor: "white",
            borderRadius: 8,
            marginBottom: 8,
            marginTop: -8,
          }}
        >
          <Grid direction="row" gap={8}>
            <GridItem flex={1}>
              <Select
                labelKey="label"
                valueKey="value"
                title="Month"
                options={monthOptions}
                value={selectedMonth}
                onConfirm={(value) => dispatch(setLatestTestMonth(value))}
              />
            </GridItem>
          </Grid>
        </View>

        {data?.length === 0 && !getTestHistoryForTankLoading && (
          <NoDataFallbackCard
            title="No Tests Yet!"
            description="You have no tests yet, add your first one below."
            buttonTitle="Add Test"
            icon="reefDocsTesting"
            onPress={handleAddTest}
          />
        )}

        {data?.map((item, index) => (
          <FadeInItem delay={index * 50} key={item.id || index}>
            <StandardView
              data={item}
              tank={tank}
              onElementPress={onElementPress}
              structuredConfiguration={structuredConfiguration}
            />
          </FadeInItem>
        ))}
      </View>
    </>
  );
};

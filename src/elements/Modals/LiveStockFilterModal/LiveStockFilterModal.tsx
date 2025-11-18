import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

import { useAppSelector } from "../../../hooks/useRedux";
import { useQueryParams } from "../../../hooks/useQueryParams";
import { useUser } from "../../../hooks/useAuth";

import { selectLiveStockListing } from "../../../store/slices/liveStockSlice";

import { getAppDimensions } from "../../../utility/dimensions";

import {
  Grid,
  GridItem,
  Icon,
  ModalComposition,
  ModalHeader,
  Text,
} from "../../../components";
import { OptionRegistry } from "./Options/OptionRegistry";

import {
  BLACK,
  INPUT_BORDER_COLOR,
  REEF_DOCS_BLUE,
  WHITE,
} from "../../../constants";

import { LiveStockListingApiResponse } from "../../../types/api/liveStock.types";
import { Pill } from "../../../components/Pill/Pill";
import { formatOptionLabel } from "./utility";
import { selectPlantCoralListing } from "../../../store/slices/coralPlantSlice";

const SCREEN_WIDTH = getAppDimensions().width;

export const LiveStockFilterModal = ({ coral }) => {
  const [step, setStep] = React.useState(0);

  const [isAnimating, setIsAnimating] = useState(false);

  const user = useUser();

  const { setFilterParam, getFilterObject, clearParams } = useQueryParams();

  const [activeNestedFilter, setActiveNestedFilter] = useState();

  const liveStockData: LiveStockListingApiResponse = useAppSelector(
    coral ? selectPlantCoralListing : selectLiveStockListing
  );

  const translateX = useSharedValue(0);

  let { facetConstruction, facets } = liveStockData;

  const liquidUnit = user?.liquidUnit;

  const measurementUnit = user?.measurementUnit;

  const liquidKeyMap = {
    usGallons: "tank_size_recommendation_gallons",
    litres: "tank_size_recommendation_litres",
    imperialGallons: "tank_size_recommendation_imperial_gallons",
  };

  const maxSizeKeyMap = {
    inches: "max_size_inches",
    cm: "max_size_centimeters",
  };

  const userPreference = liquidKeyMap[liquidUnit];

  const userSizePreference = maxSizeKeyMap[measurementUnit];

  const filterObj = getFilterObject();

  const handleNestedPress = (definition) => {
    setActiveNestedFilter(definition);
    handleNextStep();
  };

  const handleNestedBack = () => {
    handleNextStep(-1);
  };

  const handleNextStep = (increment = 1) => {
    if (isAnimating) return; // block rapid taps
    setIsAnimating(true);

    translateX.value = withTiming(
      -(step + increment) * SCREEN_WIDTH,
      { duration: 300 },
      () => {
        // animation is complete
        runOnJS(setIsAnimating)(false);
      }
    );

    setStep(step + increment);
  };

  const handleFilterChange = async (key: string, value: string | null) => {
    setFilterParam(key, value);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const constructFacets = facets?.[activeNestedFilter];

  const nested = facetConstruction?.find(
    (e) => e?.definition === activeNestedFilter
  );

  const hasFilters = Object.keys(filterObj)?.length > 0;

  return (
    <ModalComposition disableScroll={true} footerFix>
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 180, width: SCREEN_WIDTH }}
        >
          <Grid direction="column" gap={8}>
            {hasFilters && (
              <Grid
                direction="row"
                gap={8}
                justifyContent="space-between"
                alignItems="center"
                style={{ paddingLeft: 16, paddingTop: 16, paddingRight: 16 }}
              >
                <Text weight="bold" style={{ color: BLACK }}>
                  Active Filters
                </Text>
                <TouchableOpacity onPress={() => clearParams(false)}>
                  <Pill backgroundColor={BLACK}>
                    <Text style={{ color: WHITE }}>Clear All</Text>
                  </Pill>
                </TouchableOpacity>
              </Grid>
            )}
            {hasFilters && (
              <ScrollView nestedScrollEnabled horizontal>
                <Grid
                  direction="row"
                  style={{ padding: 16, paddingTop: 0 }}
                  gap={8}
                >
                  {Object.keys(filterObj)?.map((key, i) => {
                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={() => clearParams(key)}
                      >
                        <Pill>
                          <Grid direction="row" gap={8} alignItems="center">
                            <Icon
                              name="close"
                              fill={WHITE}
                              width={12}
                              height={12}
                            />
                            <Text style={{ color: WHITE }}>
                              {formatOptionLabel(filterObj[key], key)}
                            </Text>
                          </Grid>
                        </Pill>
                      </TouchableOpacity>
                    );
                  })}
                </Grid>
              </ScrollView>
            )}

            {facetConstruction?.map((construct, key) => {
              const active = filterObj?.[construct?.definition] || null;

              const total = Object.keys(facets[construct?.definition])?.length;

              if (construct.type === "custom_filter_min_tank_size") {
                if (construct?.definition !== userPreference) return null;
              }
              if (construct.type === "custom_filter_max_size") {
                if (construct?.definition !== userSizePreference) return null;
              }

              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => handleNestedPress(construct?.definition)}
                  style={[
                    styles.sectionItem,
                    key === 0 && {
                      borderTopWidth: 1,
                      borderTopColor: INPUT_BORDER_COLOR,
                    },
                  ]}
                >
                  <Grid direction="row" gap={8} alignItems="center">
                    <GridItem flex={1}>
                      <Grid direction="row" alignItems="center" gap={8}>
                        {construct?.icon && (
                          <Icon name={construct.icon} width={28} height={28} />
                        )}
                        <Text
                          weight="bold"
                          style={{ color: active ? REEF_DOCS_BLUE : BLACK }}
                        >
                          {construct?.label} ({total})
                        </Text>
                      </Grid>
                    </GridItem>
                    <Icon
                      name="chevronRight"
                      fill={active ? REEF_DOCS_BLUE : BLACK}
                    />
                  </Grid>
                </TouchableOpacity>
              );
            })}
          </Grid>
        </ScrollView>
        <View style={styles.stepContainer}>
          <TouchableOpacity onPress={() => handleNestedBack()}>
            <Grid
              direction="row"
              gap={8}
              justifyContent="space-between"
              style={[styles.sectionItem, { paddingBottom: 12 }]}
            >
              <Grid direction="row">
                <Icon name="chevronLeft" fill={BLACK} />

                <Text weight="bold">Back</Text>
              </Grid>
            </Grid>
          </TouchableOpacity>

          <View style={{ marginTop: 16, marginBottom: 16 }}>
            <ModalHeader
              icon={nested?.icon}
              title={nested?.label}
              iconWidth={40}
              iconHeight={40}
            />

            {filterObj?.[nested?.definition] && (
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => clearParams(nested?.definition)}
                >
                  <Pill backgroundColor={BLACK}>
                    <Text style={{ color: WHITE }}>Clear</Text>
                  </Pill>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 240 }}>
            <OptionRegistry
              definition={nested?.type}
              constructFacets={constructFacets}
              facets={facets}
              filterObj={filterObj}
              activeNestedFilter={activeNestedFilter}
              handleFilterChange={handleFilterChange}
            />
          </ScrollView>
        </View>
      </Animated.View>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    width: SCREEN_WIDTH,
    flexShrink: 1,
  },
  sectionItem: {
    borderBottomWidth: 1,
    padding: 16,
    paddingTop: 12,

    borderBottomColor: INPUT_BORDER_COLOR,
    width: SCREEN_WIDTH,
  },
  animatedContainer: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 2, // Total width for 4 steps
  },
});

import React, { useMemo, useState } from "react";
import Slider from "@react-native-community/slider";

import { useUser } from "../../../../../hooks/useAuth";

import { getUnitLabelForUser } from "../../../../../utility/liquidUnitSelector";

import { Button, Grid, Text } from "../../../../../components";

import { REEF_DOCS_BLUE } from "../../../../../constants";

export const SizeOption = ({
  constructFacets = {},
  definition,
  type,
  handleFilterChange,
  activeNestedFilter,
}) => {
  const user = useUser();

  const unit =
    type === "custom_filter_max_size"
      ? user?.measurementUnit
      : user?.liquidUnit;

  const label = getUnitLabelForUser(unit);

  const [sliderIndex, setSliderIndex] = useState(0);

  const { sortedSizes, cumulativeCounts } = useMemo(() => {
    const entries = Object.entries(constructFacets)
      .map(([key, count]) => ({ size: Number(key), count }))
      .sort((a, b) => a.size - b.size);

    const sortedSizes = entries.map((e) => e.size);
    const cumulativeCounts = [];
    let total = 0;
    for (let i = 0; i < entries.length; i++) {
      total += entries[i].count;
      cumulativeCounts.push(total);
    }

    return { sortedSizes, cumulativeCounts };
  }, [constructFacets]);

  const currentSize = sortedSizes[sliderIndex];
  const currentCount = cumulativeCounts[sliderIndex];

  const handleConfirm = () => {
    handleFilterChange(activeNestedFilter, `adv.number=lte=${currentSize}`);
  };

  return (
    <Grid direction="column" gap={12} style={{ padding: 16 }}>
      <Text style={{ textAlign: "center" }} weight="bold">
        Showing sizes up to: {currentSize} {label} (Total: {currentCount})
      </Text>
      <Slider
        step={1}
        minimumValue={0}
        maximumValue={sortedSizes.length - 1}
        value={sliderIndex}
        onValueChange={setSliderIndex}
        thumbTintColor={REEF_DOCS_BLUE}
        minimumTrackTintColor={REEF_DOCS_BLUE}
        maximumTrackTintColor={REEF_DOCS_BLUE}
      />
      <Grid direction="row" justifyContent="space-between">
        <Text>
          {sortedSizes[0]} {label}
        </Text>
        <Text>
          {sortedSizes[sortedSizes.length - 1]} {label}
        </Text>
      </Grid>
      <Button title="Confirm" onPress={handleConfirm} />
    </Grid>
  );
};

import React, { useMemo, useState } from "react";
import Slider from "@react-native-community/slider";

import { useUser } from "../../../../../hooks/useAuth";

import { getUnitLabelForUser } from "../../../../../utility/liquidUnitSelector";

import { Button, Grid, Icon, Text } from "../../../../../components";

import {
  BLACK,
  INPUT_BORDER_COLOR,
  REEF_DOCS_BLUE,
  WHITE,
} from "../../../../../constants";
import { TouchableOpacity, View } from "react-native";
import { formatOptionLabel } from "../../utility";
import { useAppSelector } from "../../../../../hooks/useRedux";
import { selectStructuredConfigurationById } from "../../../../../store/slices/structuredConfigurationSlice";

export const ColourPickerOption = ({
  constructFacets = {},
  definition,
  type,
  handleFilterChange,
  activeNestedFilter,
  filterObj,
}) => {
  const handleConfirm = () => {
    handleFilterChange(activeNestedFilter, `adv.number=lte=`);
  };

  const structuredConfiguration = useAppSelector(
    selectStructuredConfigurationById("dominant_colour")
  );

  return (
    <Grid direction="column">
      {constructFacets &&
        Object.keys(constructFacets).map((v, i) => {
          const hexColor = structuredConfiguration?.find(
            (option) => option.name === v
          )?.extra;

          const active = filterObj?.[activeNestedFilter] === v;

          return (
            <TouchableOpacity
              key={`f_${i}`}
              onPress={() =>
                handleFilterChange(
                  active ? activeNestedFilter : activeNestedFilter,
                  active ? null : `adv.number=in=${v}`
                )
              }
              style={[
                {
                  borderBottomWidth: 1,
                  borderColor: INPUT_BORDER_COLOR,
                  padding: 16,
                  backgroundColor: active ? REEF_DOCS_BLUE : "white",
                },
                i === 0 && {
                  borderTopWidth: 1,
                  borderColor: INPUT_BORDER_COLOR,
                },
              ]}
            >
              <Grid direction="row" gap={8} alignItems="center">
                {active && <Icon name="check" fill={WHITE} />}
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 50,
                    borderWidth: 1,
                    backgroundColor: hexColor || "transparent",
                  }}
                />
                <Text
                  style={{ color: active ? WHITE : BLACK }}
                >{`${formatOptionLabel(v)} ( ${constructFacets[v]} )`}</Text>
              </Grid>
            </TouchableOpacity>
          );
        })}
    </Grid>
  );
};

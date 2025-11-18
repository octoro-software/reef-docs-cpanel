import React from "react";
import { Grid, Icon, Text } from "../../../../../components";
import { TouchableOpacity } from "react-native";
import {
  BLACK,
  INPUT_BORDER_COLOR,
  REEF_DOCS_BLUE,
  WHITE,
} from "../../../../../constants";
import { formatOptionLabel } from "../../utility";

export const StandardOptions = ({
  constructFacets,
  filterObj,
  activeNestedFilter,
  handleFilterChange,
}) => {
  return (
    <Grid direction="column">
      {constructFacets &&
        Object.keys(constructFacets).map((v, i) => {
          const active = filterObj?.[activeNestedFilter] === v;

          return (
            <TouchableOpacity
              key={`f_${i}`}
              onPress={() =>
                handleFilterChange(
                  active ? activeNestedFilter : activeNestedFilter,
                  active ? null : v
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
              <Grid direction="row" gap={8}>
                {active && <Icon name="check" fill={WHITE} />}
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

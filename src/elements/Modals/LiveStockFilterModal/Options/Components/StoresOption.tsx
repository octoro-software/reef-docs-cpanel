import React from "react";

import { useUser } from "../../../../../hooks/useAuth";

import { Grid, Icon, Text } from "../../../../../components";

import {
  BLACK,
  INPUT_BORDER_COLOR,
  REEF_DOCS_BLUE,
  WHITE,
} from "../../../../../constants";
import { TouchableOpacity } from "react-native";
import { formatOptionLabel } from "../../utility";
import { useQueryParams } from "../../../../../hooks/useQueryParams";

export const StoresOption = ({}) => {
  const { setParam, getParam } = useQueryParams();

  const handleConfirm = (id) => {
    setParam("shopId", id);
  };

  const activeStore = getParam("shopId");

  const user = useUser();

  const stores = user?.linkedStores;

  return (
    <Grid direction="column">
      {stores?.map((store, key) => {
        const active = activeStore === store?.storeId;

        return (
          <TouchableOpacity
            key={`f_${key}`}
            onPress={() => handleConfirm(store?.storeId)}
            style={[
              {
                borderBottomWidth: 1,
                borderColor: INPUT_BORDER_COLOR,
                padding: 16,
                backgroundColor: active ? REEF_DOCS_BLUE : "white",
              },
              key === 0 && {
                borderTopWidth: 1,
                borderColor: INPUT_BORDER_COLOR,
              },
            ]}
          >
            <Grid direction="row" gap={8} alignItems="center">
              {active && <Icon name="check" fill={WHITE} />}

              <Text
                style={{ color: active ? WHITE : BLACK }}
              >{`${formatOptionLabel(store?.name)}`}</Text>
            </Grid>
          </TouchableOpacity>
        );
      })}
    </Grid>
  );
};

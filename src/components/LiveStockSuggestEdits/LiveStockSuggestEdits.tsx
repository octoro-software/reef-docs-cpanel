import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { useModal } from "../../hooks/useModal";

import { Grid } from "../Grid/Grid";
import { Icon } from "../Icon/Icon";
import { Text } from "../Text/Text";

import { REEF_DOCS_BLUE } from "../../constants";

export const LiveStockSuggestEdits: React.FC<{ id: string }> = ({ id }) => {
  const { openModal } = useModal();

  const handlePress = () => {
    openModal({
      type: "liveStockSuggestEdits",
      modalTitle: "Suggest Edits",
      height: "large",
      data: {
        id,
      },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Grid direction="row" alignItems="center" gap={8}>
        <Icon name="edit" fill={REEF_DOCS_BLUE} />

        <Text weight="bold" style={styles.text}>
          Something not right ? Suggest Edits
        </Text>
      </Grid>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    color: REEF_DOCS_BLUE,
  },
});

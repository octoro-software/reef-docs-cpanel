import React from "react";
import { StyleSheet, View } from "react-native";

import { Button, Grid, ModalComposition } from "../../../components";

import { REEF_DOCS_GREY } from "../../../constants";

import { useModal } from "../../../hooks/useModal";

export const TestMoreOptionsModal = ({ data, isIcp }) => {
  const { closeModal, openModal } = useModal();

  const handleEditTest = () => {
    closeModal(() => {
      isIcp
        ? openModal({
            type: "icpTestCreateModal",
            modalTitle: "Edit ICP Test",
            height: "large",
            data: { data },
          })
        : openModal({
            type: "homeTestCreateModal",
            modalTitle: "Edit Test",
            height: "large",
            data: { data },
          });
    });
  };

  return (
    <ModalComposition padding footerFix>
      <View style={styles.wrapper}>
        <Grid direction="column" gap={8}>
          <Button
            variant="secondary"
            title="Edit Test"
            onPress={handleEditTest}
          />
          <Button
            disabled
            variant="grey"
            title="Generate Report ( Coming Soon )"
          />
          <Button disabled variant="grey" title="Share ( Coming Soon )" />
        </Grid>
      </View>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    paddingTop: 8,
  },
  subText: {
    fontSize: 12,
    color: REEF_DOCS_GREY,
    textAlign: "center",
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: REEF_DOCS_GREY,
    backgroundColor: "#EEF2F4",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  editIcon: {
    position: "absolute",
    right: -10,
    bottom: 0,
  },
});

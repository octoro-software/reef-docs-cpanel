import React from "react";
import { StyleSheet } from "react-native";

import {
  Button,
  Grid,
  ModalComposition,
  ModalHeader,
  Text,
} from "../../../../components";

import { useModal } from "../../../../hooks/useModal";

export const TankProgressComplete = ({ icon, edit }) => {
  const { closeModal } = useModal();

  return (
    <ModalComposition
      renderFooter={() => (
        <Grid gap={8}>
          <Button title="Close" variant="primary" onPress={closeModal} />
        </Grid>
      )}
    >
      <Grid gap={16}>
        <ModalHeader
          icon={icon}
          iconHeight={48}
          iconWidth={48}
          title={edit ? "Progress Updated" : "Progress Submitted"}
        />

        <Text style={styles.contentText}>
          {edit
            ? "Your progress was updated successfully! Close this modal to view your upto date progress."
            : "Your progress was added successfully! Close this modal to view your upto date progress."}
        </Text>
      </Grid>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  contentText: {
    fontSize: 12,
  },
});

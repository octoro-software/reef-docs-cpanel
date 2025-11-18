import React from "react";
import { View } from "react-native";

import { Button, Grid, ModalComposition } from "../../../components";
import { useModal } from "../../../hooks/useModal";

export const TankTaskOptionsModal = ({ task }) => {
  const { openModal } = useModal();

  const handleEditTaskModalOpen = () => {
    openModal({
      type: "tankTaskModal",
      height: "large",
      modalTitle: "Edit Task",
      data: { task },
    });
  };

  return (
    <ModalComposition>
      <View style={{ padding: 16 }}>
        <Grid direction="column" gap={8}>
          <Button
            title="Edit Task"
            variant="secondary"
            onPress={handleEditTaskModalOpen}
          />
          {/* <Button title="Skip Task" />
          <Button title="Move Single Task Occurance" /> */}
        </Grid>
      </View>
    </ModalComposition>
  );
};

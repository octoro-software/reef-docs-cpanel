import React from "react";
import { Button, ModalComposition, ModalHeader } from "../../../../components";
import { useModal } from "../../../../hooks/useModal";

export const TankTaskFormSuccess = ({ editMode }) => {
  const { closeModal } = useModal();

  return (
    <ModalComposition
      renderFooter={() => <Button title="Close" onPress={closeModal} />}
    >
      <ModalHeader
        title={editMode ? "Task Updated" : "Task Created"}
        icon="reefDocsTasks"
        iconWidth={48}
        iconHeight={48}
        content={
          editMode
            ? "Your task was updated successfully"
            : "Your task was created successfully"
        }
      />
    </ModalComposition>
  );
};

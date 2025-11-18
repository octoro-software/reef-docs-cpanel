import React from "react";

import { useModal } from "../../../../hooks/useModal";

import {
  Button,
  Grid,
  ModalHeader,
  ModalComposition,
} from "../../../../components";

export const TestDataComplete = ({ quickMenu, editMode }) => {
  const { closeModal } = useModal();

  const content = quickMenu
    ? editMode
      ? "Your test has been updated successfully."
      : "Your test has been created successfully."
    : editMode
    ? "Your test results have been updated successfully. Please close this modal to view the latest results."
    : "Your test results where entered successfully. Please close this modal to view the latest results.";

  return (
    <ModalComposition
      renderFooter={() => {
        return (
          <Grid gap={16}>
            <Button title="Close" variant="secondary" onPress={closeModal} />
          </Grid>
        );
      }}
    >
      <ModalHeader
        title={editMode ? "Test Updated" : "Test Created"}
        icon="reefDocsHomeTest"
        iconWidth={48}
        iconHeight={48}
        content={content}
      />
    </ModalComposition>
  );
};

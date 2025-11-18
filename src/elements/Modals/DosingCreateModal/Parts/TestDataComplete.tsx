import React from "react";

import { useModal } from "../../../../hooks/useModal";

import {
  Button,
  Grid,
  ModalHeader,
  ModalComposition,
} from "../../../../components";

export const TestDataComplete = ({ quickMenu }) => {
  const { closeModal } = useModal();

  const content = quickMenu
    ? "Your dosages have been logged successfully."
    : "Your dosages where entered successfully.";

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
        title="Dosages Created"
        icon="reefDocsHomeTest"
        iconWidth={48}
        iconHeight={48}
        content={content}
      />
    </ModalComposition>
  );
};

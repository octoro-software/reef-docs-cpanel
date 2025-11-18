import React from "react";

import {
  Button,
  Grid,
  Text,
  ModalComposition,
  ModalHeader,
} from "../../../../components";

import { useModal } from "../../../../hooks/useModal";

export const ICPImportPreviewConfirmComplete = ({ icpProvider }) => {
  const { closeModal } = useModal();

  return (
    <ModalComposition
      renderFooter={() => {
        return (
          <Grid gap={8}>
            <Button title={"Close"} onPress={closeModal} variant="primary" />
          </Grid>
        );
      }}
    >
      <ModalHeader icpProvider={icpProvider} content="" />

      {/* TODO: // Design this */}

      <Text>ICP Import Complete</Text>
    </ModalComposition>
  );
};

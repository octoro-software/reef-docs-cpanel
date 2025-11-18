import React from "react";
import { useFormContext } from "react-hook-form";

import { Button, Grid } from "../../../../components";

import { ModalHeader } from "../../../../components/ModalHeader/ModalHeader";
import { ModalComposition } from "../../../../components/Modal/ModalComposition";
import { useModal } from "../../../../hooks/useModal";

export const LiveStockProfileUserVideoPostSuccess = ({ icon }) => {
  const {
    formState: { errors },
  } = useFormContext();

  const { closeModal } = useModal();

  return (
    <ModalComposition
      renderFooter={() => {
        return (
          <Grid gap={16}>
            <Button title="Close" variant="primary" onPress={closeModal} />
          </Grid>
        );
      }}
    >
      <ModalHeader
        title="Videos Submitted"
        content="Thankyou for submitting your videos, depending on the size they may upload in the background."
        icon={icon ?? "reefDocsHelp"}
        iconWidth={48}
        iconHeight={48}
      />
    </ModalComposition>
  );
};

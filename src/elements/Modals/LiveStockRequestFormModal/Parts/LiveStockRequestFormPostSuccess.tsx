import React from "react";
import { useFormContext } from "react-hook-form";

import { useModal } from "../../../../hooks/useModal";

import { Button, Grid } from "../../../../components";
import { ModalHeader } from "../../../../components/ModalHeader/ModalHeader";
import { ModalComposition } from "../../../../components/Modal/ModalComposition";

export const LiveStockRequestFormPostSuccess = ({}) => {
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
        title="Request Submitted"
        content="Thankyou for your request. We will look to include this profile in the near future."
        icon="reefDocsFish"
        iconWidth={48}
        iconHeight={48}
      />
    </ModalComposition>
  );
};

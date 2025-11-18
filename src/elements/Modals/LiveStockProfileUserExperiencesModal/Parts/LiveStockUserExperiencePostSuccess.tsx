import React from "react";
import { useFormContext } from "react-hook-form";

import { Button, Grid } from "../../../../components";

import { ModalHeader } from "../../../../components/ModalHeader/ModalHeader";
import { ModalComposition } from "../../../../components/Modal/ModalComposition";
import { useModal } from "../../../../hooks/useModal";

export const LiveStockUserExperiencePostSuccess = ({ icon }) => {
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
        title="Experience Submitted"
        content="Thankyou for submitting your experience, if approved it will be visible to other users and you will receive an entry into the current months prize draw. Please note you can only submit one experience post per animal."
        icon={icon ?? "reefDocsHelp"}
        iconWidth={48}
        iconHeight={48}
      />
    </ModalComposition>
  );
};

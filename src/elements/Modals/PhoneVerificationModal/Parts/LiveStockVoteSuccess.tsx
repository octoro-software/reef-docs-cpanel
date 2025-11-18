import React from "react";
import { Button, ModalComposition, ModalHeader } from "../../../../components";
import { useModal } from "../../../../hooks/useModal";

export const LiveStockVoteSuccess = () => {
  const { closeModal } = useModal();

  const handleClose = () => closeModal();

  return (
    <ModalComposition
      renderFooter={() => (
        <Button title="Close" variant="primary" onPress={handleClose} />
      )}
    >
      <ModalHeader
        icon="reefDocsFish"
        iconWidth={48}
        iconHeight={48}
        title="Thankyou for Contributing"
        content="Contributions from reefers will help us understand behaviour of the animal within the hobby at a deep level."
      />
    </ModalComposition>
  );
};

import React from "react";

import { useModal } from "../../../hooks/useModal";

import { Button, ModalComposition, ModalHeader } from "../../../components";

export const EngagementPointsHelpModal = () => {
  const { closeModal } = useModal();

  return (
    <ModalComposition
      padding
      renderFooter={() => {
        return (
          <Button title="Close" variant="secondary" onPress={closeModal} />
        );
      }}
    >
      <ModalHeader
        title="How does it work ?"
        icon="reefDocsEngagementPoints"
        iconWidth={48}
        iconHeight={48}
      />
    </ModalComposition>
  );
};

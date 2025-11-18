import React from "react";
import { Button, ModalComposition, ModalHeader } from "../../../../components";
import { useModal } from "../../../../hooks/useModal";

export const TankTaskSettingsFormSuccess = ({}) => {
  const { closeModal } = useModal();

  return (
    <ModalComposition
      renderFooter={() => <Button title="Close" onPress={closeModal} />}
    >
      <ModalHeader
        title={"Task Settings"}
        icon="reefDocsTaskSettings"
        iconWidth={48}
        iconHeight={48}
        content={"Task Settings Updated !"}
      />
    </ModalComposition>
  );
};

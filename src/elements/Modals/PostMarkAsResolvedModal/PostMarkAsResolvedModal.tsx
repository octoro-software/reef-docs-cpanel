import React from "react";

import { Button, ModalComposition } from "../../../components";
import { useModal } from "../../../hooks/useModal";

export const PostMarkAsResolvedModal = ({}) => {
  const { closeModal } = useModal();

  return (
    <ModalComposition
      footerFix
      renderFooter={() => (
        <Button variant="primary" onPress={closeModal} title="Close" />
      )}
    ></ModalComposition>
  );
};

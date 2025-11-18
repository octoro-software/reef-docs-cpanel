import React from "react";
import { Button, ModalComposition, ModalHeader } from "../../components";

import { useModal } from "../../hooks/useModal";

export const PhoneVerificationCompleteForm = ({}) => {
  const { closeModal } = useModal();

  return (
    <ModalComposition
      renderFooter={() => <Button title="Close" onPress={closeModal} />}
    >
      <ModalHeader
        icon="smartPhone"
        title="Phone Verification Complete"
        content="Thanks for completing phone verification. You are now free to contribute to the platform."
      />
    </ModalComposition>
  );
};

import React from "react";

import { Button, Grid, ModalComposition } from "../../../components";
import { useModal } from "../../../hooks/useModal";

export const PartnerStoreModal = (partner) => {
  const { closeModal } = useModal();

  return (
    <ModalComposition
      footerFix
      renderFooter={() => (
        <Button variant="primary" onPress={closeModal} title="Got It!" />
      )}
    >
      <Grid direction="column" gap={16} style={{ padding: 16 }}></Grid>
    </ModalComposition>
  );
};

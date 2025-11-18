import React from "react";

import { useModal } from "../../../../hooks/useModal";

import {
  Button,
  Grid,
  Heading,
  Text,
  ModalComposition,
  ModalHeader,
} from "../../../../components";

export const ICPImportSummary = ({ icpProvider, handleBack }) => {
  const { closeModal } = useModal();

  return (
    <ModalComposition
      renderFooter={() => (
        <Grid gap={8}>
          <Button
            title="Import Results"
            onPress={closeModal}
            variant="secondary"
          />
          <Button
            title="Back"
            onPress={() => handleBack(-1)}
            variant="primary"
          />
        </Grid>
      )}
    >
      <ModalHeader title={icpProvider?.name} image={icpProvider?.image} />

      <Grid gap={8}>
        <Heading variant={5} weight="bold">
          Summary
        </Heading>

        <Text>
          {`The following results will be imported against the tank DYNAMIC NAME`}
        </Text>

        <Text>56 Tank Parameters</Text>
        <Text>32 RO Water Parameters</Text>
        <Text>TBD</Text>
      </Grid>
    </ModalComposition>
  );
};

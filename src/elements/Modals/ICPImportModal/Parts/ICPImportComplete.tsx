import React from "react";

import { useModal } from "../../../../hooks/useModal";

import {
  Button,
  Grid,
  Heading,
  Text,
  ModalHeader,
  ModalComposition,
} from "../../../../components";

export const ICPImportComplete = ({ icpProvider }) => {
  const { closeModal } = useModal();

  return (
    <ModalComposition
      renderFooter={() => (
        <Button title="Finish" onPress={closeModal} variant="secondary" />
      )}
    >
      <ModalHeader image={icpProvider?.image} />

      <Grid gap={8}>
        <Heading variant={5} weight="bold">
          Upload Complete
        </Heading>

        <Text>
          Thankyou, your upload was received. Your video will now be added to a
          queue to be processed automatically.
        </Text>

        <Heading variant={5} weight="bold">
          What happens now ?
        </Heading>

        <Text>
          Once processed, you will receive and email notification and if opted
          in, a device notification. This process can take up to 5 minutes
          depending on the number of videos being processed.
        </Text>

        <Text>
          You will then be prompted to return to this form to view your scanned
          results and then complete the import.
        </Text>

        <Text>
          For now, feel free to close this modal and continue enjoying Reef
          Docs.
        </Text>
      </Grid>
    </ModalComposition>
  );
};

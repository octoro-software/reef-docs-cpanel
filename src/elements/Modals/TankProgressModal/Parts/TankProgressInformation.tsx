import React from "react";
import { useFormContext } from "react-hook-form";

import {
  Button,
  DateSelect,
  Grid,
  ModalComposition,
  ModalHeader,
  TextInput,
} from "../../../../components";

export const TankProgressInformation = ({
  handleNextStep,
  handleBack,
  loading,
  updateTankProgressLoading,
}) => {
  const { watch, setValue, control } = useFormContext();

  const date = watch("date");

  return (
    <ModalComposition
      renderFooter={() => (
        <Grid gap={8}>
          <Button
            title="Next"
            variant="secondary"
            onPress={handleNextStep}
            isLoading={loading || updateTankProgressLoading}
          />
          <Button
            title="Back"
            variant="primary"
            onPress={() => handleBack(-1)}
          />
        </Grid>
      )}
    >
      <Grid gap={16}>
        <ModalHeader
          icon={"reefDocsProgress"}
          iconHeight={48}
          iconWidth={48}
          title="Additional Information"
          content="Add further information to help you when looking back on this entry."
          center
        />

        <DateSelect
          label="Date"
          value={date}
          onConfirm={(value) => setValue("date", value)}
        />

        <TextInput
          name="description"
          control={control}
          label="Information"
          multiline
          placeholder="Enter some information here to refer back to later"
          textAlignVertical="top"
        />
      </Grid>
    </ModalComposition>
  );
};

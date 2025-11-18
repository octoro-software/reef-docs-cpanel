import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Button, Grid, TextInput } from "../../../../components";

import { ModalHeader } from "../../../../components/ModalHeader/ModalHeader";
import { ModalComposition } from "../../../../components/Modal/ModalComposition";

export const TestDataActions = ({ handleNextStep, handleSubmit, editMode }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [loading, setLoading] = useState(false);

  const handleValidationCheck = async () => {
    const validation = true;
    if (validation) {
      setLoading(true);
      await handleSubmit();
    }
  };

  return (
    <ModalComposition
      renderFooter={() => {
        return (
          <Grid gap={16}>
            <Button
              title={editMode ? "Update Test" : "Save Test"}
              variant="secondary"
              onPress={() => handleValidationCheck()}
              isLoading={loading}
            />
            <Button
              title="Back"
              variant="primary"
              onPress={() => handleNextStep(-1)}
              disabled={loading}
            />
          </Grid>
        );
      }}
    >
      <ModalHeader
        title="Test Actions"
        content="If action is required, document here what you plan to do. You can refer back to this."
        icon="reefDocsHomeTest"
        iconWidth={48}
        iconHeight={48}
      />

      <Grid gap={8} style={{ marginTop: 8 }}>
        <TextInput
          control={control}
          name="testAction"
          label="(Optional) Please Specify"
          multiline
          textAlignVertical="top"
          numberOfLines={8}
          placeholder="Type your answer here"
          hasError={errors.testAction?.message}
        />
      </Grid>
    </ModalComposition>
  );
};

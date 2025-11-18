import React from "react";
import { useFormContext } from "react-hook-form";

import { Button, Grid, TextInput } from "../../../../components";

import { ModalHeader } from "../../../../components/ModalHeader/ModalHeader";
import { ModalComposition } from "../../../../components/Modal/ModalComposition";
import { Keyboard } from "react-native";

export const LiveStockUserExperiencePost = ({
  handleNextStep,
  handleSubmit,
  error,
  loading,
  icon,
}) => {
  const {
    control,
    formState: { errors },
    trigger,
  } = useFormContext();

  const handleValidationCheck = async () => {
    const validation = await trigger();
    if (validation) {
      Keyboard.dismiss();
      await handleSubmit();
    }
  };

  return (
    <ModalComposition
      renderFooter={() => {
        return (
          <Grid gap={16}>
            <Button
              title="Submit"
              variant="secondary"
              onPress={() => handleValidationCheck()}
              isLoading={loading}
              error={error}
              errorMessage="Something went wrong"
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
        title="Add Experience"
        content="Please submit your feedback here. The more information you provide about your experience the better the community can learn from your experience."
        icon={icon ?? "reefDocsHelp"}
        iconWidth={48}
        iconHeight={48}
      />

      <Grid gap={8} style={{ marginTop: 8 }}>
        <TextInput
          control={control}
          name="content"
          label="Please Specify"
          multiline
          textAlignVertical="top"
          numberOfLines={12}
          hasError={errors.content?.message}
        />
      </Grid>
    </ModalComposition>
  );
};

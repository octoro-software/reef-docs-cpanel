import React from "react";
import { useFormContext } from "react-hook-form";

import { StyleSheet, View } from "react-native";

import {
  Button,
  Grid,
  Heading,
  ModalComposition,
  ModalHeader,
  Text,
  TextInput,
} from "../../../../components";

import { REEF_DOCS_BLUE, REEF_DOCS_GREY } from "../../../../constants";

export const LiveStockRequestForm = ({
  handleSubmit,
  loading,
  error,
  icon,
  coralRequest,
}) => {
  const {
    trigger,
    control,
    formState: { errors },
  } = useFormContext();

  const handleNextWithValidation = async () => {
    const formValid = await trigger("videos");

    if (formValid) {
      await handleSubmit();
    }
  };

  return (
    <ModalComposition
      renderFooter={() => (
        <Grid gap={8}>
          <Button
            title="Submit"
            variant="secondary"
            onPress={handleNextWithValidation}
            isLoading={loading}
            error={error}
            errorMessage="Something went wrong"
          />
        </Grid>
      )}
    >
      <Grid gap={16}>
        <ModalHeader
          icon={(icon ?? coralRequest) ? "reefDocsCoral" : "reefDocsFish"}
          iconHeight={48}
          iconWidth={48}
          title={
            coralRequest
              ? "Request New Coral"
              : "Please fill in the details below"
          }
        />

        <Grid gap={8} style={{ marginTop: 8 }}>
          <TextInput
            control={control}
            name="name"
            label="Name"
            hasError={errors.name?.message}
          />

          <Heading variant={5} weight="semiBold">
            References
          </Heading>

          <Text style={{ fontSize: 12, marginBottom: 8 }}>
            References will help us identify the animal. This can be a link to
            an image, website or any other online resource depicting your
            requested profile.
          </Text>

          <TextInput
            control={control}
            name="reference1"
            label="Reference 1"
            hasError={errors.reference1?.message}
            placeholder="https://www.aqua-docs.co.uk"
          />
          <TextInput
            control={control}
            name="reference2"
            label="Reference 2"
            hasError={errors.reference2?.message}
            placeholder="https://www.aqua-docs.co.uk"
          />
        </Grid>
      </Grid>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    borderRadius: 50,
    width: 64,
    height: 64,
    borderWidth: 1,
  },
  uploadWrapper: {
    borderStyle: "dashed",
    borderColor: REEF_DOCS_BLUE,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginTop: 16,
  },
  subText: {
    fontSize: 12,
    textAlign: "center",
    color: REEF_DOCS_GREY,
  },
});

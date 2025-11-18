import React, { useState } from "react";
import { Keyboard, View } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useModal } from "../../../../hooks/useModal";

import {
  Button,
  Grid,
  GridItem,
  ModalComposition,
  ModalHeader,
  TextInput,
} from "../../../../components";
import { useLiveStockSuggestEdits } from "../../../../hooks/useLiveStock";

export const SuggestEditForm = ({ id }) => {
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const { closeModal } = useModal();

  const {
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      suggestedEdits: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        suggestedEdits: yup
          .string()
          .max(1200)
          .required("Suggestions are required to submit this form"),
      })
    ),
  });

  const [postSuggestions] = useLiveStockSuggestEdits();

  const handleSubmit = async () => {
    Keyboard.dismiss();

    setLoading(true);

    const valid = await trigger();

    if (valid) {
      const data = getValues();

      data["liveStockId"] = id;

      await postSuggestions(data);

      setSuccess(true);

      reset();

      setTimeout(() => {
        closeModal();
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <ModalComposition
      renderFooter={() => {
        return (
          <Button
            onPress={handleSubmit}
            title={success ? "Suggestions Submitted !" : "Submit Sugggestions"}
            isLoading={loading}
            variant={success ? "success" : "primary"}
          />
        );
      }}
    >
      <View>
        <Grid gap={8}>
          <ModalHeader
            title="Suggest Edits"
            icon="reefDocsFish"
            content="Please provide details about the edits you would like to suggest. We rely on your continued information and support to keep the database accurate and up-to-date."
            iconHeight={48}
            iconWidth={48}
          />

          <GridItem>
            <TextInput
              control={control}
              name="suggestedEdits"
              multiline
              textAlignVertical="top"
              numberOfLines={8}
              placeholder="Type your suggestions here"
              hasError={errors.suggestedEdits?.message}
            />
          </GridItem>
        </Grid>
      </View>
    </ModalComposition>
  );
};

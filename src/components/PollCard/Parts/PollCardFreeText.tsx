import React, { useState } from "react";
import { TextInput } from "../../Form/TextInput/TextInput";
import { useForm } from "react-hook-form";
import { Grid } from "../../Grid/Grid";
import { Button } from "../../Button/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Text } from "../../Text/Text";
import { View } from "react-native";
export const PollCardFreeText: React.FC = ({ handleSubmit }) => {
  const [loading, setLoading] = useState(false);

  const [completed, setCompelted] = useState(false);

  const {
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      freeTextResponse: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        freeTextResponse: yup
          .string()
          .required("This field is required")
          .min(25, "Must be at least 25 characters"),
      })
    ),
  });

  const validateForm = async () => {
    const isValid = await trigger();
    if (isValid) {
      const value = getValues("freeTextResponse");

      setLoading(true);
      await handleSubmit(value);
      setLoading(false);
      setCompelted(true);
    }
  };

  if (completed) {
    return (
      <View>
        <Text>Thank you for your response</Text>
      </View>
    );
  }

  return (
    <Grid gap={8}>
      <TextInput
        control={control}
        name="freeTextResponse"
        multiline
        textAlignVertical="top"
        numberOfLines={8}
        placeholder="Type your answer here"
        hasError={errors.freeTextResponse?.message}
      />
      <Button title="Confirm" onPress={validateForm} isLoading={loading} />
    </Grid>
  );
};

import React, { useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Button,
  Grid,
  GridItem,
  ModalComposition,
  ModalHeader,
  Select,
  TextInput,
} from "../../../../components";

import { REEF_DOCS_GREY } from "../../../../constants";
import { usePostFeedback } from "../../../../hooks/useFeedback";
import { useModal } from "../../../../hooks/useModal";

export const UserFeedBackSection = ({
  footerStyle = true,
  sectionPreset = null,
}) => {
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const { closeModal } = useModal();

  const {
    control,
    watch,
    setValue,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      section: sectionPreset || "general",
      comments: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        section: yup.string().required("A section is required"),
        comments: yup
          .string()
          .max(1200)
          .required("Comments are required to submit feedback"),
      })
    ),
  });

  const [postFeedback] = usePostFeedback();

  const handleSubmit = async () => {
    Keyboard.dismiss();

    setLoading(true);

    const valid = await trigger();

    if (valid) {
      const data = getValues();

      const response = await postFeedback(data);

      if (response?.status === 200) {
        setSuccess(true);

        reset();

        setTimeout(() => {
          closeModal();
        }, 1500);
      }
    }

    setLoading(false);
  };

  const section = watch("section");

  return (
    <ModalComposition
      footerStyle={footerStyle ? { left: 1, paddingBottom: 32 } : {}}
      renderFooter={() => {
        return (
          <Button
            onPress={handleSubmit}
            title={success ? "Feedback Submitted !" : "Submit Feedback"}
            isLoading={loading}
            variant={success ? "success" : "primary"}
          />
        );
      }}
    >
      <View
        style={[styles.wrapper, footerStyle ? { padding: 16 } : { padding: 0 }]}
      >
        <Grid gap={8}>
          <ModalHeader
            title="Feedback"
            icon="reefDocsFeedback"
            content=" Please provide feedback on the app, anything not quite clear.
              Anything you dont like and things you do."
            iconHeight={48}
            iconWidth={48}
          />

          <GridItem>
            <Select
              label="Section"
              title="Section"
              hasError={errors.section?.message}
              options={[
                {
                  label: "General Feedback",
                  value: "general",
                },
                {
                  label: "Home ( Explore )",
                  value: "home",
                },
                {
                  label: "Social Media",
                  value: "socialMedia",
                },
                {
                  label: "Live Stock",
                  value: "liveStock",
                },
                {
                  label: "Tanks",
                  value: "tanks",
                },
                {
                  label: "Testing",
                  value: "testing",
                },
              ]}
              valueKey={"value"}
              labelKey={"label"}
              value={section}
              onConfirm={(value) => setValue("section", value)}
            />
          </GridItem>
          <GridItem>
            <TextInput
              control={control}
              name="comments"
              multiline
              textAlignVertical="top"
              numberOfLines={8}
              placeholder="Type your comments here"
              hasError={errors.comments?.message}
            />
          </GridItem>
        </Grid>
      </View>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    paddingTop: 0,
  },
  subText: {
    fontSize: 12,
    color: REEF_DOCS_GREY,
    textAlign: "center",
  },
});

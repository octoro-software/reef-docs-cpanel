import React from "react";
import { useFormContext } from "react-hook-form";
import { Keyboard, TouchableOpacity, View } from "react-native";

import {
  Button,
  Grid,
  Heading,
  ModalComposition,
  ModalHeader,
  RichText,
  Text,
} from "../../../../components";

import { MentionTextInput } from "../../../../components/Form/MentionTextInput/MentionTextInput";
import { ErrorText } from "../../../../components/Form/ErrorText/ErrorText";
import { INPUT_BORDER_COLOR } from "../../../../constants";
import { useModal } from "../../../../hooks/useModal";
import { useNavigate } from "react-router-native";

export const HelpPostContent = ({
  handleNextStep,
  icon,
  taggable,
  title = "Ask the Community",
  description = "Please be as thorough as possible. The more information you provide, the better the responses you'll receive. Please tag the relevant animal or topic if applicable to help us build our database.",
  placeholder = "Enter text here, use @ to tag animals or topics",
  postSearchResults = [],
  edit,
}) => {
  const { closeModal } = useModal();

  const navigate = useNavigate();

  const {
    trigger,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext();

  const handleNextWithValidation = async () => {
    const formValid = await trigger("content");

    if (formValid) {
      Keyboard.dismiss();
      handleNextStep();
    }
  };

  const handleRelatedPostPress = async (postId) => {
    await navigate(`/social?postId=${postId}`, { replace: true });

    closeModal();
  };

  const initialValue = getValues("content");

  return (
    <ModalComposition
      renderFooter={() => (
        <Button
          title="Next"
          variant="secondary"
          onPress={handleNextWithValidation}
        />
      )}
    >
      <Grid gap={16} style={{ paddingBottom: 100 }}>
        <ModalHeader
          icon={icon}
          iconHeight={48}
          iconWidth={48}
          title={title}
          content={description}
        />

        {edit && (
          <Text weight="bold">
            Editing your post will require moderation and temporarily make your
            post unavailable *
          </Text>
        )}

        <ErrorText text={errors.content?.message} />

        <MentionTextInput
          taggable={taggable}
          multiline
          numberOfLines={10}
          textAlignVertical="top"
          onChange={(v) => setValue("content", v)}
          placeholder={placeholder}
          value={initialValue}
        />

        <Text style={{ marginTop: -8, fontSize: 11 }}>Max 2400 characters</Text>

        {postSearchResults?.length > 0 && initialValue?.length > 0 && (
          <View>
            <Heading variant={5} weight="regular" style={{ marginBottom: 8 }}>
              Related Posts
            </Heading>

            <Grid direction="column">
              {postSearchResults?.map((post, key) => {
                return (
                  <TouchableOpacity
                    key={key}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: INPUT_BORDER_COLOR,
                      paddingVertical: 16,
                      borderTopWidth: key === 0 ? 1 : 0,
                      borderTopColor: INPUT_BORDER_COLOR,
                    }}
                    onPress={() => handleRelatedPostPress(post?.id)}
                  >
                    <RichText
                      html={post?.content}
                      hideShowMoreLabel={false}
                      showMore={false}
                      charLimit={400}
                    />
                  </TouchableOpacity>
                );
              })}
            </Grid>
          </View>
        )}
      </Grid>
    </ModalComposition>
  );
};

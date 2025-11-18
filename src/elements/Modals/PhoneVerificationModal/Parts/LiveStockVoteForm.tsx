import React from "react";
import { TouchableOpacity } from "react-native";
import { useFormContext } from "react-hook-form";

import {
  Button,
  Grid,
  Heading,
  Icon,
  ModalComposition,
  Select,
  Text,
  TextInput,
} from "../../../../components";
import {
  BLACK,
  INPUT_BORDER_COLOR,
  REEF_DOCS_BLUE,
  WHITE,
} from "../../../../constants";
import { ErrorText } from "../../../../components/Form/ErrorText/ErrorText";
import { AlertBox } from "../../../AlertBox/AlertBox";

export const LiveStockVoteForm = ({
  structuredConfiguration,
  handleSubmit,
  loading,
  error,
  hasVoted,
  range,
}) => {
  const {
    trigger,
    control,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useFormContext();

  const handleNextWithValidation = async () => {
    const formValid = await trigger();

    if (formValid) {
      await handleSubmit();
    }
  };

  const handleOptionSelect = (option) => {
    setValue("optionId", option.id);
    setValue("definition", option.definition);
    clearErrors("optionId");
  };

  const optionId = watch("optionId");

  return (
    <ModalComposition
      renderFooter={() => (
        <Button
          title="Submit"
          variant="secondary"
          onPress={handleNextWithValidation}
          isLoading={loading}
          error={error}
          errorMessage="Something went wrong"
        />
      )}
    >
      <Grid gap={8}>
        {hasVoted && (
          <AlertBox>
            You have already voted, you can change your vote if you wish but no
            contribution reward will be given.
          </AlertBox>
        )}

        <Heading variant={5} weight="semiBold">
          Please Choose an Option
        </Heading>

        {range ? (
          <Select
            options={structuredConfiguration}
            valueKey={"id"}
            labelKey={"name"}
            title={"Select an Option"}
            value={optionId}
            onConfirm={(value) =>
              handleOptionSelect(
                structuredConfiguration?.find((opt) => opt.id === value)
              )
            }
          />
        ) : (
          <Grid direction="row" gap={8} style={{ flexWrap: "wrap" }}>
            {structuredConfiguration?.map((option, key) => {
              const active = optionId === option.id;

              const hasError = errors?.optionId?.message;

              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => handleOptionSelect(option)}
                  style={{
                    borderWidth: hasError ? 2 : 1,
                    borderColor: hasError ? "#ff0000" : INPUT_BORDER_COLOR,
                    padding: 8,
                    borderRadius: 16,
                    backgroundColor: active ? REEF_DOCS_BLUE : "white",
                  }}
                >
                  <Grid direction="row" gap={8}>
                    {active && <Icon name="check" fill={WHITE} />}
                    <Text style={{ color: active ? WHITE : BLACK }}>
                      {option?.name}
                    </Text>
                  </Grid>
                </TouchableOpacity>
              );
            })}
          </Grid>
        )}

        <ErrorText text={errors?.optionId?.message} />

        <Heading variant={5} weight="semiBold">
          Please Provide Reasoning
        </Heading>
        <Text style={{ marginBottom: 8 }}>
          This is not public, this is to help us understand your reasons. If you
          would like to provide public feedback on the animal please use the
          share experience button.
        </Text>
        <TextInput
          control={control}
          name="reasoning"
          multiline
          textAlignVertical="top"
          numberOfLines={8}
          placeholder="Type your answer here"
          hasError={errors.reasoning?.message}
        />
      </Grid>
    </ModalComposition>
  );
};

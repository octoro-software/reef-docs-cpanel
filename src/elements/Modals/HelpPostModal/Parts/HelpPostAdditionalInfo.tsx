import React from "react";
import { useFormContext } from "react-hook-form";

import {
  Button,
  CheckboxField,
  Grid,
  GridItem,
  Heading,
  ModalComposition,
  ModalHeader,
  Select,
  Text,
} from "../../../../components";

import { useTankList } from "../../../../hooks/useTanks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppSelector } from "../../../../hooks/useRedux";
import { selectStructuredConfigurationById } from "../../../../store/slices/structuredConfigurationSlice";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  ALL_POST_TAG_ID,
  BLACK,
  REEF_DOCS_BLUE,
  WHITE,
} from "../../../../constants";

export const HelpPostAdditionalInfo = ({
  handleNextStep,
  handleBack,
  handleTankSelection,
  icon,
  urgentAvailable,
  edit,
}) => {
  const tanks = useTankList();

  const postTags = useAppSelector(
    selectStructuredConfigurationById("post_tags")
  );

  const {
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [tankId, shareTank, shareTest, urgent] = watch([
    "tankId",
    "shareTank",
    "shareTest",
    "urgent",
  ]);

  const handleNextWithValidation = async () => {
    const formValid = await trigger("content");

    if (formValid) {
      handleNextStep();
    }
  };

  const handleTestOrTankSelection = async (key, value) => {
    await AsyncStorage.setItem(key, value ? "true" : "false");

    setValue(key, value);
  };

  const onTagPress = (tag) => {
    let newTags = watch("tags") || [];

    if (newTags.some((t) => t === tag.id)) {
      newTags = newTags.filter((t) => t !== tag.id);
    } else {
      newTags.push(tag.id);
    }
    setValue("tags", newTags);
  };

  return (
    <ModalComposition
      renderFooter={() => (
        <Grid gap={8}>
          <Button
            title="Submit for Moderation"
            variant="secondary"
            onPress={handleNextWithValidation}
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
          icon={icon}
          iconHeight={48}
          iconWidth={48}
          title="Additional Information"
          content="Add further supporting information."
        />

        <Select
          title="Select Tank"
          options={tanks}
          valueKey="id"
          labelKey="name"
          label="Select Tank"
          onConfirm={handleTankSelection}
          value={tankId}
        />

        <Grid direction="row" gap={16} alignItems="center">
          <CheckboxField
            checked={shareTank}
            onChange={(e) =>
              handleTestOrTankSelection("shareTank", e.target.value)
            }
            hasError={errors?.shareTank?.message}
          />
          <Text>
            Allow users to see my selected tank overview for a better
            understanding of my setup
          </Text>
        </Grid>

        <Grid direction="row" gap={16} alignItems="center">
          <CheckboxField
            checked={shareTest}
            onChange={(e) =>
              handleTestOrTankSelection("shareTest", e.target.value)
            }
            hasError={errors?.shareTank?.message}
          />
          <Text>Share my parameters.</Text>
        </Grid>

        {urgentAvailable && (
          <Grid direction="column" gap={8}>
            <Grid
              direction="row"
              gap={16}
              alignItems="center"
              style={{ flexWrap: "wrap" }}
            >
              <GridItem>
                <CheckboxField
                  checked={urgent}
                  onChange={(e) =>
                    handleTestOrTankSelection("urgent", e.target.value)
                  }
                  hasError={errors?.disableComments?.message}
                  disabled={edit}
                />
              </GridItem>
              <GridItem flex={1}>
                <Text>Urgent</Text>
              </GridItem>
            </Grid>
            <Text>You can only have 1 urgent post per week.</Text>
          </Grid>
        )}

        <Heading variant={5} weight="regular">
          Post Tags
        </Heading>

        <Text style={{ marginTop: -8 }}>
          These are optional but help users interested in these topics find your
          post.
        </Text>

        <Grid direction="row" gap={8} style={{ flexWrap: "wrap" }}>
          {postTags
            ?.filter((t) => t.id !== ALL_POST_TAG_ID)
            .map((tag, key) => {
              const active = watch("tags")?.some((t) => t === tag.id);

              return (
                <TouchableOpacity
                  onPress={() => onTagPress(tag)}
                  key={key}
                  style={[
                    styles.pill,
                    active && { backgroundColor: REEF_DOCS_BLUE },
                  ]}
                >
                  <Text
                    style={{
                      color: active ? WHITE : BLACK,
                      textAlign: "center",
                    }}
                  >
                    {tag.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </Grid>
      </Grid>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  pill: {
    padding: 8,
    backgroundColor: WHITE,
    borderRadius: 16,
    minWidth: 50,
    alignItems: "center",
    borderWidth: 2,
    justifyContent: "center",
    display: "flex",
  },
});

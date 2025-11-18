import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useFormContext } from "react-hook-form";

import { useModal } from "../../../../hooks/useModal";

import {
  Button,
  CheckboxField,
  Grid,
  Icon,
  Text,
  ModalComposition,
  ModalHeader,
} from "../../../../components";

import { REEF_DOCS_BLUE, REEF_DOCS_GREY } from "../../../../constants";

export const CsvImportFileBrowseModal = ({
  handleCheckFileUpload,
  handleFileBrowse,
}) => {
  const {
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const { closeModal } = useModal();

  const [file, headers] = watch(["file", "headers"]);

  return (
    <ModalComposition
      renderFooter={() => (
        <Grid gap={8}>
          <Button
            title="Next"
            onPress={handleCheckFileUpload}
            variant="secondary"
          />
          <Button title="Close" onPress={closeModal} variant="primary" />
        </Grid>
      )}
    >
      <ModalHeader content="Please choose your excel document, you can then proceed to the next step." />

      <Grid gap={8}>
        <TouchableOpacity onPress={handleFileBrowse}>
          <View
            style={[
              styles.uploadWrapper,
              errors.file?.uri && { borderColor: "red" },
            ]}
          >
            <Icon
              fill={REEF_DOCS_BLUE}
              name="cloudUpload"
              width={64}
              height={64}
            />
            <Text style={{ marginTop: 8 }}>
              {file?.name || "Upload your Excel Document here"}
            </Text>
            <Text style={styles.subText}>
              Tap to browse for you excel document file.
            </Text>
            <Text style={styles.subText} weight="bold">
              Max 1
            </Text>
          </View>
        </TouchableOpacity>

        <Text>
          Does the file contain column headers ? ( We will skip the first row )
        </Text>

        <CheckboxField
          checked={headers}
          onChange={(e) => setValue("headers", e.target.value)}
          hasError={errors?.acceptedTerms?.message}
        />
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

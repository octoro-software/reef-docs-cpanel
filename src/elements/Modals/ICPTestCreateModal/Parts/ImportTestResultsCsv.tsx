import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { usePostTestImportCsv } from "../../../../hooks/useTestHistory";

import { pickDocument } from "../../../../utility/camera";

import {
  Button,
  Grid,
  Icon,
  Text,
  ModalComposition,
  ModalHeader,
  Heading,
  GridItem,
  CheckboxField,
} from "../../../../components";

import { RawTextInput } from "../../../../components/Form/RawTextInput/RawTextInput";

import { REEF_DOCS_BLUE, REEF_DOCS_GREY } from "../../../../constants";

export const ImportTestResultsCsv = ({ handleNextStep, localKey }) => {
  const { setValue } = useFormContext();

  const [csvMedia, setCsvMedia] = React.useState(null);

  const [uploading, setUploading] = React.useState(false);

  const [errors, setErrors] = React.useState({
    media: null,
    elementSymbolColumnNumber: null,
    elementNameColumnNumber: null,
    elementValueColumnNumber: null,
  });

  const [csvMediaSetup, setCsvMediaSetup] = React.useState({
    elementSymbolColumnNumber: "",
    elementNameColumnNumber: "",
    elementValueColumnNumber: "",
    headers: true,
  });

  const [importTestCsv] = usePostTestImportCsv();

  const handleMediaPress = async () => {
    const result = await pickDocument({
      type: [
        "text/csv",
        "application/vnd.ms-excel",
        "application/csv",
        "text/comma-separated-values",
      ],
      multiple: false,
    });

    setCsvMedia(result?.assets?.[0]);

    setErrors((prev) => ({
      ...prev,
      media: null,
    }));
  };

  const handleGetPreviousSetup = async () => {
    const previousSetup = await AsyncStorage.getItem(localKey);

    if (previousSetup) {
      const parsedSetup = JSON.parse(previousSetup);

      setCsvMediaSetup(parsedSetup);
    }
  };

  const handleValidationCheck = async () => {
    const errorState: any = {};

    if (!csvMedia) {
      errorState.media = "Please upload a CSV file";
    }

    if (!csvMediaSetup.elementSymbolColumnNumber) {
      errorState.elementSymbolColumnNumber =
        "Element Symbol Column Number is required";
    }

    if (!csvMediaSetup.elementValueColumnNumber) {
      errorState.elementValueColumnNumber =
        "Element Value Column Number is required";
    }

    if (Object.keys(errorState).length > 0) {
      setErrors(errorState);
      return;
    }

    const formData: any = new FormData();

    formData.append(`file`, {
      uri: csvMedia.uri,
      name: csvMedia.name,
      type: csvMedia.mimeType,
    });

    formData.append(
      "elementSymbolColumnNumber",
      csvMediaSetup.elementSymbolColumnNumber
    );
    formData.append(
      "elementValueColumnNumber",
      csvMediaSetup.elementValueColumnNumber
    );
    formData.append(
      "elementNameColumnNumber",
      csvMediaSetup.elementNameColumnNumber
    );

    formData.append("headers", csvMediaSetup.headers);

    setUploading(true);

    const response = await importTestCsv(formData);

    setUploading(false);

    setValue("uploadedTestResults", response);

    await AsyncStorage.setItem(localKey, JSON.stringify(csvMediaSetup));

    handleNextStep(-1);
  };

  useEffect(() => {
    handleGetPreviousSetup();
  }, []);

  return (
    <ModalComposition
      renderFooter={() => {
        return (
          <Grid gap={8}>
            <Button
              title="Process File"
              variant="secondary"
              isLoading={uploading}
              disabled={uploading}
              onPress={() => handleValidationCheck()}
            />

            <Button
              title="Back"
              variant="primary"
              onPress={() => handleNextStep(-1)}
              disabled={uploading}
            />
          </Grid>
        );
      }}
    >
      <ModalHeader
        icon="reefDocsIcpTest"
        iconWidth={48}
        iconHeight={48}
        title={"Import Test Results"}
      />

      <View style={{ marginBottom: 40 }}>
        <TouchableOpacity onPress={() => handleMediaPress("media")}>
          <View
            style={[
              styles.uploadWrapper,
              errors.media && { borderColor: "red" },
            ]}
          >
            <Icon
              fill={errors?.media ? "red" : REEF_DOCS_BLUE}
              name="cloudUpload"
              width={64}
              height={64}
            />
            <Text style={{ marginTop: 8 }}>
              {csvMedia?.name || "Upload your CSV here"}
            </Text>
            <Text style={styles.subText}>
              Please ensure the the document is a CSV and matches the mapping.
            </Text>
            <Text style={styles.subText} weight="bold">
              Max 1
            </Text>
          </View>
        </TouchableOpacity>

        <Grid direction="column" gap={16} style={{ marginTop: 16 }}>
          <View>
            <Heading variant={5} weight="semiBold">
              Document Setup
            </Heading>

            <Text style={{ fontSize: 12 }}>
              Please enter the respective column numbers for each field.
            </Text>
          </View>

          <Grid direction="row" gap={8}>
            <GridItem flex={1}>
              <RawTextInput
                label="Element Symbol *"
                keyboardType="numeric"
                placeholder="1"
                name="elementSymbolColumnNumber"
                hasError={errors.elementSymbolColumnNumber}
                value={csvMediaSetup.elementSymbolColumnNumber}
                onChange={(value) => {
                  setCsvMediaSetup({
                    ...csvMediaSetup,
                    elementSymbolColumnNumber: value,
                  });
                  setErrors((prev) => ({
                    ...prev,
                    elementSymbolColumnNumber: null,
                  }));
                }}
                transformFn={(value) => value.replace(",", ".")}
              />
            </GridItem>

            <GridItem flex={1}>
              <RawTextInput
                label="Element Value *"
                keyboardType="numeric"
                placeholder="2"
                name="elementValueColumnNumber"
                hasError={errors.elementValueColumnNumber}
                value={csvMediaSetup.elementValueColumnNumber}
                onChange={(value) => {
                  setCsvMediaSetup({
                    ...csvMediaSetup,
                    elementValueColumnNumber: value,
                  });
                  setErrors((prev) => ({
                    ...prev,
                    elementValueColumnNumber: null,
                  }));
                }}
                transformFn={(value) => value.replace(",", ".")}
              />
            </GridItem>
            <GridItem flex={1}>
              <RawTextInput
                label="Element Name"
                placeholder="3"
                keyboardType="numeric"
                name="elementNameColumnNumber"
                value={csvMediaSetup.elementNameColumnNumber}
                onChange={(value) =>
                  setCsvMediaSetup({
                    ...csvMediaSetup,
                    elementNameColumnNumber: value,
                  })
                }
                transformFn={(value) => value.replace(",", ".")}
              />
            </GridItem>
          </Grid>

          <Grid direction="row" gap={8}>
            <GridItem flex={1}>
              <Grid direction="row" gap={16} alignItems="center">
                <CheckboxField
                  checked={csvMediaSetup.headers}
                  onChange={(e) =>
                    setCsvMediaSetup({
                      ...csvMediaSetup,
                      headers: e.target.value,
                    })
                  }
                  hasError={errors?.shareTank?.message}
                />
                <Text>Header Row</Text>
              </Grid>
              <Text style={{ fontSize: 12, marginTop: 16 }}>
                Does the CSV file contain a header row to be ignored ?
              </Text>
            </GridItem>
          </Grid>
        </Grid>
      </View>
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

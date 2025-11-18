import React from "react";
import { useFormContext } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { pickMedia } from "../../../../utility/camera";

import {
  Button,
  Grid,
  Heading,
  Icon,
  Text,
  ModalComposition,
  ModalHeader,
} from "../../../../components";

import { ProgressChart } from "../../../../components/Charts/Core/ProgressChart/ProgressChart";

import { REEF_DOCS_BLUE, REEF_DOCS_GREY } from "../../../../constants";

export const ICPImportVideo = ({
  handleProcess,
  handleGuideNavigate,
  icpProvider,
  handleBack,
  includesRo,
  uploading = false,
  roUploading = false,
  uploadProgress,
  roUploadProgress,
}) => {
  const {
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext();

  const [media, roMedia] = watch(["media", "roMedia"]);

  const handleMediaPress = async (key: string) => {
    const result = await pickMedia(false, true, 1);

    setValue(key, result?.assets?.[0]);
  };

  const handleValidationCheck = async (fn) => {
    const validation = await trigger(["media.uri"]);

    if (validation) {
      return fn();
    }
  };

  return (
    <ModalComposition
      renderFooter={() => {
        return (
          <Grid gap={8}>
            <Button
              title="Process Video"
              variant="secondary"
              isLoading={uploading}
              onPress={() => handleValidationCheck(handleProcess)}
            />
            <Button
              title="Need Help ? View Guide"
              variant="primary"
              onPress={() => handleGuideNavigate()}
              disabled={uploading}
            />
            <Button
              title="Back"
              variant="primary"
              onPress={() => handleBack(-1)}
              disabled={uploading}
            />
          </Grid>
        );
      }}
    >
      <ModalHeader image={icpProvider?.image} title={icpProvider?.name} />

      {includesRo && (
        <Heading variant={6} weight="semiBold">
          Tank Elements ( Required )
        </Heading>
      )}
      <TouchableOpacity onPress={() => handleMediaPress("media")}>
        <View
          style={[
            styles.uploadWrapper,
            errors.media?.uri && { borderColor: "red" },
          ]}
        >
          {uploading ? (
            <ProgressChart
              percentage={uploadProgress ?? 0}
              value={`${parseInt(uploadProgress ?? 0)}%`}
              startingGradient="#3fff3f"
              endingGradient="#00a100"
            />
          ) : (
            <Icon
              fill={REEF_DOCS_BLUE}
              name="cloudUpload"
              width={64}
              height={64}
            />
          )}
          <Text style={{ marginTop: 8 }}>
            {media?.fileName || "Upload your screen recording here"}
          </Text>
          <Text style={styles.subText}>
            Please ensure the video is clear and scrolled at an average speed.
            The screen recording must not exceed 30 seconds in length.
          </Text>
          <Text style={styles.subText} weight="bold">
            Max 1
          </Text>
        </View>
      </TouchableOpacity>

      {includesRo && (
        <View style={{ marginTop: 16 }}>
          <Heading variant={6} weight="semiBold">
            RO Water ( Optional )
          </Heading>
          <TouchableOpacity onPress={() => handleMediaPress("roMedia")}>
            <View style={styles.uploadWrapper}>
              {roUploading ? (
                <ProgressChart
                  percentage={roUploadProgress ?? 0}
                  value={`${parseInt(roUploadProgress ?? 0)}%`}
                  startingGradient="#3fff3f"
                  endingGradient="#00a100"
                />
              ) : (
                <Icon
                  fill={REEF_DOCS_BLUE}
                  name="cloudUpload"
                  width={64}
                  height={64}
                />
              )}
              <Text style={{ marginTop: 8 }}>
                {roMedia?.fileName || "Upload your screen recording here"}
              </Text>
              <Text style={styles.subText}>
                Please ensure the video is clear and scrolled at an average
                speed. The screen recording must not exceed 30 seconds in
                length.
              </Text>
              <Text style={styles.subText} weight="bold">
                Max 1
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
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

import React from "react";
import {
  Button,
  Grid,
  Icon,
  ModalComposition,
  ModalHeader,
  Text,
} from "../../../../components";
import { useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { REEF_DOCS_BLUE, REEF_DOCS_GREY } from "../../../../constants";
import { pickMedia, useCameraOrMedia } from "../../../../utility/camera";

export const LiveStockProfileUserSelectVideo = ({
  handleSubmit,
  handleNextStep,
  icon,
}) => {
  const {
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [videos] = watch(["videos"]);

  const handleNextWithValidation = async () => {
    const formValid = await trigger("videos");

    if (formValid) {
      await handleSubmit();
    }
  };

  const handleMediaPress = (key, result) => {
    setValue(key, result?.assets);
  };

  const { CameraMediaModal: VideoMediaModal } =
    useCameraOrMedia(handleMediaPress);

  return (
    <ModalComposition
      renderFooter={() => (
        <Grid gap={8}>
          <Button
            title="Submit"
            variant="secondary"
            onPress={handleNextWithValidation}
          />
          <Button
            title="Back"
            variant="primary"
            onPress={() => handleNextStep(-1)}
          />
        </Grid>
      )}
    >
      <Grid gap={16}>
        <ModalHeader
          icon={icon ?? "reefDocsContribution"}
          iconHeight={48}
          iconWidth={48}
          title="Please Upload a Video"
          content="Please try to capture the animal under white light to give users a true representation of the animal."
        />

        <VideoMediaModal
          keyName="videos"
          video={true}
          limit={1}
          maxSizeMB={200}
        >
          <View
            style={[
              styles.uploadWrapper,
              errors.videos?.message && { borderColor: "red" },
              { marginTop: 4 },
            ]}
          >
            <Icon name="reefDocsVideo" width={64} height={64} />
            <Text style={{ marginTop: 8 }}>
              {videos?.length > 0 ? `1 Video chosen` : "Upload your video here"}
            </Text>
            <Text style={styles.subText}>
              Please ensure the video tries to capture the problem, the better
              the video the better the community can help!
            </Text>
            <Text style={styles.subText} weight="bold">
              Max 1 - Max Size 200MB
            </Text>
          </View>
        </VideoMediaModal>
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

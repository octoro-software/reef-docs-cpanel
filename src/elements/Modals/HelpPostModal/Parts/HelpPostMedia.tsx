import React from "react";
import {
  AppImage,
  Button,
  Grid,
  Icon,
  ModalComposition,
  ModalHeader,
  Text,
} from "../../../../components";
import { useFormContext } from "react-hook-form";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ProgressChart } from "../../../../components/Charts/Core/ProgressChart/ProgressChart";
import {
  CDN_VIDEO_BASE_URL,
  REEF_DOCS_BLUE,
  REEF_DOCS_GREY,
  WHITE,
} from "../../../../constants";
import { useCameraOrMedia } from "../../../../utility/camera";

export const HelpPostMedia = ({
  handleNextStep,
  handleBack,
  uploading = false,
  icon,
  edit = false,
}) => {
  const {
    trigger,
    watch,
    setValue,
    formState: { errors },
    getValues,
  } = useFormContext();

  const [images, videos, imagesToUpload] = watch([
    "images",
    "videos",
    "imagesToUpload",
  ]);

  const handleNextWithValidation = async () => {
    const formValid = await trigger("images");

    if (formValid) {
      handleNextStep();
    }
  };

  const handleRemoveImageUpload = (data) => {
    const isExisting = typeof data === "string";
    const index = isExisting
      ? images.findIndex((img) => img === data)
      : imagesToUpload.findIndex((img) => img.uri === data.uri);

    if (isExisting) {
      const currentImages = getValues("images");
      currentImages.splice(index, 1);
      setValue("images", currentImages);
    } else {
      const currentImagesToUpload = getValues("imagesToUpload");
      currentImagesToUpload.splice(index, 1);
      setValue("imagesToUpload", currentImagesToUpload);
    }
  };

  const totalImages = (imagesToUpload?.length || 0) + (images?.length || 0);

  const combinedImages = [...(images || []), ...(imagesToUpload || [])];

  const handleMediaChoice = (key, result) => {
    if (totalImages >= 4) {
      return;
    }

    // only spread the result into imagesToUpload upto the max of 4
    const newImagesToUpload =
      totalImages === 0
        ? result?.assets
        : result?.assets?.slice(0, 4 - totalImages);

    setValue(key, newImagesToUpload);
  };

  const handleVideoMediaChoice = (key, result) => {
    setValue(key, result?.assets);
  };

  const { CameraMediaModal } = useCameraOrMedia(handleMediaChoice);
  const { CameraMediaModal: VideoMediaModal } = useCameraOrMedia(
    handleVideoMediaChoice
  );

  const handleRemoveVideo = () => {
    setValue("videos", []);
  };

  return (
    <ModalComposition
      renderFooter={() => (
        <Grid gap={8}>
          <Button
            title="Next"
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
      <Grid gap={16} style={{ paddingBottom: 60 }}>
        <ModalHeader
          icon={icon}
          iconHeight={48}
          iconWidth={48}
          title="Please Upload Photos and Videos"
          content="Please try to make the photos and videos as clear as possible. Videos will have the audio removed by default."
        />

        <CameraMediaModal keyName="imagesToUpload" video={false} limit={4}>
          <View
            style={[
              styles.uploadWrapper,
              errors.images?.message && { borderColor: "red" },
            ]}
          >
            <Icon name="reefDocsCamera" width={64} height={64} />
            <Text style={{ marginTop: 8 }}>
              {totalImages > 0
                ? `${
                    totalImages === 1 ? `1 Image` : `${totalImages} Images`
                  } chosen`
                : "Upload your images here"}
            </Text>
            <Text style={styles.subText}>
              Please ensure the images try to capture the problem, the better
              the images the better the community can help!
            </Text>
            <Text style={styles.subText} weight="bold">
              Max 4
            </Text>
          </View>
        </CameraMediaModal>

        <Grid direction="row" gap={16}>
          {edit &&
            combinedImages?.length > 0 &&
            combinedImages.map((img, index) => (
              <TouchableOpacity onPress={() => handleRemoveImageUpload(img)}>
                <View
                  style={{
                    position: "absolute",
                    zIndex: 1,
                    top: -4,
                    right: -4,
                    width: 16,
                    height: 16,
                    backgroundColor: "red",
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon name="close" width={12} height={12} fill={WHITE} />
                </View>
                {typeof img === "string" ? (
                  <AppImage
                    path={img}
                    key={index}
                    width={64}
                    height={64}
                    style={{ borderRadius: 8 }}
                  />
                ) : (
                  <Image
                    source={{ uri: img?.uri }}
                    width={64}
                    height={64}
                    style={{ borderRadius: 8 }}
                  />
                )}
              </TouchableOpacity>
            ))}
        </Grid>

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
            <Text style={styles.subText} weight="bold">
              * HDR videos will only play in full screen mode, we will monitor
              this *
            </Text>
          </View>
        </VideoMediaModal>

        {videos && videos?.length > 0 && edit && (
          <Grid direction="row">
            <TouchableOpacity onPress={handleRemoveVideo}>
              <View
                style={{
                  position: "absolute",
                  zIndex: 1,
                  top: -4,
                  right: -4,
                  width: 16,
                  height: 16,
                  backgroundColor: "red",
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon name="close" width={12} height={12} fill={WHITE} />
              </View>
              <Image
                width={64}
                height={64}
                source={{
                  uri: `${CDN_VIDEO_BASE_URL}${videos?.[0]?.bunnyVideoId}/thumbnail.jpg`,
                }}
                style={{ borderRadius: 8 }}
              />
            </TouchableOpacity>
          </Grid>
        )}
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

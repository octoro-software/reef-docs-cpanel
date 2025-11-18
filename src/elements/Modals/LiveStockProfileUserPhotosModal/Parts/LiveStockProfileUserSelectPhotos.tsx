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
import { useCameraOrMedia } from "../../../../utility/camera";

export const LiveStockProfileUserSelectPhotos = ({
  handleNextStep,
  handleSubmit,
  loading,
  error,
  icon,
}) => {
  const {
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const handleMediaChoice = (key, result) => setValue(key, result?.assets);

  const { CameraMediaModal } = useCameraOrMedia(handleMediaChoice);

  const [images] = watch(["images"]);

  const handleNextWithValidation = async () => {
    const formValid = await trigger("images");

    if (formValid) {
      await handleSubmit();
    }
  };

  return (
    <ModalComposition
      renderFooter={() => (
        <Grid gap={8}>
          <Button
            title="Next"
            variant="secondary"
            isLoading={loading}
            error={error}
            errorMessage="Something went wrong"
            onPress={handleNextWithValidation}
          />
          <Button
            title="Back"
            variant="primary"
            onPress={() => handleNextStep(-1)}
            disabled={loading}
          />
        </Grid>
      )}
    >
      <Grid gap={16}>
        <ModalHeader
          icon={icon ?? "reefDocsHelp"}
          iconHeight={48}
          iconWidth={48}
          title="Please Upload Photos"
          content="Please note, photos are subject to approval. Once submitted, we aim to approve your photos within 24 hours."
        />

        <Text weight="semiBold" style={{ fontSize: 12 }}>
          Users who submit photos must own or have the rights to submit them.
          Aqua Docs makes copyright checks where possible and photos which look
          to be taken without consent will be declined. We hope you understand.
        </Text>

        <CameraMediaModal keyName="images" video={false} limit={4}>
          <View
            style={[
              styles.uploadWrapper,
              errors.images?.message && { borderColor: "red" },
            ]}
          >
            <Icon name={icon ?? "reefDocsCamera"} width={64} height={64} />
            <Text style={{ marginTop: 8 }}>
              {images?.length > 0
                ? `${
                    images.length === 1 ? `1 Image` : `${images.length} Images`
                  } chosen`
                : "Upload your images here"}
            </Text>
            <Text style={styles.subText}>
              Please ensure the image captures the animal and try not have other
              animal in the shots.
            </Text>
            <Text style={styles.subText} weight="bold">
              Min 1 - Max 4
            </Text>
          </View>
        </CameraMediaModal>
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

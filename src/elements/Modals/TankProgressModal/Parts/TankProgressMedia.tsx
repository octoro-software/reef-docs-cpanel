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
import { StyleSheet, View } from "react-native";
import { REEF_DOCS_BLUE, REEF_DOCS_GREY } from "../../../../constants";
import { useCameraOrMedia } from "../../../../utility/camera";
import { getAppDimensions } from "../../../../utility/dimensions";
import { ButtonWithConfirmation } from "../../../../components/ButtonWithConfirmation/ButtonWithConfirmation";

const width = getAppDimensions().width;

export const TankProgressMedia = ({
  handleNextStep,
  icon,
  edit,
  handleDeleteProgress,
  deleteTankProgressLoading,
}) => {
  const handleMediaChoice = (key, result) => {
    setValue(key, result?.assets);
  };
  const { CameraMediaModal } = useCameraOrMedia(handleMediaChoice);

  const {
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [images, imageUrls, id] = watch(["images", "imageUrls", "id"]);

  const handleNextWithValidation = async () => {
    const formValid = await trigger("images");

    if (formValid) {
      handleNextStep();
    }
  };

  const handleRemove = () => {
    setValue("removeExistingImage", true);
    setValue("imageUrls", []);
  };

  const hasImages = imageUrls?.length > 0;

  return (
    <ModalComposition
      renderFooter={() => (
        <Grid gap={8}>
          <Button
            title="Next"
            variant="secondary"
            onPress={handleNextWithValidation}
          />
          {edit && (
            <ButtonWithConfirmation
              onPress={() => handleDeleteProgress(id)}
              title="Delete Progress"
              confirmationTitle="Are you sure ?"
              confirmationVariant="delete"
              isLoading={deleteTankProgressLoading}
            />
          )}
        </Grid>
      )}
    >
      <Grid gap={16} style={{ paddingBottom: 60 }}>
        <ModalHeader
          icon={icon}
          iconHeight={48}
          iconWidth={48}
          title="Please Choose a Photo"
          content="Please try to capture your whole tank."
        />

        {hasImages && edit ? (
          <Grid gap={8}>
            <AppImage
              path={imageUrls[0]?.url}
              width={width}
              height={200}
              style={{ resizeMode: "cover" }}
            />

            <Button
              title="Change Image"
              variant="delete"
              onPress={handleRemove}
            />
          </Grid>
        ) : (
          <CameraMediaModal keyName="images" video={false} limit={1}>
            <View
              style={[
                styles.uploadWrapper,
                errors.images?.message && { borderColor: "red" },
              ]}
            >
              <Icon name="reefDocsCamera" width={64} height={64} />
              <Text style={{ marginTop: 8 }}>
                {images?.length > 0
                  ? `${
                      images.length === 1
                        ? `1 Image`
                        : `${images.length} Images`
                    } chosen`
                  : "Upload your images here"}
              </Text>
              <Text style={styles.subText}>
                Please ensure the images try to capture the problem, the better
                the images the better the community can help!
              </Text>
              <Text style={styles.subText} weight="bold">
                Max 1
              </Text>
            </View>
          </CameraMediaModal>
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

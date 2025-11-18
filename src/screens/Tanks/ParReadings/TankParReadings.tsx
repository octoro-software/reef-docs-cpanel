import React, { useEffect } from "react";
import {
  PanResponder,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { UserPostCardScreenHeader } from "../../../elements/UserPostCardScreenHeader/UserPostCardScreenHeader";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { useCameraOrMedia } from "../../../utility/camera";
import {
  AppImage,
  Button,
  Grid,
  GridItem,
  Icon,
  Text,
  TextInput,
} from "../../../components";
import {
  BLACK,
  REEF_DOCS_BLUE,
  REEF_DOCS_GREY,
  WHITE,
} from "../../../constants";

import { useRef } from "react";
import {
  useGetActiveTank,
  useUpdateTankParMeasurements,
} from "../../../hooks/useTanks";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppTip } from "../../../components/AppTip/AppTip";

const IMAGE_WIDTH = 1000;
const IMAGE_HEIGHT = 400;

export const TankParReadings: React.FC = () => {
  const horizontalScrollRef = useRef(null);
  const verticalScrollRef = useRef(null);
  const [scrollX, setScrollX] = React.useState(0);
  const [scrollY, setScrollY] = React.useState(0);
  const [visibleWidth, setVisibleWidth] = React.useState(0);
  const [visibleHeight, setVisibleHeight] = React.useState(0);
  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const activeTank = useGetActiveTank();

  const [updateTankParReadings, updateTankParReadingLoading] =
    useUpdateTankParMeasurements();

  const { setValue, watch, control, getValues, trigger } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        images: yup.array().of(
          yup.object().shape({
            uri: yup.string(),
            fileName: yup.string(),
            type: yup.string(),
          })
        ),
        parReferenceImage: yup.string(),
        parMeasurements: yup.array().of(
          yup.object().shape({
            x: yup.number().typeError("Must be a number"),
            y: yup.number().typeError("Must be a number"),
            par: yup
              .number()
              .typeError("Must be a number")
              .min(0, "Must be 0 or more")
              .max(1000, "Must be 1000 or less")
              .required(),
          })
        ),
      })
    ),
    defaultValues: {
      parMeasurements: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "parMeasurements",
  });

  const handleMediaChoice = (key, result) => {
    setValue(key, result?.assets);
    setValue("parReferenceImage", result?.assets?.[0]?.uri);
  };
  const { CameraMediaModal } = useCameraOrMedia(handleMediaChoice);

  const [parReferenceImage, parMeasurements, images] = watch([
    "parReferenceImage",
    "parMeasurements",
    "images",
  ]);

  const panResponders = (parMeasurements || []).map((m, idx) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => setScrollEnabled(false),
      onPanResponderMove: (_, gesture) => {
        // Update the point position
        setValue(
          `parMeasurements.${idx}.x`,
          Math.max(
            0,
            Math.min(IMAGE_WIDTH, (m.x || IMAGE_WIDTH / 2) + gesture.dx)
          )
        );
        setValue(
          `parMeasurements.${idx}.y`,
          Math.max(
            0,
            Math.min(IMAGE_HEIGHT, (m.y || IMAGE_HEIGHT / 2) + gesture.dy)
          )
        );
      },
      onPanResponderRelease: () => setScrollEnabled(true),
      onPanResponderTerminate: () => setScrollEnabled(true),
    })
  );

  const handleSubmit = async () => {
    const data = getValues();

    const valid = await trigger();

    if (valid) {
      const formData: any = new FormData();

      formData.append("parReferenceImage", data?.parReferenceImage);
      formData.append("parMeasurements", JSON.stringify(data?.parMeasurements));
      formData.append("tankId", activeTank?.id);

      if (
        data.images &&
        Array.isArray(data.images) &&
        data?.images?.length > 0
      ) {
        data.images.forEach((image, index) => {
          formData.append(`images[${index}]`, {
            uri: image.uri,
            name: image.fileName || `image_${index}.jpg`,
            type: image.type || "image/jpeg",
          });
        });
      }
      await updateTankParReadings(formData);

      setSaveSuccess(true);

      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handleChangeImage = () => {
    setValue("parReferenceImage", null);
  };

  useEffect(() => {
    if (activeTank?.parReferenceImage) {
      setValue("parReferenceImage", activeTank.parReferenceImage);
      setValue("parMeasurements", activeTank?.parMeasurements || []);
    }
  }, [activeTank]);

  return (
    <View style={{ marginBottom: 80 }}>
      <UserPostCardScreenHeader
        title="Par Readings"
        icon="reefDocsCoralLighting"
      />

      <View style={{ height: 8 }} />

      {!parReferenceImage && (
        <CameraMediaModal
          keyName="images"
          enableEdit={true}
          editHeight={400}
          editWidth={1000}
          video={false}
          limit={1}
        >
          <View style={[styles.uploadWrapper]}>
            <Icon name="reefDocsTanks" width={64} height={64} />

            <Text style={styles.subText}>
              Please add an image of your tank to map par measurements.
            </Text>
            <Text style={styles.subText} weight="bold">
              Max 1
            </Text>
          </View>
        </CameraMediaModal>
      )}

      {parReferenceImage && (
        <ScrollView
          horizontal
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ flex: 1 }}
          scrollEnabled={scrollEnabled}
          ref={horizontalScrollRef}
          onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
          scrollEventThrottle={16}
          onLayout={(e) => setVisibleWidth(e.nativeEvent.layout.width)}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}
            scrollEnabled={scrollEnabled}
            ref={verticalScrollRef}
            onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
            scrollEventThrottle={16}
            onLayout={(e) => setVisibleHeight(e.nativeEvent.layout.height)}
          >
            <View style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}>
              <AppImage
                path={parReferenceImage}
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                localImage={images?.length > 0}
              />
              <TouchableOpacity
                onPress={handleChangeImage}
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  zIndex: 10,
                }}
              >
                <Icon name="edit" width={24} height={24} fill={WHITE} />
              </TouchableOpacity>
              {(parMeasurements || []).map((m, idx) => (
                <View
                  key={idx}
                  {...(panResponders[idx]?.panHandlers || {})}
                  style={{
                    position: "absolute",
                    left: (m.x ?? IMAGE_WIDTH / 2) - 24,
                    top: (m.y ?? IMAGE_HEIGHT / 2) - 24,
                    width: 48,
                    height: 64, // increased height for value below
                    alignItems: "center",
                    zIndex: 10,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: "rgba(0,122,255,0.7)",
                      borderWidth: 2,
                      borderColor: "#fff",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      {String(idx + 1)}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: "#222",
                      fontWeight: "bold",
                      fontSize: 12,
                      marginTop: 2,
                      backgroundColor: "rgba(255,255,255,0.8)",
                      borderRadius: 4,
                      paddingHorizontal: 4,
                    }}
                  >
                    {m.par ? m.par : ""}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      )}

      <AppTip
        text="Remember: Swipe along the image to reveal the rest of it."
        tipId="PAR_READINGS_SWIPE"
        style={{ marginTop: 8 }}
      />

      <Grid direction="column" gap={8} style={{ marginTop: 8 }}>
        {fields?.map((_, index) => {
          return (
            <Grid key={index} direction="row" gap={8} alignItems="center">
              <GridItem flex={1}>
                <TextInput
                  style={{ backgroundColor: WHITE, borderColor: BLACK }}
                  control={control}
                  unitLabel="PAR"
                  name={`parMeasurements.${index}.par`}
                  keyboardType="numeric"
                  onChange={(value) =>
                    setValue(`parMeasurements.${index}.par`, value)
                  }
                  transformFn={(value) => value.replace(",", ".")}
                />
              </GridItem>
              <GridItem>
                <Button
                  title="Remove"
                  onPress={() => remove(index)}
                  variant="delete"
                />
              </GridItem>
            </Grid>
          );
        })}

        <Button
          title="Add Measurement"
          onPress={() => {
            // Center in visible area, fallback to image center
            const x =
              scrollX + (visibleWidth ? visibleWidth / 2 : IMAGE_WIDTH / 2);
            const y =
              scrollY + (visibleHeight ? visibleHeight / 2 : IMAGE_HEIGHT / 2);
            append({ par: "", x, y });
          }}
          variant="secondary"
        />

        <Button
          title="Save"
          onPress={handleSubmit}
          isLoading={updateTankParReadingLoading}
          success={saveSuccess}
          successMessage="Par Readings Saved!"
        />
      </Grid>
    </View>
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

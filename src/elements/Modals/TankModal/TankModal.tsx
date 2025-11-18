import React, { useEffect, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Button,
  Grid,
  GridItem,
  Heading,
  Icon,
  ModalComposition,
  Text,
  TextInput,
  AppImage,
  DateSelect,
  Select,
} from "../../../components";

import { REEF_DOCS_BLUE, REEF_DOCS_GREY } from "../../../constants";
import {
  useAddToTank,
  useCreateTank,
  useRemoveTank,
  useUpdateTank,
} from "../../../hooks/useTanks";
import { useModal } from "../../../hooks/useModal";
import { ButtonWithConfirmation } from "../../../components/ButtonWithConfirmation/ButtonWithConfirmation";
import { getUnitLabelForUser } from "../../../utility/liquidUnitSelector";
import { useUser } from "../../../hooks/useAuth";
import { useAppSelector } from "../../../hooks/useRedux";
import { selectTanks } from "../../../store/slices/tankSlice";
import { useCameraOrMedia } from "../../../utility/camera";
import { selectStoreMode } from "../../../store/slices/userConfigSlice";
import { useAudience } from "../../../hooks/useAudience";

export const TankModal = ({
  tank,
  edit,
  addToTankConfirm,
  addToTankLiveStockId,
}) => {
  const user = useUser();

  const { isReef } = useAudience();

  const totalTanks = useAppSelector(selectTanks)?.length;

  const storeMode = useAppSelector(selectStoreMode);

  const [success, setSuccess] = useState(false);

  const { closeModal } = useModal();

  const [createTank, createTankLoading, createTankError] = useCreateTank();
  const [updateTank, updateTankLoading, updateTankError] = useUpdateTank();
  const [removeTank, removeTankLoading, removeTankError] = useRemoveTank();

  const {
    control,
    trigger,
    getValues,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      setupDate: new Date().toISOString(),
      imageUri: "",
      imageType: "",
      imageName: "",
      isStoreTank: storeMode,
      shopId: user?.store?.shopId,
      type: isReef ? "reef" : "standard",
    },
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required("A name is required").max(20),
        setupDate: yup.string().required("A date is required"),
        volume: yup
          .number()
          .typeError("Please enter a valid number")
          .positive("Volume must be a positive number")
          .max(99999, "Volume must be less than 99999")
          .required("A system volume is required"),
        image: yup.string().nullable(),
        imageUri: yup.string(),
        imageType: yup.string(),
        imageName: yup.string(),
        isStoreTank: yup.boolean(),
        shopId: yup.string(),
        type: yup.string(),
      })
    ),
  });

  useEffect(() => {
    if (tank && edit) {
      reset({
        setupDate: tank?.setupDate ?? new Date().toISOString(),
        name: tank?.name,
        volume: tank?.volume,
        image: tank?.image,
        type: tank?.type,
      });
    }
  }, []);

  const handleRemoveTank = async () => {
    await removeTank(tank?.id);

    closeModal();
  };

  const handleBrowsePhotos = async (key, media) => {
    if (media?.assets?.length) {
      const asset = media.assets[0];

      setValue("imageUri", asset.uri);
      setValue("imageName", asset.fileName);
      setValue("imageType", asset.type);
    }
  };

  const { CameraMediaModal } = useCameraOrMedia(handleBrowsePhotos);

  const [addToTank] = useAddToTank(addToTankLiveStockId);

  const handleSubmit = async () => {
    const valid = await trigger();

    Keyboard.dismiss();

    if (valid) {
      const data = getValues();

      const formData = new FormData();

      data?.imageUri &&
        formData.append("file", {
          uri: data.imageUri,
          type: data.imageType,
          name: data.imageName,
        });

      formData.append("name", data.name);
      formData.append("volume", data.volume?.toString());
      formData.append("setupDate", data.setupDate?.toString());
      formData.append("isStoreTank", data.isStoreTank?.toString());
      formData.append("shopId", data.shopId?.toString());
      formData.append("type", data.type?.toString());

      if (edit) {
        Keyboard.dismiss();
      }

      const response = edit
        ? await updateTank(tank?.id, formData)
        : await createTank(formData);

      if (addToTankLiveStockId) {
        await addToTank(response?.data?.data?.id).then(() => {});
      }

      if (response?.status === 200) {
        if (edit) {
          setSuccess(true);

          setTimeout(() => {
            setSuccess(false);
          }, 3000);
        } else {
          setSuccess(true);

          setTimeout(() => {
            if (addToTankConfirm) {
              addToTankConfirm();
            }
            closeModal();
          }, 1500);
        }
      }
    }
  };

  const [imageUri, image, setupDate, type] = watch([
    "imageUri",
    "image",
    "setupDate",
    "type",
  ]);

  const hasPreviousImage = tank?.image;

  const hasUploaded = imageUri;

  const volumeUnitLabel = getUnitLabelForUser(user?.liquidUnit);

  return (
    <ModalComposition
      padding
      footerFix
      renderFooter={() => {
        return (
          <Grid gap={8}>
            <Button
              title={success ? "Save Success!" : "Save Tank"}
              variant={success ? "success" : "secondary"}
              onPress={handleSubmit}
              isLoading={createTankLoading || updateTankLoading}
              disabled={removeTankLoading || success}
              error={createTankError || updateTankError}
            />
            {edit && totalTanks > 1 && (
              <ButtonWithConfirmation
                title="Remove Tank"
                confirmationTitle="Confirm Remove Tank ?"
                variant="primary"
                confirmationVariant="delete"
                onPress={handleRemoveTank}
                isLoading={removeTankLoading}
                disabled={createTankLoading || updateTankLoading}
                error={removeTankError}
              />
            )}
          </Grid>
        );
      }}
    >
      <View style={styles.wrapper}>
        <Grid gap={8}>
          <GridItem>
            <CameraMediaModal limit={1}>
              <Grid alignItems="center" gap={16}>
                <View style={styles.profileImageWrapper}>
                  {imageUri || image ? (
                    <View>
                      <AppImage
                        path={imageUri || image}
                        localImage={Boolean(imageUri)}
                        width={98}
                        height={98}
                        style={{ borderRadius: 100 }}
                      />
                      {hasPreviousImage && !hasUploaded && edit && (
                        <View style={styles.editIcon}>
                          <Icon name="edit" fill={REEF_DOCS_BLUE} />
                        </View>
                      )}
                    </View>
                  ) : (
                    <Icon name="addUserMale" fill="black" />
                  )}
                </View>
                <Heading variant={5} weight="regular">
                  Tank Image
                </Heading>
              </Grid>
            </CameraMediaModal>
            <Text style={styles.subText}>
              Please select an image of your tank
            </Text>
          </GridItem>
          <GridItem>
            <TextInput
              control={control}
              name="name"
              label="Name"
              hasError={errors.name?.message}
              maxLength={25}
            />
          </GridItem>

          <GridItem>
            <DateSelect
              label="Setup Date"
              hasError={errors.setupDate?.message}
              onConfirm={(date) => setValue("setupDate", date)}
              value={setupDate}
            />
          </GridItem>

          {isReef && (
            <GridItem>
              <Select
                label="Type"
                title="Type"
                labelKey="label"
                valueKey="value"
                value={type}
                onConfirm={(value) => setValue("type", value)}
                options={[
                  {
                    label: "Reef",
                    value: "reef",
                  },
                  {
                    label: "Fish Only",
                    value: "fish_only",
                  },
                  {
                    label: "Frag",
                    value: "frag",
                  },
                  {
                    label: "Quarantine",
                    value: "quarantine",
                  },
                  {
                    label: "Hospital",
                    value: "hospital",
                  },
                  {
                    label: "RODI Reservoir",
                    value: "rodi_reservoir",
                  },
                  {
                    label: "Saltwater Reservoir",
                    value: "saltwater_reservoir",
                  },
                ]}
              />
            </GridItem>
          )}

          <GridItem>
            <TextInput
              control={control}
              name="volume"
              label="System Volume"
              hasError={errors.volume?.message}
              keyboardType="numeric"
              placeholder="e.g. 1000"
              unitLabel={volumeUnitLabel}
              transformFn={(value) => value.replace(",", ".")}
            />
          </GridItem>
        </Grid>
      </View>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
  },
  subText: {
    fontSize: 12,
    color: REEF_DOCS_GREY,
    textAlign: "center",
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: REEF_DOCS_GREY,
    backgroundColor: "#EEF2F4",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  editIcon: {
    position: "absolute",
    right: -10,
    bottom: 0,
  },
});

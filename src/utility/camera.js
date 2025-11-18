import { useEffect, useState } from "react";
import React from "react";
import ImagePicker from "react-native-image-crop-picker";

import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

import { Button, Grid, SlideInModal } from "../components";
import { REEF_DOCS_BLUE } from "../constants";

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    return false;
  }
};

const requestMediaPermissions = async () => {
  try {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES, // Android 13+
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO, // Android 13+
    ];

    const granted = await PermissionsAndroid.requestMultiple(permissions);

    return (
      granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
        PermissionsAndroid.RESULTS.GRANTED ||
      granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
        PermissionsAndroid.RESULTS.GRANTED
    );
  } catch (err) {
    return false;
  }
};

export const pickDocument = async (options) => {
  const result = await DocumentPicker.getDocumentAsync(options);

  return result;
};

export const useCameraOrMedia = (onMediaSelect) => {
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Sync render state with visibility (enter)
  useEffect(() => {
    if (visible) {
      setShouldRender(true);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      const timeout = setTimeout(() => {
        setShouldRender(false);
      }, 300); // match animation duration in SlideInModal
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  const isValidMedia = (result, isVideo, maxDuration, maxSizeMB) => {
    if (result?.didCancel) return { valid: false };

    const asset = result.assets?.[0];

    if (!asset) return { valid: false, error: "Invalid media selected." };

    if (isVideo) {
      if (maxDuration && asset.duration && asset.duration > maxDuration) {
        return {
          valid: false,
          error: `Video must be under ${maxDuration} seconds.`,
        };
      }

      if (
        maxSizeMB &&
        asset.fileSize &&
        asset.fileSize / (1024 * 1024) > maxSizeMB
      ) {
        return {
          valid: false,
          error: `Video must be smaller than ${maxSizeMB} MB.`,
        };
      }
    }

    return { valid: true };
  };

  const CameraMediaModal = ({
    children,
    keyName,
    video,
    limit = 1,
    maxDuration = 60,
    maxSizeMB = 100,
    enableEdit = false, // new prop
    editWidth = 1000, // new prop
    editHeight = 400, // new prop
    beforeOnPress,
  }) => {
    const [cameraError, setCameraError] = useState(null);
    const [libraryError, setLibraryError] = useState(null);

    const resetErrors = () => {
      setCameraError(null);
      setLibraryError(null);
    };

    const handlePress = async (fromCamera) => {
      if (beforeOnPress) {
        beforeOnPress();
      }

      const result = await pickMedia(
        fromCamera,
        video,
        limit,
        enableEdit,
        editWidth,
        editHeight
      );

      const { valid, error: validationError } = isValidMedia(
        result,
        video,
        maxDuration,
        maxSizeMB
      );

      if (!valid) {
        if (fromCamera) {
          setCameraError(validationError);
          setTimeout(() => setCameraError(null), 3000);
        } else {
          setLibraryError(validationError);
          setTimeout(() => setLibraryError(null), 3000);
        }
      } else {
        onMediaSelect(keyName, result);
        setVisible(false);
      }
    };

    useEffect(() => {
      if (visible) {
        resetErrors();
      }
    }, [visible]);

    return (
      <>
        {shouldRender && (
          <SlideInModal
            visible={visible}
            title="Option"
            onClose={() => {
              setVisible(false);
              resetErrors();
            }}
            height={200}
          >
            <Grid gap={8} style={{ padding: 16 }}>
              <Button
                title={"Camera"}
                error={!!cameraError}
                errorMessage={cameraError}
                onPress={() => handlePress(true)}
              />
              <Button
                title={"Library"}
                error={!!libraryError}
                errorMessage={libraryError}
                onPress={() => handlePress(false)}
              />
            </Grid>
          </SlideInModal>
        )}
        <TouchableOpacity
          onPress={() => {
            beforeOnPress && beforeOnPress();
            setVisible(true);
            resetErrors();
          }}
        >
          {children}
        </TouchableOpacity>
      </>
    );
  };

  return { CameraMediaModal };
};

export const pickMedia = async (
  camera = false,
  video = false,
  limit = 0,
  enableEdit = false,
  editWidth = 1000,
  editHeight = 400
) => {
  let permissionResult = false;

  if (Platform.OS === "android") {
    if (camera) {
      permissionResult = await requestCameraPermission();
    } else {
      permissionResult = await requestMediaPermissions();
    }
  } else {
    permissionResult = true; // iOS permissions are handled by the ImagePicker library
  }

  if (!permissionResult) {
    Alert.alert(
      "Permission Denied",
      camera
        ? "Camera permission is required to take photos or videos. Please enable it in your device settings."
        : "Media permissions are required to select photos or videos. Please enable them in your device settings.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Settings",
          onPress: () => {
            Linking.openSettings();
          },
        },
      ]
    );
    return { didCancel: true, permissionDenied: true };
  }

  let pickerOptions = {
    cropping: enableEdit && !video,
    width: enableEdit && !video ? editWidth : undefined,
    height: enableEdit && !video ? editHeight : undefined,
    mediaType: video ? "video" : "photo",
    multiple: limit > 1,
    maxFiles: limit,
    compressImageQuality: 1,
    cropperToolbarTitle: "Crop Image",
    cropperActiveWidgetColor: REEF_DOCS_BLUE,
    cropperStatusBarColor: REEF_DOCS_BLUE,
    cropperToolbarColor: REEF_DOCS_BLUE,
    cropperToolbarWidgetColor: "#ffffff", // fixed to 6-digit hex
    cropperChooseText: "Choose",
    cropperCancelText: "Cancel",
    forceJpg: true,
    cropperCircleOverlay: false,
    cropperAspectRatio:
      enableEdit && !video
        ? { width: editWidth, height: editHeight }
        : undefined,
  };

  let result;
  try {
    if (camera) {
      result = await ImagePicker.openCamera(pickerOptions);
    } else {
      result = await ImagePicker.openPicker(pickerOptions);
    }

    // Normalize to match react-native-image-picker's result shape
    if (Array.isArray(result)) {
      // Multiple selection
      return {
        assets: result.map((r) => ({
          uri: r.path,
          fileName:
            r.filename ||
            result?.fileName ||
            (r.path ? r.path.split("/").pop() : Date.now() + ".jpg"),
          type: r.mime,
          width: r.width,
          height: r.height,
          fileSize: r.size,
        })),
      };
    } else {
      // Single selection
      return {
        assets: [
          {
            uri: result.path,
            fileName:
              result.fileName ||
              result?.filename ||
              (result.path
                ? result.path.split("/").pop()
                : Date.now() + ".jpg"),
            type: result.mime,
            width: result.width,
            height: result.height,
            fileSize: result.size,
          },
        ],
      };
    }
  } catch (e) {
    if (e?.code === "E_PICKER_CANCELLED") {
      return { didCancel: true, assets: [] };
    }

    return { didCancel: false };
  }
};

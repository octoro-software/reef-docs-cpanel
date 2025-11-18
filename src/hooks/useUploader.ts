import { UploadType, backgroundUpload } from "react-native-compressor";
import Constants from "expo-constants";
import * as RNFS from "react-native-fs";
import { useAppDispatch } from "./useRedux";
import {
  clearPostUploadProgress,
  setPostUploadProgress,
} from "../store/slices/globalSlice";

export const useBackgroundVideoUpload = () => {
  const dispatch = useAppDispatch();
  let lastDispatchedProgress = 0; // Keep track of last dispatched progress

  const fn = async (video, videoConfiguration, type = "social") => {
    const videoUrl = video?.uri;

    try {
      const uploadResult = await backgroundUpload(
        `${Constants.expoConfig.extra.MEDIA_SERVICE_URL}/api/video`,
        videoUrl,
        {
          httpMethod: "POST",
          uploadType: UploadType.MULTIPART,
          headers: {
            Authorization: `Bearer ${videoConfiguration?.uploadToken?.token}`,
          },
          parameters: {
            postId: videoConfiguration?.postId ?? "",
            videoId: videoConfiguration?.id ?? "",
            liveStockId: videoConfiguration?.liveStockId ?? "",
            type: type || "social",
          },
        },

        (written, total) => {
          const progress = Math.round((written / total) * 100);

          // Always dispatch 100% when reached
          if (progress === 100 || progress >= lastDispatchedProgress + 5) {
            dispatch(setPostUploadProgress(progress));
            lastDispatchedProgress = progress;
          }
        }
      );

      if (videoUrl && (await RNFS.exists(videoUrl))) {
        await RNFS.unlink(videoUrl);
      }

      dispatch(clearPostUploadProgress());

      return uploadResult;
    } catch (error) {
      console.error("Error in compression or upload:", error);
    }
  };

  return [fn];
};

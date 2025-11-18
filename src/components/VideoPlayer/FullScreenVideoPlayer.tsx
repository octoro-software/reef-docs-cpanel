import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Video, { BufferingStrategyType, VideoRef } from "react-native-video";
import { Icon } from "../Icon/Icon";
import { CDN_VIDEO_BASE_URL, WHITE, Z_INDEX } from "../../constants";
import { useAppSelector } from "../../hooks/useRedux";
import { useModal } from "../../hooks/useModal";
import { Text } from "../Text/Text";
import { selectSocialFullScreenVideoMute } from "../../store/slices/userConfigSlice";

export const FullScreenVideoPlayer = ({ video, width, height, isActive }) => {
  const { modalVisible } = useModal();

  const [manualPaused, setManualPaused] = useState(false);

  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isActive || modalVisible) {
      videoRef?.current?.pause();
    } else if(manualPaused){
        return
      }else if(videoEnded){
        return
      }else{
      setVideoEnded(false);
      videoRef?.current?.resume();
      }

  }, [isActive, modalVisible]);

  const thumbnail = `${CDN_VIDEO_BASE_URL}${video?.bunnyVideoId}/thumbnail.jpg`;

  const [showSpinner, setShowSpinner] = useState(false);

  const path = `${CDN_VIDEO_BASE_URL}${video?.bunnyVideoId}/playlist.m3u8`;

  const videoRef = useRef<VideoRef>(null);
  const spinnerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bufferingStartTime = useRef<number | null>(null);

  const videoMute = useAppSelector(selectSocialFullScreenVideoMute);

  const [videoEnded, setVideoEnded] = React.useState(false);

  const handleEnd = () => {
    if (!videoRef.current) return;
    setVideoEnded(true); // Set video ended state
    videoRef.current.pause();
  };

  const handleReplay = () => {
    if (!videoRef.current) return;
    if (!videoEnded) return; // Only allow replay if video has ended
    setVideoEnded(false); // Reset video ended state
    videoRef.current.seek(0); // Seek to the start of the video
    videoRef.current.resume();
  };

  // When video becomes active, reset videoEnded and play from start
  useEffect(() => {
    if (isActive) {
      setVideoEnded(false);
      if (videoRef.current) {
        videoRef.current.seek(0);
      }
      videoRef?.current?.resume();
    } else {
      videoRef?.current?.pause();
    }

    if (manualPaused) {
      setManualPaused(false);
    }

    () => {
      console.log('unmounting video player, pausing video');
      videoRef?.current?.pause();
    }

  }, [isActive, videoRef]);

  const handlePauseToggle = () => {
    if (manualPaused) {
      videoRef?.current?.resume();
      setManualPaused(false);
    } else {
      videoRef?.current?.pause();
      setManualPaused(true);
    }
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <TouchableOpacity onPress={handleReplay} activeOpacity={1}>
        {videoEnded && (
          <View
            style={{
              position: "absolute",
              left: 0,
              width: width,
              height: height,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: Z_INDEX.videoPlayerReplayOverlay,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="replay" />
          </View>
        )}
        {showSpinner && !videoEnded && !error && (
          <View
            style={{
              position: "absolute",
              left: 0,
              width: width,
              height: height,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: Z_INDEX.videoPlayerReplayOverlay,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color={WHITE} />
          </View>
        )}

        {!showSpinner && !error && !videoEnded && (
          <TouchableOpacity
            onPress={handlePauseToggle}
            style={{
              position: "absolute",
              zIndex: 999,
              left: 0,
              top: 0,
              width: width,
              height: height,
            }}
          />
        )}

        {!showSpinner && !error && !videoEnded && manualPaused && (
          <Fragment>
            <View
              style={{
                position: "absolute",
                left: 0,
                width: width,
                height: height,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: Z_INDEX.videoPlayerReplayOverlay,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="play" />
            </View>
          </Fragment>
        )}

        {!error ? (
          <Video
            ref={videoRef}
            source={{ uri: path }} // Replace with your HLS URL
            style={{ width, height }}
            onError={(e) => setError(true)}
            poster={{
              source: { uri: thumbnail }, // Thumbnail image URL
              resizeMode:
                video?.orientation === "horizontal" ? "contain" : "cover",
            }}
            onBuffer={({ isBuffering }) => {
              if (isBuffering) {
                bufferingStartTime.current = Date.now();

                spinnerTimeoutRef.current = setTimeout(() => {
                  const elapsed =
                    Date.now() - (bufferingStartTime.current || 0);

                  // Show spinner only if buffering lasted more than 1.5s
                  if (elapsed > 1500) {
                    setShowSpinner(true);
                  }
                }, 1500);
              } else {
                bufferingStartTime.current = null;
                if (spinnerTimeoutRef.current) {
                  clearTimeout(spinnerTimeoutRef.current);
                }
                setShowSpinner(false);
              }
            }}
            muted={videoMute}
            controls={false}
            resizeMode={
              video?.orientation === "horizontal" ? "contain" : "cover"
            }
            volume={1.0}
            onEnd={handleEnd}
            bufferingStrategy={BufferingStrategyType.DEFAULT}
            onReadyForDisplay={() => setShowSpinner(false)}
            repeat={false}
            paused={!isActive}
          />
        ) : (
          <View
            style={{
              backgroundColor: "grey",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999999,
              width,
              height,
            }}
          >
            <Text style={{ color: WHITE }}>
              Error loading video, please try again later
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    position: "absolute",
  },
});

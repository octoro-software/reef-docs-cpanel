import React, { memo, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Video, { BufferingStrategyType, VideoRef } from "react-native-video";
import { VideoControls } from "./VideoControls";
import { Icon } from "../Icon/Icon";
import { CDN_VIDEO_BASE_URL, WHITE, Z_INDEX } from "../../constants";
import { Text } from "../Text/Text";

const VideoPlayerComponent = ({
  video,
  width,
  height,
  isVisible,
  videoMute,
  handleMuteVideo,
  modalVisible,
  handleMediaPress,
  startingSeek,
  fullScreenActive,
}) => {
  const path = `${CDN_VIDEO_BASE_URL}${video?.bunnyVideoId}/playlist.m3u8`;
  const thumbnail = `${CDN_VIDEO_BASE_URL}${video?.bunnyVideoId}/thumbnail.jpg`;
  const isHdr = video?.isHdr || false;

  const spinnerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bufferingStartTime = useRef<number | null>(null);

  const videoRef = useRef<VideoRef>(null);

  const [videoEnded, setVideoEnded] = React.useState(false);
  const [videoError, setVideoError] = React.useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (!fullScreenActive && isVisible && !modalVisible && videoRef?.current) {
      videoRef.current?.pause();
    }

    if (fullScreenActive && isVisible) {
      videoRef.current?.pause();
    }

    if (!fullScreenActive && isVisible && modalVisible && videoRef?.current) {
      videoRef.current?.pause();
    }
  }, [fullScreenActive, modalVisible]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isVisible && videoRef.current) {
      setVideoEnded(false); // Reset video ended state when it becomes visible
      videoRef.current.seek(0); // Seek to the start of the video
      videoRef.current?.resume();
    } else {
      videoRef.current?.pause();
    }
  }, [isVisible, videoRef, startingSeek]);

  const handleEnd = () => {
    if (!videoRef.current) return;

    setVideoEnded(true); // Set video ended state

    videoRef.current.seek(0.1); // Seek to the start (0.1 to avoid potential issues with 0)
    videoRef.current?.pause();
  };

  useEffect(() => {
    if (modalVisible && isVisible) {
      if (videoRef.current) {
        videoRef.current?.pause();
      }
    }

    if (!modalVisible && isVisible) {
      if (videoRef.current) {
        videoRef.current?.resume(); // Play the video when modal closes
      }
    }
  }, [modalVisible]);

  const renderVideo = true;

  useEffect(() => {
    return () => {
      // Pause the video when the component unmounts
      videoRef.current?.pause(); // Ensure the video is paused

      if (spinnerTimeoutRef.current) {
        clearTimeout(spinnerTimeoutRef.current);
      }
    };
  }, []);

  const handlePress = () => {
    if (videoEnded) {
      setVideoEnded(false);
    }
    videoRef.current?.pause();
    handleMediaPress(0);
  };

  return (
    <View style={[styles.container, { width, height }]}>
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

      <TouchableOpacity
        style={{
          position: "absolute",
          zIndex: 999,
          left: 0,
          top: 0,
          width: width,
          height,
        }}
        onPress={handlePress}
      ></TouchableOpacity>

      {showSpinner && !videoEnded && !videoError && (
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
      <View>
        {!videoError ? (
          isHdr ? (
            <TouchableOpacity onPress={handlePress} activeOpacity={1}>
              <Image
                source={{ uri: thumbnail }}
                width={width}
                height={height}
              />
              <View
                style={{
                  position: "absolute",
                  zIndex: 9999,
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width,
                  height,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  zIndex: 9999,
                  justifyContent: "center",
                  alignItems: "center",
                  width,
                  height,
                }}
              >
                <Icon name="play" width={96} height={96} />
              </View>
            </TouchableOpacity>
          ) : (
            <Video
              ref={videoRef}
              source={renderVideo ? { uri: path } : null}
              style={{ width, height: 400 }}
              onError={(e) => setVideoError(true)}
              poster={{
                source: { uri: thumbnail },
                resizeMode: "cover",
              }}
              muted={videoMute}
              controls={false}
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
              resizeMode={
                video?.orientation === "horizontal" ? "contain" : "cover"
              }
              volume={1.0}
              onEnd={handleEnd}
              bufferingStrategy={BufferingStrategyType.DEFAULT}
              repeat={false}
              onReadyForDisplay={() => setShowSpinner(false)}
            />
          )
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
      </View>
      <VideoControls
        ref={videoRef}
        videoMute={videoMute}
        handleMuteVideo={handleMuteVideo}
      />
    </View>
  );
};

export const VideoPlayer = memo(
  VideoPlayerComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.video === nextProps.video &&
      prevProps.width === nextProps.width &&
      prevProps.height === nextProps.height &&
      prevProps.isVisible === nextProps.isVisible &&
      prevProps.videoMute === nextProps.videoMute &&
      prevProps.handleMuteVideo === nextProps.handleMuteVideo &&
      prevProps.modalVisible === nextProps.modalVisible &&
      prevProps.handleMediaPress === nextProps.handleMediaPress &&
      prevProps.startingSeek === nextProps.startingSeek &&
      prevProps.fullScreenActive === nextProps.fullScreenActive
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

import React, { Fragment, useEffect, useRef } from "react";
import Video, { BufferingStrategyType, VideoRef } from "react-native-video";
import LinearGradient from "react-native-linear-gradient";

import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { AppImage, Grid, GridItem, Icon, Text } from "../../../../components";

import { getAppDimensions } from "../../../../utility/dimensions";

import {
  CDN_VIDEO_BASE_URL,
  REEF_DOCS_BLUE,
  REEF_DOCS_GREY,
  WHITE,
  Z_INDEX,
} from "../../../../constants";

type Props = {
  user: {};
  bunnyVideoId: string;
  videoHeight: number;
  hasLeft?: boolean;
  hasRight?: boolean;
  active?: boolean;
};

const { width } = getAppDimensions();

export const LiveStockVideoCard: React.FC<Props> = ({
  user,
  bunnyVideoId,
  videoHeight,
  hasLeft,
  hasRight,
  active,
}) => {
  const [error, setError] = React.useState(false);

  const [manualPaused, setManualPaused] = React.useState(true);

  const [ended, setEnded] = React.useState(false);

  const [showSpinner, setShowSpinner] = React.useState(false);

  const handlePauseToggle = () => {
    if (manualPaused) {
      videoRef?.current?.resume();
      setManualPaused(false);
    } else {
      videoRef?.current?.pause();
      setManualPaused(true);
    }
  };

  const bufferingStartTime = useRef<number | null>(null);
  const spinnerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const path = `${CDN_VIDEO_BASE_URL}${bunnyVideoId}/playlist.m3u8`;
  const thumbnail = `${CDN_VIDEO_BASE_URL}${bunnyVideoId}/thumbnail.jpg`;

  const videoRef: React.RefObject<VideoRef> | null = React.useRef(null);

  const renderVideo = true;

  const handleEnd = () => {
    if (!videoRef?.current) return;
    setEnded(true);
    videoRef?.current.pause();
  };

  useEffect(() => {
    if (!active) {
      setManualPaused(true);
      videoRef?.current?.pause();
    } else {
      setManualPaused(false);
      videoRef?.current?.resume();
    }
  }, [active]);

  const handleReplay = () => {
    if (!videoRef.current) return;
    if (!ended) return; // Only allow replay if video has ended
    setEnded(false); // Reset video ended state
    videoRef.current.seek(0); // Seek to the start of the video
    videoRef.current.resume();
  };

  return (
    <View style={{ zIndex: 9999 }}>
      <TouchableOpacity onPress={handleReplay} activeOpacity={1}>
        {showSpinner && !ended && !error && (
          <View
            style={{
              position: "absolute",
              left: 0,
              width: width,
              height: videoHeight,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: Z_INDEX.videoPlayerReplayOverlay,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color={WHITE} />
          </View>
        )}

        {!showSpinner && !error && !ended && (
          <TouchableOpacity
            onPress={handlePauseToggle}
            style={{
              position: "absolute",
              zIndex: 999,
              left: 0,
              top: 0,
              width: width,
              height: videoHeight,
            }}
          />
        )}

        {!showSpinner && !error && !ended && manualPaused && (
          <Fragment>
            <View
              style={{
                position: "absolute",
                left: 0,
                width: width,
                height: videoHeight,
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

        {hasLeft && (
          <Fragment>
            <View
              style={{
                position: "absolute",
                left: 0,
                width: width,
                height: videoHeight,
                zIndex: Z_INDEX.videoPlayerReplayOverlay,
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Icon name="chevronLeft" />
            </View>
          </Fragment>
        )}

        {hasRight && (
          <Fragment>
            <View
              style={{
                position: "absolute",
                left: 0,
                width: width,
                height: videoHeight,
                zIndex: Z_INDEX.videoPlayerReplayOverlay,
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <Icon name="chevronRight" />
            </View>
          </Fragment>
        )}

        {ended && (
          <View
            style={{
              position: "absolute",
              left: 0,
              width: width,
              height: videoHeight,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: Z_INDEX.videoPlayerReplayOverlay,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="replay" />
          </View>
        )}

        {!error ? (
          <Video
            ref={videoRef}
            source={renderVideo ? { uri: path } : null} // Replace with your HLS URL
            style={{ width: width, height: videoHeight }}
            onError={(e) => setError(true)}
            poster={{
              source: { uri: thumbnail },
              resizeMode: "cover",
            }}
            paused={!active}
            muted={true}
            controls={false}
            onBuffer={({ isBuffering }) => {
              if (isBuffering) {
                bufferingStartTime.current = Date.now();

                spinnerTimeoutRef.current = setTimeout(() => {
                  const elapsed =
                    Date.now() - (bufferingStartTime.current || 0);

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
            resizeMode={"cover"}
            volume={1.0}
            onEnd={handleEnd}
            bufferingStrategy={BufferingStrategyType.DEFAULT}
            repeat={false}
            onReadyForDisplay={() => setShowSpinner(false)}
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

        <LinearGradient
          colors={["transparent", "rgba(0, 0, 0, 1.7)"]}
          style={styles.bottomFade}
        />

        <Grid
          direction="row"
          alignItems="center"
          gap={8}
          style={{
            position: "absolute",
            bottom: 32,
            left: 16,
            zIndex: 99999999,
          }}
        >
          <GridItem>
            <AppImage
              path={user?.image}
              width={40}
              height={40}
              style={{ borderRadius: 80 }}
            />
          </GridItem>

          <GridItem>
            <Text weight="bold" style={{ fontSize: 12, color: WHITE }}>
              {user?.displayName}
            </Text>
            <Text style={{ fontSize: 12, color: REEF_DOCS_GREY }}>
              @{user?.userName}
            </Text>
          </GridItem>
        </Grid>
      </TouchableOpacity>
    </View>
  );
};

export const LiveStockVideoCardSkeleton = ({ videoHeight }) => {
  const videoWidth = getAppDimensions().width;

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: videoHeight,
        width: videoWidth,
        zIndex: Z_INDEX.socialFullScreenBottomFade,
      }}
    >
      <ActivityIndicator size="large" color={REEF_DOCS_BLUE} />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: Z_INDEX.socialFullScreenBottomFade,
  },
});

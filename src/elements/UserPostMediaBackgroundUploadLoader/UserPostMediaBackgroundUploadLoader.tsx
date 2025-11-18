import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

import { REEF_DOCS_BLUE } from "../../constants";
import { useAppSelector } from "../../hooks/useRedux";
import {
  selectPostUploadProgress,
  selectScrollDirection,
} from "../../store/slices/globalSlice";
import { socialPaths } from "../../screens/Layout/Layout";
import { useLocation } from "react-router-native";

export const UserPostMediaBackgroundUploadLoader: React.FC = () => {
  const progress = useAppSelector(selectPostUploadProgress);
  const location = useLocation();

  const progressAnim = useRef(new Animated.Value(0)).current;

  const scrollDirection = useAppSelector(selectScrollDirection);

  const isSocialPath = socialPaths.includes(location.pathname);

  useEffect(() => {
    if (progress >= 0 && progress < 100) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [progress]);

  if (progress >= 100 || progress === 0) return null;

  if (scrollDirection === "down" && isSocialPath) {
    return <></>;
  }

  return (
    <View style={{ marginBottom: 8 }}>
      <View
        style={{
          height: 6,
          width: "100%",
          backgroundColor: "#E0E0E0",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            height: "100%",
            width: progressAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
            backgroundColor: REEF_DOCS_BLUE,
            borderRadius: 8,
          }}
        />
      </View>
    </View>
  );
};

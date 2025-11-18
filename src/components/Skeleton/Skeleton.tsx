import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const Skeleton = ({
  height = 60,
  color = "#e0e0e0",
  width = "100%",
  marginBottom = 10,
  marginTop = 0,
  style = {},
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={{
        opacity: pulseAnim,
        backgroundColor: color,
        height: height,
        borderRadius: 10,
        marginBottom,
        marginTop,
        width,
        ...style,
      }}
    />
  );
};

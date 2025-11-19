import React, { useRef, useEffect, useState } from "react";
import { View, Animated } from "react-native";
import Svg, { Polyline } from "react-native-svg";

export const LineChart = ({
  data,
  width = 200,
  height = 80,
  color = "#60a5fa",
}) => {
  if (!data || data.length < 2) return null;

  // Normalize data to fit chart
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 8;
  const stepX = (width - 2 * padding) / (data.length - 1);

  const points = data.map((value, i) => {
    const x = padding + i * stepX;
    const y =
      height - padding - ((value - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  });

  // Calculate total line length for animation
  const getLineLength = (pts) => {
    const arr = pts.map((pt) => pt.split(",").map(Number));
    let len = 0;
    for (let i = 1; i < arr.length; i++) {
      const [x1, y1] = arr[i - 1];
      const [x2, y2] = arr[i];
      len += Math.hypot(x2 - x1, y2 - y1);
    }
    return len;
  };
  const lineLength = getLineLength(points);

  const [offset, setOffset] = useState(lineLength);
  useEffect(() => {
    setOffset(lineLength);
    Animated.timing(new Animated.Value(lineLength), {
      toValue: 0,
      duration: 1200,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) setOffset(0);
    });
    const interval = setInterval(() => {
      setOffset((prev) => Math.max(prev - lineLength / 24, 0));
    }, 50);
    setTimeout(() => clearInterval(interval), 1200);
    return () => clearInterval(interval);
  }, [data, lineLength]);

  return (
    <View>
      <Svg width={width} height={height}>
        <Polyline
          points={points.join(" ")}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinejoin="round"
          strokeDasharray={lineLength}
          strokeDashoffset={offset}
        />
      </Svg>
    </View>
  );
};

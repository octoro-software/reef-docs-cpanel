import React, { useRef } from "react";
import { Animated, StyleSheet } from "react-native";

import { getAppDimensions } from "../../utility/dimensions";

import { REEF_DOCS_BLUE, REEF_DOCS_LIGHT_BLUE, Z_INDEX } from "../../constants";

type Props = {
  show: boolean;
  lineWidth?: number;
};

export const LoadingBar: React.FC<Props> = ({
  show,
  lineWidth = 400,
  children,
}) => {
  const screenWidth = getAppDimensions().width;

  const animatedLine = useRef(new Animated.Value(-lineWidth)).current;

  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 750,
      useNativeDriver: true,
    }).start();
  };

  const loopLine = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedLine, {
          toValue: screenWidth,
          duration: 950,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  if (show) {
    loopLine();
    fadeIn();
  } else {
    fadeOut();
  }

  const animatedOuterViewStyles = [
    styles.container,
    {
      opacity: fadeAnimation,
    },
  ];

  const animatedInnerLineStyles = [
    styles.innerLine,
    {
      width: lineWidth,
      transform: [{ translateX: animatedLine }],
    },
  ];

  if (!show) return children;

  return (
    <Animated.View style={animatedOuterViewStyles} pointerEvents={"none"}>
      <Animated.View style={animatedInnerLineStyles} pointerEvents="none" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: REEF_DOCS_LIGHT_BLUE,
    flex: 1,
    height: 3,
    left: 0,
    padding: 0,
    position: "absolute",
    right: 0,
    top: 65,
    width: "100%",
    zIndex: Z_INDEX.loadingBar,
  },
  innerLine: {
    backgroundColor: REEF_DOCS_BLUE,
    height: "100%",
  },
});

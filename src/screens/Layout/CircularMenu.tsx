import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Icon, Select, Text } from "../../components";
import { Overlay } from "../../components/Overlay/Overlay";
import { useModal } from "../../hooks/useModal";
import { getEnv } from "../../utility/getEnv";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  selectConfirmWheelIndicator,
  setWheelMenuOpen,
} from "../../store/slices/globalSlice";
import { REEF_DOCS_BLUE, REEF_DOCS_LIGHT_BLUE } from "../../constants";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const BUTTON_SIZE = 66;
const RADIUS = 120;
const ANIMATION_DURATION = 300;
const COLLAPSED_OFFSET = 20;

export const CircularMenu = ({
  buttonsConfig,
  topButtonsConfig = buttonsConfig,
  menuActive,
}) => {
  const confirmWheelIndicator = useAppSelector(selectConfirmWheelIndicator);

  const { openModal } = useModal();
  const dispatch = useAppDispatch();
  const NUM_BUTTONS = buttonsConfig?.length ?? 0;
  const [optionOpen, setOptionOpen] = useState(null);

  const animValues = buttonsConfig.map(() =>
    useSharedValue(menuActive ? 1 : 0)
  );
  const animValuesTop = topButtonsConfig.map(() =>
    useSharedValue(menuActive ? 1 : 0)
  );

  useEffect(() => {
    animValues.forEach((anim, index) => {
      anim.value = withTiming(menuActive ? 1 : 0, {
        duration: ANIMATION_DURATION + index * 100,
      });
    });
    animValuesTop.forEach((anim, index) => {
      anim.value = withTiming(menuActive ? 1 : 0, {
        duration: ANIMATION_DURATION + index * 100,
      });
    });
  }, [menuActive]);

  const openDevModal = () => {
    if (getEnv() !== "production") {
      openModal({
        type: "devModal",
        height: "large",
        modalTitle: "Dev Modal",
        data: {},
      });
    }
  };

  const handleToggleMenu = () => {
    dispatch(setWheelMenuOpen(!menuActive));
  };

  const renderMenuButtons = () => {
    return buttonsConfig.map((buttonConfig, index) => {
      const angle = -Math.PI + (Math.PI / (NUM_BUTTONS - 1)) * index;
      const yRadiusAdjust = 80;
      const x = Math.cos(angle) * RADIUS;
      const y = Math.sin(angle) * RADIUS - yRadiusAdjust;

      const animatedStyle = useAnimatedStyle(() => {
        return {
          transform: [
            { translateX: animValues[index].value * x },
            {
              translateY:
                animValues[index].value * y +
                COLLAPSED_OFFSET * (1 - animValues[index].value),
            },
          ],
          opacity: animValues[index].value,
        };
      });

      const handleOnPress = async () => {
        if (buttonConfig?.options) {
          if (buttonConfig?.skipOnOne && buttonConfig.options.length === 1) {
            await buttonConfig.onPress(buttonConfig.options[0].value);
            handleToggleMenu();
            setOptionOpen(null);
          } else {
            setOptionOpen(index);
            handleToggleMenu();
          }
        } else {
          await buttonConfig.onPress();
          handleToggleMenu();
        }
      };

      const handleConfirmOptionSelect = (value) => {
        buttonConfig.onPress(value);
        setOptionOpen(null);
      };

      return (
        <Animated.View key={index} style={[styles.menuButton, animatedStyle]}>
          {!buttonConfig?.spacer && (
            <>
              <TouchableOpacity
                onPress={handleOnPress}
                style={[
                  styles.actionButton,
                  {
                    backgroundColor:
                      buttonConfig.buttonColor ?? REEF_DOCS_LIGHT_BLUE,
                  },
                ]}
              >
                <Icon
                  name={buttonConfig.icon}
                  width={buttonConfig.iconWidth ?? 24}
                  height={buttonConfig.iconHeight ?? 24}
                  fill={buttonConfig.iconFill ?? "white"}
                  strokeFill={buttonConfig.iconStrokeFill ?? "white"}
                  strokeWidth={buttonConfig.iconStrokeWidth}
                />
              </TouchableOpacity>

              {buttonConfig.options?.length > 1 && (
                <Select
                  options={buttonConfig.options}
                  labelKey="label"
                  valueKey="value"
                  title={buttonConfig.optionTitle}
                  onConfirm={handleConfirmOptionSelect}
                  hideInput
                  openSelector={optionOpen === index}
                  onClose={() => setOptionOpen(null)}
                  required
                />
              )}

              {buttonConfig.label && (
                <Text style={styles.buttonLabel}>{buttonConfig.label}</Text>
              )}
            </>
          )}
        </Animated.View>
      );
    });
  };

  const renderTopButtons = () => {
    return topButtonsConfig.map((buttonConfig, index) => {
      const spacing = 80;
      const x = (index - 1.5) * spacing;
      const y = -260;

      const animatedStyle = useAnimatedStyle(() => {
        return {
          transform: [
            { translateX: animValuesTop[index].value * x },
            { translateY: animValuesTop[index].value * y },
          ],
          opacity: animValuesTop[index].value,
        };
      });

      const handleOnPress = async () => {
        await buttonConfig.onPress?.();
        handleToggleMenu();
      };

      return (
        <Animated.View
          key={`top-${index}`}
          style={[styles.menuButton, animatedStyle]}
        >
          <TouchableOpacity
            onPress={handleOnPress}
            style={[
              styles.actionButton,
              {
                backgroundColor:
                  buttonConfig.buttonColor ?? REEF_DOCS_LIGHT_BLUE,
              },
            ]}
          >
            <Icon
              name={buttonConfig.icon}
              width={buttonConfig.iconWidth ?? 24}
              height={buttonConfig.iconHeight ?? 24}
              fill={buttonConfig.iconFill ?? "white"}
              strokeFill={buttonConfig.iconStrokeFill ?? "white"}
              strokeWidth={buttonConfig.iconStrokeWidth}
            />
          </TouchableOpacity>
          {buttonConfig.label && (
            <Text style={styles.buttonLabel}>{buttonConfig.label}</Text>
          )}
        </Animated.View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Overlay handlePress={handleToggleMenu} active={menuActive} />
      {renderTopButtons()}
      {renderMenuButtons()}

      <TouchableOpacity
        onLongPress={openDevModal}
        activeOpacity={1}
        style={[
          styles.mainButton,
          confirmWheelIndicator && { backgroundColor: "#5cb85c" },
        ]}
        onPress={handleToggleMenu}
      >
        <Icon
          name={confirmWheelIndicator ? "check" : menuActive ? "close" : "menu"}
          size={24}
          fill="white"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  mainButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: REEF_DOCS_BLUE,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  menuButton: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLabel: {
    marginTop: 5,
    fontSize: 12,
    color: "white",
    textAlign: "center",
  },
});

export default CircularMenu;

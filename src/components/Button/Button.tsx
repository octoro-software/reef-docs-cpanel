import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "../Text/Text";
import { REEF_DOCS_BLUE, SUCCESS, WHITE } from "../../constants/colors";
import { Icon, IconDefinitions } from "../Icon/Icon";

export type ButtonVariants =
  | "primary"
  | "secondary"
  | "success"
  | "delete"
  | "grey";

export type ButtonProps = {
  title?: string;
  onPress?: () => void;
  variant?: ButtonVariants;
  style?: object;
  isLoading?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  success?: boolean;
  successMessage?: string;
  iconRight?: IconDefinitions;
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  style,
  isLoading = false,
  disabled = false,
  error = false,
  errorMessage = "",
  success,
  successMessage,
  iconRight,
  iconRightWidth = 16,
  iconRightHeight = 16,
  iconRightStrokeWidth = 0,
}) => {
  const getVariantStyles = (variant: ButtonVariants, error) => {
    if (error) return styles.delete;

    if (success) return styles.success;

    switch (variant) {
      case "primary":
        return styles.primary;

      case "secondary":
        return styles.secondary;

      case "success":
        return styles.success;
      case "delete":
        return styles.delete;
      case "grey":
        return styles.grey;
      default:
        return styles.primary;
    }
  };
  const getVariantTextStyles = (variant: ButtonVariants) => {
    switch (variant) {
      case "primary":
        return styles.primaryText;

      case "secondary":
        return styles.secondaryText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity disabled={isLoading || disabled} onPress={onPress}>
      <View
        style={[
          getVariantStyles(variant, error),
          styles.buttonRoot,
          iconRight ? { flexDirection: "row", alignItems: "center" } : {},
          style,
        ]}
      >
        {isLoading ? (
          <View
            style={{
              minHeight: 20,
              justifyContent: "center",
            }}
          >
            <ActivityIndicator color={WHITE} size={16} />
          </View>
        ) : (
          title && (
            <Text style={[styles.root, getVariantTextStyles(variant)]}>
              {error
                ? errorMessage || "Something went wrong"
                : success
                  ? successMessage
                  : title}
            </Text>
          )
        )}
        {iconRight && !isLoading && (
          <Icon
            name={iconRight}
            width={iconRightWidth}
            height={iconRightHeight}
            color={WHITE}
            strokeFill={WHITE}
            strokeWidth={iconRightStrokeWidth}
            style={{ marginLeft: 8 }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    fontFamily: "Inter-Regular",
    color: "black",
    textAlign: "center",
  },
  buttonRoot: {
    padding: 16,
    borderRadius: 8,
  },
  primary: {
    backgroundColor: "black",
  },
  grey: {
    backgroundColor: "grey",
  },
  primaryText: {
    color: "white",
  },
  secondary: {
    backgroundColor: REEF_DOCS_BLUE,
  },
  success: {
    backgroundColor: SUCCESS,
  },
  delete: {
    backgroundColor: "#FF2400",
  },
  secondaryText: {
    color: "white",
  },
});

import React, { useState } from "react";
import {
  Text as RNText,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { REEF_DOCS_BLUE } from "../../constants";

type WeightOptions = "bold" | "regular" | "semiBold";

type TextProps = {
  style?: any;
  children?: string | React.ElementType;
  expandable?: boolean;
  maxLength?: number;
  weight?: WeightOptions;
  showMoreButton?: boolean;
  numberOfLines?: number | null;
};

export const Text: React.FC<TextProps> = ({
  style,
  children,
  expandable = false,
  maxLength = 100,
  weight = "regular",
  showMoreButton = true,
  numberOfLines = null,
  ...props
}) => {
  const [expanded, setExpanded] = useState(false);
  const isLongText = children?.length > maxLength;

  const getWeightFont = (weight: WeightOptions) => {
    switch (weight) {
      case "bold":
        return styles.bold;
      case "semiBold":
        return styles.semiBold;
      case "regular":
      default:
        return styles.regular;
    }
  };

  return (
    <View>
      <RNText
        style={[styles.root, getWeightFont(weight), style]}
        numberOfLines={numberOfLines}
        {...props}
      >
        {expandable && isLongText && !expanded
          ? `${children.substring(0, maxLength)}...`
          : children}
      </RNText>

      {expandable && isLongText && showMoreButton && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <RNText style={[styles.showMore, style]}>
            {expanded ? "Show Less" : "Show More"}
          </RNText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontFamily: "Inter-Bold",
  },
  regular: {
    fontFamily: "Inter-Regular",
  },
  semiBold: {
    fontFamily: "Inter-SemiBold",
  },
  root: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#4E4E56",
  },
  showMore: {
    fontSize: 12,
    color: REEF_DOCS_BLUE,
    marginTop: 4,
    fontWeight: "bold",
  },
});

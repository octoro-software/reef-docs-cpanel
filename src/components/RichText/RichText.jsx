import React, { useState, memo } from "react";
import Constants from "expo-constants";
import RenderHTML, { HTMLElementModel } from "react-native-render-html";
import { getAppDimensions } from "../../utility/dimensions";
import { BLACK, REEF_DOCS_BLUE } from "../../constants";
import { View, Text, TouchableOpacity } from "react-native";
import truncate from "html-truncate";

const { width } = getAppDimensions();

const systemFonts = [
  ...Constants.systemFonts,
  "Poppins-Regular",
  "Poppins-Bold",
  "Poppins-SemiBold",
  "Inter-Regular",
  "Inter-Bold",
  "Inter-SemiBold",
];

const RichTextComponent = ({
  html,
  styles = {},
  renderersProps = {},
  showMore = false,
  charLimit = 300,
  hideShowMoreLabel = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const plainText = html.replace(/<[^>]+>/g, "");

  const shouldTruncate =
    showMore && !isExpanded && plainText.length > charLimit;

  const truncatedHtml = shouldTruncate
    ? truncate(html, charLimit, { elipsis: "..." })
    : html;

  return (
    <View>
      <RenderHTML
        systemFonts={systemFonts}
        renderers={{
          br: () => <View style={{ height: 12 }} />,
        }}
        customHTMLElementModels={{
          br: HTMLElementModel.fromCustomModel({
            tagName: "br",
            contentModel: "block",
          }),
        }}
        renderersProps={renderersProps}
        tagsStyles={{
          h1: {
            fontFamily: "Poppins-SemiBold",
            fontSize: 26,
            fontWeight: "normal",
            margin: 0,
            color: BLACK,
          },
          h2: {
            fontFamily: "Poppins-SemiBold",
            fontSize: 22,
            fontWeight: "normal",
            margin: 0,
            color: BLACK,
          },
          h3: {
            fontFamily: "Poppins-SemiBold",
            fontSize: 18,
            fontWeight: "normal",
            margin: 0,
            color: BLACK,
          },
          h4: {
            fontFamily: "Poppins-SemiBold",
            fontSize: 14,
            fontWeight: "normal",
            margin: 0,
            color: BLACK,
          },
          h5: {
            fontFamily: "Poppins-SemiBold",
            fontSize: 10,
            fontWeight: "normal",
            margin: 0,
            color: BLACK,
          },
          h6: {
            fontFamily: "Poppins-SemiBold",
            fontSize: 8,
            fontWeight: "normal",
            margin: 0,
            color: BLACK,
          },
          p: {
            fontFamily: "Inter-Regular",
            fontWeight: "normal",
            margin: 0,
            color: BLACK,
          },
          b: {
            fontFamily: "Inter-Bold",
            fontWeight: "bold",
            margin: 0,
            color: BLACK,
          },
          li: {
            fontFamily: "Inter-Regular",
            fontWeight: "normal",
            marginLeft: 8,
            color: BLACK,
          },
          em: { backgroundColor: "#0071bd45" },
          ul: {
            paddingLeft: 8,
            color: BLACK,
            paddingTop: 0,
            marginTop: 0,
            marginBottom: 0,
          },
          a: {
            color: REEF_DOCS_BLUE,
          },
          ...styles,
        }}
        contentWidth={width}
        source={{ html: truncatedHtml }}
      />

      {showMore && !hideShowMoreLabel && plainText.length > charLimit && (
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={{ color: "#0071bd", marginTop: 8 }}>
            {isExpanded ? "Show Less" : "Show More"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Optional: custom props equality check
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.html === nextProps.html &&
    prevProps.showMore === nextProps.showMore &&
    prevProps.charLimit === nextProps.charLimit &&
    JSON.stringify(prevProps.styles) === JSON.stringify(nextProps.styles) &&
    JSON.stringify(prevProps.renderersProps) ===
      JSON.stringify(nextProps.renderersProps)
  );
};

export const RichText = memo(RichTextComponent, areEqual);

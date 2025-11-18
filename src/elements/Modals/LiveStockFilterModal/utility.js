export const formatOptionLabel = (label, definition) => {
  if (label === "true") return "Yes";
  if (label === "false") return "No";

  const reWriteList = [
    "tank_size_recommendation_litres",
    "tank_size_recommendation_gallons",
    "tank_size_recommendation_imperial_gallons",
    "max_size_inches",
    "max_size_centimeters",
    "dominant_colours",
  ];

  if (reWriteList.includes(definition)) {
    switch (definition) {
      case "tank_size_recommendation_litres":
        label = `Tank Size: ${extraSizeFilterValue(label)} Litres`;
        break;
      case "tank_size_recommendation_gallons":
        label = `Tank Size: ${extraSizeFilterValue(label)} Gallons`;
        break;
      case "tank_size_recommendation_imperial_gallons":
        label = `Tank Size: ${extraSizeFilterValue(label)} Gallons`;
        break;
      case "max_size_inches":
        label = `Max Size: ${extraSizeFilterValue(label)} Inches`;
        break;
      case "max_size_centimeters":
        label = `Max Size: ${extraSizeFilterValue(label)} CM`;
        break;
      case "dominant_colours":
        label = `Dominant Colour: ${extraSizeFilterValue(label)}`;
        break;
    }
  }

  return label;
};

const extraSizeFilterValue = (label) =>
  label.substring(label.lastIndexOf("=") + 1);

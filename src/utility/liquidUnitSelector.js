import { isCountry } from "./isCountry";

const roundToNearestTen = (num) => {
  return Math.ceil(num / 10) * 10;
};

export const getTankSizeForUser = (unit, data) => {
  switch (unit) {
    case "imperialGallons":
      return `${roundToNearestTen(
        data?.tank_size_recommendation_imperial_gallons
      )}+ Gallons`;
    case "litres":
      return `${roundToNearestTen(data?.tank_size_recommendation_litres)}+ ${
        isCountry() === "US" ? "Liters" : "Litres"
      }`;
    case "usGallons":
      return `${roundToNearestTen(
        data?.tank_size_recommendation_gallons
      )}+ Gallons`;
  }
};

export const getTankVolumeForUser = (unit, data) => {
  switch (unit) {
    case "imperialGallons":
      return `${data?.imperialGallons} Gallons`;
    case "litres":
      return `${data?.litres} ${isCountry() === "US" ? "Liters" : "Litres"}`;
    case "usGallons":
      return `${data?.usGallons} Gallons`;
  }
};

export const getFishSizeForUser = (unit, data) => {
  switch (unit) {
    case "cm":
      return `${data?.max_size_centimeters} cm`;
    case "inches":
      return `${data?.max_size_inches} inches`;
  }
};

export const getUnitLabelForUser = (unit) => {
  switch (unit) {
    case "imperialGallons":
      return "Imperial Gallons";
    case "litres":
      return isCountry() === "US" ? "Liters" : "Litres";
    case "usGallons":
      return "US Gallons";
    case "cm":
      return "Centimeters";
    case "inches":
      return "Inches";
  }
};

export const getTankTypeName = (type) => {
  switch (type) {
    case "reef":
      return "Reef";
    case "fish_only":
      return "Fish Only";
    case "frag":
      return "Frag";
    case "quarantine":
      return "Quarantine";
    case "hospital":
      return "Hospital";
    case "rodi_reservoir":
      return "RODI Reservoir";
    case "saltwater_reservoir":
      return "Saltwater Reservoir";
    default:
      return "Reef";
  }
};

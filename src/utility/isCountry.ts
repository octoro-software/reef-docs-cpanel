import * as RNLocalize from "react-native-localize";

export const isCountry = (): "GB" | "US" | undefined => {
  const countryCode = RNLocalize.getLocales()[0]?.country;

  if (countryCode === "GB" || countryCode === "US") {
    return countryCode;
  }

  return undefined;
};

import { Image } from "react-native";

export const Logo = ({ width = 225, height = 300 }) => {
  return <Image source={require("../../logo.png")} style={{ width, height }} />;
};

import React, { useState } from "react";
import { CDN_BASE_URL } from "../../constants";
import { REEF_DOCS_LOGO } from "../../constants/global";
import { Image } from "expo-image";

// Predefined sizes for width and height
const widths = [200, 400, 600, 800];
const heights = [200, 400, 600, 800];

// Function to find the next closest size in the profile
const getNextSize = (value: number, sizeProfile: number[]) => {
  for (let i = 0; i < sizeProfile.length; i++) {
    if (value <= sizeProfile[i]) {
      return sizeProfile[i];
    }
  }
  return sizeProfile[sizeProfile.length - 1]; // Return the largest size if no match
};

type Priority = "low" | "normal" | "high";

export const AppImage: React.FC<{
  path: string | number;
  transform?: boolean;
  localImage?: boolean;
  staticImage?: boolean;
  priority?: Priority;
  width: number;
  height: number;
  transition?: number;
  style?: object;
}> = ({
  path,
  width,
  height,
  transform = false,
  localImage = false,
  staticImage = false,
  priority = "normal",
  transition = 500,
  ...rest
}) => {
  const [error, setError] = useState(false);

  // Default image URL (fallback)
  let url = `${CDN_BASE_URL}${path ?? REEF_DOCS_LOGO}?quality=80&format=webp`;

  if (transform && typeof path === "string") {
    const resizedWidth = width ? getNextSize(width, widths) : undefined;
    const resizedHeight = height ? getNextSize(height, heights) : undefined;
    if (resizedWidth) url += `&width=${resizedWidth}`;
    if (resizedHeight) url += `&height=${resizedHeight}`;
  }

  const source =
    staticImage && typeof path === "number"
      ? path
      : localImage
      ? { uri: path as string }
      : { uri: url };

  return (
    <Image
      {...rest}
      source={error ? { uri: `${CDN_BASE_URL}${REEF_DOCS_LOGO}` } : source}
      onError={() => setError(true)}
      style={[rest.style, { width, height }]}
      cachePolicy="memory-disk"
      priority={priority}
      transition={transition}
    />
  );
};

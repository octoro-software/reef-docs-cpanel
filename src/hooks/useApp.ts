import { APP_HEADER_HEIGHT } from "../constants";
import { getAppDimensions } from "../utility/dimensions";
import { useFooterHeight } from "./useFooter";

export const useContentHeight = () => {
  const footerHeight = useFooterHeight();

  const dimensions = getAppDimensions().height;

  const contentHeight = dimensions - footerHeight - APP_HEADER_HEIGHT;

  return contentHeight;
};

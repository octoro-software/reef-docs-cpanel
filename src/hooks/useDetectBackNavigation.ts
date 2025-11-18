import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-native";

export function useDetectBackNavigation(onBack) {
  const navigationType = useNavigationType();
  const location = useLocation(); // Needed to re-trigger when location changes

  useEffect(() => {
    if (navigationType === "POP") {
      onBack();
    }
  }, [navigationType, location, onBack]);
}

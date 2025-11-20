import React from "react";

import { TestHistoryChart } from "../../components/TestHistoryChart/TestHistoryChart";
import { useLocation } from "react-router-native";

export const ElementGraphScreen: React.FC = () => {
  const { state } = useLocation();

  return (
    <TestHistoryChart
      elementId={state?.elementId}
      elementName={state?.label}
      measurementUnit={"ppm"}
      activeTab={"Dosindg"}
    />
  );
};

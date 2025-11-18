import React from "react";
import { Text } from "../../../components";

export const CalculatorDisclaimer = () => {
  return (
    <Text style={{ fontSize: 12, marginTop: 8 }}>
      Please double-check that you have set your tank volume correctly. Ensure
      you have read the instructions for the product you’re using, and we
      recommend checking against the supplier’s calculator at least once to
      ensure you’re satisfied. Aqua Docs takes no responsibility for misuse,
      inaccurate entries, or mistakes that may have occurred while using this
      calculator.
    </Text>
  );
};

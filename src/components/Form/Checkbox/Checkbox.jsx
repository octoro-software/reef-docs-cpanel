import React, { forwardRef } from "react";
import { StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";

import { INPUT_BORDER_COLOR, REEF_DOCS_BLUE } from "../../../constants";

export const CheckboxField = forwardRef(
  (
    { name, checked, unCheckedColor = undefined, onChange, hasError, ...rest },
    ref
  ) => {
    return (
      <>
        <Checkbox
          ref={ref}
          value={checked}
          onValueChange={() => onChange({ target: { value: !checked, name } })}
          color={checked ? REEF_DOCS_BLUE : unCheckedColor}
          style={[styles.root, hasError ? styles.errorBorder : null]}
          {...rest}
        />
      </>
    );
  }
);

const styles = StyleSheet.create({
  root: {
    borderWidth: 2,
    borderColor: INPUT_BORDER_COLOR,
  },
  errorBorder: {
    borderWidth: 2,
    borderColor: "#ff0000",
  },
});

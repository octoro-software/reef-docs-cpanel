import React from "react";
import { TextInput as RnTextInput, StyleSheet, View, Text } from "react-native";

import { InputLabel } from "../InputLabel/InputLabel";
import { INPUT_BORDER_COLOR } from "../../../constants";
import { ErrorText } from "../ErrorText/ErrorText";

export const RawTextInput = React.forwardRef(
  (
    {
      name,
      value,
      caps,
      transformFn,
      label,
      center,
      onBlur,
      onChange,
      onFocus,
      rightComponentRender,
      textAlignVertical,
      style,
      multiline = false,
      inForm = true,
      numberOfLines,
      unitLabel,
      noErrorMessage = false,
      errorMessage = "",
      hasError,
      ...rest
    }: {
      hasError?: any;
      onChange?: any;
      name?: string;
      value?: any;
      caps?: boolean;
      label?: string;
      textAlignVertical?: any;
      transformFn?: any;
      autoCapitalize?: "none" | "characters" | "sentences" | "words";
      secureTextEntry?: boolean;
      keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
      textContentType?: "emailAddress" | "password" | "username";
      autoComplete?: "email" | "password";
      onFocus?: any;
      placeholder?: string;
      center?: boolean;
      rightComponentRender?: any;
      style?: any;
      multiline?: boolean;
      inForm?: boolean;
      numberOfLines?: number;
      unitLabel?: string;
      noErrorMessage?: boolean;
    },
    ref: React.Ref<RnTextInput>
  ) => {
    const [focused, setFocused] = React.useState(false);

    const handleBlur = () => {
      setFocused(false);
    };

    const handleFocus = () => {
      setFocused(true);
    };

    return (
      <View>
        {label && <InputLabel>{label}</InputLabel>}

        <View style={textInputStyles.inputWrapper}>
          <RnTextInput
            ref={ref}
            autoCapitalize={caps ? "characters" : "none"}
            {...rest}
            value={value}
            onChangeText={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            multiline={multiline}
            textAlignVertical={textAlignVertical}
            numberOfLines={numberOfLines}
            textAlign={center ? "center" : "left"}
            style={[
              textInputStyles.root,
              unitLabel ? textInputStyles.withUnitLabel : null,
              rest.disabled ? textInputStyles.disabledInput : null,
              focused ? textInputStyles.focused : null,
              hasError ? textInputStyles.errorBorder : null,
              center ? textInputStyles.center : null,
              style,
              multiline && { minHeight: 150 },
            ]}
          />

          {unitLabel && (
            <View style={textInputStyles.unitLabel}>
              <Text style={textInputStyles.unitLabelText}>{unitLabel}</Text>
            </View>
          )}
        </View>

        {rightComponentRender && rightComponentRender()}
        {hasError && !noErrorMessage && <ErrorText text={errorMessage} />}
      </View>
    );
  }
);

const textInputStyles = StyleSheet.create({
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  root: {
    padding: 12,
    borderWidth: 2,
    borderRadius: 8,
    margin: 0,
    borderColor: INPUT_BORDER_COLOR,
    color: "black",
    fontFamily: "Inter-Regular",
    fontSize: 12,
    minHeight: 48,
    paddingRight: 60, // Make room for unit label
  },
  withUnitLabel: {
    paddingRight: 60,
  },
  unitLabel: {
    position: "absolute",
    right: 10,
    top: 16,
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  unitLabelText: {
    fontSize: 12,
    color: "#333",
    fontFamily: "Inter-Regular",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#666",
  },
  errorBorder: {
    borderWidth: 2,
    borderColor: "#ff0000",
  },
  errorText: {
    color: "#ff0000",
    fontSize: 12,
    marginTop: 4,
  },
  focused: {
    borderColor: "black",
  },
  center: {
    textAlign: "center",
  },
});

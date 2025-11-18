import React from "react";
import { useController } from "react-hook-form";
import { TextInput as RnTextInput, StyleSheet, View, Text } from "react-native";

import { InputLabel } from "../InputLabel/InputLabel";
import { BLACK, INPUT_BORDER_COLOR, REEF_DOCS_GREY } from "../../../constants";
import { ErrorText } from "../ErrorText/ErrorText";

export const TextInput = React.forwardRef(
  (
    {
      onChange,
      name,
      value,
      control,
      caps,
      transformFn,
      label,
      center,
      onBlur,
      onFocus,
      rightComponentRender,
      textAlignVertical,
      style,
      multiline = false,
      inForm = true,
      numberOfLines,
      unitLabel,
      noErrorMessage = false,
      hasError: remoteError = null,
      textContentType,
      autoComplete,
      ...rest
    }: {
      hasError?: any;
      onChange?: any;
      name?: string;
      value?: any;
      control: any;
      caps?: boolean;
      label?: string;
      textAlignVertical?: any;
      transformFn?: any;
      autoCapitalize?: "none" | "characters" | "sentences" | "words";
      secureTextEntry?: boolean;
      keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
      textContentType?: "emailAddress" | "password" | "username";
      autoComplete?: "email" | "password" | "username";
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
      textInputType?: string;
    },
    ref: React.Ref<RnTextInput>
  ) => {
    const [focused, setFocused] = React.useState(false);

    const { field, fieldState } = useController({
      control: inForm ? control : {},
      name: inForm ? name : "",
    });

    const hasError = fieldState?.error || remoteError;

    const handleChange = (value) => {
      let _v = value;
      if (transformFn) _v = transformFn(value) || "";
      field.onChange(_v);
      onChange && onChange(_v);
    };

    const handleBlur = () => {
      setFocused(false);
      field.onBlur();
      onBlur && onBlur(field.value);
    };

    const handleFocus = () => {
      setFocused(true);
      onFocus && onFocus(field.value);
    };

    return (
      <View>
        {label && <InputLabel>{label}</InputLabel>}

        <View style={styles.inputWrapper}>
          <RnTextInput
            ref={ref}
            autoCapitalize={caps ? "characters" : "none"}
            {...rest}
            value={field.value?.toString() || ""}
            onChangeText={(text) => handleChange(text)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            multiline={multiline}
            textAlignVertical={textAlignVertical}
            numberOfLines={numberOfLines}
            textAlign={center ? "center" : "left"}
            placeholderTextColor={REEF_DOCS_GREY}
            textContentType={textContentType}
            style={[
              styles.root,
              unitLabel ? styles.withUnitLabel : null,
              rest.disabled ? styles.disabledInput : null,
              focused ? styles.focused : null,
              hasError ? styles.errorBorder : null,
              center ? styles.center : null,
              style,
              multiline && { minHeight: 150 },
            ]}
          />

          {unitLabel && (
            <View style={styles.unitLabel}>
              <Text style={styles.unitLabelText}>{unitLabel}</Text>
            </View>
          )}
        </View>

        {rightComponentRender && rightComponentRender()}
        {hasError && !noErrorMessage && <ErrorText text={fieldState?.error} />}
      </View>
    );
  }
);

TextInput.displayName = "TextInput";

const styles = StyleSheet.create({
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
    color: BLACK,
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
    top: 12,
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

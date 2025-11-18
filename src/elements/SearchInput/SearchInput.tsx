import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";

import { INPUT_BORDER_COLOR, WHITE } from "../../constants";

export const SearchInput = React.memo(({ onChange, styles, value, ref }) => {
  const [focused, setFocused] = useState(false);
  const [search, setSearch] = useState("");

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const handleChange = (text) => {
    setSearch(text);
    onChange(text);
  };

  useEffect(() => {
    setSearch(value);
  }, []);

  return (
    <TextInput
      ref={ref}
      onChange={(e) => handleChange(e.nativeEvent.text)}
      style={[style.root, focused ? styles.focused : null, styles]}
      placeholder="Search"
      onFocus={handleFocus}
      onBlur={handleBlur}
      value={search}
    />
  );
});

const style = StyleSheet.create({
  root: {
    padding: 12,
    height: 40,
    borderWidth: 2,
    borderRadius: 8,
    margin: 0,
    borderColor: INPUT_BORDER_COLOR,
    color: "black",
    fontFamily: "Inter-Regular",
    fontSize: 12,
    backgroundColor: WHITE,
    marginBottom: 8,
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

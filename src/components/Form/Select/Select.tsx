import React, { useEffect, useState } from "react";
import {
  findNodeHandle,
  FlatList,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getAppDimensions } from "../../../utility/dimensions";

import { Grid, GridItem } from "../../Grid/Grid";
import { Text } from "../../Text/Text";
import { Icon } from "../../Icon/Icon";
import { Button } from "../../Button/Button";
import { InputLabel } from "../InputLabel/InputLabel";
import { SlideInModal } from "../../Modal/Modal";
import { Heading } from "../../Heading/Heading";

import {
  BLACK,
  INPUT_BORDER_COLOR,
  REEF_DOCS_BLUE,
  WHITE,
} from "../../../constants";

const { width } = getAppDimensions();

export const Select = ({
  options,
  labelKey,
  valueKey,
  title,
  renderItem: RenderItem = null,
  onConfirm,
  hasError = null,
  focused = null,
  center = null,
  style = null,
  placeholder = null,
  label = null,
  value = null,
  hideInput = false,
  openSelector = false,
  onClose = null,
  noResultsText = null,
  grouped = false,
  scrollRef = null,
  required = false,
  displayValuePrefix = null,
  ...rest
}) => {
  const [selectVisible, setSelectVisible] = React.useState(false);

  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    setSelectVisible(openSelector);
  }, [openSelector]);

  const [chosenValue, setChosenValue] = React.useState(value);
  const [selectedValue, setSelectedValue] = React.useState(value);
  const [error, setError] = React.useState(null);

  const handleOptionConfirm = () => {
    if (required && !chosenValue) {
      setError("Please select an option");

      setTimeout(() => {
        setError(null);
      }, 2000);
    } else {
      if (onConfirm) {
        onConfirm(chosenValue);
      }

      setSelectVisible(false);
      setSelectedValue(chosenValue);
    }
  };

  useEffect(() => {
    setChosenValue(value);
    setSelectedValue(value);
  }, [value]);

  const handleClose = () => {
    setSelectVisible(false);
    onClose && onClose();
  };

  useEffect(() => {
    if (options?.length === 0) {
      setNoResults(true);
    } else {
      setNoResults(false);
    }
  }, [options]);

  const selectedValueText = (() => {
    if (!options) return placeholder || "";
    if (!grouped) {
      return (
        options.find((o) => o?.[valueKey] === selectedValue)?.[labelKey] ||
        placeholder ||
        ""
      );
    } else {
      // grouped: options is array of groups, each with children
      for (const group of options) {
        if (Array.isArray(group?.children)) {
          const found = group.children.find(
            (child) => child?.[valueKey] === selectedValue
          );
          if (found) return found[labelKey];
        }
      }
      return placeholder || "";
    }
  })();

  const finalText = displayValuePrefix
    ? `${displayValuePrefix} ${selectedValueText}`
    : selectedValueText;

  const createGroupOptions = (options) => {
    let data = [];

    options?.map((group) => {
      data.push({ name: group?.name, groupHeader: true });

      group?.children?.map((child) => data.push(child));
    });

    return data;
  };

  const dataOptions = !grouped ? options : createGroupOptions(options);

  return (
    <View>
      {!hideInput && (
        <>
          {label && <InputLabel>{label}</InputLabel>}
          <View style={{ position: "relative" }}>
            <TouchableOpacity
              onPress={() => {
                const handle = findNodeHandle(scrollRef?.current);
                if (scrollRef?.current?.scrollToFocusedInput && handle) {
                  scrollRef.current.scrollToFocusedInput(handle);
                }
                setSelectVisible(true);
              }}
              activeOpacity={0.8}
              style={styles.touchableOverlay}
            >
              <TextInput
                style={[
                  styles.root,
                  hasError ? styles.errorBorder : null,
                  rest.disabled ? styles.disabledInput : null,
                  selectVisible ? styles.focused : null,
                  center ? styles.center : null,
                  style,
                ]}
                editable={false}
                pointerEvents="none"
                value={noResults ? noResultsText : finalText}
              />
              <View style={styles.selectIcon}>
                <Icon name="chevronDown" fill={BLACK} />
              </View>
            </TouchableOpacity>
            {hasError && (
              <Heading style={styles.errorText} variant={6} weight="regular">
                {hasError}
              </Heading>
            )}
          </View>
        </>
      )}
      <SlideInModal
        height={350}
        visible={selectVisible}
        onClose={handleClose}
        title={title}
        scrollView={false}
        legacy
      >
        <View
          style={{
            width,
            flex: 1,
            paddingBottom: Platform.OS === "ios" ? 32 : 8,
          }}
        >
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContent}
            data={dataOptions}
            showsVerticalScrollIndicator={false}
            renderItem={(info) => {
              if (RenderItem) {
                return (
                  <RenderItem
                    item={info.item}
                    labelKey={labelKey}
                    valueKey={valueKey}
                    onPress={() => setChosenValue(info.item[valueKey])}
                    selected={info.item[valueKey] === chosenValue}
                  />
                );
              }

              return (
                <SelectListItem
                  item={info.item}
                  labelKey={labelKey}
                  index={info.index}
                  onPress={() => setChosenValue(info.item[valueKey])}
                  selected={info.item[valueKey] === chosenValue}
                  groupHeader={info.item?.groupHeader}
                />
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />

          <Grid style={{ padding: 8 }}>
            <Button
              variant={error ? "delete" : "secondary"}
              title={error ?? "Confirm"}
              onPress={handleOptionConfirm}
            />
          </Grid>
        </View>
      </SlideInModal>
    </View>
  );
};

const SelectListItem = ({
  item,
  labelKey,
  index,
  onPress,
  selected,
  groupHeader,
}) => {
  return (
    <TouchableOpacity disabled={groupHeader} onPress={!groupHeader && onPress}>
      <Grid
        direction="row"
        justifyContent="space-between"
        style={[styles.itemWrapper, { borderTopWidth: index === 0 ? 0 : 1 }]}
      >
        <GridItem flex={1}>
          <Text weight={groupHeader ? "bold" : "regular"}>
            {item[labelKey]}
          </Text>
        </GridItem>
        {!groupHeader && (
          <GridItem>
            {selected ? (
              <Icon
                name="radioChecked"
                width={24}
                height={24}
                fill={REEF_DOCS_BLUE}
              />
            ) : (
              <Icon name="radio" width={24} height={24} fill={REEF_DOCS_BLUE} />
            )}
          </GridItem>
        )}
      </Grid>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  list: {
    width: "100%",
    flex: 1,
    flexGrow: 1, // Ensures content stretches to fill available space
  },
  listContent: {
    flexGrow: 1, // Ensures content stretches to fill available space
  },
  itemWrapper: {
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10,
    width: "100%", // Ensures items stretch to full width
    borderColor: INPUT_BORDER_COLOR,
  },
  root: {
    padding: 12,
    borderWidth: 2,
    borderRadius: 8,
    margin: 0,
    borderColor: INPUT_BORDER_COLOR,
    backgroundColor: "white",
    color: "black",
    fontFamily: "Inter-Regular",
    fontSize: 12,
    minHeight: 48,
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
  selectIcon: {
    position: "absolute",
    right: 12,
    top: Platform.OS === "ios" ? 12 : 12,
    backgroundColor: WHITE,
  },
  touchableOverlay: {
    width: "100%",
  },
});

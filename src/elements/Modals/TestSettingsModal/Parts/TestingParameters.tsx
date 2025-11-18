import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";
import {
  FlatList,
  Platform,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

import {
  Button,
  Grid,
  GridItem,
  Text,
  ModalHeader,
  ModalComposition,
  Icon,
} from "../../../../components";

import {
  BLACK,
  INPUT_BORDER_COLOR,
  REEF_DOCS_BLUE,
} from "../../../../constants";
import { Animated } from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const TestingParameters = ({
  elements,
  handleNextStep,
  handleSubmit,
  loading,
  error,
  success,
  handleMenuPress,
  errors,
  activeMenu,
  setActiveMenu,
  menu,
}) => {
  const { watch } = useFormContext();

  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;
  const itemRefs = useRef({});

  const handleMenuLayout = (event, m) => {
    itemRefs.current[m] = {
      x: event.nativeEvent.layout.x,
      width: event.nativeEvent.layout.width,
    };
    if (m === activeMenu) {
      indicatorX.setValue(event.nativeEvent.layout.x);
      indicatorWidth.setValue(event.nativeEvent.layout.width);
    }
  };

  const handleMenuTap = (m) => {
    setActiveMenu(m);
    const layout = itemRefs.current[m];
    if (layout) {
      Animated.spring(indicatorX, {
        toValue: layout.x,
        useNativeDriver: false,
      }).start();
      Animated.spring(indicatorWidth, {
        toValue: layout.width,
        useNativeDriver: false,
      }).start();
    }
  };

  const errorsText = (() => {
    if (!errors || Object.keys(errors).length === 0) return null;
    const invalidLabels = elements
      .filter((el) => errors[el.id])
      .map((el) => el.label);
    if (invalidLabels.length === 0) return null;
    return `The following elements have invalid settings, please check: ${invalidLabels.join(
      ", "
    )}`;
  })();

  return (
    <ModalComposition
      renderFooter={() => (
        <Grid gap={16}>
          <Button
            title="Update Preferences"
            variant="secondary"
            onPress={handleSubmit}
            isLoading={loading}
            error={error}
            errorMessage="Something went wrong, please try again"
            success={success}
            successMessage="Preferences updated successfully"
          />
          <Button
            title="Help"
            variant="primary"
            onPress={() => handleNextStep(1)}
            disabled={loading}
          />
        </Grid>
      )}
    >
      <ModalHeader
        icon="reefDocsIcpTest"
        iconWidth={48}
        iconHeight={48}
        title="Testing Parameters"
        content="Please select the parameters you track using home test kits. We have chosen some for you."
      />

      {errorsText && (
        <Text style={{ color: "red", marginVertical: 8 }}>{errorsText}</Text>
      )}

      <View style={{ marginTop: 8, position: "relative" }}>
        <Grid direction="row" justifyContent="space-between">
          {menu.map((m) => (
            <TouchableOpacity
              key={m}
              activeOpacity={0.7}
              onPress={() => handleMenuTap(m)}
              onLayout={(e) => handleMenuLayout(e, m)}
              style={{ flex: 1, alignItems: "center", paddingVertical: 8 }}
            >
              <Grid direction="row" gap={8} alignItems="center">
                <Icon
                  width={32}
                  height={32}
                  name={m === "Home" ? "reefDocsHomeTest" : "reefDocsIcpTest"}
                />
                <Text weight={m === activeMenu ? "bold" : "regular"}>{m}</Text>
              </Grid>
            </TouchableOpacity>
          ))}
        </Grid>

        {/* Animated sliding underline */}
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 2,
            backgroundColor: REEF_DOCS_BLUE,
            width: indicatorWidth,
            transform: [{ translateX: indicatorX }],
          }}
        />
      </View>

      <Grid gap={16} direction="column" style={{ marginTop: 24 }}>
        <FlatList
          data={elements}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ width: "100%", paddingBottom: 20 }}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 2,
                marginVertical: 14,
                backgroundColor: INPUT_BORDER_COLOR,
              }}
            />
          )}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
          windowSize={5}
          getItemLayout={(data, index) => ({
            length: 120,
            offset: 120 * index,
            index,
          })}
          renderItem={({ item, index }) => {
            const value = watch(item?.id);
            const hasErrors = errors[item?.id];

            const checkEnabled =
              activeMenu === "Home"
                ? value?.home
                : activeMenu === "NDOC"
                  ? value?.ndoc
                  : value?.icp;

            const enabled =
              value?.notInTank && !value?.hasAddedToTank ? false : checkEnabled;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleMenuPress(item)}
              >
                <Grid direction="row" justifyContent="space-between">
                  <GridItem flex={1} style={{ minWidth: 40 }}>
                    <Grid direction="row" gap={4}>
                      <Text
                        weight="bold"
                        style={hasErrors ? { color: "red" } : {}}
                      >
                        {item.label === "Calcium Carbonate Equivalent"
                          ? "CCE"
                          : item.label}
                      </Text>
                      <Text style={hasErrors ? { color: "red" } : {}}>
                        ({item.symbol})
                      </Text>
                    </Grid>
                  </GridItem>
                  <GridItem flex={1}>
                    <Text>{enabled ? "Enabled" : "Disabled"}</Text>
                  </GridItem>
                  <GridItem>
                    <Icon name="chevronRight" fill={BLACK} />
                  </GridItem>
                </Grid>
              </TouchableOpacity>
            );
          }}
        />
      </Grid>
    </ModalComposition>
  );
};

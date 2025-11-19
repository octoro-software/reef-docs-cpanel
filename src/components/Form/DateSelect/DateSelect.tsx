import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "../../Text/Text";
import { SlideInModal } from "../../Modal/Modal";
import { Button } from "../../Button/Button";
import { format } from "date-fns";
import { getAppDimensions } from "../../../utility/dimensions";
import { InputLabel } from "../InputLabel/InputLabel";
import { BLACK, INPUT_BORDER_COLOR, WHITE, Z_INDEX } from "../../../constants";
import { Icon } from "../../Icon/Icon";

const { width } = getAppDimensions();
const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5;

const generateRange = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

const months = Array.from({ length: 12 }, (_, i) =>
  format(new Date(2000, i, 1), "MMMM")
);

export const DateSelect = React.forwardRef(
  (
    {
      label = null,
      value = null,
      placeholder = "Select a date",
      onConfirm,
      hasError = null,
      style = null,
      mode = "date", // "date" or "time"
      minuteInterval = 1,
      hideInput = false,
      openSelector = false,
      onClose = null,
      dateModalTitle = "Select Date",
    }: any,
    ref: React.Ref<TextInput>
  ) => {
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
      setModalVisible(openSelector);
    }, [openSelector]);

    const parseDate = (input) => {
      if (input instanceof Date) return input;
      if (!input) return new Date();
      // If input is a string in YYYY-MM-DD, parse as local
      if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
        const [year, month, day] = input.split("-").map(Number);
        return new Date(year, month - 1, day);
      }
      // If input is an ISO string with Z, extract the date part and parse as local
      if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}T/.test(input)) {
        const [year, month, day] = input.slice(0, 10).split("-").map(Number);
        return new Date(year, month - 1, day);
      }
      // Otherwise, fallback to Date constructor
      const date = new Date(input);
      return isNaN(date.getTime()) ? new Date() : date;
    };

    const [selectedDate, setSelectedDate] = useState(parseDate(value));

    // Date states
    const [selectedDay, setSelectedDay] = useState(selectedDate.getDate());
    const [selectedMonth, setSelectedMonth] = useState(selectedDate.getMonth());
    const [selectedYear, setSelectedYear] = useState(
      selectedDate.getFullYear()
    );

    // Time states
    const [selectedHour, setSelectedHour] = useState(selectedDate.getHours());
    const [selectedMinute, setSelectedMinute] = useState(
      Math.round(selectedDate.getMinutes() / minuteInterval) * minuteInterval
    );

    useEffect(() => {
      const parsed = parseDate(value);
      if (!isNaN(parsed.getTime())) {
        setSelectedDate(parsed);
        if (mode === "date") {
          setSelectedDay(parsed.getDate());
          setSelectedMonth(parsed.getMonth());
          setSelectedYear(parsed.getFullYear());
        } else {
          setSelectedHour(parsed.getHours());
          setSelectedMinute(
            Math.round(parsed.getMinutes() / minuteInterval) * minuteInterval
          );
        }
      }
    }, [value]);

    // Refs
    const dayListRef = useRef(null);
    const monthListRef = useRef(null);
    const yearListRef = useRef(null);
    const hourListRef = useRef(null);
    const minuteListRef = useRef(null);

    const scrollToIndex = (ref, index) => {
      if (ref?.current && index >= 0) {
        ref.current.scrollToIndex({ index, animated: false });
      }
    };

    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const dayOptions = generateRange(1, daysInMonth);
    const yearOptions = generateRange(1950, 2050);
    const hourOptions = generateRange(0, 23);
    const minuteOptions = generateRange(0, 59).filter(
      (m) => m % minuteInterval === 0
    );

    useEffect(() => {
      if (modalVisible) {
        requestAnimationFrame(() => {
          if (mode === "date") {
            scrollToIndex(dayListRef, selectedDay - 1);
            scrollToIndex(monthListRef, selectedMonth);
            scrollToIndex(yearListRef, selectedYear - 1950);
          } else {
            scrollToIndex(hourListRef, selectedHour);
            scrollToIndex(minuteListRef, minuteOptions.indexOf(selectedMinute));
          }
        });
      }
    }, [modalVisible]);

    useEffect(() => {
      if (selectedDay > daysInMonth && mode === "date") {
        setSelectedDay(daysInMonth);
        scrollToIndex(dayListRef, daysInMonth - 1);
      }
    }, [selectedMonth, selectedYear]);

    const handleConfirm = () => {
      let finalDate;
      let time;
      if (mode === "time") {
        finalDate = new Date();
        finalDate.setHours(selectedHour);
        finalDate.setMinutes(selectedMinute);
        finalDate.setSeconds(0);
        finalDate.setMilliseconds(0);
        // Always format as HH:mm (zero-padded)
        const hourStr = selectedHour.toString().padStart(2, "0");
        const minuteStr = selectedMinute.toString().padStart(2, "0");
        time = `${hourStr}:${minuteStr}`;
        setSelectedDate(finalDate);
        setSelectedHour(finalDate.getHours());
        setSelectedMinute(finalDate.getMinutes());
        setModalVisible(false);
        if (onConfirm) onConfirm(time, time);
      } else {
        // Always store as Date object, only output string for onConfirm
        finalDate = new Date(selectedYear, selectedMonth, selectedDay);
        // Format as local YYYY-MM-DD, not UTC
        const monthStr = (selectedMonth + 1).toString().padStart(2, "0");
        const dayStr = selectedDay.toString().padStart(2, "0");
        const dateString = `${selectedYear}-${monthStr}-${dayStr}`;
        setSelectedDate(finalDate);
        setSelectedDay(finalDate.getDate());
        setSelectedMonth(finalDate.getMonth());
        setSelectedYear(finalDate.getFullYear());
        setModalVisible(false);
        if (onConfirm) onConfirm(dateString, null);
      }
    };

    const handleMomentumScrollEnd = (e, onSelect) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      onSelect(index);
    };

    const renderWheelItem = (item, selected) => (
      <View style={[styles.wheelItem]}>
        <Text style={[styles.wheelText, selected && styles.selectedWheelText]}>
          {item.toString().padStart(2, "0")}
        </Text>
      </View>
    );

    const renderWheel = (ref, data, selectedIndex, onSelect) => {
      const safeIndex = Math.max(0, Math.min(selectedIndex, data.length - 1));
      return (
        <View style={styles.wheelWrapper}>
          <FlatList
            ref={ref}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            getItemLayout={(_, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            initialScrollIndex={safeIndex}
            onScrollToIndexFailed={({ index }) => {
              setTimeout(() => {
                ref.current?.scrollToIndex({
                  index: Math.max(0, Math.min(index, data.length - 1)),
                  animated: true,
                });
              }, 100);
            }}
            renderItem={({ item, index }) =>
              renderWheelItem(item, index === safeIndex)
            }
            showsVerticalScrollIndicator={false}
            style={styles.wheel}
            contentContainerStyle={{
              paddingTop: ITEM_HEIGHT * 2,
              paddingBottom: ITEM_HEIGHT * 2,
              minHeight: ITEM_HEIGHT * VISIBLE_ITEMS,
            }}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            bounces={false}
            onStartReached={(e) => {
              if (ref === dayListRef) setSelectedDay(dayOptions[0]);
              if (ref === monthListRef) setSelectedMonth(0); // Fix: January is index 0
              if (ref === yearListRef) setSelectedYear(yearOptions[0]);
              if (ref === hourListRef) setSelectedHour(hourOptions[0]);
              if (ref === minuteListRef) setSelectedMinute(minuteOptions[0]);
            }}
            onEndReached={(e) => {
              if (ref === dayListRef)
                setSelectedDay(dayOptions[dayOptions.length - 1]);
              if (ref === monthListRef) setSelectedMonth(11); // Fix: December is index 11
              if (ref === yearListRef)
                setSelectedYear(yearOptions[yearOptions.length - 1]);
              if (ref === hourListRef)
                setSelectedHour(hourOptions[hourOptions.length - 1]);
              if (ref === minuteListRef)
                setSelectedMinute(minuteOptions[minuteOptions.length - 1]);
            }}
            onMomentumScrollEnd={(e) =>
              handleMomentumScrollEnd(e, (i) => {
                if (ref === dayListRef) setSelectedDay(dayOptions[i]);
                if (ref === monthListRef) setSelectedMonth(i);
                if (ref === yearListRef) setSelectedYear(yearOptions[i]);
                if (ref === hourListRef) setSelectedHour(hourOptions[i]);
                if (ref === minuteListRef) setSelectedMinute(minuteOptions[i]);
              })
            }
          />
          <View style={styles.selectionOverlay} pointerEvents="none" />
        </View>
      );
    };

    return (
      <View>
        {!hideInput && (
          <>
            {label && <InputLabel>{label}</InputLabel>}
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <TextInput
                ref={ref}
                style={[styles.input, hasError && styles.errorBorder, style]}
                editable={false}
                value={
                  selectedDate
                    ? mode === "time"
                      ? format(selectedDate, "HH:mm")
                      : format(selectedDate, "EEEE, MMMM do, yyyy")
                    : placeholder
                }
                pointerEvents="none"
              />
              <View style={styles.selectIcon}>
                <Icon name="chevronDown" fill={BLACK} />
              </View>
            </TouchableOpacity>
            {hasError && <Text style={styles.errorText}>{hasError}</Text>}
          </>
        )}
        <SlideInModal
          visible={modalVisible}
          height={350}
          onClose={() => {
            setModalVisible(false);
            if (onClose) onClose();
          }}
          title={mode === "time" ? "Select Time" : dateModalTitle}
          scrollView={false}
          legacy
        >
          <View style={styles.wheelContainer}>
            {mode === "time" ? (
              <>
                {renderWheel(hourListRef, hourOptions, selectedHour, (i) =>
                  setSelectedHour(hourOptions[i])
                )}
                {renderWheel(
                  minuteListRef,
                  minuteOptions,
                  minuteOptions.indexOf(selectedMinute),
                  (i) => setSelectedMinute(minuteOptions[i])
                )}
              </>
            ) : (
              <>
                {renderWheel(dayListRef, dayOptions, selectedDay - 1, (i) =>
                  setSelectedDay(dayOptions[i])
                )}
                {renderWheel(monthListRef, months, selectedMonth, (i) =>
                  setSelectedMonth(i)
                )}
                {renderWheel(
                  yearListRef,
                  yearOptions,
                  selectedYear - 1950,
                  (i) => setSelectedYear(yearOptions[i])
                )}
              </>
            )}
          </View>

          <View style={{ padding: 16 }}>
            <Button title="Confirm" onPress={handleConfirm} />
          </View>
        </SlideInModal>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wheelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width - 32,
    alignSelf: "center",
    flex: 1,
    paddingTop: 8,
  },
  wheelWrapper: {
    flex: 1,
    position: "relative",
    minHeight: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  wheel: {
    flex: 1,
  },
  selectionOverlay: {
    position: "absolute",
    top: ITEM_HEIGHT * 2,
    height: ITEM_HEIGHT,
    width: "100%",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    zIndex: Z_INDEX.dateSelect,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedWheelText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  wheelText: {
    fontSize: 16,
  },
  input: {
    padding: 12,
    borderWidth: 2,
    borderRadius: 8,
    margin: 0,
    borderColor: INPUT_BORDER_COLOR,
    backgroundColor: "white",
    color: "black",
    fontSize: 12,
    minHeight: 48,
  },
  errorBorder: {
    borderColor: "#ff0000",
  },
  errorText: {
    color: "#ff0000",
    fontSize: 12,
    marginTop: 4,
  },
  selectIcon: {
    position: "absolute",
    right: 12,
    top: Platform.OS === "ios" ? 12 : 12,
    backgroundColor: WHITE,
  },
});

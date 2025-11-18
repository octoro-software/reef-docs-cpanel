import React, { useEffect, useState, useRef } from "react";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import {
  addDays,
  addMonths,
  subDays,
  eachDayOfInterval,
  format,
  startOfWeek,
  addWeeks,
  isBefore,
  isSameDay,
  startOfMonth,
} from "date-fns";
import { BLACK, REEF_DOCS_BLUE, WHITE } from "../../constants";
import { Grid, GridItem, Icon, Select, Text, Button } from "../../components";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  selectTaskViewMode,
  setTaskViewMode,
} from "../../store/slices/userConfigSlice";

const PAST_DAYS = 30;

const generateDatesRange = (startDate, endDate) => {
  return eachDayOfInterval({ start: startDate, end: endDate });
};

const generateWeekStartDates = (startDate, endDate) => {
  const mondays = [];
  let current = startOfWeek(startDate, { weekStartsOn: 1 });
  while (isBefore(current, endDate) || isSameDay(current, endDate)) {
    mondays.push(current);
    current = addWeeks(current, 1);
  }
  return mondays;
};

const generateMonthStartDates = (startDate, endDate) => {
  const months = [];
  let current = startOfMonth(startDate);
  while (isBefore(current, endDate) || isSameDay(current, endDate)) {
    months.push(current);
    current = addMonths(current, 1);
  }
  return months;
};

const generateDatesByView = (mode, startDate, endDate) => {
  switch (mode) {
    case "day":
      return generateDatesRange(startDate, endDate);
    case "week":
      return generateWeekStartDates(startDate, endDate);
    case "month":
      return generateMonthStartDates(startDate, endDate);
    default:
      return [];
  }
};

export const TasksDateNav = ({
  onDatePress,
  onInit,
  onViewModeChange,
  tasksLoading,
}) => {
  const [dates, setDates] = useState([]);
  const [lastDate, setLastDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateViewOpen, setDateViewOpen] = useState(false);
  const [currentMonthLabel, setCurrentMonthLabel] = useState(
    format(new Date(), "MMMM yyyy")
  );
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector(selectTaskViewMode) || "day";
  const flatListRef = useRef(null);
  const previousViewMode = useRef(viewMode);

  const handleViewModeChange = (value) => {
    onViewModeChange(value);
    dispatch(setTaskViewMode(value));
  };

  const scrollToToday = () => {
    const today = new Date();
    let targetDate = today;
    if (viewMode === "week") {
      targetDate = startOfWeek(today, { weekStartsOn: 1 });
    } else if (viewMode === "month") {
      targetDate = startOfMonth(today);
    }
    const index = dates.findIndex((d) => isSameDay(d, targetDate));
    if (index >= 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
      setSelectedDate(targetDate);
      setCurrentMonthLabel(format(targetDate, "MMMM yyyy"));
      onDatePress(format(targetDate, "yyyy-MM-dd"), viewMode);
    }
  };
  useEffect(() => {
    const today = new Date();
    const startDate = subDays(today, PAST_DAYS);
    const endDate = addMonths(today, 3);
    const initialDates = generateDatesByView(viewMode, startDate, endDate);

    setDates(initialDates);
    setLastDate(initialDates[initialDates.length - 1]);
    setSelectedDate(today);
    setCurrentMonthLabel(format(today, "MMMM yyyy"));
    onInit(today);

    setTimeout(() => {
      const targetDate =
        viewMode === "week"
          ? startOfWeek(today, { weekStartsOn: 1 })
          : viewMode === "month"
          ? startOfMonth(today)
          : today;

      const index = initialDates.findIndex((d) => isSameDay(d, targetDate));
      if (index >= 0 && flatListRef.current) {
        flatListRef.current.scrollToIndex({ index, animated: false });
      }
    }, 300);
  }, [viewMode]);

  useEffect(() => {
    const today = new Date();
    if (
      !tasksLoading &&
      dates.length > 0 &&
      flatListRef.current &&
      previousViewMode.current !== viewMode
    ) {
      let targetDate = today;
      if (viewMode === "week") {
        targetDate = startOfWeek(today, { weekStartsOn: 1 });
      } else if (viewMode === "month") {
        targetDate = startOfMonth(today);
      }

      const index = dates.findIndex((d) => isSameDay(d, targetDate));

      if (index >= 0 && index < dates.length) {
        setTimeout(() => {
          try {
            flatListRef.current.scrollToIndex({ index, animated: false });
          } catch (e) {
            console.warn("scrollToIndex error:", e.message);
          }
        }, 50);
      }
    }
    previousViewMode.current = viewMode;
  }, [tasksLoading, dates, viewMode]);

  const loadMoreDates = () => {
    const endDate = addMonths(lastDate, 3);
    const nextStartDate = (() => {
      if (viewMode === "month") {
        return addMonths(startOfMonth(lastDate), 1);
      }
      if (viewMode === "week") {
        return addWeeks(startOfWeek(lastDate, { weekStartsOn: 1 }), 1);
      }
      return addDays(lastDate, 1);
    })();

    const newDates = generateDatesByView(viewMode, nextStartDate, endDate);
    setDates((prev) => [...prev, ...newDates]);
    setLastDate(newDates[newDates.length - 1]);
  };

  const handleDatePress = (date) => {
    setSelectedDate(date);
    setCurrentMonthLabel(format(date, "MMMM yyyy"));
    onDatePress(format(date, "yyyy-MM-dd"), viewMode);
  };

  const renderItem = ({ item, index }) => {
    let isSelected = false;
    if (viewMode === "day") {
      isSelected = isSameDay(item, selectedDate);
    } else if (viewMode === "week") {
      isSelected = isSameDay(
        startOfWeek(item, { weekStartsOn: 1 }),
        startOfWeek(selectedDate, { weekStartsOn: 1 })
      );
    } else if (viewMode === "month") {
      isSelected = isSameDay(startOfMonth(item), startOfMonth(selectedDate));
    }

    let topText = "";
    let bottomText = "";

    if (viewMode === "day") {
      topText = format(item, "EEE");
      bottomText = format(item, "d");
    } else if (viewMode === "week") {
      topText = format(item, "EEE");
      bottomText = format(item, "do");
    } else if (viewMode === "month") {
      topText = format(item, "MMM");
      bottomText = "";
    }

    return (
      <TouchableOpacity onPress={() => handleDatePress(item)}>
        <View
          style={[
            styles.dateContainer,
            isSelected && styles.selectedDateContainer,
          ]}
        >
          <Text style={[styles.dayName, isSelected && styles.selectedText]}>
            {topText}
          </Text>
          {bottomText !== "" && (
            <Text style={[styles.dayNumber, isSelected && styles.selectedText]}>
              {bottomText}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Grid
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={16}
        style={{ marginBottom: 16 }}
      >
        <GridItem>
          <Text style={styles.headerText}>{currentMonthLabel}</Text>
        </GridItem>
        <GridItem justifyContent="flex-end">
          <Grid direction="row" justifyContent="flex-end" gap={16}>
            <Button
              style={{ padding: 8 }}
              title="Today"
              variant="secondary"
              onPress={scrollToToday}
            />
            <Button
              style={{ padding: 8 }}
              title={viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
              variant="secondary"
              onPress={() => setDateViewOpen(true)}
              iconRight="chevronDown"
            />
          </Grid>
          <Select
            value={viewMode}
            options={[
              { id: "day", label: "Day" },
              { id: "week", label: "Week" },
              { id: "month", label: "Month" },
            ]}
            valueKey="id"
            labelKey="label"
            title="Select Calendar View"
            hideInput
            openSelector={dateViewOpen}
            onClose={() => setDateViewOpen(false)}
            onConfirm={(value) => {
              handleViewModeChange(value);
              setDateViewOpen(false);
            }}
          />
        </GridItem>
      </Grid>
      <FlatList
        ref={flatListRef}
        key={`list-${viewMode}`}
        data={dates}
        keyExtractor={(item) => `${viewMode}-${item.toISOString()}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        onEndReached={!tasksLoading ? loadMoreDates : null}
        onEndReachedThreshold={0.5}
        getItemLayout={(data, index) => ({
          length: 72,
          offset: 72 * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    marginTop: -32,
    marginLeft: -16,
    marginRight: -16,
    padding: 16,
    paddingBottom: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  dateContainer: {
    alignItems: "center",
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: WHITE,
    borderRadius: 10,
    width: 62,
  },
  selectedDateContainer: {
    backgroundColor: REEF_DOCS_BLUE,
  },
  dayName: {
    fontSize: 16,
    fontWeight: "600",
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  selectedText: {
    color: "white",
  },
  skeleton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  skeletonText: {
    width: 30,
    height: 12,
    backgroundColor: "#ccc",
    borderRadius: 6,
  },
});

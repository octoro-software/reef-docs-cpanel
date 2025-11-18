// Collapsible Tank Task Groups by Week/Month
import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { format } from "date-fns";

import { useModal } from "../../../hooks/useModal";
import { useGetActiveTank } from "../../../hooks/useTanks";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { useActionTask, useTasksForDate } from "../../../hooks/useTankTasks";
import {
  selectCurrentDate,
  selectTankTasks,
  setCurrentDateValue,
} from "../../../store/slices/tankSlice";
import { selectTaskViewMode } from "../../../store/slices/userConfigSlice";

import { Grid, GridItem, Heading, Text, Icon } from "../../../components";
import { TasksDateNav } from "../../../elements/TasksDateNav/TasksDateNav";
import { TaskCard } from "../../../elements/TaskCard/TaskCard";
import { NoDataFallbackCard } from "../../../elements/NoDataFallbackCard/NoDataFallbackCard";
import { REEF_DOCS_BLUE, WHITE } from "../../../constants";
import { Skeleton } from "../../../components/Skeleton/Skeleton";
import { isLastDate, isPastDate } from "../../../utility/date";
import { UserPostCardScreenHeader } from "../../../elements/UserPostCardScreenHeader/UserPostCardScreenHeader";

export const TankTasksScreen: React.FC = () => {
  const { openModal } = useModal();
  const [getTasks, tasksLoading] = useTasksForDate();
  const [actionTask] = useActionTask();
  const firstLoadRef = useRef(true);
  const dispatch = useAppDispatch();

  const taskViewMode = useAppSelector(selectTaskViewMode) ?? "day";

  const currentDate = useAppSelector(selectCurrentDate);

  const setCurrentDate = (date) => dispatch(setCurrentDateValue(date));

  const [loadingTasks, setLoadingTasks] = useState({});
  const [openGroupDate, setOpenGroupDate] = useState<string | null>(null);
  const [closestDate, setClosestDate] = useState<string | null>(null);
  const activeTank = useGetActiveTank();
  const tasks = useAppSelector(selectTankTasks(activeTank?.id));

  const animationRefs = useRef({});

  const handleGetTasks = async (date, tankId, viewMode) => {
    await getTasks(date, tankId, viewMode);
  };

  const handleOnDatePress = async (date, viewMode) => {
    await handleGetTasks(date, activeTank?.id, viewMode);
    setCurrentDate(date);
  };

  useEffect(() => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    handleGetTasks(today.toISOString(), activeTank?.id, taskViewMode);
  }, [activeTank]);

  useEffect(() => {
    if (taskViewMode === "day" || !tasks?.length) return;
    if (!firstLoadRef.current) return; // only run once

    const today = new Date();
    let closest = tasks?.[0]?.weekDate;
    let minDiff = Infinity;

    tasks.forEach((t) => {
      const d = new Date(t?.weekDate);
      const diff = Math.abs(today.getTime() - d.getTime());
      if (diff < minDiff) {
        closest = t?.weekDate;
        minDiff = diff;
      }
    });

    setClosestDate(closest);

    const target = tasks.find((t) => t?.weekDate === closest);
    if (target) {
      animationRefs.current[closest] = Array.from(
        { length: target.dates?.length || 0 },
        () => new Animated.Value(1)
      );
    }
  }, [tasks, taskViewMode]);

  const animateGroup = (groupKey: string, length: number, open: boolean) => {
    if (!animationRefs.current[groupKey]) {
      animationRefs.current[groupKey] = Array.from(
        { length },
        () => new Animated.Value(open ? 0 : 1)
      );
    }

    animationRefs.current[groupKey].forEach((val, i) => {
      Animated.timing(val, {
        toValue: open ? 1 : 0,
        duration: 300,
        delay: i * 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }).start();
    });
  };

  const handleToggleGroup = (groupKey: string, taskCount: number) => {
    const isOpening = openGroupDate !== groupKey;
    animateGroup(groupKey, taskCount, isOpening);
    setOpenGroupDate(isOpening ? groupKey : null);
  };

  const handleTaskEdit = (task) =>
    openModal({
      type: "tankTaskModal",
      height: "large",
      modalTitle: "Edit Task",
      data: { task },
    });

  const handleAddTask = () => {
    openModal({
      type: "tankTaskModal",
      modalTitle: "New Task",
      height: "large",
    });
  };

  const handleActionTask = async (task, weekDate, skip = false) => {
    const taskId = task?.id;
    setLoadingTasks((prev) => ({ ...prev, [taskId]: true }));

    const completed = skip ? false : task?.completed ? false : true;

    const payload = {
      id: taskId,
      date: new Date(currentDate).toISOString(),
      completed,
      skipped: skip,
      tankId: activeTank?.id,
      weekDate,
    };

    await actionTask(payload);

    setLoadingTasks((prev) => ({ ...prev, [taskId]: false }));
  };

  const handleViewModeChange = async (viewMode: string) => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    await handleGetTasks(today.toISOString(), activeTank?.id, viewMode);
  };

  const hasTasks = tasks?.[0]?.dates?.length > 0;

  return (
    <Grid gap={16}>
      <UserPostCardScreenHeader title="Tasks" icon="reefDocsTasks" />

      <TasksDateNav
        onDatePress={handleOnDatePress}
        onInit={(date) => setCurrentDate(date)}
        onViewModeChange={handleViewModeChange}
        tasksLoading={tasksLoading}
      />

      {!hasTasks && !tasksLoading && (
        <NoDataFallbackCard
          onPress={handleAddTask}
          title="No Tasks Today!"
          description="You have no tasks for this date"
          buttonTitle="Add Task"
          icon="reefDocsTasks"
        />
      )}

      <ScrollView>
        <Grid gap={24}>
          {tasksLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={`skeleton-${i}`} />
              ))
            : tasks?.map((rootTask, key) => {
                const groupKey = rootTask?.weekDate;
                const isGroupOpen =
                  taskViewMode === "day" || openGroupDate === groupKey;
                const isClosest = closestDate === groupKey;

                return (
                  <Fragment key={key}>
                    {taskViewMode !== "day" && (
                      <TouchableOpacity
                        onPress={() =>
                          handleToggleGroup(
                            groupKey,
                            rootTask?.dates?.length || 0
                          )
                        }
                      >
                        <View
                          style={[
                            styles.groupDate,
                            isClosest && {
                              borderColor: REEF_DOCS_BLUE,
                              borderWidth: 2,
                            },
                          ]}
                        >
                          <Grid direction="row" alignItems="center" gap={8}>
                            <Grid
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              gap={8}
                            >
                              <GridItem flex={1}>
                                <Heading variant={5} weight="semiBold">
                                  {groupKey &&
                                    format(new Date(groupKey), "EEEE do MMMM")}
                                </Heading>
                              </GridItem>
                              <GridItem>
                                <Text>
                                  {rootTask?.totalComplete} / {rootTask?.total}
                                </Text>
                              </GridItem>
                              <GridItem>
                                <Animated.View
                                  style={{
                                    transform: [
                                      {
                                        rotate:
                                          openGroupDate === groupKey
                                            ? "90deg"
                                            : "0deg",
                                      },
                                    ],
                                  }}
                                >
                                  <Icon
                                    name="chevronRight"
                                    fill={REEF_DOCS_BLUE}
                                  />
                                </Animated.View>
                              </GridItem>
                            </Grid>
                          </Grid>
                        </View>
                      </TouchableOpacity>
                    )}

                    {isGroupOpen &&
                      rootTask?.dates?.map((task, subTaskKey) => {
                        const complete = task?.completed;
                        const isLoading = loadingTasks[task?.id] || false;
                        const animatedVal =
                          animationRefs.current[groupKey]?.[subTaskKey] ??
                          new Animated.Value(1);

                        const animatedStyle = {
                          opacity: animatedVal,
                          transform: [
                            {
                              translateY: animatedVal.interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                              }),
                            },
                          ],
                        };

                        const isPast = isPastDate(rootTask?.weekDate);

                        const isExpiring = isLastDate(
                          task?.expiresDate,
                          currentDate
                        );

                        return (
                          <Animated.View
                            key={`sub_task_${subTaskKey}`}
                            style={animatedStyle}
                          >
                            <TaskCard
                              name={task?.name}
                              description={task?.description}
                              isPast={isPast}
                              complete={complete}
                              loading={isLoading}
                              task={task}
                              isExpiring={isExpiring}
                              handleActionTask={() =>
                                handleActionTask(task, rootTask?.weekDate)
                              }
                              handleTaskEdit={() =>
                                handleTaskEdit(task)
                              }
                            />
                          </Animated.View>
                        );
                      })}
                  </Fragment>
                );
              })}
        </Grid>
      </ScrollView>
    </Grid>
  );
};

const styles = StyleSheet.create({
  groupDate: {
    backgroundColor: WHITE,
    borderRadius: 8,
    padding: 16,
  },
});

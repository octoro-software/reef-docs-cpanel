import React, { useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { addDays, format, isAfter } from "date-fns";

import { Grid, GridItem, Heading, Icon, Text } from "../../components";

import { useUpdateTask } from "../../hooks/useTankTasks";
import { ButtonWithConfirmation } from "../../components/ButtonWithConfirmation/ButtonWithConfirmation";

import { BLACK, REEF_DOCS_BLUE, WHITE } from "../../constants";

export const TaskCard = ({
  
  handleActionTask,
  complete,
  name,
  description,
  loading,
  isPast,
  task,
  isExpiring,
  handleTaskEdit
}) => {
  const [showUpdateTask, setShowUpdateTask] = useState(false);

  const [updateTask, updateTaskLoading, updateTaskError] = useUpdateTask();

  const repeatDays = task?.repeatDays;

  const expiresDate = task?.expiresDate;

  const newDate = addDays(new Date(), Number(repeatDays));

  const formattedNewDate = format(newDate, "do MMMM yyyy");

  const handleTaskAction = async () => {
    await handleActionTask();

    if (isPast && !complete && task?.repeat && task?.repeatDays > 1) {
      setShowUpdateTask(true);
    }
  };

  const handleUpdateSchedule = async () => {
    await updateTask({
      ...task,
      date: new Date().toISOString(),
    });

    setShowUpdateTask(false);
  };

  const taskDescription =
    task?.dosagePlan && isExpiring
      ? task?.hasFinalDose
        ? task?.lastDayDescription
        : description
      : description;

  return (
    <TouchableOpacity
      onLongPress={handleTaskEdit}
      onPress={handleTaskAction}
      style={styles.taskCard}
    >
          <Grid direction="row" gap={8}>
          {!loading ? (
            <GridItem style={{padding: 8, paddingRight: 0}}>
              {complete ? (
                <Icon name="taskCheck" fill={REEF_DOCS_BLUE} />
              ) : (
                <Icon name="radio" fill={BLACK} />
              )}
            </GridItem>
          ) : (
            <GridItem justifyContent={Platform.OS === 'ios' ? 'flex-start' :  "flex-end"}>
              <ActivityIndicator size={48} color={REEF_DOCS_BLUE} />
            </GridItem>
          )}
          <GridItem flex={1} style={{paddingVertical: 8}} >
            <Heading variant={5} weight="semiBold">
              {name}
            </Heading>
            <Text>{taskDescription}</Text>
          </GridItem>
          <TouchableOpacity style={{backgroundColor: REEF_DOCS_BLUE,  width: 48, borderTopRightRadius: 8, borderBottomRightRadius: 8, justifyContent: 'center', alignItems: 'center'}} onPress={handleTaskEdit}>
            <Icon name="edit" fill={WHITE} />
          </TouchableOpacity>
          </Grid>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: WHITE,
    borderRadius: 8,
  },
});

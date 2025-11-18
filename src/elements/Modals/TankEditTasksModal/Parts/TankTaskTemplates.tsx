import React from "react";
import {
  Button,
  Grid,
  GridItem,
  Icon,
  ModalComposition,
  ModalHeader,
  Text,
} from "../../../../components";
import { useModal } from "../../../../hooks/useModal";
import { Skeleton } from "../../../../components/Skeleton/Skeleton";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { BLACK, INPUT_BORDER_COLOR, WHITE } from "../../../../constants";

export const TankTaskTemplates = ({
  handleTaskPress,
  taskTemplates,
  loading,
}) => {
  const { closeModal } = useModal();

  return (
    <ModalComposition
      renderFooter={() => {
        return <Button title="Close" onPress={closeModal} />;
      }}
    >
      <ModalHeader
        title={"Edit Task"}
        icon="reefDocsTasks"
        iconWidth={48}
        iconHeight={48}
      />

      <Grid direction="column">
        {loading
          ? Array.from({ length: 5 }, (_, index) => <Skeleton key={index} />)
          : taskTemplates.map((task, key) => (
              <TouchableOpacity
                onPress={() => handleTaskPress(task)}
                key={task.id}
                style={[
                  styles.taskCard,
                  key === 0 && {
                    borderTopWidth: 1,
                    borderTopColor: INPUT_BORDER_COLOR,
                    marginTop: 16,
                  },
                ]}
              >
                <Grid direction="row" gap={8} justifyContent="space-between">
                  <Grid direction="row" gap={8} alignItems="center">
                    <Icon name="reefDocsTasks" width={32} height={32} />
                    <Text weight="bold">{task?.name}</Text>
                  </Grid>
                  <GridItem>
                    <Icon
                      name="chevronRight"
                      width={24}
                      height={24}
                      fill={BLACK}
                    />
                  </GridItem>
                </Grid>
              </TouchableOpacity>
            ))}
      </Grid>
    </ModalComposition>
  );
};

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: WHITE,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: INPUT_BORDER_COLOR,
    paddingVertical: 16,
  },
});

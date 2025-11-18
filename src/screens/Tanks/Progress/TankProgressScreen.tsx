import React, { useEffect, useCallback } from "react";
import { FlatList, View } from "react-native";

import {
  selectTankProgress,
  setTankProgressState,
} from "../../../store/slices/tankSlice";

import { useModal } from "../../../hooks/useModal";
import { useGetActiveTank, useGetTankProgress } from "../../../hooks/useTanks";
import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { useGetTaskById } from "../../../hooks/useTankTasks";

import { TankProgressCard } from "../../../elements/TankProgressCard/TankProgressCard";
import { UserPostCardScreenHeader } from "../../../elements/UserPostCardScreenHeader/UserPostCardScreenHeader";
import { NoDataFallbackCard } from "../../../elements/NoDataFallbackCard/NoDataFallbackCard";
import { Skeleton } from "../../../components/Skeleton/Skeleton";
import { Button, Grid, GridItem, Select } from "../../../components";

import { getAppDimensions } from "../../../utility/dimensions";

const width = getAppDimensions().width;

export const TankProgressScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  const { data, page, loading, hasMore, initialLoading, sortBy } =
    useAppSelector(selectTankProgress);

  const [getTask, getTaskLoading] = useGetTaskById();

  const activeTank = useGetActiveTank();

  const [getTankProgress] = useGetTankProgress();

  const fetchPage = useCallback(
    async (pageNum = 1, sort = sortBy) => {
      dispatch(setTankProgressState({ loading: true }));
      if (pageNum === 1)
        dispatch(setTankProgressState({ initialLoading: true }));

      const response = await getTankProgress(activeTank.id, pageNum, sort);

      const items = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

      dispatch(
        setTankProgressState({
          data:
            pageNum === 1
              ? items
              : [
                  ...data,
                  ...items.filter(
                    (item) => !data.some((d) => d.id === item.id)
                  ),
                ],
          hasMore: items.length === 5,
          loading: false,
          initialLoading: pageNum === 1 ? false : initialLoading,
          page: pageNum,
        })
      );
    },
    [activeTank?.id, hasMore, sortBy, loading, data, initialLoading]
  );

  // Fetch data when page changes
  useEffect(() => {
    if (activeTank?.id) {
      fetchPage(page, sortBy);
    }
  }, [page, activeTank?.id, sortBy]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(setTankProgressState({ page: page + 1 }));
    }
  };

  const { openModal } = useModal();

  const handleOpenCreateModal = () =>
    openModal({
      type: "tankProgressModal",
      height: "large",
      modalTitle: "Add Progress",
      data: {
        title: "Add Progress",
        description: "Log the progress of your tank.",
      },
    });

  const handleEditProgress = (item) =>
    openModal({
      type: "tankProgressModal",
      height: "large",
      modalTitle: "Edit Progress",
      data: {
        title: "Edit Progress",
        description: "Log the progress of your tank.",
        item,
        edit: true,
      },
    });

  const handleReminder = async () => {
    if (activeTank?.tankProgress) {
      const task = await getTask(activeTank.tankProgress);

      openModal({
        type: "tankTaskModal",
        modalTitle: "Edit Task",
        height: "large",
        data: {
          task,
        },
      });
    } else {
      openModal({
        type: "tankTaskModal",
        modalTitle: "New Task",
        height: "large",
        data: {
          task: {
            name: "Add Progress Image",
            description: "Capture image for tank progress.",
            repeat: true,
            repeatDays: 30,
            specialTaskKey: "tankProgress",
            date: new Date(),
          },
        },
      });
    }
  };

  return (
    <View style={{ marginBottom: 80 }}>
      <FlatList
        renderItem={({ item }) => (
          <TankProgressCard
            images={item?.imageUrls}
            description={item?.description}
            date={item?.date}
            handleEdit={() => handleEditProgress(item)}
          />
        )}
        data={data}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingBottom: 240 }}
        ListHeaderComponent={() => (
          <>
            <UserPostCardScreenHeader
              title="Progress"
              icon="reefDocsProgress"
            />

            <View style={{ height: 10 }} />

            <Grid direction="row" gap={8}>
              <GridItem flex={1}>
                <Select
                  options={[
                    { label: "Newest", value: "desc" },
                    { label: "Oldest", value: "asc" },
                  ]}
                  labelKey="label"
                  valueKey="value"
                  title="Sort By"
                  value={sortBy}
                  displayValuePrefix="Sort By: "
                  onConfirm={(val) =>
                    dispatch(setTankProgressState({ sortBy: val }))
                  }
                />
              </GridItem>

              <Button
                variant="secondary"
                title={
                  activeTank?.tankProgress ? "Edit Reminder" : "Create Reminder"
                }
                style={{ paddingTop: 13, paddingBottom: 13, minWidth: 130 }}
                onPress={handleReminder}
                isLoading={getTaskLoading}
              />
            </Grid>

            <View style={{ height: 10 }} />

            {initialLoading && <ProgressSkeletonLoader />}

            {data?.length === 0 && !loading && (
              <NoDataFallbackCard
                title="No Progress Logged Yet!"
                icon="reefDocsProgress"
                description="You haven't added any progress yet. Tap below or use the wheel to add progress!"
                buttonTitle="Add Progress"
                centered={true}
                onPress={handleOpenCreateModal}
              />
            )}
          </>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && hasMore ? <View style={{ height: 60 }} /> : null
        }
      />
    </View>
  );
};

const ProgressSkeletonLoader = () => {
  const items = Array.from({ length: 5 }, (_, i) => ({}));

  return (
    <Grid gap={8}>
      {items.map((_, idx) => (
        <View key={idx}>
          <Skeleton
            height={320}
            width={width - 16}
            marginBottom={0}
            marginTop={0}
          />

          <View>
            <Grid style={{ padding: 16, paddingBottom: 8 }}>
              <Skeleton marginBottom={0} marginTop={0} />
            </Grid>

            <Grid
              direction="row"
              style={{ paddingHorizontal: 16, paddingVertical: 8 }}
            >
              <Skeleton marginBottom={0} marginTop={0} height={16} />
            </Grid>
          </View>
        </View>
      ))}
    </Grid>
  );
};

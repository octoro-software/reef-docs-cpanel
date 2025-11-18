import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

import {
  useGetActiveTank,
  useGetTankLiveStock,
  useRemoveFromTank,
} from "../../../hooks/useTanks";

import { UserPostCardScreenHeader } from "../../../elements/UserPostCardScreenHeader/UserPostCardScreenHeader";
import {
  UserLiveStockCard,
  UserLiveStockCardSkeleton,
} from "../../../elements/UserLiveStockCard/UserLiveStockCard";
import { NoDataFallbackCard } from "../../../elements/NoDataFallbackCard/NoDataFallbackCard";
import { useNavigate } from "react-router-native";
import { LIVESTOCK_PATH, REEF_DOCS_BLUE } from "../../../constants";
import { removeTankLiveStockById } from "../../../store/slices/tankSlice";
import { useAppDispatch } from "../../../hooks/useRedux";
import { FlashList } from "@shopify/flash-list";

export const TankInvertsScreen: React.FC = () => {
  const data = useGetActiveTank();

  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(true);
  const [confirmRemoveUuid, setConfirmRemoveUuid] = React.useState<
    string | null
  >(null);
  const [removeLoadingUuid, setRemoveLoadingUuid] = React.useState<
    string | null
  >(null);

  const dispatch = useAppDispatch();

  const [getLiveStock, loadMore] = useGetTankLiveStock();

  const liveStock = data?.invert?.data || [];

  const pagination = data?.invert?.pagination || {};

  const handleLoadMore = async () => {
    const page = (pagination?.current_page || 1) + 1;

    if (pagination?.current_page < pagination?.last_page) {
      await getLiveStock({ page, tankId: data?.id, type: "invert" });
    }
  };

  const handleInitialLoad = async () => {
    setLoading(true);
    await getLiveStock({ page: 1, tankId: data?.id, type: "invert" });
    setLoading(false);
  };

  useEffect(() => {
    handleInitialLoad();
  }, []);

  const [removeFromTank] = useRemoveFromTank();

  const handleRemoveFromTank = async (id: string, uuid: string) => {
    setRemoveLoadingUuid(uuid);
    await removeFromTank(data?.id, uuid);
    dispatch(
      removeTankLiveStockById({ uuid, tankId: data?.id, type: "invert" })
    );
    setRemoveLoadingUuid(null);
  };

  const [confirmRemove, setConfirmRemove] = React.useState("");

  const handleNavigateBrowse = () =>
    navigate(`${LIVESTOCK_PATH}?filter=is_invert:true`);

  const renderHeader = () => (
    <>
      <UserPostCardScreenHeader title="Inverts" icon="reefDocsInverts" />
      <View style={{ height: 10 }} />

      {liveStock?.length === 0 && !loading && (
        <NoDataFallbackCard
          title="No Inverts Yet!"
          icon="reefDocsInverts"
          description="You haven't added any inverts yet. Browse Inverts and add some to your tank!"
          buttonTitle="Browse Inverts"
          centered={true}
          onPress={handleNavigateBrowse}
        />
      )}
    </>
  );

  return (
    <View style={{ marginBottom: 80, flex: 1 }}>
      <FlashList
        data={loading ? Array.from({ length: 3 }) : liveStock}
        renderItem={
          loading
            ? () => <UserLiveStockCardSkeleton />
            : ({ item }: any) => (
                <UserLiveStockCard
                  {...item}
                  handleRemoveFromTank={handleRemoveFromTank}
                  showConfirmRemove={confirmRemoveUuid === item.uuid}
                  setShowConfirmRemove={setConfirmRemoveUuid}
                  removeFromTankLoading={removeLoadingUuid === item.uuid}
                  confirmRemove={confirmRemove}
                  setConfirmRemove={setConfirmRemove}
                  title="Inverts"
                  icon="reefDocsInverts"
                />
              )
        }
        keyExtractor={
          loading
            ? (_, idx) => `skeleton-${idx}`
            : (item: any, index) => `${item?.uuid}`
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingBottom: 240 }}
        showsVerticalScrollIndicator={false}
        onEndReached={loading ? undefined : handleLoadMore}
        onEndReachedThreshold={5}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={() =>
          loadMore ? (
            <View style={{ paddingVertical: 16, alignItems: "center" }}>
              <ActivityIndicator color={REEF_DOCS_BLUE} size="small" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

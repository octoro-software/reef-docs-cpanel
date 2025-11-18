import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useLocation, useNavigate } from "react-router-native";

import { useAppSelector } from "../../hooks/useRedux";
import { useModal } from "../../hooks/useModal";
import { useQueryParams } from "../../hooks/useQueryParams";

import {
  selectLastUsedQueryParams,
  selectLiveStockScrollOffset,
  setLastUsedQueryParams,
  setScrollOffset,
} from "../../store/slices/liveStockSlice";

import { LiveStockCard } from "../../elements/LiveStockCard/LiveStockCard";
import { LoadingSpinner, Select } from "../../components";
import { CORAL_PROFILE_PATH, REEF_DOCS_BLUE } from "../../constants";

import { LiveStockListingApiResponse } from "../../types/api/liveStock.types";
import { sendEvent, sendEventOnce } from "../../utility/analytics";
import { useDispatch } from "react-redux";
import { LiveStockHeader } from "../../elements/LiveStockHeader/LiveStockHeader";
import { LiveStockNoResultsFallback } from "../../elements/LiveStockNoResultsFallback/LiveStockNoResultsFallback";
import { ScrollToTopFlatListButton } from "../../components/ScrollTopTopFlatListButton/ScrollToTopFlatListButton";
import { usePlantCoralListing } from "../../hooks/useCoral";
import { selectPlantCoralListing } from "../../store/slices/coralPlantSlice";
import { AppTip } from "../../components/AppTip/AppTip";
import { useAudience } from "../../hooks/useAudience";

export const CoralScreen: React.FC<{ coral: boolean }> = ({ coral }) => {
  const [getLiveStockListing, liveStockListingLoading] = usePlantCoralListing();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [sortByOpen, setSortByOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState({ state: false, focus: false });
  const [loadingMore, setLoadingMore] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const { isFresh } = useAudience();
  const scrollOffsetRef = useRef(0);
  const lastScrollY = useRef(0);

  const listRef = useRef<FlashList<any>>(null);
  const dispatch = useDispatch();

  const savedScrollOffset = useAppSelector(selectLiveStockScrollOffset);
  const lastUsedQueryParams = useAppSelector(selectLastUsedQueryParams(coral));

  const location = useLocation();
  const navigationState = location?.state;

  const {
    getParam,
    setParam,
    setParams,
    rawParams,
    getTotalFilterCount,
    clearParams,
  } = useQueryParams();

  const liveStockData: LiveStockListingApiResponse = useAppSelector(
    selectPlantCoralListing
  );

  const shopId = getParam("shopId");

  const currentPage = parseInt(getParam("page") || "1", 10);
  const showFullScreenLoader = liveStockListingLoading && currentPage === 1;

  sendEventOnce("CORAL_VIEW", {
    params: rawParams,
  });

  useEffect(() => {
    const query = rawParams?.trim() || "";

    if (!query) {
      if (lastUsedQueryParams) {
        const paramsObject = new URLSearchParams(lastUsedQueryParams);
        const restoredParams: Record<string, string> = {};
        paramsObject.forEach((value, key) => {
          restoredParams[key] = value;
        });
        setParams(restoredParams, { replace: true });
      } else {
        setParam("page", "1", { replace: true });
      }
      return;
    }

    if (getParam("search") && !searchOpen.state) {
      setSearchOpen({ state: true, focus: false });
    }

    const currentQueryParams = new URLSearchParams(query);
    const lastQueryParams = new URLSearchParams(lastUsedQueryParams || "");

    const pageNow = currentQueryParams.get("page") || "1";
    const pageLast = lastQueryParams.get("page") || "1";

    currentQueryParams.delete("page");
    lastQueryParams.delete("page");

    const cleanedQuery = currentQueryParams.toString();
    const cleanedLastQuery = lastQueryParams.toString();

    const filtersChanged = cleanedQuery !== cleanedLastQuery;
    const pageChanged = pageNow !== pageLast;

    if (!filtersChanged && !pageChanged) {
      // ✅ No filters changed, no page changed → skip fetching
      return;
    }

    const fetchLiveStock = async () => {
      await getLiveStockListing({ filterQuery: query, coral });
      dispatch(setLastUsedQueryParams({ query, coral }));
    };
    fetchLiveStock();
  }, [rawParams, lastUsedQueryParams]);

  const handleLiveStockProfileNavigation = async (id: string, data) =>
    await navigate(CORAL_PROFILE_PATH(id), {
      state: {
        data,
      },
    });

  const handleSearchChange = (value: string) => {
    setParams({
      search: value,
      page: "1",
    });

    sendEvent("LIVESTOCK_SEARCH_QUERY", {
      query: value,
    });
  };

  const handleLoadMoreResults = async () => {
    if (!liveStockData.hasMore || loadingMore) return; // avoid double requests

    setLoadingMore(true);

    const currentPage = parseInt(getParam("page") || "1", 10);
    await setParam("page", (currentPage + 1).toString());

    setLoadingMore(false);
  };

  const handleOpenFilterModal = () =>
    openModal({
      type: "liveStockFilterModal",
      height: "medium",
      modalTitle: "Filter",
      data: {
        coral: true,
      },
    });

  const filterCount = getTotalFilterCount();

  const shopFilter = shopId ? 1 : 0;

  const totalFilters = Number(filterCount) + shopFilter;

  const handleClearFilters = () => {
    clearParams();
    dispatch(setScrollOffset(0)); // <-- Reset saved scroll position in Redux
    setParam("shopId", null);
  };

  const handleSortByConfirm = (value: string) => {
    setParams({
      sort: value,
      sortOrder: "asc",
      page: "1",
    });
  };

  const handleSearchClose = () => {
    setParam("search", null);
    setSearchOpen({ state: false, focus: false });
  };

  const handleOpenLiveStockRequestForm = () =>
    openModal({
      type: "liveStockRequestFormModal",
      modalTitle: "Request a Profile",
      height: "large",
      data: {
        icon: isFresh ? "reefDocsPlant" : "reefDocsCoral",
      },
    });

  const navigationScrollOffset = navigationState?.scrollToOffset;

  useEffect(() => {
    if (listRef.current) {
      const timeout = setTimeout(() => {
        const offsetToRestore =
          navigationScrollOffset >= 0
            ? navigationScrollOffset
            : savedScrollOffset >= 0
              ? savedScrollOffset
              : 0;

        listRef.current?.scrollToOffset({
          offset: offsetToRestore,
          animated: false,
        });
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [navigationScrollOffset, savedScrollOffset, listRef]);

  const estimatedItemHeight = 104;
  const initialIndex = Math.floor(savedScrollOffset / estimatedItemHeight);

  return (
    <>
      <AppTip
        text="The Coral Database is still under construction, if you need
        something please use the menu."
        tipId="CORAL_DATABASE_CONSTRUCT"
        style={{ marginBottom: 16 }}
      />

      <LiveStockHeader
        searchOpen={searchOpen}
        searchValue={getParam("search") || ""}
        onSearchChange={handleSearchChange}
        onSearchClose={handleSearchClose}
        onOpenSearch={() => setSearchOpen({ state: true, focus: true })}
        onOpenSort={() => setSortByOpen(true)}
        onOpenFilter={handleOpenFilterModal}
        onClearFilters={handleClearFilters}
        totalFilters={totalFilters}
      />

      <ScrollToTopFlatListButton
        onPress={() => {
          listRef.current?.scrollToOffset({ offset: 0, animated: true });
        }}
        visible={showScrollToTop}
      />

      {liveStockData?.data?.length === 0 && (
        <LiveStockNoResultsFallback onPress={handleOpenLiveStockRequestForm} />
      )}

      {showFullScreenLoader ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <LoadingSpinner width={200} />
        </View>
      ) : (
        <FlashList
          ref={listRef}
          data={liveStockData?.data}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${item?.id}_${index}`}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          disableIntervalMomentum
          onEndReached={handleLoadMoreResults}
          onScroll={(event) => {
            const offsetY = event.nativeEvent.contentOffset.y;
            const diff = offsetY - lastScrollY.current;

            if (offsetY < 300) {
              setShowScrollToTop(false);
            } else if (diff < 0) {
              // Scrolling up
              setShowScrollToTop(true);
            } else {
              // Scrolling down
              setShowScrollToTop(false);
            }

            lastScrollY.current = offsetY;
            scrollOffsetRef.current = offsetY;
            dispatch(setScrollOffset(offsetY));
          }}
          initialScrollIndex={
            liveStockData?.data?.length > initialIndex
              ? initialIndex
              : undefined
          }
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <LiveStockCard
              id={item?.id}
              title={item?.name}
              subtitle={item?.scientific_name}
              image={item?.images?.[0]?.url}
              onPress={handleLiveStockProfileNavigation}
              statePayload={item}
              transition={100}
            />
          )}
          ListFooterComponent={() =>
            loadingMore ? (
              <View style={{ paddingVertical: 16, alignItems: "center" }}>
                <ActivityIndicator color={REEF_DOCS_BLUE} size="small" />
              </View>
            ) : null
          }
        />
      )}
      <Select
        hideInput
        title="Sort By"
        labelKey="label"
        valueKey="definition"
        options={liveStockData?.sortableConstruction ?? []}
        openSelector={sortByOpen}
        onConfirm={(value) => handleSortByConfirm(value)}
        onClose={() => setSortByOpen(false)}
      />
    </>
  );
};

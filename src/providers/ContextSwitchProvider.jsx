import React, { useEffect, useState, useRef } from "react";
import { useGetTanks } from "../hooks/useTanks";
import { useGetPolls } from "../hooks/usePolls";
import { useGetWishList } from "../hooks/useWishList";
import { useInitStructuredConfiguration } from "../hooks/useStructuredConfiguration";
import { useGetRecentlyViewed } from "../hooks/useRecentlyViewed";
import { useGetTaskPreferences } from "../hooks/useTankTasks";
import {
  useGetLiveStockRecentlyAdded,
  useGetLiveStockTrending,
  useLiveStockListing,
} from "../hooks/useLiveStock";
import { DataLoading } from "../elements/DataLoading/DataLoading";
import { useGetFeaturedArticles } from "../hooks/useArticles";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import {
  selectContextSwitchLoading,
  setContextSwitchLoading,
} from "../store/slices/globalSlice";

export const ContextSwitchProvider = ({ children }) => {
  const [isCriticalDataLoaded, setIsCriticalDataLoaded] = useState(false);

  const dispatch = useAppDispatch();

  const contextSwitchLoading = useAppSelector(selectContextSwitchLoading);

  const [getTanks] = useGetTanks();
  const [getWishList] = useGetWishList();
  const [getRecentlyViewed] = useGetRecentlyViewed();
  const [getStructuredConfiguration] = useInitStructuredConfiguration();

  // Non-critical hooks (properly destructured)
  const deferredHooks = useRef({
    getTrendingLiveStock: useGetLiveStockTrending()[0],
    getLiveStockListing: useLiveStockListing()[0],
    getPolls: useGetPolls()[0],
    getFeaturedArticles: useGetFeaturedArticles()[0],
    getTaskPreferences: useGetTaskPreferences()[0],
    getRecentlyAdded: useGetLiveStockRecentlyAdded()[0],
    getFavourites: useGetWishList()[0],
  });

  useEffect(() => {
    if (!contextSwitchLoading) return;

    const fetchCriticalData = async () => {
      try {
        const criticalResults = await Promise.allSettled([
          getStructuredConfiguration(),
          getTanks(),
          getRecentlyViewed(),
          getWishList(),
        ]);

        criticalResults.forEach(({ status, reason }, index) => {
          if (status === "rejected") {
            console.error(`Critical data failed at index ${index}:`, reason);
          }
        });

        setIsCriticalDataLoaded(true);
      } catch (error) {
        console.error("Unexpected critical data load error:", error);
        setIsCriticalDataLoaded(true);
      } finally {
        fetchDeferredData();
      }
    };

    const fetchDeferredData = async () => {
      const {
        getTrendingLiveStock,
        getLiveStockListing,
        getPolls,
        getFeaturedArticles,
        getTaskPreferences,
        getRecentlyAdded,
      } = deferredHooks.current;

      await Promise.allSettled([
        getTrendingLiveStock(),
        getLiveStockListing({ filterQuery: "?page=1" }),
        getPolls(),
        getFeaturedArticles(),
        getTaskPreferences(),
        getRecentlyAdded(),
      ]);
    };

    fetchCriticalData();

    dispatch(setContextSwitchLoading(false));
  }, [contextSwitchLoading]);

  if (contextSwitchLoading) {
    return <DataLoading />;
  }

  return <>{children}</>;
};

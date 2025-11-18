import React, { useEffect, useState, useRef } from "react";
import { useGetTanks } from "../hooks/useTanks";
import { useElements, useIcpProviders } from "../hooks/useIcp";
import { useGetPolls } from "../hooks/usePolls";
import { useGetWishList } from "../hooks/useWishList";
import { useInitStructuredConfiguration } from "../hooks/useStructuredConfiguration";
import { useGetRecentlyViewed } from "../hooks/useRecentlyViewed";
import { useGetTaskPreferences } from "../hooks/useTankTasks";
import {
  useGetLiveStockCoralTrending,
  useGetLiveStockRecentlyAdded,
  useGetLiveStockTrending,
  useLiveStockListing,
} from "../hooks/useLiveStock";
import { DataLoading } from "../elements/DataLoading/DataLoading";
import {
  useGetArticleMenu,
  useGetFeaturedArticles,
} from "../hooks/useArticles";
import BootSplash from "react-native-bootsplash";
import { usePlantCoralListing } from "../hooks/useCoral";
import { useGetPartners } from "../hooks/usePartners";
import { useUser } from "../hooks/useAuth";
import * as Sentry from "@sentry/react";

export const DataInitProvider = ({ children }) => {
  const [isCriticalDataLoaded, setIsCriticalDataLoaded] = useState(false);
  const isFetched = useRef(false);
  const user = useUser();

  const [getTanks] = useGetTanks();
  const [getStructuredConfiguration] = useInitStructuredConfiguration();
  const [getRecentlyViewed] = useGetRecentlyViewed();
  const [getFavourites] = useGetWishList();
  const [getPartners] = useGetPartners();

  // Non-critical hooks (properly destructured)
  const deferredHooks = useRef({
    getLiveStockListing: useLiveStockListing()[0],
    getCoralListing: usePlantCoralListing()[0],
    getPolls: useGetPolls()[0],
    getFeaturedArticles: useGetFeaturedArticles()[0],
    getTaskPreferences: useGetTaskPreferences()[0],
    getRecentlyAdded: useGetLiveStockRecentlyAdded()[0],
    getIcpProviders: useIcpProviders()[0],
    getElements: useElements()[0],
    getFavourites: useGetWishList()[0],
    getTrendingLiveStock: useGetLiveStockTrending()[0],
    getTrendingCoral: useGetLiveStockCoralTrending()[0],
    getArticleMenu: useGetArticleMenu()[0],
  });

  useEffect(() => {
    Sentry.setUser({ username: user?.userName });
  }, []);

  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;

    const fetchCriticalData = async () => {
      try {
        const criticalResults = await Promise.allSettled([
          getRecentlyViewed(),
          getFavourites(),
          getStructuredConfiguration(),
          getTanks(),
          getPartners(),
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
        getCoralListing,
        getPolls,
        getFeaturedArticles,
        getTaskPreferences,
        getRecentlyAdded,
        getElements,
        getTrendingCoral,
        getArticleMenu,
      } = deferredHooks.current;

      await Promise.allSettled([
        getLiveStockListing({ filterQuery: "?page=1" }),
        getCoralListing({ filterQuery: "?page=1" }),
        getPolls(),
        getFeaturedArticles(),
        getTaskPreferences(),
        getRecentlyAdded(),
        getElements(),
        getTrendingLiveStock(),
        getTrendingCoral(),
        getArticleMenu(),
      ]);
    };

    fetchCriticalData();
  }, [getTanks, getStructuredConfiguration]);

  if (!isCriticalDataLoaded) {
    return <DataLoading />;
  }

  BootSplash.hide();

  return <>{children}</>;
};

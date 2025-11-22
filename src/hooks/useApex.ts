import axios from "axios";
import {
  selectActiveTankId,
  selectApexFeed,
  setApexFeed,
} from "../store/slices/userConfigSlice";
import { useAppDispatch, useAppSelector } from "./useRedux";
import { useEffect } from "react";
import { XMLParser } from "fast-xml-parser";
import { setApexSyncing } from "../store/slices/apexSlice";
import apiClient from "../api/apiClient";
import * as FileSystem from "expo-file-system";
import {
  setApexInitialSyncComplete,
  setUserProfile,
} from "../store/slices/globalSlice";

export const useApexEnabled = () => {
  const apexFeed = useAppSelector(selectApexFeed);

  if (apexFeed && apexFeed.ipAddress) {
    return true;
  }
  return false;
};

export const useGetApexDataLog = () => {
  const apexFeed = useAppSelector(selectApexFeed);

  const tankId = useAppSelector(selectActiveTankId);

  const fn = async (date: string, days = 1) => {
    const response = await axios
      .get(
        `http://${apexFeed.ipAddress}/datalog.xml?sdate=${date}&days=${days}`
      )
      .catch((error) => {
        console.log("Error fetching Apex status:", error);
        return null;
      });

    const xmlString = response.data;

    const parser = new XMLParser();
    const json = parser.parse(xmlString);

    if (!json?.datalog?.record || json?.datalog?.record.length === 0) {
      console.log("No datalog records found for the given date.");
      return;
    }

    const postXmlData = await apiClient.post("tests/apex/import", {
      tankId: tankId.toString(),
      apex_xml: xmlString,
    });
    return postXmlData;
  };

  return [fn];
};

export const useGetApexStatus = () => {
  const dispatch = useAppDispatch();

  const apexFeed = useAppSelector(selectApexFeed);

  const fn = async () => {
    dispatch(setApexSyncing(true));

    const response = await axios
      .get(`http://${apexFeed.ipAddress}/status.xml`)
      .catch((error) => {
        console.log("Error fetching Apex status:", error);
        return null;
      });

    const data = response?.data;

    const parser = new XMLParser();
    const json = parser.parse(data);

    dispatch(
      setApexFeed({
        status: json?.status,
      })
    );

    dispatch(setApexSyncing(false));
  };

  return [fn];
};

export const useAutoApexFeed = () => {
  const apexEnabled = useApexEnabled();

  const apexFeed = useAppSelector(selectApexFeed);

  const [getFeed] = useGetApexStatus();

  const refreshTimeRaw = apexFeed?.refreshTime;
  const refreshTime = refreshTimeRaw ? parseFloat(refreshTimeRaw) : 5;

  useEffect(() => {
    if (!refreshTime || !apexEnabled) {
      console.log("Apex auto feed not enabled");
      return;
    }

    const interval = setInterval(
      () => {
        getFeed();
      },
      refreshTime * 60 * 1000
    );
    return () => clearInterval(interval);
  }, [refreshTime, apexEnabled]);
};

export const useApexInitialSyncComplete = () => {
  const dispatch = useAppDispatch();

  const fn = async () => {
    const response = await apiClient.post("tests/apex/markSyncComplete", {});

    dispatch(setApexInitialSyncComplete({ apexInitialSyncComplete: true }));
  };

  return [fn];
};

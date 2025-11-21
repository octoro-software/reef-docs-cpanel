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

    const data = response?.data;

    const parser = new XMLParser();
    const json = parser.parse(data);

    if (!json?.datalog?.record || json?.datalog?.record.length === 0) {
      console.log("No datalog records found for the given date.");
      return;
    }

    const blob = new Blob([data], { type: "application/xml" });

    const formData = new FormData();

    formData.append("apex_xml", blob, `apex_data.xml`);

    formData.append("tankId", tankId.toString());

    const postXmlData = await apiClient.post("tests/apex/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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

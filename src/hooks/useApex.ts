import axios from "axios";
import {
  selectApexFeed,
  selectRedSeaFeed,
  setApexFeed,
} from "../store/slices/userConfigSlice";
import { useAppDispatch, useAppSelector } from "./useRedux";
import { setRedSeaData } from "../store/slices/redSeaSlice";
import { useEffect } from "react";
import { XMLParser } from "fast-xml-parser";

export const useApexEnabled = () => {
  const apexFeed = useAppSelector(selectApexFeed);

  if (apexFeed && apexFeed.ipAddress) {
    return true;
  }
  return false;
};

export const useGetApexStatus = () => {
  const dispatch = useAppDispatch();

  const apexFeed = useAppSelector(selectApexFeed);

  const fn = async () => {
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
  };

  return [fn];
};

export const useAutoApexFeed = () => {
  const apexEnabled = useApexEnabled();

  const apexFeed = useAppSelector(selectApexFeed);

  const [getFeed] = useGetApexStatus();

  const refreshTimeRaw = apexFeed?.refreshTime;
  const refreshTime = refreshTimeRaw ? parseFloat(refreshTimeRaw) : 5;

  console.log({ refreshTime, apexEnabled });

  useEffect(() => {
    if (!refreshTime || !apexEnabled) {
      console.log("Apex auto feed not enabled");
      return;
    }

    const interval = setInterval(
      () => {
        console.log("Apex auto feed interval fired");
        getFeed();
      },
      refreshTime * 60 * 1000
    );
    return () => clearInterval(interval);
  }, [refreshTime, apexEnabled]);
};

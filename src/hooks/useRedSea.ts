import axios from "axios";
import { selectRedSeaFeed } from "../store/slices/userConfigSlice";
import { useAppDispatch, useAppSelector } from "./useRedux";
import { setRedSeaData } from "../store/slices/redSeaSlice";
import { useEffect } from "react";

export const useRedSeaEnabled = () => {
  const redSeaFeed = useAppSelector(selectRedSeaFeed);

  if (redSeaFeed && redSeaFeed.ipAddress) {
    return true;
  }
  return false;
};

export const useGetRedSeaFeed = () => {
  const dispatch = useAppDispatch();

  const redSeaFeed = useAppSelector(selectRedSeaFeed);

  const fn = async () => {
    const response = await axios.get(
      `http://${redSeaFeed.ipAddress}/dashboard`
    );

    dispatch(setRedSeaData(response.data));
  };

  return [fn];
};

export const useAutoRedSeaFeed = () => {
  const redSeaEnabled = useRedSeaEnabled();

  const redSeaFeed = useAppSelector(selectRedSeaFeed);

  const [getFeed] = useGetRedSeaFeed();

  const refreshTime = redSeaFeed?.refreshTime;

  useEffect(() => {
    getFeed();
  }, []);

  useEffect(() => {
    if (!refreshTime || !redSeaEnabled) return;

    const interval = setInterval(
      () => {
        getFeed();
      },
      (refreshTime || 5) * 60 * 1000
    );
    return () => clearInterval(interval);
  }, [refreshTime, redSeaEnabled]);
};

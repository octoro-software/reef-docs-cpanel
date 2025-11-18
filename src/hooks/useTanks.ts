import apiClient from "../api/apiClient";
import { API_BASE_URL, API_TANK } from "../constants";
import {
  addTankProfile,
  removeTankProfile,
  selectActiveTank,
  selectTankProfile,
  selectTanks,
  setTankActiveTank,
  setTankProfile,
  setTanks,
  updateTankProfile,
  setTankProgressState,
  appendTankLiveStock,
} from "../store/slices/tankSlice";
import {
  setChartData,
  setCurrentStanding,
  setDosageData,
  setElementViewData,
  setLatestTest,
} from "../store/slices/testingSlice";
import { selectStoreMode } from "../store/slices/userConfigSlice";
import { useApiRequest } from "./useApiRequest";
import { useUser } from "./useAuth";
import { useAppDispatch, useAppSelector } from "./useRedux";

export const useGetTanks = () => {
  const dispatch = useAppDispatch();

  const [getTankProfile] = useGetTankProfile();

  const fn = async () => {
    const response = await apiClient
      .get(`${API_BASE_URL}/tanksv2`)
      .catch((error) => {
        console.log(error);
        return { error: true };
      });

    const firstTankId = response?.data?.data?.[0]?.id;

    if (firstTankId) {
      await getTankProfile(response?.data?.data?.[0]?.id);
    }

    if (response.error) {
      return response;
    }

    dispatch(setTanks(response?.data?.data));
  };

  return [fn];
};

export const useGetTankLiveStock = () => {
  const dispatch = useAppDispatch();

  const fn = async ({ page, tankId, type }) => {
    const response = await apiClient.post(
      `/tanks/getTankLiveStock?page=${page}`,
      {
        tankId,
        type,
      }
    );

    // response.data.data is the pagination object, response.data.data.data is the array
    const fishArray = response?.data?.data?.data?.map((item) => ({
      ...item?.live_stock,
      uuid: item?.id, // id from pivot table
    }));
    // pagination info: all fields except 'data'
    const { data: _ignore, ...pagination } = response?.data?.data || {};

    dispatch(
      appendTankLiveStock({
        tankId,
        type,
        data: fishArray,
        pagination,
      })
    );

    return response;
  };

  return useApiRequest(fn);
};

export const useGetTankLiveStockProfile = () => {
  const fn = async (id: string) => {
    const response = await apiClient.get(
      `tanks/liveStock/getTankLiveStockProfile/${id}`
    );

    return response?.data;
  };

  return useApiRequest(fn);
};

export const useUpdateTankEquipment = () => {
  const dispatch = useAppDispatch();

  const fn = async (data, tankId) => {
    const response = await apiClient.put(
      `/tanks/${tankId}/updateTankEquipment`,
      {
        equipment: data,
        tankId,
      }
    );

    const responseData = response?.data?.data;

    dispatch(updateTankProfile(responseData));

    return;
  };

  return useApiRequest(fn);
};

export const useHasTanks = () => {
  const tanks = useAppSelector(selectTanks);
  return tanks && tanks.length > 0;
};

export const useTankList = () => {
  const shopMode = useAppSelector(selectStoreMode);

  const user = useUser();

  const filterByShop = user?.isStoreOwner && shopMode;

  const tanks = useAppSelector(selectTanks);

  if (filterByShop) {
    return tanks?.filter((tank) => tank?.isStoreTank);
  } else {
    return tanks?.filter((tank) => !tank?.isStoreTank);
  }
};

export const useUpdateTankTestingConfig = () => {
  const dispatch = useAppDispatch();

  const fn = async (data, tankId) => {
    const response = await apiClient.put(
      `/tanks/${tankId}/updateTestingConfig`,
      data
    );

    dispatch(updateTankProfile(response?.data?.data));

    return;
  };

  return useApiRequest(fn);
};

export const useAddToTank = (liveStockId) => {
  const fn = async (tankId: string) => {
    const response = await apiClient.post("/tanks/addLiveStock", {
      tankId,
      liveStockId,
    });

    if (response?.status === 200) {
    }
  };

  return [fn];
};

export const useRemoveFromTank = () => {
  const fn = async (tankId: string, liveStockId: string) => {
    const response = await apiClient.post("/tanks/removeLiveStock", {
      tankId,
      id: liveStockId,
    });

    return response;
  };

  return useApiRequest(fn);
};

export const useActiveTankId = () => useAppSelector(selectActiveTank);

export const useGetActiveTank = () => {
  const activeTankId = useActiveTankId();

  const tankProfile = useAppSelector(selectTankProfile(activeTankId));

  return tankProfile;
};

export const useGetTankProfile = () => {
  const dispatch = useAppDispatch();

  const fn = async (id: string) => {
    const response = await apiClient.get(`${"tanksv2"}/${id}`);

    if (response?.status === 200) {
      dispatch(setTankProfile(response?.data?.data));

      dispatch(setTankActiveTank(response?.data?.data?.id));

      dispatch(
        setElementViewData({
          dosingData: [],
          testingData: [],
        })
      );
      dispatch(setChartData([]));

      dispatch(setDosageData([]));

      dispatch(setCurrentStanding({}));
      dispatch(
        setLatestTest({
          data: [],
          selectedMonth: null,
          monthsWithTests: [],
        })
      );
    }
  };

  return useApiRequest(fn);
};

export const useCreateTank = () => {
  const dispatch = useAppDispatch();

  const fn = async (data) => {
    const response = await apiClient.post(API_TANK, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    if (response?.status === 200) {
      dispatch(addTankProfile(response?.data?.data));
    }

    return response;
  };

  return useApiRequest(fn);
};

export const useUpdateTank = () => {
  const dispatch = useAppDispatch();

  const fn = async (id, data) => {
    const response = await apiClient.put(`${API_TANK}/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    if (response?.status === 200) {
      dispatch(updateTankProfile(response?.data?.data));
    }

    return response;
  };

  return useApiRequest(fn);
};

export const useRemoveTank = () => {
  const dispatch = useAppDispatch();

  const fn = async (id) => {
    const response = await apiClient.delete(`${API_TANK}/${id}`);

    if (response?.status === 204) {
      dispatch(removeTankProfile(id));
    }

    return response;
  };

  return useApiRequest(fn);
};

export const useAddTankProgress = () => {
  const dispatch = useAppDispatch();
  const tankProgress = useAppSelector((state) => state.tanks.tankProgress);
  const fn = async (data) => {
    const response = await apiClient.post(`tankProgress`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response?.data?.data) {
      const newRecord = response.data.data;
      dispatch(
        setTankProgressState({
          data: [newRecord, ...(tankProgress?.data || [])],
        })
      );
    }

    return response?.data;
  };

  return useApiRequest(fn);
};

export const useUpdateTankParMeasurements = () => {
  const dispatch = useAppDispatch();

  const fn = async (data) => {
    const response = await apiClient.post(
      "/tanks/par/updateTankParMeasurements",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch(
      updateTankProfile({
        parMeasurements: response?.data?.data?.parMeasurements,
        parReferenceImage: response?.data?.data?.parReferenceImage,
        tankId: response?.data?.data?.id,
      })
    );
  };

  return useApiRequest(fn);
};

export const useUpdateTankProgress = () => {
  const dispatch = useAppDispatch();
  const tankProgress = useAppSelector((state) => state.tanks.tankProgress);

  const fn = async (data, id) => {
    const response = await apiClient.put(`tankProgress/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response?.data?.data) {
      const updated = response.data.data;
      dispatch(
        setTankProgressState({
          data: tankProgress.data.map((item) =>
            item.id === updated.id ? { ...item, ...updated } : item
          ),
        })
      );
    }
    return response?.data;
  };
  return useApiRequest(fn);
};

export const useDeleteTankProgress = () => {
  const dispatch = useAppDispatch();
  const tankProgress = useAppSelector((state) => state.tanks.tankProgress);
  const fn = async (id) => {
    const response = await apiClient.delete(`tankProgress/${id}`);
    if (response?.data !== undefined) {
      dispatch(
        setTankProgressState({
          data: tankProgress.data.filter((item) => item.id !== id),
        })
      );
    }
    return response?.data;
  };
  return useApiRequest(fn);
};

export const useGetTankProgress = () => {
  // Accept tankId, page, and sortBy for pagination and sorting
  const fn = async (tankId, page = 1, sortBy = "asc") => {
    const response = await apiClient.get(
      `tankProgress?tankId=${tankId}&page=${page}&sortDataBy=${sortBy}`
    );

    return response?.data;
  };
  return useApiRequest(fn);
};

export const useGetFreshTankProgress = () => {
  const dispatch = useAppDispatch();
  // Accept tankId, page, and sortBy for pagination and sorting
  const fn = async (tankId, page = 1, sortBy = "asc") => {
    const response = await apiClient.get(
      `tankProgress?tankId=${tankId}&page=${page}&sortDataBy=${sortBy}`
    );

    const data = response?.data?.data?.data;

    dispatch(
      setTankProgressState({
        data: data,
        hasMore: data.length === 5,
        loading: false,
        initialLoading: false,
        page: 1,
      })
    );
  };
  return useApiRequest(fn);
};

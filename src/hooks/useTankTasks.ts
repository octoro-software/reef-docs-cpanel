import apiClient from "../api/apiClient";
import {
  setTankTaskPreferences,
  setTankTasks,
  updateSingleTankTask,
} from "../store/slices/tankSlice";
import { useApiRequest } from "./useApiRequest";
import { useAppDispatch } from "./useRedux";

export const useTasksForDate = () => {
  const dispatch = useAppDispatch();

  const fn = async (date, tankId, viewMode = "day") => {
    const response = await apiClient
      .get(
        `/tasks?date=${new Date(
          date
        ).toISOString()}&tankId=${tankId}&viewMode=${viewMode}`
      )
      .catch((error) => {
        console.log(error);
        return { error: true };
      });

    dispatch(setTankTasks({ data: response?.data?.data, tankId }));

    return response;
  };

  return useApiRequest(fn);
};

export const useGetTaskTemplates = () => {
  const fn = async (tankId) => {
    const response = await apiClient
      .get(`/tasks/getTaskTemplates?tankId=${tankId}`)
      .catch((error) => {
        console.log(error);
        return { error: true };
      });

    return response;
  };

  return useApiRequest(fn);
};

export const useCreateTask = () => {
  const fn = async (data) => {
    const response = await apiClient.post(`/tasks`, data);
    return response?.data?.data;
  };

  return useApiRequest(fn);
};

export const useUpdateTask = () => {
  const fn = async (data) => {
    const response = await apiClient.put(`/tasks/${data?.id}`, data);

    return response?.data?.data;
  };

  return useApiRequest(fn);
};

export const useGetTaskById = () => {
  const fn = async (id) => {
    const response = await apiClient.get(`/tasks/${id}`).catch((error) => {
      console.log(error);
      return { error: true };
    });

    return response?.data?.data;
  };

  return useApiRequest(fn);
};

export const useActionTask = () => {
  const dispatch = useAppDispatch();

  const fn = async (data) => {
    const response = await apiClient
      .post(`/tasks/actionTask`, data)
      .catch((error) => {
        console.log(error);
        return { error: true };
      });

    dispatch(updateSingleTankTask(data));

    return response;
  };

  return useApiRequest(fn);
};

export const useSetTaskPreferences = () => {
  const dispatch = useAppDispatch();

  const fn = async (data) => {
    const response = await apiClient
      .post(`/tasks/setUserPreferences`, data)
      .catch((error) => {
        console.log(error);
        return { error: true };
      });

    const responsePayload = response?.data?.data;

    if (responsePayload) {
      dispatch(setTankTaskPreferences(responsePayload));
    }

    return response;
  };

  return useApiRequest(fn);
};

export const useGetTaskPreferences = () => {
  const dispatch = useAppDispatch();

  const fn = async () => {
    const response = await apiClient
      .get(`/tasks/getUserTaskPreferences`)
      .catch((error) => {
        console.log(error);
        return { error: true };
      });

    dispatch(setTankTaskPreferences(response?.data?.data || {}));

    return response;
  };

  return useApiRequest(fn);
};

export const useRemoveTask = () => {
  const fn = async (id) => {
    const response = await apiClient.delete(`/tasks/${id}`).catch((error) => {
      console.log(error);
      return { error: true };
    });

    return response;
  };

  return useApiRequest(fn);
};

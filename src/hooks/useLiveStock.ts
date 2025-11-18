import apiClient from "../api/apiClient";

import { API_LIVESTOCK } from "../constants";
import {
  setRecentlyAdded,
  setRecentlyContributed,
  setTrending,
  setTrendingCoral,
} from "../store/slices/globalSlice";
import {
  setLiveStockListing,
  setLiveStockProfile,
  setLiveStockProfileUserImages,
  setLiveStockProfileUserVideos,
  setLiveStockUserExperiences,
  setLiveStockUserPastVotes,
} from "../store/slices/liveStockSlice";

import { LiveStockListingApiResponse } from "../types/api/liveStock.types";
import { LiveStockProfileApiResponse } from "../types/api/liveStockProfile.types";
import { useApiRequest } from "./useApiRequest";
import { useAppDispatch } from "./useRedux";
import { useBackgroundVideoUpload } from "./useUploader";

export const useLiveStockListing = () => {
  const dispatch = useAppDispatch();

  const fn = async ({ filterQuery }) => {
    const queryString = filterQuery.startsWith("?")
      ? filterQuery
      : `?${filterQuery}`;

    const response = await apiClient.get(`${API_LIVESTOCK}${queryString}`);

    const data: LiveStockListingApiResponse = response?.data;

    dispatch(setLiveStockListing(data));

    return data;
  };

  return useApiRequest(fn);
};

export const useSubmitVideoContribution = () => {
  const [backgroundVideoUpload] = useBackgroundVideoUpload();

  const fn = async (data, videos) => {
    const response = await apiClient
      .post("/liveStock/videoContribution", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-videos": videos?.length,
        },
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      });

    const videoPayload = response?.data?.data?.videoPayload;

    if (videoPayload?.length > 0) {
      videos?.map((video, key) =>
        backgroundVideoUpload(video, videoPayload[key], "liveStockContribution")
      );
    }
  };

  return useApiRequest(fn);
};

export const useGetLiveStockProfile = () => {
  const dispatch = useAppDispatch();
  const fn = async (id: string) => {
    const response = await apiClient.get(
      `${API_LIVESTOCK}/${id?.replace(":", "")}`
    );

    const data: LiveStockProfileApiResponse = response?.data;

    dispatch(setLiveStockProfile(response?.data?.data));

    return data;
  };

  return [fn];
};

export const useGetLiveStockImageContributions = () => {
  const dispatch = useAppDispatch();

  const fn = async (id: string) => {
    const response = await apiClient.get(
      `${API_LIVESTOCK}/getUserImageContributions/${id?.replace(":", "")}`
    );

    const data = response?.data?.data;

    dispatch(setLiveStockProfileUserImages({ id, data }));

    return data;
  };

  return [fn];
};

export const useGetVideoContributions = () => {
  const dispatch = useAppDispatch();

  const fn = async (id: string) => {
    const response = await apiClient.get(
      `${API_LIVESTOCK}/videoContributions/${id?.replace(":", "")}`
    );

    const data = response?.data?.data;

    dispatch(setLiveStockProfileUserVideos({ id, data }));

    return data;
  };

  return [fn];
};

export const useGetLiveStockPostResourceSummary = () => {
  const fn = async (id: string) => {
    const response = await apiClient.get(
      `${API_LIVESTOCK}/getLiveStockTaggedResourceSummary/${id}`
    );

    return response?.data?.data;
  };

  return useApiRequest(fn);
};

export const useGetRecentContributions = () => {
  const dispatch = useAppDispatch();

  const fn = async () => {
    const response = await apiClient.get(
      `${API_LIVESTOCK}/getRecentContributions`
    );

    const data = response?.data?.data;

    const formattedData = data?.map((d) => ({
      images: [
        {
          url: d?.image,
        },
      ],
      name: d?.liveStockName,
      id: d?.liveStockId,
      scientific_name: `@${d?.user}`,
      plant_coral: d?.plant_coral,
    }));

    dispatch(setRecentlyContributed(formattedData));

    return data;
  };

  return [fn];
};

export const usePostLiveStockExperience = () => {
  const fn = async (data) => {
    await apiClient.post(`/liveStock/addUserExperience`, data);
  };

  return useApiRequest(fn);
};

export const useGetLiveStockExperiencePosts = () => {
  const dispatch = useAppDispatch();

  const fn = async (liveStockId) => {
    const response = await apiClient.get(
      `/liveStock/getUserExperience?liveStockId=${liveStockId}`
    );

    dispatch(
      setLiveStockUserExperiences({
        id: liveStockId,
        data: response?.data,
      })
    );
  };

  return [fn];
};

export const useGetLiveStockPastVotes = () => {
  const dispatch = useAppDispatch();

  const fn = async (liveStockId) => {
    const response = await apiClient.get(
      `/liveStock/hasUserVotedOnLiveStockProfile/${liveStockId}`
    );

    dispatch(
      setLiveStockUserPastVotes({
        id: liveStockId,
        data: response?.data?.data,
      })
    );
  };

  return [fn];
};

export const useLiveStockProfileRequest = () => {
  const fn = async (data) => {
    await apiClient.post(`/liveStock/createProfileRequest`, data);
  };

  return useApiRequest(fn);
};

export const useCoralProfileRequest = () => {
  const fn = async (data) => {
    await apiClient.post(`/liveStock/createCoralProfileRequest`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return useApiRequest(fn);
};

export const useLiveStockVote = () => {
  const fn = async (data) => {
    await apiClient.post(`/liveStock/voteOnData`, data);
  };

  return useApiRequest(fn);
};

export const useLiveStockVotesForDataDefinition = () => {
  const fn = async (id, definition) => {
    return apiClient.get(`/liveStock/getVotesForLiveStock/${id}/${definition}`);
  };

  return useApiRequest(fn);
};

export const useLiveStockPostPhotos = () => {
  const fn = async (data) => {
    await apiClient.post(`/liveStock/userImageContribution`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return useApiRequest(fn);
};

export const useGetLiveStockRecentlyAdded = () => {
  const dispatch = useAppDispatch();

  const fn = async () => {
    const response = await apiClient.get("/liveStock/latestReleases");

    const data = response?.data?.data;

    dispatch(setRecentlyAdded(data));

    return data;
  };

  return [fn];
};

export const useGetLiveStockTrending = () => {
  const dispatch = useAppDispatch();

  const fn = async () => {
    const response = await apiClient.get("/liveStock/topTrending");

    const data = response?.data?.data;

    dispatch(setTrending(data));

    return data;
  };

  return [fn];
};
export const useGetLiveStockCoralTrending = () => {
  const dispatch = useAppDispatch();

  const fn = async () => {
    const response = await apiClient.get("/liveStock/topTrendingCoral");

    const data = response?.data?.data;

    dispatch(setTrendingCoral(data));

    return data;
  };

  return [fn];
};

export const useLiveStockSuggestEdits = () => {
  const fn = async (data) => {
    await apiClient.post(`/liveStock/suggestEdits`, data);
  };

  return useApiRequest(fn);
};

export const useLiveStockTaggedPosts = () => {
  const fn = async (id) => {
    const response = await apiClient.get(
      `/liveStock/getLiveStockTaggedPosts/${id}`
    );

    return response?.data;
  };

  return useApiRequest(fn);
};

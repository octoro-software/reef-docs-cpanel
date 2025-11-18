import { shallowEqual } from "react-redux";

import apiClient from "../api/apiClient";
import { useAppDispatch, useAppSelector } from "./useRedux";
import {
  removePostById,
  setFullScreenPostResults,
  setPostResults,
  updatePostData,
} from "../store/slices/postSlice";
import { useApiRequest } from "./useApiRequest";
import { useBackgroundVideoUpload } from "./useUploader";
import { useQueryParams } from "./useQueryParams";
import { POST_CLASSIFICATION_GENERAL_HELP } from "../constants";
import {
  selectSocialFullScreen,
  setLatestUrgentPosts,
  setPostAcceptedTerms,
} from "../store/slices/globalSlice";
import { selectPostTags } from "../store/slices/userConfigSlice";

export const useCreatePost = () => {
  const [backgroundVideoUpload] = useBackgroundVideoUpload();

  const fn = async (data, videos, urgent = false) => {
    const response = await apiClient
      .post("/posts", data, {
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
        backgroundVideoUpload(video, videoPayload[key])
      );
    }
  };

  return useApiRequest(fn);
};

export const useGetPostSharedTank = () => {
  const fn = async (postId) => {
    const response = await apiClient.get(`/posts/${postId}/sharedTank`);

    return response?.data;
  };

  return useApiRequest(fn);
};

export const useGetPostSharedParameters = () => {
  const fn = async (postId) => {
    const response = await apiClient.get(`/posts/${postId}/sharedParameters`);

    return response?.data;
  };

  return useApiRequest(fn);
};

export const useGetLatestUrgentPosts = () => {
  const dispatch = useAppDispatch();

  const fn = async () => {
    const response = await apiClient.get(`/posts/latestUrgentPosts`);

    dispatch(setLatestUrgentPosts(response?.data?.data?.data));

    return response?.data;
  };

  return useApiRequest(fn);
};

export const useUpdatePost = () => {
  const [backgroundVideoUpload] = useBackgroundVideoUpload();

  const fn = async (data, videos, postId) => {
    const response = await apiClient.put(`/posts/${postId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-videos": videos?.length,
      },
    });

    const videoPayload = response?.data?.data?.videoPayload;

    if (videoPayload?.length > 0) {
      videos?.map((video, key) =>
        backgroundVideoUpload(video, videoPayload[key])
      );
    }
  };

  return useApiRequest(fn);
};

export const useGetPosts = (classification, type) => {
  const dispatch = useAppDispatch();

  const { getParam } = useQueryParams();

  const postId = getParam("postId");

  const liveStockId = getParam("liveStockId");

  const tags = useAppSelector(selectPostTags, shallowEqual);

  const fn = async ({ nextPage = 1, noLiveStockId = false }) => {
    const response = await apiClient.get(
      `/posts?page=${
        nextPage ?? 1
      }&type=${type}&classification=${classification}${
        postId ? `&postId=${postId}` : ""
      }${liveStockId ? (!noLiveStockId ? `&liveStockId=${liveStockId}` : "") : ""}${tags ? `&tags=${tags}` : ""}`
    );

    dispatch(setPostResults({ ...response.data?.data, classification, type }));
  };

  return useApiRequest(fn);
};

export const useGetVideoPosts = (
  classification,
  type,
  isFullScreenVideo = false
) => {
  const dispatch = useAppDispatch();

  const { getParam } = useQueryParams();

  // When we go full screen we dont want to use post id as the start from post takes over. If we include this we get a duplicate post
  const postId = isFullScreenVideo ? null : getParam("postId");

  const liveStockId = getParam("liveStockId");

  const socialFullScreenData = useAppSelector(selectSocialFullScreen);

  const fn = async ({ nextPage = 1, startFromPost }) => {
    const response = await apiClient.get(
      `/posts?limit=4&page=${
        nextPage ?? 1
      }&type=${type}&classification=${classification}${
        postId ? `&postId=${postId}` : ""
      }${liveStockId ? `&liveStockId=${liveStockId}` : ""}${
        startFromPost ? `&startFromPost=${startFromPost}` : ""
      }`
    );

    const payload = response?.data?.data;
    payload.data.unshift(socialFullScreenData?.data);

    dispatch(setFullScreenPostResults({ ...payload, classification, type }));
  };

  return useApiRequest(fn);
};

export const useGetPost = () => {
  const fn = async (postId) => {
    const response = await apiClient.get(`/posts/getPost/${postId}`);

    return response.data?.data;
  };

  return useApiRequest(fn);
};

export const useReportPost = () => {
  const fn = async (postId, reason = "") => {
    const response = await apiClient.post(`/posts/reportPost`, {
      postId,
      reason,
    });
    return response.data?.data;
  };

  return useApiRequest(fn);
};

export const useDeletePost = () => {
  const dispatch = useAppDispatch();

  const fn = async (postId, type) => {
    const response = await apiClient.delete(`/posts/${postId}`);

    dispatch(
      removePostById({
        type,
        postId,
        classification: POST_CLASSIFICATION_GENERAL_HELP,
      })
    );

    return response.data?.data;
  };

  return useApiRequest(fn);
};

export const useAcceptPostTerms = () => {
  const dispatch = useAppDispatch();

  const fn = async () => {
    try {
      const response = await apiClient.post(
        `/posts/user/acceptTermsAndConditions`,
        {}
      );

      dispatch(setPostAcceptedTerms(true));
    } catch (error) {
      return { error: true };
    }
  };

  return useApiRequest(fn);
};

export const useAddPostComment = () => {
  const fn = async (formData) => {
    const response = await apiClient.post(`/posts/response`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
    return response.data?.data;
  };

  return useApiRequest(fn);
};

export const useUpdatePostComment = () => {
  const fn = async (formData) => {
    const response = await apiClient.put(`/posts/response`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
    return response.data?.data;
  };

  return useApiRequest(fn);
};

export const useLikePost = () => {
  const dispatch = useAppDispatch();

  const fn = async (postId, type, hasLiked, postLikes, fullScreen) => {
    const response = await apiClient.post(`/posts/likePost/${postId}`, {});

    const payload = hasLiked
      ? {
          likedByUser: false,
          postLikes: postLikes - 1,
        }
      : {
          likedByUser: true,
          postLikes: postLikes + 1,
        };

    dispatch(
      updatePostData({
        postId,
        data: payload,
        classification: POST_CLASSIFICATION_GENERAL_HELP,
        type,
      })
    );
    if (fullScreen)
      dispatch(
        updatePostData({
          postId,
          data: payload,
          classification: POST_CLASSIFICATION_GENERAL_HELP,
          type: "full-screen-videos",
        })
      );

    return response.data?.data;
  };

  return useApiRequest(fn);
};

export const useRejectPost = () => {
  const dispatch = useAppDispatch();

  const fn = async (postId, silent) => {
    const response = await apiClient.post(`/posts/rejectPost/${postId}`, {
      silent,
    });

    dispatch(
      removePostById({
        type: "pending-posts",
        postId,
        classification: POST_CLASSIFICATION_GENERAL_HELP,
      })
    );
  };

  return useApiRequest(fn);
};

export const useApprovePost = () => {
  const dispatch = useAppDispatch();

  const fn = async (postId, isSensitive) => {
    const response = await apiClient.post(`/posts/approvePost/${postId}`, {
      isSensitive,
    });

    dispatch(
      removePostById({
        type: "pending-posts",
        postId,
        classification: POST_CLASSIFICATION_GENERAL_HELP,
      })
    );
  };

  return useApiRequest(fn);
};

export const useSavePost = () => {
  const dispatch = useAppDispatch();

  const fn = async (
    postId,
    hasSavedPost,
    type,
    classification = POST_CLASSIFICATION_GENERAL_HELP
  ) => {
    const response = await apiClient.post(`/posts/savePost`, { postId });

    dispatch(
      updatePostData({
        postId,
        data: { hasSavedPost: !hasSavedPost },
        classification,
        type,
      })
    );

    return response.data?.data;
  };

  return useApiRequest(fn);
};

export const useGetPostComments = (postId) => {
  const fn = async () => {
    const response = await apiClient.get(`/posts/${postId}/responses`);
    return response.data?.data;
  };

  return useApiRequest(fn);
};

export const useDeleteComment = () => {
  const fn = async (commentId) => {
    const response = await apiClient.delete(
      `posts/comments/${commentId}/deletePostComment`
    );
    return response.data?.data;
  };

  return useApiRequest(fn);
};
export const useReportComment = () => {
  const fn = async (commentId) => {
    const response = await apiClient.get(
      `posts/comments/${commentId}/reportPostComment`
    );
    return response.data?.data;
  };

  return useApiRequest(fn);
};

export const usePostCommentVote = (postId) => {
  const fn = async (vote, responseId) => {
    const response = await apiClient.post(`/posts/response/vote`, {
      vote,
      responseId,
      postId,
    });
    return response.data?.data;
  };

  return useApiRequest(fn);
};

export const usePostAddTag = (postId) => {
  const fn = async (tagId) => {
    const response = await apiClient.post(`/posts/tag`, { tagId, postId });
    return response.data?.data;
  };

  return useApiRequest(fn);
};

export const useGetPostTagResults = () => {
  const fn = async (postId) => {
    const response = await apiClient.get(`/posts/${postId}/tags`);
    return response.data?.data;
  };

  return useApiRequest(fn);
};

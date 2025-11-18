import { createSlice } from "@reduxjs/toolkit";
import {
  POST_CLASSIFICATION_CORAL_HELP,
  POST_CLASSIFICATION_DISEASE_IDENTIFICATION,
  POST_CLASSIFICATION_FRIEND_OR_FOE,
  POST_CLASSIFICATION_GENERAL_HELP,
} from "../../constants/global";

const initialState = {
  [POST_CLASSIFICATION_DISEASE_IDENTIFICATION]: {
    social: {
      posts: [],
      postPagination: {},
    },
    "my-posts": {
      posts: [],
      postPagination: {},
    },
    urgent: {
      posts: [],
      postPagination: {},
    },
    "saved-posts": {
      posts: [],
      postPagination: {},
    },
  },
  [POST_CLASSIFICATION_CORAL_HELP]: {
    social: {
      posts: [],
      postPagination: {},
    },
    "my-posts": {
      posts: [],
      postPagination: {},
    },
    urgent: {
      posts: [],
      postPagination: {},
    },
    "saved-posts": {
      posts: [],
      postPagination: {},
    },
  },
  [POST_CLASSIFICATION_FRIEND_OR_FOE]: {
    social: {
      posts: [],
      postPagination: {},
    },
    "my-posts": {
      posts: [],
      postPagination: {},
    },
    urgent: {
      posts: [],
      postPagination: {},
    },
    "saved-posts": {
      posts: [],
      postPagination: {},
    },
  },
  [POST_CLASSIFICATION_GENERAL_HELP]: {
    social: {
      posts: [],
      postPagination: {},
    },
    "my-posts": {
      posts: [],
      postPagination: {},
    },
    urgent: {
      posts: [],
      postPagination: {},
    },
    "saved-posts": {
      posts: [],
      postPagination: {},
    },
    "full-screen-videos": {
      posts: [],
      postPagination: {},
    },
    "pending-posts": {
      posts: [],
      postPagination: {},
    },
  },
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPostResults: (state, action) => {
      const { data, meta, classification, type } = action.payload;

      // If it's the first page, reset the posts array
      if (meta.current_page === 1) {
        state[classification][type].posts = data;
      } else {
        // Append new posts only if they are not duplicates
        const existingIds = new Set(
          state[classification][type].posts.map((post) => post.id)
        );
        const newPosts = data.filter((post) => !existingIds.has(post.id));

        state[classification][type].posts = [
          ...state[classification][type].posts,
          ...newPosts,
        ];
      }

      // Store pagination metadata
      state[classification][type].postPagination = meta;
    },
    setFullScreenPostResults: (state, action) => {
      const { data, meta, classification, type } = action.payload;

      // If it's the first page, reset the posts array
      if (meta?.current_page === 1) {
        state[classification][type].posts = data;
      } else {
        // Append new posts only if they are not duplicates
        const existingIds = new Set(
          state[classification][type].posts.map((post) => post.id)
        );
        const newPosts = data?.filter((post) => !existingIds.has(post.id));

        state[classification][type].posts = [
          ...state[classification][type].posts,
          ...newPosts,
        ];
      }

      // Store pagination metadata
      state[classification][type].postPagination = meta;
    },

    clearFullScreenPosts: (state, action) => {
      const { classification, type } = action.payload;
      state[classification][type].posts = [];
      state[classification][type].postPagination = {};
    },

    updatePostData: (state, action) => {
      const { postId, data, classification, type } = action.payload;

      // If a classification is supplied we look only there;
      // otherwise search every bucket.
      const buckets = classification ? [classification] : Object.keys(state);

      buckets.forEach((cls) => {
        const idx = state[cls][type].posts.findIndex((p) => p.id === postId);
        if (idx !== -1) {
          state[cls][type].posts[idx] = {
            ...state[cls][type].posts[idx],
            ...data,
          };
        }
      });
    },
    clearAllPosts: () => initialState,

    removePostById: (state, action) => {
      const { postId, classification, type } = action.payload;

      if (state[classification] && state[classification][type]) {
        state[classification][type].posts = state[classification][
          type
        ].posts.filter((post) => post.id !== postId);
      }
    },
  },
});

export const {
  setPostResults,
  updatePostData,
  clearAllPosts,
  removePostById,
  setFullScreenPostResults,
  clearFullScreenPosts,
} = postSlice.actions;

export default postSlice.reducer;

export const selectDiseaseIdentificationResults =
  (classification, type) => (state) =>
    state.posts[classification][type]?.posts;

export const selectDiseaseIdentificationPagination =
  (classification, type) => (state) =>
    state.posts[classification][type]?.postPagination;

export const selectPostById = (classification, type, postId) => (state) =>
  state.posts[classification][type]?.posts.find((post) => post.id === postId);

export const selectPosts = (classification, type) => (state) =>
  state.posts[classification][type];

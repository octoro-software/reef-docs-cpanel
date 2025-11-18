import { createSlice } from "@reduxjs/toolkit";
import { ALL_POST_TAG_ID } from "../../constants";

const initialState = {
  testing: {
    activeView: "standard", // deprecated
    activeTestType: "all", // deprecated
    lastIcpProvider: null, // deprecated
    testingView: "Current Standing",
    currentStandingFilter: "homeTest",
  },
  tank: {
    activeTank: null,
  },
  shopMode: false,
  searchHistory: [],
  taskViewMode: "day",
  audience: "reef-docs",
  lastSocialPath: null,
  videoMute: false,
  videoFullScreenMute: false,
  
  postTags: [],
};

const searchHistoryLimit = 4;

const userConfigSlice = createSlice({
  name: "userConfig",
  initialState,
  reducers: {
    setAudience: (state, action) => {
      state.audience = action.payload;
    },
    setTestingView: (state, action) => {
      state.testing.testingView = action.payload;
    },
    setCurrentStandingFilter: (state, action) => {
      state.testing.currentStandingFilter = action.payload;
    },
    setLastSocialPath: (state, action) => {
      state.lastSocialPath = action.payload;
    },
    setStoreMode: (state, action) => {
      state.shopMode = action.payload;
    },
    setTestingActiveView: (state, action) => {
      state.testing.activeView = action.payload;
    },
    setTestingActiveTestType: (state, action) => {
      state.testing.activeTestType = action.payload;
    },
    setTestingLastIcpProvider: (state, action) => {
      state.testing.lastIcpProvider = action.payload;
    },

    setTaskViewMode: (state, action) => {
      state.taskViewMode = action.payload;
    },

    setVideoMute: (state, action) => {
      state.videoMute = action.payload;
    },
        setVideoFullScreenMute: (state, action) => {
      state.videoFullScreenMute = action.payload;
    },

    setPostTags: (state, action) => {
      // action.payload is just a single string tag id

      if (action.payload === ALL_POST_TAG_ID) {
        state.postTags = [];
        return;
      }

      if (state.postTags?.includes(action.payload)) {
        state.postTags = state.postTags.filter((tag) => tag !== action.payload);
        return;
      }

      state.postTags = state.postTags
        ? [...state.postTags, action.payload]
        : [action.payload];
    },

    setSearchHistory: (state, action) => {
      const newSearch = action.payload;
      // Remove if already exists to avoid duplicates
      state.searchHistory = state.searchHistory?.filter(
        (item) => item !== newSearch
      );

      // Add new search term at the beginning
      state.searchHistory?.unshift(newSearch);

      // Trim the array if it exceeds the limit
      if (state.searchHistory?.length > searchHistoryLimit) {
        state.searchHistory.pop();
      }
    },
  },
});

export const {
  setTestingActiveView,
  setTestingActiveTestType,
  setTestingLastIcpProvider,
  setSearchHistory,
  setTaskViewMode,
  setAudience,
  setStoreMode,
  setLastSocialPath,
  setVideoMute,
  setVideoFullScreenMute,
  setCurrentStandingFilter,
  setTestingView,
  setPostTags,
} = userConfigSlice.actions;

export default userConfigSlice.reducer;

export const selectTestingUserConfig = (state) => state.userConfig.testing;

export const selectSearchHistory = (state) => state.userConfig.searchHistory;

export const selectTaskViewMode = (state) => state.userConfig.taskViewMode;

export const selectAudience = (state) => state.userConfig.audience;

export const selectLastSocialPath = (state) => state.userConfig.lastSocialPath;

export const selectStoreMode = (state) => state.userConfig.shopMode;

export const selectVideoMute = (state) => state.userConfig.videoMute;

export const selectSocialFullScreenVideoMute = (state) =>
  state.userConfig.videoFullScreenMute;

export const selectCurrentStandingFilter = (state) =>
  state.userConfig.testing.currentStandingFilter;

export const selectTestingView = (state) =>
  state.userConfig.testing.testingView;

export const selectPostTags = (state) => state.userConfig.postTags;

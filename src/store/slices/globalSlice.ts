import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  overlay: false,
  user: {},
  searchResults: {},
  searchActive: false,
  searchTerm: "",
  notificationMenuActive: false,
  postUploadProgress: 0,
  recentlyViewed: [],
  recentlyAdded: [],
  recentlyContributed: [],
  trending: [],
  trendingCoral: [],
  leaderboard: [],
  screenLoader: false,
  wheelMenuOpen: false,
  contextSwitchLoading: false,
  confirmWheelIndicator: false,
  notifications: {
    unreadCount: 0,
    notifications: {},
  },
  storeSignup: {
    shouldInit: false,
    storeId: "",
  },
  scrollDirection: "",
  socialFullScreen: {
    active: false,
    data: {},
  },
  urgentPostAvailable: false,
  postAcceptedTerms: false,
  partners: [],
  latestUrgentPosts: [],
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    showOverlay: (state, action) => {
      state.overlay = true;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    clearNotificationCount: (state) => {
      state.notifications = {
        ...state.notifications,
        unreadCount: 0,
      };
    },

    setUrgentPostAvailable: (state, action) => {
      state.urgentPostAvailable = action.payload;
    },

    setConfirmWheelIndicator: (state, action) => {
      state.confirmWheelIndicator = action.payload;
    },

    setRecentlyContributed: (state, action) => {
      state.recentlyContributed = action.payload;
    },
    setLatestUrgentPosts: (state, action) => {
      state.latestUrgentPosts = action.payload;
    },
    setSocialFullScreen: (state, action) => {
      state.socialFullScreen = action.payload;
    },



    setScrollDirection: (state, action) => {
      state.scrollDirection = action.payload;
    },

    appendNotifications: (state, action) => {
      const { data, next_page_url } = action.payload;

      const existingData = state.notifications?.notifications?.data || [];

      state.notifications = {
        ...state.notifications,
        notifications: {
          ...state.notifications.notifications,
          data: [...existingData, ...data?.notifications?.data],
          next_page_url: next_page_url,
        },
      };
    },
    setScreenLoader: (state, action) => {
      state.screenLoader = action.payload;
    },
    setWheelMenuOpen: (state, action) => {
      state.wheelMenuOpen = action.payload;
    },
    hideOverlay: (state, action) => {
      state.overlay = false;
    },
    setNotificationMenuActive: (state, action) => {
      state.notificationMenuActive = action.payload;
    },
    setUserProfile: (state, action) => {
      state.user = action.payload;
      state.urgentPostAvailable = action.payload?.urgentPostAvailable || false;
      state.postAcceptedTerms = action.payload?.postTermsAccepted || false;
    },
    setUserLinkedProfile: (state, action) => {
      state.user = {
        ...state.user,
        linkedStores: [...(state.user?.linkedStores || []), action.payload],
      };
    },

    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setSearchActive: (state, action) => {
      state.searchActive = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setRecentlyViewed: (state, action) => {
      state.recentlyViewed = action.payload;
    },
    setGameLeaderboard: (state, action) => {
      state.leaderboard = action.payload;
    },
    setContextSwitchLoading: (state, action) => {
      state.contextSwitchLoading = action.payload;
    },
    setPostUploadProgress: (state, action) => {
      // Ensure postUploadProgress is an array
      state.postUploadProgress = action.payload;
    },

    clearPostUploadProgress: (state) => {
      state.postUploadProgress = 0;
    },

    setStoreSignup: (state, action) => {
      state.storeSignup = {
        shouldInit: true,
        storeId: action.payload,
      };
    },
    clearStoreSignup: (state, action) => {
      state.storeSignup = {
        shouldInit: false,
        storeId: "",
      };
    },

    setPostAcceptedTerms: (state, action) => {
      state.postAcceptedTerms = action.payload;
    },

    setRecentlyAdded: (state, action) => {
      state.recentlyAdded = action.payload;
    },
    setTrending: (state, action) => {
      state.trending = action.payload;
    },
    setTrendingCoral: (state, action) => {
      state.trendingCoral = action.payload;
    },
    clearUser: (state, action) => {
      state.user = false;
    },
    setPartners: (state, action) => {
      state.partners = action.payload;
    },
  },
});

export const {
  showOverlay,
  hideOverlay,
  setUserProfile,
  setSearchResults,
  setSearchActive,
  setSearchTerm,
  setPostUploadProgress,
  clearPostUploadProgress,
  setRecentlyViewed,
  setScreenLoader,
  setRecentlyAdded,
  clearUser,
  setTrending,
  setGameLeaderboard,
  setWheelMenuOpen,
  setContextSwitchLoading,
  setTrendingCoral,
  setStoreSignup,
  clearStoreSignup,
  setUserLinkedProfile,
  setNotificationMenuActive,
  setNotifications,
  clearNotificationCount,
  appendNotifications,
  setScrollDirection,
  setSocialFullScreen,
  setUrgentPostAvailable,
  setPostAcceptedTerms,
  setConfirmWheelIndicator,
  setRecentlyContributed,
  setLatestUrgentPosts,
  setPartners,
} = globalSlice.actions;

export default globalSlice.reducer;

const selectGlobal = (state) => state.global;

export const selectOverlayStatus = (state) => state.global.overlay;

export const selectUser = createSelector(
  [selectGlobal],
  (global) => global.user
);
export const selectSearchResults = (state) => state.global.searchResults;
export const selectSearchActive = (state) => state.global.searchActive;
export const selectSearchTerm = (state) => state.global.searchTerm;

export const selectRecentlyViewed = (state) => state.global.recentlyViewed;
export const selectRecentlyContributed = (state) =>
  state.global.recentlyContributed;

export const selectRecentlyAdded = (state) => state.global.recentlyAdded;
export const selectTrendingLiveStock = (state) => state.global.trending;
export const selectTrendingCoral = (state) => state.global.trendingCoral;

export const selectPostUploadProgress = (state) =>
  state.global.postUploadProgress;

export const selectScreenLoading = (state) => state.global.screenLoader;

export const selectConfirmWheelIndicator = (state) =>
  state.global.confirmWheelIndicator;

export const selectNotifications = (state) => state.global.notifications;

export const selectNotificationMenuActive = (state) =>
  state.global.notificationMenuActive;

export const selectGameLeaderboard = (state) => state.global.leaderboard;

export const selectWheelMenu = (state) => state.global.wheelMenuOpen;

export const selectContextSwitchLoading = (state) =>
  state.global.contextSwitchLoading;

export const selectStoreSignup = (state) => state.global.storeSignup;

export const selectScrollDirection = (state) => state.global.scrollDirection;

export const selectSocialFullScreen = (state) => state.global.socialFullScreen;

export const selectUrgentPostAvailable = (state) =>
  state.global.urgentPostAvailable;

export const selectPostAcceptedTerms = (state) =>
  state.global.postAcceptedTerms;

export const selectPartners = (state) => state.global.partners;

export const selectUrgentPosts = (state) => state.global.latestUrgentPosts;

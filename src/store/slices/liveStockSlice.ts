import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: {},
  listing: {
    data: [],
    links: [],
    facets: {},
    facetConstruction: [],
    sortableConstruction: [],
    total: 0,
    firstItem: 0,
    lastItem: 0,
    totalShowing: 0,
    hasMore: true,
  },
  scrollOffset: 0,
  lastUsedQueryParams: "", // <--- add this
  lastUsedQueryParamsCoral: "", // <--- add this
};

const liveStockSlice = createSlice({
  name: "liveStock",
  initialState,
  reducers: {
    setLiveStockListing: (state, action) => {
      const {
        data,
        links,
        facets,
        facetConstruction,
        total,
        firstItem,
        lastItem,
        hasMore,
        sortableConstruction,
      } = action.payload;

      // If it's the first page, reset the posts array
      if (firstItem === 1) {
        state.listing.data = data;
      } else {
        // Append new posts only if they are not duplicates
        const existingIds = new Set(state.listing.data.map((post) => post.id));
        const newPosts = data.filter((post) => !existingIds.has(post.id));

        const listData = [...state.listing.data, ...newPosts];

        state.listing.data = listData;
      }

      // Store pagination metadata
      state.listing.links = links;
      state.listing.facets = facets;
      state.listing.facetConstruction = facetConstruction;
      state.listing.sortableConstruction = sortableConstruction;
      state.listing.total = total;
      state.listing.firstItem = firstItem;
      state.listing.lastItem = lastItem;
      state.listing.hasMore = hasMore;
      state.listing.totalShowing = state.listing.data?.length;
    },
    setLiveStockProfile: (state, action) => {
      state.profile = {
        ...state.profile,
        [action.payload.id]: action.payload,
      };
    },
    setLastUsedQueryParams: (state, action) => {
      const coral = action.payload.coral;

      if (coral) {
        state.lastUsedQueryParamsCoral = action.payload.query;
      } else {
        state.lastUsedQueryParams = action.payload.query;
      }
    },
    setLiveStockProfileUserImages: (state, action) => {
      state.profile = {
        ...state.profile,
        [action.payload.id]: {
          ...state.profile[action.payload.id],
          userImages: {
            data: [
              ...(state.profile[action.payload.id]?.userImages?.data || []),
              // ...action.payload.data,
            ],
            ...action.payload.data,
          },
        },
      };
    },
    setLiveStockProfileUserVideos: (state, action) => {
      state.profile = {
        ...state.profile,
        [action.payload.id]: {
          ...state.profile[action.payload.id],
          userVideos: {
            data: [
              ...(state.profile[action.payload.id]?.userVideos?.data || []),
              // ...action.payload.data,
            ],
            ...action.payload.data,
          },
        },
      };
    },
    setLiveStockUserExperiences: (state, action) => {
      state.profile = {
        ...state.profile,
        [action.payload.id]: {
          ...state.profile[action.payload.id],
          userExperiences: {
            ...action.payload.data?.data,
            data: [
              ...(state.profile[action.payload.id]?.userExperiences?.data ||
                []),
              ...action.payload.data?.data?.data,
            ],
          },
        },
      };
    },
    setScrollOffset(state, action) {
      state.scrollOffset = action.payload;
    },
    setLiveStockUserPastVotes: (state, action) => {
      state.profile = {
        ...state.profile,
        [action.payload.id]: {
          ...state.profile[action.payload.id],
          pastVotes: action.payload.data,
        },
      };
    },
  },
});

export const {
  setLiveStockListing,
  setLiveStockProfile,
  setLiveStockProfileUserImages,
  setLiveStockUserExperiences,
  setLiveStockUserPastVotes,
  setScrollOffset,
  setLiveStockProfileUserVideos,
  setLastUsedQueryParams,
} = liveStockSlice.actions;

export default liveStockSlice.reducer;

const selectLiveStock = (state) => state.liveStock;

export const selectLiveStockListing = (state) => state.liveStock.listing;

export const selectLiveStockProfile = (id) =>
  createSelector([selectLiveStock], (liveStock) => liveStock.profile[id]);

export const selectLiveStockUserPastVotes = (id) => (state) =>
  state.liveStock.profile[id]?.pastVotes;

export const selectLiveStockScrollOffset = (state) =>
  state.liveStock.scrollOffset;

export const selectLastUsedQueryParams = (coral) => (state) =>
  coral
    ? state.liveStock.lastUsedQueryParamsCoral
    : state.liveStock.lastUsedQueryParams;

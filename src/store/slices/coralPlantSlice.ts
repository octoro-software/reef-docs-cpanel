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
};

const coralPlantSlice = createSlice({
  name: "coralPlant",
  initialState,
  reducers: {
    setPlantCoralListing: (state, action) => {
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
    setPlantCoralProfile: (state, action) => {
      state.profile = {
        ...state.profile,
        [action.payload.id]: action.payload,
      };
    },
    setLastUsedQueryParamsPlantCoral: (state, action) => {
      state.lastUsedQueryParams = action.payload;
    },
    setPlantCoralProfileUserImages: (state, action) => {
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
    setPlantCoralUserExperiences: (state, action) => {
      state.profile = {
        ...state.profile,
        [action.payload.id]: {
          ...state.profile[action.payload.id],
          userExperiences: {
            ...action.payload.data,
            data: [
              ...(state.profile[action.payload.id]?.userExperiences?.data ||
                []),
              ...action.payload.data?.data,
            ],
          },
        },
      };
    },
    setScrollOffsetPlantCoral(state, action) {
      state.scrollOffset = action.payload;
    },
    setPlantCoralUserPastVotes: (state, action) => {
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
  setPlantCoralListing,
  setPlantCoralProfile,
  setPlantCoralProfileUserImages,
  setPlantCoralUserExperiences,
  setPlantCoralUserPastVotes,
  setScrollOffsetPlantCoral,
  setLastUsedQueryParamsPlantCoral,
} = coralPlantSlice.actions;

export default coralPlantSlice.reducer;

const selectPlantCoral = (state) => state.coralPlant;

export const selectPlantCoralListing = (state) => state.coralPlant.listing;

export const selectPlantCoralProfile = (id) =>
  createSelector([selectPlantCoral], (coralPlant) => coralPlant.profile[id]);

export const selectLiveStockUserPastVotesCoralPlant = (id) => (state) =>
  state.coralPlant.profile[id]?.pastVotes;

export const selectLiveStockScrollOffsetCoralPlant = (state) =>
  state.coralPlant.scrollOffset;

export const selectLastUsedQueryParamsCoralPlant = (state) =>
  state.coralPlant.lastUsedQueryParams;

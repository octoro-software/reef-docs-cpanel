import { createSlice } from "@reduxjs/toolkit";
import { ARTICLE_MENU } from "../../constants/articles";

const initialState = {
  selectedArticleSlug: null,
  articleData: null,
  history: [ARTICLE_MENU],
  scrollPositions: {},
  featuredArticles: [],
};

const moreSlice = createSlice({
  name: "more",
  initialState,
  reducers: {
    setSelectedArticleSlug: (state, action) => {
      state.selectedArticleSlug = action.payload;
    },
    setArticleData: (state, action) => {
      state.articleData = action.payload;
    },
    setFeaturedArticles: (state, action) => {
      state.featuredArticles = action.payload;
    },
    setArticleHistory: (state, action) => {
      state.history = action.payload;
    },
    setScrollPositions: (state, action) => {
      state.scrollPositions = action.payload;
    },
  },
});

export const {
  setSelectedArticleSlug,
  setArticleData,
  setArticleHistory,
  setScrollPositions,
  setFeaturedArticles,
} = moreSlice.actions;

export default moreSlice.reducer;

export const selectArticleSlug = (state) => state.more.selectedArticleSlug;
export const selectArticleData = (state) => state.more.articleData;
export const selectArticleHistory = (state) => state.more.history;
export const selectArticleScrollPosition = (state) =>
  state.more.scrollPositions;
export const selectFeaturedArticles = (state) => state.more.featuredArticles;

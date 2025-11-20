import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  redseaFeed: {},
  apexFeed: {},
  aquaDocsFeed: {
    refreshTime: 5,
  },
  tankId: null,
  tankName: "",
  storeMode: null,
};

const userConfigSlice = createSlice({
  name: "userConfig",
  initialState,
  reducers: {
    setActiveTank: (state, action) => {
      state.tankId = action.payload;
    },
    setActiveTankName: (state, action) => {
      state.tankName = action.payload;
    },
    setRedseaFeed: (state, action) => {
      state.redseaFeed = { ...state.redseaFeed, ...action.payload };
    },
    setAquaDocsFeed: (state, action) => {
      state.aquaDocsFeed = { ...state.aquaDocsFeed, ...action.payload };
    },
    setApexFeed: (state, action) => {
      state.apexFeed = { ...state.apexFeed, ...action.payload };
    },
    setStoreMode: (state, action) => {
      state.storeMode = action.payload;
    },
  },
});

export const {
  setActiveTank,
  setActiveTankName,
  setRedseaFeed,
  setStoreMode,
  setApexFeed,
  setAquaDocsFeed,
} = userConfigSlice.actions;

export default userConfigSlice.reducer;

export const selectRedSeaFeed = (state: any) => state.userConfig.redseaFeed;
export const selectApexFeed = (state: any) => state.userConfig.apexFeed;
export const selectAquaDocsFeed = (state: any) => state.userConfig.aquaDocsFeed;
export const selectActiveTankId = (state: any) => state.userConfig.tankId;
export const selectActiveTankName = (state: any) => state.userConfig.tankName;
export const selectTestingUserConfig = (state) => state.userConfig.testing;

export const selectAudience = (state) => state.userConfig.audience;

export const selectStoreMode = (state) => state.userConfig.shopMode;

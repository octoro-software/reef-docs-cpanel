import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  redseaFeed: {},
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
      state.redseaFeed = action.payload;
    },
    setStoreMode: (state, action) => {
      state.storeMode = action.payload;
    },
  },
});

export const { setActiveTank, setActiveTankName, setRedseaFeed, setStoreMode } =
  userConfigSlice.actions;

export default userConfigSlice.reducer;

export const selectRedSeaFeed = (state: any) => state.userConfig.redseaFeed;
export const selectActiveTankId = (state: any) => state.userConfig.tankId;
export const selectActiveTankName = (state: any) => state.userConfig.tankName;
export const selectTestingUserConfig = (state) => state.userConfig.testing;

export const selectAudience = (state) => state.userConfig.audience;

export const selectStoreMode = (state) => state.userConfig.shopMode;

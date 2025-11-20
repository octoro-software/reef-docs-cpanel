import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  apexData: {},
  syncing: false,
};

const apexSlice = createSlice({
  name: "apex",
  initialState,
  reducers: {
    setApexData: (state, action) => {
      state.apexData = action.payload;
    },
    setApexSyncing: (state, action) => {
      state.syncing = action.payload;
    },
  },
});

export const { setApexData, setApexSyncing } = apexSlice.actions;

export default apexSlice.reducer;

export const selectApexData = (state: any) => state.apex.apexData;

export const selectApexSyncing = (state: any) => state.apex.syncing;

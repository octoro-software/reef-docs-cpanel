import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  redSeaData: {},
  syncing: false,
};

const redSeaSlice = createSlice({
  name: "redSea",
  initialState,
  reducers: {
    setRedSeaData: (state, action) => {
      state.redSeaData = action.payload;
    },
    setRedSeaSyncing: (state, action) => {
      state.syncing = action.payload;
    },
  },
});

export const { setRedSeaData, setRedSeaSyncing } = redSeaSlice.actions;

export default redSeaSlice.reducer;

export const selectRedSeaData = (state: any) => state.redSea.redSeaData;

export const selectRedSeaSyncing = (state: any) => state.redSea.syncing;

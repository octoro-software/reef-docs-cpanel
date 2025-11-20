import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  redSeaData: {},
};

const redSeaSlice = createSlice({
  name: "redSea",
  initialState,
  reducers: {
    setRedSeaData: (state, action) => {
      state.redSeaData = action.payload;
    },
  },
});

export const { setRedSeaData } = redSeaSlice.actions;

export default redSeaSlice.reducer;

export const selectRedSeaData = (state: any) => state.redSea.redSeaData;

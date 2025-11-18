import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  providers: [],
  elements: [],
};

const icpSlice = createSlice({
  name: "icp",
  initialState,
  reducers: {
    setIcpProviders: (state, action) => {
      state.providers = action.payload;
    },
    setElements: (state, action) => {
      state.elements = action.payload;
    },
  },
});

export const { setIcpProviders, setElements } = icpSlice.actions;

export default icpSlice.reducer;

export const selectIcpProviders = (state) => state.icp.providers;

export const selectElements = (state) => state.icp.elements;

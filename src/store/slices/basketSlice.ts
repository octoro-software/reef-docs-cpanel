import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setBasket: (state, action) => {
      return action.payload;
    },
  },
});

export const { setBasket } = basketSlice.actions;

export default basketSlice.reducer;

export const selectBasket = (state) => state.basket;

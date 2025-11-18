import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishList: [],
};

const wishListSlice = createSlice({
  name: "wishList",
  initialState,
  reducers: {
    setWishList: (state, action) => {
      state.wishList = action.payload;
    },
  },
});

export const { setWishList } = wishListSlice.actions;

export default wishListSlice.reducer;

export const selectWishList = (state) => state.wishList.wishList;

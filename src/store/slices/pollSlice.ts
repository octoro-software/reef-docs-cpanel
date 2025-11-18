import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  polls: [],
};

const slice = createSlice({
  name: "polls",
  initialState,
  reducers: {
    setPolls: (state, action) => {
      state.polls = action.payload;
    },
    setPollActioned: (state, action) => {
      const poll = state.polls.find((poll) => poll.id === action.payload);
      poll.actioned = true;
    },
  },
});

export const { actions } = slice;

export default slice.reducer;

export const { setPolls, setPollActioned } = actions;

export const selectPolls = (state) => state.polls.polls;

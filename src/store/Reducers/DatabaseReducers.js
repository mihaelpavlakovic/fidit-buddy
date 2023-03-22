import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

const databaseSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
  },
});

export const databaseActions = databaseSlice.actions;

export default databaseSlice;

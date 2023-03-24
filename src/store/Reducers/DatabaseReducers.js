import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  image: [],
  progress: 0,
};

const databaseSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload.image;
    },
    setProgress: (state, action) => {
      state.progress = action.payload.progress;
    },
    resetProgress: state => {
      state.progress = 0;
    },
    removeImage: state => {
      state.image = [];
    },
  },
});

export const databaseActions = databaseSlice.actions;

export default databaseSlice;

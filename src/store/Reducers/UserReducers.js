import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  initialized: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    initialized: (state, action) => {
      state.initialized = action.payload;
    },
    login: (state, action) => {
      state.user = action.payload.user;
    },
    logout: state => {
      state.user = null;
    },
    setUserData: (state, action) => {
      state.user = { ...state.user, ...action.payload.user };
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;

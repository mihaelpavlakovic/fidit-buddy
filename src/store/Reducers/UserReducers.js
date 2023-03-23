import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
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
      state.userData = action.payload.user;
    },
    logout: state => {
      state.userData = null;
    },
    setUserData: (state, action) => {
      state.userData = { ...state.userData, ...action.payload.user };
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;

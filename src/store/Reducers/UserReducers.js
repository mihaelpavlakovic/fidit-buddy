import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authToken: null,
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    initialized: (state, action) => {
      state.initialized = action.payload;
    },
    LOGIN: (state, action) => {
      if (action.payload.authToken !== state.authToken) {
        state.authToken = action.payload.authToken;
      } else {
        return;
      }
    },
    logout: state => {
      state.userData = null;
      state.authToken = null;
    },
    setUserData: (state, action) => {
      if (action.payload.userData !== state.authToken) {
        state.userData = { ...state.userData, ...action.payload.userData };
      }
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;

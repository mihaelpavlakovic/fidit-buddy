// redux imports
import { configureStore } from "@reduxjs/toolkit";
import databaseSlice from "./Reducers/DatabaseReducers";
import userSlice from "./Reducers/UserReducers";

const store = configureStore({
  reducer: {
    database: databaseSlice.reducer,
    user: userSlice.reducer,
  },
});

export default store;

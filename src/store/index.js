// redux imports
import { configureStore } from "@reduxjs/toolkit";
import databaseSlice from "./Reducers/DatabaseReducers";

const store = configureStore({
  reducer: {
    database: databaseSlice.reducer,
  },
});

export default store;

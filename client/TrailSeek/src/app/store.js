import { configureStore } from "@reduxjs/toolkit";

import trailsReducer from "./trailSlice";
import userReducer from "./userSlice";

export default configureStore({
  reducer: {
    trails: trailsReducer,
    user: userReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

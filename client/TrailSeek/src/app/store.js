import { configureStore } from "@reduxjs/toolkit";

import trailsReducer from "./trailSlice";
import userReducer from "./userSlice";
import eventReducer from "./eventSlice";

export default configureStore({
  reducer: {
    trails: trailsReducer,
    user: userReducer,
    event: eventReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

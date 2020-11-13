import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import trailSeek from "../api/trailSeek";
import CONSTANTS from "../util/Constants";

const initialState = {
  events: [],
  error: null,
  status: CONSTANTS.IDLE,
};

export const fetchEvents = createAsyncThunk(
  "event/fetchEvents",
  async (trailID, { rejectWithValue }) => {
    try {
      const response = await trailSeek.get(`/trails/${trailID}/events`);
      return { data: response.data, trailID };
    } catch (e) {
      return rejectWithValue(
        e.response.data.errors
          .map((item) => {
            return item.msg;
          })
          .join(" ")
      );
    }
  }
);

export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    logOut1(state, action) {},
  },
  extraReducers: {
    [fetchEvents.pending]: (state, action) => {
      state.status = CONSTANTS.LOADING;
    },
    [fetchEvents.fulfilled]: (state, action) => {
      state.status = CONSTANTS.SUCCESS;
      const idx = state.events.findIndex(
        (obj) => obj.trailID === action.payload.trailID
      );
      if (idx === -1) {
        state.events.push(action.payload);
      } else {
        state.events[idx] = action.payload;
      }
    },
    [fetchEvents.rejected]: (state, action) => {
      state.status = CONSTANTS.FAILED;
      state.error = action.payload;
    },
    //////////////////////////////////////////////////////////////
  },
});

export const { logOut1 } = eventSlice.actions;

export default eventSlice.reducer;

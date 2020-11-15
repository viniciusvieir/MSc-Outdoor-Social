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

export const postEvents = createAsyncThunk(
  "event/postEvents",
  async ({ trailID, inputs }, { dispatch, rejectWithValue }) => {
    try {
      const response = await trailSeek.post(
        `/trails/${trailID}/events`,
        inputs
      );
      // try{}catch(e)
      return { eventID: response.data, data: inputs, trailID };
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
    [postEvents.pending]: (state, action) => {
      state.status = CONSTANTS.LOADING;
    },
    [postEvents.fulfilled]: (state, action) => {
      // console.log(action.payload.eventID.eventId);
      // const { data, trailID, eventID } = action.payload;
      // data._id = eventID.eventId;
      state.status = CONSTANTS.SUCCESS;
      // const idx = state.events.findIndex((obj) => obj.trailID === trailID);
      // if (idx === -1) {
      //   state.events.push({ data, trailID });
      // } else {
      //   state.events[idx].data.push(data);
      // }
    },
    [postEvents.rejected]: (state, action) => {
      state.status = CONSTANTS.FAILED;
      state.error = action.payload;
    },
    //////////////////////////////////////////////////////////////
  },
});

export const { logOut1 } = eventSlice.actions;

// export const eventData =

export default eventSlice.reducer;

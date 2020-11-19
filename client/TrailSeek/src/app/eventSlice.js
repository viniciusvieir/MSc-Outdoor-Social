import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import trailSeek from "../api/trailSeek";
import CONSTANTS from "../util/Constants";

const initialState = {
  currentEvent: [],
  events: [],
  error: null,
  joinedEvents: [],
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
        e.response.data?.errors
          ? e.response.data.errors
              .map((item) => {
                return item.msg;
              })
              .join(" ")
          : e.status
      );
    }
  }
);

export const joinEvent = createAsyncThunk(
  "event/joinEvent",
  async ({ trailID, eventID }, { dispatch, rejectWithValue }) => {
    try {
      const response = await trailSeek.post(
        `/trails/${trailID}/events/${eventID}/join`
      );
      return response.data;
    } catch (e) {
      console.log(e.response);
      return rejectWithValue(
        e.response.data?.errors
          ? e.response.data.errors
              .map((item) => {
                return item.msg;
              })
              .join(" ")
          : e.status
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
      console.log(e.response);
      return rejectWithValue(
        e.response.data?.errors
          ? e.response.data.errors
              .map((item) => {
                return item.msg;
              })
              .join(" ")
          : e.status
      );
    }
  }
);

export const putEvents = createAsyncThunk(
  "event/putEvents",
  async ({ trailID, inputs, eventID }, { rejectWithValue }) => {
    try {
      const response = await trailSeek.put(
        `/trails/${trailID}/events/${eventID}`,
        inputs
      );
      return { eventData: response.data };
    } catch (e) {
      console.log(e);
      return rejectWithValue(
        e.response.data?.errors
          ? e.response.data.errors
              .map((item) => {
                return item.msg;
              })
              .join(" ")
          : e.status
      );
    }
  }
);

export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    addJoinedEvent(state, action) {
      state.joinedEvents.push(action.payload);
    },
    logOut1(state, action) {},
    updateCurrentEvent(state, action) {
      state.currentEvent.length ? state.currentEvent.pop() : null;
      state.currentEvent.push(action.payload);
    },
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
    [putEvents.pending]: (state, action) => {
      state.status = CONSTANTS.LOADING;
    },
    [putEvents.fulfilled]: (state, action) => {
      state.status = CONSTANTS.SUCCESS;
    },
    [putEvents.rejected]: (state, action) => {
      state.status = CONSTANTS.FAILED;
      state.error = action.payload;
    },
    //////////////////////////////////////////////////////////////
    [joinEvent.pending]: (state, action) => {
      state.status = CONSTANTS.LOADING;
    },
    [joinEvent.fulfilled]: (state, action) => {
      state.status = CONSTANTS.SUCCESS;
    },
    [joinEvent.rejected]: (state, action) => {
      state.status = CONSTANTS.FAILED;
      state.error = action.payload;
    },
    //////////////////////////////////////////////////////////////
  },
});

export const {
  logOut1,
  updateCurrentEvent,
  addJoinedEvent,
} = eventSlice.actions;

// export const eventData =

export default eventSlice.reducer;

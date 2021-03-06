import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import trailSeek from '../api/trailSeek'
import CONSTANTS from '../util/Constants'
import { errorHandler } from '../util/errorHandler'

const initialState = {
  currentEvent: [],
  events: [],
  error: null,
  status: CONSTANTS.IDLE,
}

export const fetchEvents = createAsyncThunk(
  'event/fetchEvents',
  async (trailID, { rejectWithValue }) => {
    try {
      const response = await trailSeek.get(`/trails/${trailID}/events`)
      return { data: response.data, trailID }
    } catch (e) {
      return rejectWithValue(errorHandler(e))
    }
  }
)

// export const fetchSingleEvent = createAsyncThunk(
//   "event/fetchSingleEvent",
//   async ({ trailID, eventID }, { rejectWithValue }) => {
//     try {
//       const response = await trailSeek.get(
//         `/trails/${trailID}/events/${eventID}`
//       );
//       return response.data;
//     } catch (e) {
//       return rejectWithValue(
//         e.response.data?.errors
//           ? e.response.data.errors
//               .map((item) => {
//                 return item.msg;
//               })
//               .join(" ")
//           : e.status
//       );
//     }
//   }
// );

export const fetchSingleEvent = createAsyncThunk(
  'event/fetchSingleEvent',
  async (eventID, { rejectWithValue }) => {
    try {
      const response = await trailSeek.get(`/events/${eventID}`)
      return response.data
    } catch (e) {
      console.log(e.response)
      return rejectWithValue(errorHandler(e))
    }
  }
)

export const joinEvent = createAsyncThunk(
  'event/joinEvent',
  async ({ trailID, eventID }, { rejectWithValue }) => {
    try {
      const response = await trailSeek.put(
        `/trails/${trailID}/events/${eventID}/join`
      )
      return response.data
    } catch (e) {
      console.log(e.response)
      return rejectWithValue(errorHandler(e))
    }
  }
)

export const deleteEvent = createAsyncThunk(
  'event/deleteEvent',
  async ({ trailID, eventID }, { rejectWithValue }) => {
    try {
      const response = await trailSeek.delete(
        `/trails/${trailID}/events/${eventID}`
      )
      return response.data
    } catch (e) {
      console.log(e.response)
      return rejectWithValue(errorHandler(e))
    }
  }
)

export const leaveEvent = createAsyncThunk(
  'event/leaveEvent',
  async ({ trailID, eventID }, { rejectWithValue }) => {
    try {
      const response = await trailSeek.put(
        `/trails/${trailID}/events/${eventID}/leave`
      )
      return response.data
    } catch (e) {
      console.log(e.response)
      return rejectWithValue(errorHandler(e))
    }
  }
)

export const postEvents = createAsyncThunk(
  'event/postEvents',
  async ({ trailID, inputs }, { rejectWithValue }) => {
    try {
      const response = await trailSeek.post(`/trails/${trailID}/events`, inputs)
      // try{}catch(e)
      return { eventID: response.data, data: inputs, trailID }
    } catch (e) {
      console.log(e.response)
      return rejectWithValue(errorHandler(e))
    }
  }
)

export const putEvents = createAsyncThunk(
  'event/putEvents',
  async ({ trailID, inputs, eventID }, { rejectWithValue }) => {
    // console.log(inputs)
    try {
      const response = await trailSeek.put(
        `/trails/${trailID}/events/${eventID}`,
        inputs
      )
      // console.log(response.data)
      return { eventData: response.data }
    } catch (e) {
      console.log(e)
      return rejectWithValue(errorHandler(e))
    }
  }
)

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    updateCurrentEvent(state, action) {
      state.currentEvent.length ? state.currentEvent.pop() : null
      state.currentEvent.push(action.payload)
    },
  },
  extraReducers: {
    [fetchEvents.pending]: (state, action) => {
      state.status = CONSTANTS.LOADING
    },
    [fetchEvents.fulfilled]: (state, action) => {
      state.status = CONSTANTS.SUCCESS
      const idx = state.events.findIndex(
        (obj) => obj.trailID === action.payload.trailID
      )
      if (idx === -1) {
        state.events.push(action.payload)
      } else {
        state.events[idx] = action.payload
      }
    },
    [fetchEvents.rejected]: (state, action) => {
      state.status = CONSTANTS.FAILED
      state.error = action.payload
    },
    //////////////////////////////////////////////////////////////
    [postEvents.pending]: (state, action) => {
      state.status = CONSTANTS.LOADING
    },
    [postEvents.fulfilled]: (state, action) => {
      // console.log(action.payload.eventID.eventId);
      // const { data, trailID, eventID } = action.payload;
      // data._id = eventID.eventId;
      state.status = CONSTANTS.SUCCESS
      // const idx = state.events.findIndex((obj) => obj.trailID === trailID);
      // if (idx === -1) {
      //   state.events.push({ data, trailID });
      // } else {
      //   state.events[idx].data.push(data);
      // }
    },
    [postEvents.rejected]: (state, action) => {
      state.status = CONSTANTS.FAILED
      state.error = action.payload
    },
    //////////////////////////////////////////////////////////////
    [putEvents.pending]: (state, action) => {
      state.status = CONSTANTS.LOADING
    },
    [putEvents.fulfilled]: (state, action) => {
      state.status = CONSTANTS.SUCCESS
    },
    [putEvents.rejected]: (state, action) => {
      state.status = CONSTANTS.FAILED
      state.error = action.payload
    },
    //////////////////////////////////////////////////////////////
    [joinEvent.pending]: (state, action) => {
      state.status = CONSTANTS.LOADING
    },
    [joinEvent.fulfilled]: (state, action) => {
      state.status = CONSTANTS.SUCCESS
    },
    [joinEvent.rejected]: (state, action) => {
      state.status = CONSTANTS.FAILED
      state.error = action.payload
    },
    //////////////////////////////////////////////////////////////
    [fetchSingleEvent.pending]: (state, action) => {
      state.status = CONSTANTS.LOADING
    },
    [fetchSingleEvent.fulfilled]: (state, action) => {
      state.status = CONSTANTS.SUCCESS
    },
    [fetchSingleEvent.rejected]: (state, action) => {
      state.status = CONSTANTS.FAILED
      state.error = action.payload
    },
    //////////////////////////////////////////////////////////////
    [leaveEvent.pending]: (state, action) => {
      state.status = CONSTANTS.LOADING
    },
    [leaveEvent.fulfilled]: (state, action) => {
      state.status = CONSTANTS.SUCCESS
    },
    [leaveEvent.rejected]: (state, action) => {
      state.status = CONSTANTS.FAILED
      state.error = action.payload
    },
    //////////////////////////////////////////////////////////////
    [deleteEvent.pending]: (state, action) => {
      state.status = CONSTANTS.LOADING
    },
    [deleteEvent.fulfilled]: (state, action) => {
      state.status = CONSTANTS.SUCCESS
    },
    [deleteEvent.rejected]: (state, action) => {
      state.status = CONSTANTS.FAILED
      state.error = action.payload
    },
  },
})

export const { updateCurrentEvent } = eventSlice.actions

// export const eventData =

export default eventSlice.reducer

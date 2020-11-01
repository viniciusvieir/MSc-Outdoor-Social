import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import trailSeek from "../api/trailSeek";
import { Intersect } from "../util/Intersect";
import CONSTANTS from "../util/Constants";

const initialState = {
  trails: [],
  trailDetails: [],
  filteredTrails: [],
  status: CONSTANTS.IDLE,
  error: null,
};

export const fetchAllTrails = createAsyncThunk(
  "trails/fetchAllTrails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await trailSeek.get("/trails", {
        params: {
          fields: "name,avg_rating,location,img_url",
        },
      });
      return response.data;
    } catch (error) {
      console.log(error.message);
      retrun(error.message);
      return rejectWithValue(
        error.response.data.errors
          .map((item) => {
            return item.msg;
          })
          .join(" ")
      );
    }
  }
);

export const fetchTrailsByQuery = createAsyncThunk(
  "trails/fetchTrailsByQuery",
  async (
    { query = {}, limit = 10, location = false, maxDist = 5000, minDist = 0 },
    { rejectWithValue, getState }
  ) => {
    try {
      if (location) {
        query = {
          start: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [
                  getState().user.userLocation.latitude,
                  getState().user.userLocation.longitude,
                ],
              },
              $minDistance: minDist,
              $maxDistance: maxDist,
            },
          },
        };
      }
      const response = await trailSeek.get("/trails", {
        params: {
          q: JSON.stringify(query),
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response.data.errors
          .map((item) => {
            return item.msg;
          })
          .join(" ")
      );
    }
  }
);

export const fetchTrailsByID = createAsyncThunk(
  "trails/fetchTrailsByID",
  async ({ fields, id }, { rejectWithValue, getState }) => {
    try {
      const existTrail = getState().trails.trailDetails.find(
        (item) => item._id === id
      );
      if (existTrail) return existTrail;
      const response = await trailSeek.get(`/trails/${id}?fields=${fields}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response.data.errors
          .map((item) => {
            return item.msg;
          })
          .join(" ")
      );
    }
  }
);

export const trailSlice = createSlice({
  name: "trails",
  initialState,
  reducers: {
    ratingAdded(state, action) {
      const { trailId, rating } = action.payload;
      const existingTrail = state.trails.find((trail) => {
        trail._id === trailId;
      });
      if (existingTrail) {
        existingTrail.rating[rating]++;
      }
    },
  },
  extraReducers: {
    [fetchAllTrails.pending]: (state, action) => {
      state.status = CONSTANTS.LOADING;
    },
    [fetchAllTrails.fulfilled]: (state, action) => {
      state.status = CONSTANTS.SUCCESS;
      state.trails = action.payload;
    },
    [fetchAllTrails.rejected]: (state, action) => {
      state.status = CONSTANTS.FAILED;
      state.error = action.payload;
    },
    //////////////////////////////////////////////////////////////
    [fetchTrailsByID.pending]: (state, action) => {
      state.status = CONSTANTS.LOADING;
    },
    [fetchTrailsByID.fulfilled]: (state, action) => {
      state.status = CONSTANTS.SUCCESS;
      if (!state.trailDetails.some((item) => item._id === action.payload._id))
        state.trailDetails.push(action.payload);
    },
    [fetchTrailsByID.rejected]: (state, action) => {
      state.status = CONSTANTS.FAILED;
      state.error = action.error.message;
    },
    //////////////////////////////////////////////////////////////
    [fetchTrailsByQuery.pending]: (state, action) => {
      state.status = CONSTANTS.LOADING;
    },
    [fetchTrailsByQuery.fulfilled]: (state, action) => {
      state.status = CONSTANTS.SUCCESS;
      state.filteredTrails = Intersect(state.trails, action.payload);
    },
    [fetchTrailsByQuery.rejected]: (state, action) => {
      state.status = CONSTANTS.FAILED;
      state.error = action.payloade;
    },
  },
});

export const { ratingAdded } = trailSlice.actions;

export default trailSlice.reducer;

// export const selectAllTrails = (state) => state.trails.trails; // remember to return

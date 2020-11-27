import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import trailSeek from '../api/trailSeek'
import weather from '../api/weather'
import covid from '../api/covid'
// import { Intersect } from "../util/Intersect";
import CONSTANTS from '../util/Constants'

const initialState = {
  trails: [],
  trailDetails: [],
  ///changes to ve done, remove the query and data, make into array and set the object fields in the return call of thunk.
  filteredTrails: {
    data: [],
    query: {},
  },
  status: CONSTANTS.IDLE,
  error: null,
  weatherData: {
    status: CONSTANTS.IDLE,
    error: null,
    data: {},
  },
}

export const fetchTrailsByQuery = createAsyncThunk(
  'trails/fetchTrailsByQuery',
  async (
    {
      query = {},
      limit = 20,
      skip = 0,
      location = false,
      maxDist = 10000,
      minDist = 0,
      fields = 'name,avg_rating,location,img_url,outing_count',
    },
    { rejectWithValue, getState }
  ) => {
    try {
      if (location) {
        if (
          getState().user.userLocation.latitude != null ||
          getState().user.userLocation.latitude != undefined
        ) {
          query = {
            start: {
              $near: {
                $geometry: {
                  type: 'Point',
                  coordinates: [
                    getState().user.userLocation.latitude,
                    getState().user.userLocation.longitude,
                  ],
                },
                $minDistance: minDist,
                $maxDistance: maxDist,
              },
            },
          }
        } else {
          return []
        }
      }
      const response = await trailSeek.get('/trails', {
        params: {
          q: query,
          limit,
          skip,
          fields,
        },
      })
      return response.data
    } catch (error) {
      console.log(error.response)
      return rejectWithValue(
        error.response.data?.errors
          ? error.response.data.errors
              .map((item) => {
                return item.msg
              })
              .join(' ')
          : error.message
      )
    }
  }
)

export const fetchTrailsByID = createAsyncThunk(
  'trails/fetchTrailsByID',
  async (
    {
      covFlag = true,
      weathFlag = true,
      fields,
      id,
      excludeWeather = 'hourly,current,minutely,alerts',
    },
    { rejectWithValue, getState }
  ) => {
    let weatherResponse = []
    let covidResponse = []
    const covToggleFlag = getState().user.covidToggle
    try {
      // const existTrail = getState().trails.trailDetails.find(
      //   (item) => item._id === id
      // );
      // if (existTrail) return existTrail;
      console.log(id)
      console.log(fields)
      const response = await trailSeek.get(`/trails/${id}?fields=${fields}`)
      console.log(response.data)
      if (weathFlag) {
        try {
          weatherResponse = await weather.get('/onecall', {
            params: {
              // appid:trailData.weatherApiToken,
              lat: response.data.start.coordinates[0],
              lon: response.data.start.coordinates[1],
              exclude: excludeWeather,
            },
          })
          response.data.weatherData = weatherResponse.data
        } catch (e) {
          console.log('Weather API Error')
          console.log(e.response.data.message)
        }
      }
      if (covToggleFlag && covFlag) {
        try {
          covidResponse = await covid.get('', {
            params: {
              geometry: `${response.data.start.coordinates[1]},${response.data.start.coordinates[0]}`,
            },
          })
          response.data.covidData = covidResponse.data.features
        } catch (e) {
          console.log('Covid API Error')
          console.log(e.response.data.message)
        }
      }
      // response.data.weatherData = weathFlag ? weatherResponse.data : []
      // response.data.covidData =
      //   covToggleFlag && covFlag ? covidResponse.data.features : []
      console.log(response.data)
      return response.data
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response.data?.errors
          ? error.response.data.errors
              .map((item) => {
                return item.msg
              })
              .join(' ')
          : error.status
      )
    }
  }
)

export const trailSlice = createSlice({
  name: 'trails',
  initialState,
  reducers: {
    ratingAdded(state, action) {
      const { trailId, rating } = action.payload
      const existingTrail = state.trails.find((trail) => {
        trail._id === trailId
      })
      if (existingTrail) {
        existingTrail.rating[rating]++
      }
    },
  },
  extraReducers: {
    [fetchTrailsByID.pending]: (state, action) => {
      state.status = CONSTANTS.LOADING
    },
    [fetchTrailsByID.fulfilled]: (state, action) => {
      const idx = state.trailDetails.findIndex(
        (item) => item._id === action.payload._id
      )
      if (idx === -1) {
        state.trailDetails.push(action.payload)
      } else {
        state.trailDetails[idx] = action.payload
      }
      state.status = CONSTANTS.SUCCESS
    },
    [fetchTrailsByID.rejected]: (state, action) => {
      state.status = CONSTANTS.FAILED
      state.error = action.error.message
    },
    //////////////////////////////////////////////////////////////
    [fetchTrailsByQuery.pending]: (state, action) => {
      state.status = CONSTANTS.LOADING
    },
    [fetchTrailsByQuery.fulfilled]: (state, action) => {
      state.status = CONSTANTS.SUCCESS
      // state.filteredTrails.query = action.payload.query;
      state.filteredTrails.data = action.payload
    },
    [fetchTrailsByQuery.rejected]: (state, action) => {
      state.status = CONSTANTS.FAILED
      state.error = action.payload
    },
  },
})

export const { ratingAdded } = trailSlice.actions

export default trailSlice.reducer

// export const selectAllTrails = (state) => state.trails.trails; // remember to return

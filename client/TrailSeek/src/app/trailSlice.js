import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { errorHandler } from '../util/errorHandler'

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
      // maxDist = 10000,
      // minDist = 0,
      fields = 'name,weighted_rating,location,img_url,outing_count,comment_count',
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
            near: {
              lat: getState().user.userLocation.latitude,
              lon: getState().user.userLocation.longitude,
            },
          }
          // query = {
          //   start: {
          //     $near: {
          //       // {"near":{"lat":53.285268,"lon":-6.239517}}
          //       $geometry: {
          //         type: 'Point',
          //         coordinates: [
          //           getState().user.userLocation.latitude,
          //           getState().user.userLocation.longitude,
          //         ],
          //       },
          //       $minDistance: minDist,
          //       $maxDistance: maxDist,
          //     },
          //   },
          // }
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
  async ({ fields, id }, { rejectWithValue, getState }) => {
    // let weatherResponse = []
    // let covidResponse = []
    // const covToggleFlag = getState().user.covidToggle
    try {
      // const existTrail = getState().trails.trailDetails.find(
      //   (item) => item._id === id
      // );
      // if (existTrail) return existTrail;
      const response = await trailSeek.get(`/trails/${id}?fields=${fields}`)
      // if (weathFlag) {
      //   try {
      //     response.data.weatherData = weatherResponse.data
      //   } catch (e) {
      //     console.log('Weather API Error')
      //     console.log(e.response.data.message)
      //   }
      // }
      // if (covToggleFlag && covFlag) {
      // }
      // response.data.weatherData = weathFlag ? weatherResponse.data : []
      // response.data.covidData =
      //   covToggleFlag && covFlag ? covidResponse.data.features : []
      return response.data
    } catch (error) {
      console.log(error.message)
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

export const fetchCovidData = createAsyncThunk(
  'trails/fetchCovidData',
  async ({ latitude, longitude }, { rejectWithValue, getState }) => {
    const covToggleFlag = getState().user.covidToggle
    if (covToggleFlag) {
      try {
        const covidResponse = await covid.get('', {
          params: {
            geometry: `${longitude},${latitude}`,
          },
        })
        return covidResponse.data.features
      } catch (e) {
        console.log(e.message)
        console.log('Covid API Error')
        return rejectWithValue(errorHandler(e))
      }
    } else return []
  }
)

export const fetchWeatherData = createAsyncThunk(
  'trails/fetchWeatherData',
  async (
    { latitude, longitude, excludeWeather = 'hourly,current,minutely,alerts' },
    { rejectWithValue }
  ) => {
    console.log(latitude + '' + longitude)
    try {
      const weatherResponse = await weather.get('/onecall', {
        params: {
          // appid:trailData.weatherApiToken,
          lat: latitude,
          lon: longitude,
          exclude: excludeWeather,
        },
      })
      console.log(weatherResponse.data)
      return weatherResponse.data
    } catch (e) {
      console.log('Weather API Error')
      console.log(e)
      return rejectWithValue(errorHandler(e))
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
    //////////////////////////////////////////////////////////////
    [fetchWeatherData.pending]: (state, action) => {
      state.weatherData.status = CONSTANTS.LOADING
    },
    [fetchWeatherData.fulfilled]: (state, action) => {
      state.weatherData.status = CONSTANTS.SUCCESS
      state.weatherData = action.payload
      // state.filteredTrails.query = action.payload.query;
    },
    [fetchWeatherData.rejected]: (state, action) => {
      state.weatherData.status = CONSTANTS.FAILED
      state.weatherData.error = action.payload
    },
    //////////////////////////////////////////////////////////////
    [fetchCovidData.pending]: (state, action) => {
      state.status = CONSTANTS.LOADING
    },
    [fetchCovidData.fulfilled]: (state, action) => {
      state.status = CONSTANTS.SUCCESS
      // state.filteredTrails.query = action.payload.query;
    },
    [fetchCovidData.rejected]: (state, action) => {
      state.status = CONSTANTS.FAILED
      state.error = action.payload
    },
  },
})

export const { ratingAdded } = trailSlice.actions

export default trailSlice.reducer

// export const selectAllTrails = (state) => state.trails.trails; // remember to return

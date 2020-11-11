import { createSlice, createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-community/async-storage";
import * as Location from "expo-location";

import trailSeek from "../api/trailSeek";
import CONSTANTS from "../util/Constants";

const initialState = {
  profile: {
    name: null,
    token: null,
    error: null,
    status: CONSTANTS.IDLE,
  },
  userLocation: {
    latitude: null,
    longitude: null,
    status: CONSTANTS.IDLE,
    error: null,
  },
  isAuth: false,
};

export const signIn = createAsyncThunk(
  "user/signIn",
  async ({ inputs }, { dispatch, rejectWithValue }) => {
    try {
      const response = await trailSeek.post("/signin", inputs);
      try {
        const sav = await dispatch(saveToken({ data: response.data }));
      } catch (e) {
        console.log(e.message);
      }
      return response.data;
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

export const signUp = createAsyncThunk(
  "user/signUp",
  async ({ inputs }, { dispatch, rejectWithValue }) => {
    try {
      const response = await trailSeek.post("/signup", inputs);
      try {
        const sav = await dispatch(saveToken({ data: response.data }));
      } catch (e) {
        console.log(e.message);
      }
      return response.data;
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

export const saveToken = createAsyncThunk(
  "user/saveToken",
  async ({ data }) => {
    const token = ["@token", data.token];
    const name = ["@name", data.name];
    try {
      const response = await AsyncStorage.multiSet([token, name]);
      return response;
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const logOut = createAsyncThunk("user/delToken", async () => {
  try {
    const response = await AsyncStorage.clear();
    // const response = await AsyncStorage.multiRemove(["@token", "@name"]);
    return response;
  } catch (error) {
    console.log(error.response);
  }
});

export const getToken = createAsyncThunk("user/getToken", async () => {
  try {
    const value = await AsyncStorage.multiGet(["@token", "@name"]);
    if (value) {
      return value;
    }
  } catch (error) {
    console.log(error.response);
  }
});

export const getLocation = createAsyncThunk(
  "user/getLocation",
  async (_, { getState }) => {
    let location;
    if (getState().user.userLocation.status != CONSTANTS.SUCCESS) {
      try {
        let { status } = await Location.requestPermissionsAsync();
        try {
          if (status !== "granted") console.log("Acess to location was denied");
          location = await Location.getCurrentPositionAsync({});
        } catch (e) {
          console.log(e);
        }
        return location.coords;
      } catch (e) {
        console.log(e);
      }
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logOut1(state, action) {
      state.isAuth = false;
      state.profile = initialState.profile;
    },
  },
  extraReducers: {
    [signIn.pending]: (state, action) => {
      state.profile.status = CONSTANTS.LOADING;
    },
    [signIn.fulfilled]: (state, action) => {
      state.profile.status = CONSTANTS.SUCCESS;
      state.isAuth = true;
      state.profile.name = action.payload.name;
      state.profile.token = action.payload.token;
    },
    [signIn.rejected]: (state, action) => {
      state.profile.status = CONSTANTS.FAILED;
      state.isAuth = false;
      state.profile.error = action.payload;
    },
    //////////////////////////////////////////////////////////////
    [signUp.pending]: (state, action) => {
      state.status = CONSTANTS.LOADING;
    },
    [signUp.fulfilled]: (state, action) => {
      state.profile.status = CONSTANTS.SUCCESS;
      // state.isAuth = true;
      // state.profile.name = action.payload.email;
      // state.profile.token = action.payload.token;
    },
    [signUp.rejected]: (state, action) => {
      state.profile.status = CONSTANTS.FAILED;
      state.isAuth = false;
      state.profile.error = action.payload;
    },
    //////////////////////////////////////////////////////////////
    [getToken.pending]: (state, action) => {
      state.profile.status = CONSTANTS.LOADING;
    },
    [getToken.fulfilled]: (state, action) => {
      state.profile.status = CONSTANTS.SUCCESS;
      state.profile.token = action.payload[0][1]; //@token
      state.profile.name = action.payload[1][1]; //@name
      if (state.profile.token) state.isAuth = true;
    },
    [getToken.rejected]: (state, action) => {
      state.profile.status = CONSTANTS.FAILED;
      state.profile.token = null;
      state.profile.name = null;
      state.isAuth = false;
      state.profile.error = action.error.message;
    },
    //////////////////////////////////////////////////////////////
    [saveToken.pending]: (state, action) => {
      state.profile.status = CONSTANTS.LOADING;
    },
    [saveToken.fulfilled]: (state, action) => {
      state.profile.status = CONSTANTS.SUCCESS;
      // state.profile.token = action.payload;
    },
    [saveToken.rejected]: (state, action) => {
      state.profile.status = CONSTANTS.FAILED;
      state.profile.error = action.error.message;
    },
    //////////////////////////////////////////////////////////////
    [getLocation.pending]: (state, action) => {
      state.userLocation.status = CONSTANTS.LOADING;
    },
    [getLocation.fulfilled]: (state, action) => {
      state.userLocation.status = CONSTANTS.SUCCESS;
      state.userLocation.latitude = action.payload.latitude;
      state.userLocation.longitude = action.payload.longitude;
    },
    [getLocation.rejected]: (state, action) => {
      state.userLocation.status = CONSTANTS.FAILED;
      state.userLocation.error = action.error.message;
    },
    //////////////////////////////////////////////////////////////
    [logOut.pending]: (state, action) => {
      state.profile.status = CONSTANTS.LOADING;
    },
    [logOut.fulfilled]: (state, action) => {
      state.profile.status = CONSTANTS.SUCCESS;
      state.profile.token = null;
      state.profile.name = null;
      state.isAuth = false;
    },
    [logOut.rejected]: (state, action) => {
      state.profile.status = CONSTANTS.FAILED;
      state.profile.error = action.error.message;
    },
  },
});

export const { logOut1 } = userSlice.actions;

export default userSlice.reducer;

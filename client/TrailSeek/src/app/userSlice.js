import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import trailSeek from "../api/trailSeek";
import { Intersect } from "../util/Intersect";

const initialState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
  isAuth: false,
  authError: false,
};

export const signUp = createAsyncThunk(
  "user/signUp",
  async ({ inputs }, { dispatch }) => {
    try {
      const response = await trailSeek.post("/signup", inputs);
      dispatch(signUpSucceded({ data: response.data }));
      dispatch(saveToken());
      return response.data;
    } catch (error) {
      dispatch(signUpFailed({ error: error.message }));
      // console.log(error);
      throw error;
    }
  }
);

export const signIn = createAsyncThunk(
  "user/signIn",
  async ({ inputs }, { dispatch, getState }) => {
    // const currentUserState = getState().user;
    try {
      const response = await trailSeek.post("/signin", inputs);
      dispatch(loginSucceded({ data: response.data }));
      dispatch(saveToken({ data: response.data.token }));
      return response.data;
    } catch (error) {
      dispatch(loginFailed({ error: error.message }));
      console.log(error);
    }
  }
);

//Write reducer for saveToken
export const saveToken = createAsyncThunk(
  "user/saveToken",
  async ({ data }, { dispatch, getState }) => {
    // console.log(data);
    try {
      const response = await AsyncStorage.setItem("@token", data);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getToken = createAsyncThunk("user/getToken", async () => {
  try {
    const value = await AsyncStorage.getItem("token");
    if (value) {
      return value;
    }
  } catch (error) {}
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginFailed(state, action) {
      state.isAuth = false;
      state.error = action.payload.error;
    },
    loginSucceded(state, action) {
      state.isAuth = true;
      state.token = action.payload.data.token;
      state.user = action.payload.data;
    },
    signUpFailed(state, action) {
      state.isAuth = false;
      state.error = action.payload.error;
    },
    signUpSucceded(state, action) {
      state.isAuth = true;
      state.token = action.payload.data.token;
      state.user = action.payload.data;
    },
  },
  extraReducers: {
    [signUp.pending]: (state, action) => {
      state.status = "loading";
    },
    [signUp.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.user = action.payload;
      state.token = action.payload.token;
    },
    [signUp.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
    [signIn.pending]: (state, action) => {
      state.status = "loading";
    },
    [signIn.fulfilled]: (state, action) => {
      state.status = "succeeded";
      if (state.authError) {
        state.isAuth = false;
      } else {
        state.user = action.payload;
        state.token = action.payload.token;
      }
      // console.log(action.payload);
    },
    [signIn.rejected]: (state, action) => {
      state.status = "failed";
      state.isAuth = false;
      // console.log(action.error.message);
      state.error = action.error.message;
    },
    [getToken.pending]: (state, action) => {
      state.status = "loading";
    },
    [getToken.fulfilled]: (state, action) => {
      //Todo
      state.status = "succeeded";
      state.isAuth = true;
      state.token = action.payload;
    },
    [getToken.rejected]: (state, action) => {
      state.status = "failed";
      state.token = null;
      state.error = action.error.message;
    },
  },
});

export const { loginSucceded, loginFailed } = userSlice.actions;

export default userSlice.reducer;

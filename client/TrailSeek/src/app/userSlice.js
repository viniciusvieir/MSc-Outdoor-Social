import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-community/async-storage";
import trailSeek from "../api/trailSeek";

const initialState = {
  name: null,
  user: null,
  token: null,
  status: "idle",
  error: null,
  isAuth: false,
};

export const signUp = createAsyncThunk(
  "user/signUp",
  async ({ inputs }, { dispatch }) => {
    const response = await trailSeek
      .post("/signup", inputs)
      .catch((error) => dispatch(signUpFailed({ error: error.message })));
    if (!response.payload?.error) {
      dispatch(signUpSucceded({ data: response.data }));
      const savToken = await dispatch(saveToken()).catch((err) => {
        console.log("SaveToken : " + err.message);
      });
    }
    return response.data;
  }
);

export const signIn = createAsyncThunk(
  "user/signIn",
  async ({ inputs }, { dispatch, getState }) => {
    const response = await trailSeek
      .post("/signin", inputs)
      .catch((e) => dispatch(loginFailed({ error: e.message })));
    if (!response.payload?.error) {
      console.log(response.data);
      dispatch(loginSucceded({ data: response.data }));
      const savToken = await dispatch(saveToken()).catch((err) => {
        console.log("SaveToken : " + err.message);
      });
    }
    return response.data;
  }
);

//Write reducer for saveToken
export const saveToken = createAsyncThunk(
  "user/saveToken",
  async (_, { dispatch, getState }) => {
    try {
      const response = await AsyncStorage.setItem(
        "@token",
        getState().user.token
      );
      return response.data;
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const getToken = createAsyncThunk("user/getToken", async () => {
  try {
    const value = await AsyncStorage.getItem("@token");
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
      state.user = action.payload.data.email;
      state.name = action.payload.data.name;
    },
    signUpFailed(state, action) {
      state.isAuth = false;
      state.error = action.payload.error;
    },
    signUpSucceded(state, action) {
      state.isAuth = true;
      state.token = action.payload.data.token;
      state.user = action.payload.data.email;
      state.name = action.payload.data.name;
    },
    logOut(state, action) {
      state.isAuth = false;
      state.status = "idle";
      state.token = null;
      state.user = null;
      state.error = null;
      state.name = null;
    },
  },
  extraReducers: {
    [signUp.pending]: (state, action) => {
      state.status = "loading";
    },
    [signUp.fulfilled]: (state, action) => {
      state.status = "succeeded";
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
    },
    [signIn.rejected]: (state, action) => {
      state.status = "failed";
      state.isAuth = false;
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

export const {
  loginSucceded,
  loginFailed,
  signUpFailed,
  signUpSucceded,
  logOut,
} = userSlice.actions;

export default userSlice.reducer;

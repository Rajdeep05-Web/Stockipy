import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api/api.js";

const API_URL_AUTH = "/api/v1/auth";

//async thunk to create a new user
export const createUser = createAsyncThunk("user/signup", async (user, { rejectWithValue }) => {
  try {
    const { data } = await API.post(`${API_URL_AUTH}/signup`, user);
    return data;
  } catch (error) {
    return rejectWithValue(error?.response?.data.error || error.message);
  }
});

//async thunk to login a user
export const loginUser = createAsyncThunk("user/login", async (user, { rejectWithValue }) => {
  try {
    const { data } = await API.post(`${API_URL_AUTH}/login`, user);
    return data;
  } catch (error) {
    return rejectWithValue(error?.response?.data.error || error.message);
  }
});

//async thunk to logout a user
export const logOutUser = createAsyncThunk("user/Logout", async (userData, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`${API_URL_AUTH}/logout/${userData._id}`, userData);
    return data;
  } catch (error) {
    return rejectWithValue(error?.response?.data.error || error.message);
  }
});
export const googleAuth = createAsyncThunk("user/googleAuth", async (googleAccessToken, { rejectWithValue }) => {
  try {
    const { data } = await API.post(`${API_URL_AUTH}/google-signin`, {}, {
      headers: {
        Authorization: `Bearer ${googleAccessToken}`,
      }
    });
    return data;
  } catch (error) {
    return rejectWithValue(error?.response?.data.error || error.message);
  }
});

//verify user
export const verifyUserOnPageLoad = createAsyncThunk("user/Verify", async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.post(`${API_URL_AUTH}/verify-user`, {});
    return data;
  } catch (error) {
    return rejectWithValue(error?.response?.data.error || error.message);
  }
});

export const forgetPassword = createAsyncThunk("user/ForgetPassword", async (email, { rejectWithValue }) => {
  try {
    const { data } = await API.post(`${API_URL_AUTH}/forget-password`, { email });
    return data;
  } catch (error) {
    return rejectWithValue(error?.response?.data.error || error.message);
  }
})

export const verifyOTP = createAsyncThunk("user/verifyOTP", async ({ email, otp }, { rejectWithValue }) => {
  try {
    const { data } = await API.post(`${API_URL_AUTH}/verify-otp`, { email, otp });
    return data;
  } catch (error) {
    return rejectWithValue(error?.response?.data.error || error.message);
  }
})

export const resetPassword = createAsyncThunk("user/resetPassword", async (obj, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`${API_URL_AUTH}/reset-password`, { ...obj });
    return data;
  } catch (error) {
    return rejectWithValue(error?.response?.data.error || error.message);
  }
})

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: false,
  loading: false,
  error: false,
  message: null,
  token: localStorage.getItem('token') || null,
  otpSent: false,
  otpLoading: false,
  otpVerified: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,

  //reducers for synchronous actions
  reducers: {
    //populate user data into local storage and Redux store on successful login
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },

    //resets the auth state
    resetAuthState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },

    //stores the new access token in the Redux store and local storage
    updateAccessToken: (state, action) => {
      // state.loading = false;
      // state.user = action.payload.user;
      state.token = action.payload;
    },

    //sets the loading state to true or false
    setLoader: (state, action) => {
      console.log("Loading state changed");
      state.loading = !state.loading;
      if (action.payload) {
        state.loading = action.payload;
      }
      if (action.payload === false) {
        state.loading = false;
      }
    }
  },

  //extraReducers for async actions
  extraReducers: (builder) => {
    // Extra reducers go here
    builder.

      addCase(createUser.pending, (state) => {
        state.loading = true;
        state.message = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.message = action.payload.message;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload.error;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.message = action.payload.message;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(googleAuth.pending, (state) => {
        state.loading = true;
        state.message = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Update user data from Google sign-in
        state.token = action.payload.token; // Update token from Google sign-in
        state.isAuthenticated = true;
        state.message = action.payload.message;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
        state.user = null;
        state.token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      })

      .addCase(logOutUser.pending, (state) => {
        state.loading = true;
        state.message = null;
      })
      .addCase(logOutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.message = action.payload.message;
        state.isAuthenticated = false;
      })
      .addCase(logOutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      })


      .addCase(verifyUserOnPageLoad.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyUserOnPageLoad.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyUserOnPageLoad.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      })

      .addCase(forgetPassword.pending, (state) =>{
        state.otpLoading = true;
        state.message = null;
        state.otpSent = false;
      })
      .addCase(forgetPassword.fulfilled, (state, action) =>{
        state.otpLoading = false;
        state.message = action.payload.message;
        state.otpSent = true;
      })
      .addCase(forgetPassword.rejected, (state, action) =>{
        state.otpLoading = false;
        state.error = action.payload;
        state.message = action.payload;
        state.otpSent = false;
      })

      .addCase(verifyOTP.pending, (state) => {
        state.otpLoading = true;
        state.otpVerified = false;
        state.message = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.otpLoading = false;
        state.otpVerified = true;
        state.message = action.payload.message;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpVerified = false;
        state.message = action.payload;
      })

      .addCase(resetPassword.pending, (state) => {
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.otpVerified = false; 
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.message = action.payload.message;
        state.error = action.payload;
      })

  }
});

export const { resetAuthState, updateAccessToken, setLoader } = authSlice.actions; //exports the actions
export default authSlice.reducer; //exports the reducer async thunk functions
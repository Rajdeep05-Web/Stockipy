import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api/api.js";

const API_URL_AUTH = "http://localhost:5000/api/v1/auth";

//async thunk to create a new user
export const createUser = createAsyncThunk("user/signup", async (user, { rejectWithValue }) => {
  try {
    const {data} = await API.post(`${API_URL_AUTH}/signup`, user);
    return data;
  } catch (error) {
    return rejectWithValue(error?.response?.data.error || error.message);
  }
});

//async thunk to login a user
export const loginUser = createAsyncThunk("user/login", async (user, { rejectWithValue }) => {
  try {
    const {data} = await API.post(`${API_URL_AUTH}/login`, user);
    return data;
  } catch (error) {
    return rejectWithValue(error?.response?.data.error || error.message);
  }
});

//async thunk to logout a user
export const logOutUser = createAsyncThunk("user/Logout", async (userData, { rejectWithValue }) => {
  try {
    const {data} = await API.put(`${API_URL_AUTH}/logout/${userData._id}`, userData);
    return data;
  } catch (error) {
    return rejectWithValue(error?.response?.data.error || error.message);
  }
});




const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: false,
  loading: false,
  error: false,
  message: null,
  token: localStorage.getItem('token') || null,
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
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },

    //stores the new access token in the Redux store and local storage
    updateAccessToken : (state, action) => {
      // state.loading = false;
      // state.user = action.payload.user;
      state.token = action.payload;
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
  }
});

export const { resetAuthState, updateAccessToken } = authSlice.actions; //exports the actions
export default authSlice.reducer; //exports the reducer async thunk functions
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL_AUTH = "http://localhost:5000/api/v1/auth";

export const createUser = createAsyncThunk("user/signup", async (user, { rejectWithValue }) => {
  try {
    const {data} = await axios.post(`${API_URL_AUTH}/signup`, user);
    return data;
  } catch (error) {
    return rejectWithValue(error?.response?.data.error || error.message);
  }
});

export const loginUser = createAsyncThunk("user/login", async (user, { rejectWithValue }) => {
  try {
    const {data} = await axios.post(`${API_URL_AUTH}/login`, user);
    return data;
  } catch (error) {
    return rejectWithValue(error?.response?.data.error || error.message);
  }
});

export const logOutUser = createAsyncThunk("user/Logout", async (userData, { rejectWithValue }) => {
  try {
    const {data} = await axios.delete(`${API_URL_AUTH}/logout`, userData);
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
  token: localStorage.getItem('token') || null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
      resetAuthState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    // Extra reducers go here
    builder.
    addCase(createUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(createUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    })
    .addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(logOutUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(logOutUser.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    })  
    .addCase(logOutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
  }
});

export default authSlice.reducer;
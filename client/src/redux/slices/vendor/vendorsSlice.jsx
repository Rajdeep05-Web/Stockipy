import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL ='http://192.168.29.163:5000/api/v1/vendors' || "http://localhost:5000/api/v1/vendors";

//thunks makes the api call and returns the response data
export const fetchVendors = createAsyncThunk(
  "vendors/fetchVendors",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(API_URL);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);
export const fetchVendor = createAsyncThunk(
  "vendors/fetchVendor",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);
export const addVendor = createAsyncThunk(
  "vendors/addVendor",
  async (vendor, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(API_URL, vendor);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);
export const updateVendor = createAsyncThunk(
  "vendors/updateVendor",
  async ({ id, vendor }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_URL}/${id}`, vendor);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);
export const deleteVendor = createAsyncThunk(
  "vendors/deleteVendor",
  async (vendor, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${vendor._id}`);
      return vendor._id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const vendorsSlice = createSlice({
  name: "vendors",
  initialState: {
    vendors: [],
    status: "idle",
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //thunks returns the response data here
      //fetch vendors
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      //fetch vendor
      .addCase(fetchVendor.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(fetchVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.vendors = state.vendors.some((v) => v._id === action.payload._id)
          ? state.vendors.map((v) =>
              v._id === action.payload._id ? action.payload : v
            )
          : [...state.vendors, action.payload];
      })
      .addCase(fetchVendor.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      //addcreate vendors
      .addCase(addVendor.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(addVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.vendors = action.payload;
      })
      .addCase(addVendor.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      //update vendor
      .addCase(updateVendor.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.vendors = state.vendors.map((vendor) => {
          if (vendor._id === action.payload._id) {
            return action.payload;
          }
          return vendor;
        });
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      //delete vendor
      .addCase(deleteVendor.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        // console.log(action)
        state.vendors = state.vendors.filter(
          (vendor) => vendor._id !== action.payload
        );
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default vendorsSlice.reducer;

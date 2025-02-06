import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";

const API_URL =
  // "http://192.168.29.163:5000/api/v1/stock-ins" ||
  "http://localhost:5000/api/v1/stock-ins";
const API_URL_FILE_UPLOAD = "http://localhost:5000/api/v1/upload";

//Async Actions for product api calls
export const fetchStockIns = createAsyncThunk(
  "stockIn/fetchStockIns",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data.error || error.message);
    }
  }
);

export const fetchStockInById = createAsyncThunk(
  "stockIn/fetchStockInById",
  async () => {}
);

export const addStockIn = createAsyncThunk(
  "stockIn/addStockIn",
  async (stockInDataAll, { rejectWithValue }) => {
    const { stockInData, file } = stockInDataAll;
    let formData; //for the file to be sent as form data to the server
    if (file) {
      formData = new FormData();
      formData.append("invoice", file);
    }
    try {
      const fileUploadResponse = file
        ? await axios.post(API_URL_FILE_UPLOAD, formData, {
            //for the form data to be sent as a file
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : "";
      if (fileUploadResponse) {
        stockInData.fileCloudUrl = fileUploadResponse.data.fileUrl;
      }
      const { data } = await axios.post(`${API_URL}`, stockInData);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data.error || error.message);
    }
  }
);

export const updateStockIn = createAsyncThunk(
  "stockIn/updateStockIn",
  async (stockInUpdateData, { rejectWithValue }) => {
    const { file, stockInData, id } = stockInUpdateData;
    let formData = null;
    if(file){
      formData = new FormData();
      formData.append("invoice", file);
    }
    try {
      const fileUploadResponse = file
        ? await axios.post(API_URL_FILE_UPLOAD, formData, {
            //for the form data to be sent as a file
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : "";
        if (fileUploadResponse) {
          stockInData.fileCloudUrl = fileUploadResponse.data.fileUrl;
        }
      const { data } = await axios.put(`${API_URL}/${id}`, {stockInData});
      return data;
    } catch (error) {
      rejectWithValue(error?.response?.data.error || error.message);
    }
  }
);

export const deleteStockIn = createAsyncThunk(
  "stockIn/deleteStockIn",
  async ({ id }, { rejectWithValue }) => {
    try {
      const { deleteedData } = axios.delete(`${API_URL}/${id}`);
      return deleteedData;
    } catch (error) {
      rejectWithValue(error?.response?.data.error || error.message);
    }
  }
);

const stockInSlice = createSlice({
  name: "stockIns",
  initialState: {
    stockIns: [],
    stockIn: {},
    status: "idle",
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetch stockIns
      .addCase(fetchStockIns.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchStockIns.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.stockIns = action.payload;
      })
      .addCase(fetchStockIns.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })
      //fetch stockIn by id
      .addCase(fetchStockInById.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchStockInById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.stockIn = action.payload;
      })
      .addCase(fetchStockInById.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })
      //add stockIn
      .addCase(addStockIn.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(addStockIn.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.stockIns.push(action.payload);
      })
      .addCase(addStockIn.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(updateStockIn.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(updateStockIn.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        const index = state.stockIns.findIndex(
          (stockIn) => stockIn._id === action.payload._id
        );
        if (index !== -1) {
          state.stockIns[index] = action.payload;
        }
      })
      .addCase(updateStockIn.rejected, (state, action) => {
        state.status = "failed";
        action.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteStockIn.pending, () => {})
      .addCase(deleteStockIn.fulfilled, () => {})
      .addCase(deleteStockIn.rejected, () => {});
  },
});

export default stockInSlice.reducer;

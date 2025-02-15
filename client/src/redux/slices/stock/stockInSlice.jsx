import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";
import { extractPublicId } from 'cloudinary-build-url';

const API_URL =
  // "http://192.168.29.163:5000/api/v1/stock-ins" ||
  "http://localhost:5000/api/v1/stock-ins";
const API_URL_FILE = "http://localhost:5000/api/v1/file";


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
    try {
      //if file is selected
      if (file) {
        //for the file to be sent as form data to the server
        let formData = new FormData();
        formData.append("invoice", file);
        const fileUploadResponse = file
        ? await axios.post(API_URL_FILE, formData, {
          //for the form data to be sent as a file
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        : "";
        if (fileUploadResponse) {
          stockInData.fileCloudUrl = fileUploadResponse.data.fileUrl;
        }
      } else {
        stockInData.fileCloudUrl = "";
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
    try {
      if(file){
        let formData = null;
        formData = new FormData();
        formData.append("invoice", file);
        const fileUploadResponse = file
        ? await axios.post(API_URL_FILE, formData, {
          //for the form data to be sent as a file
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        : "";
        if (fileUploadResponse) {
          //if isFileUpdated true and file is selected -> delete the previous file from cloudinary and update with new file
          const res = await axios.get(`${API_URL}/${id}`);
          let fileCloudUrl = res.data.fileCloudUrl;
          if(fileCloudUrl != ""){
            const public_id = extractPublicId(fileCloudUrl);
            await axios.delete(`${API_URL_FILE}/${public_id}`);
          }
          stockInData.fileCloudUrl = fileUploadResponse.data.fileUrl;
        } 
      } else {
        //if isFileUpdated true and no file is selected -> delete the file from cloudinary(user want to clear the file from db)
        if(stockInData.isFileUpdated){
          const res = await axios.get(`${API_URL}/${id}`);
          let fileCloudUrl = res.data.fileCloudUrl;
          if(fileCloudUrl != ""){
            const public_id = extractPublicId(fileCloudUrl);
            await axios.delete(`${API_URL_FILE}/${public_id}`);
          }
        }  
        //if isFileUpdated false and no file is selected -> keep the previous state for file
        stockInData.fileCloudUrl = "";
      }
      const { data } = await axios.put(`${API_URL}/${id}`, stockInData);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data.error || error.message);
    }
  }
);

export const deleteStockIn = createAsyncThunk(
  "stockIn/deleteStockIn",
  async ({ id }, { rejectWithValue }) => {
    try {
      const { deleteedData } = await axios.delete(`${API_URL}/${id}`);
      return deleteedData;
    } catch (error) {
      return rejectWithValue(error?.response?.data.error || error.message);
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
            (stockIn) => stockIn._id == action.payload._id
          );
          if (index != -1) {
              state.stockIns[index] = action.payload;
          }
        })
        .addCase(updateStockIn.rejected, (state, action) => {
            state.status = "failed";
            state.loading = false;
            state.error = action.payload;
      })

      .addCase(deleteStockIn.pending, () => {})
      .addCase(deleteStockIn.fulfilled, () => {})
      .addCase(deleteStockIn.rejected, () => {});
  },
});

export default stockInSlice.reducer;

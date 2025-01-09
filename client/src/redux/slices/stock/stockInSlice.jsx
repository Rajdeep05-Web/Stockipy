import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://192.168.29.163:5000/api/v1/stock-ins' || 'http://localhost/api/v1/stock-ins'  ;

export const fetchStockIns = createAsyncThunk('stockIn/fetchStockIns', async (_, {rejectWithValue}) => {
    try {
        const {data} = await axios.get(`${API_URL}`);
        return data;
    } catch (error) {
         return rejectWithValue(error?.response?.data.error || error.message);
    }
});
export const fetchStockInById = createAsyncThunk('stockIn/fetchStockInById', async () => {});
export const addStockIn = createAsyncThunk('stockIn/addStockIn', async (stockInData,{rejectWithValue}) => {
    try {
        const {data} = await axios.post(`${API_URL}`, stockInData);
        return data;
    } catch (error) {  
        return rejectWithValue(error?.response?.data.error || error.message);
    }
});
export const updateStockIn = createAsyncThunk('stockIn/updateStockIn', async () => {});
export const deleteStockIn = createAsyncThunk('stockIn/deleteStockIn', async () => {});

const stockInSlice = createSlice({
    name: 'stockIns',
    initialState: {
        stockIns : [],
        stockIn: {},
        status: 'idle',
        error: null,
        loading: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        //fetch stockIns
        .addCase(fetchStockIns.pending, (state) => {
            state.status = 'loading';
            state.loading = true;
        })
        .addCase(fetchStockIns.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.loading = false;
            state.stockIns = action.payload;
        })
        .addCase(fetchStockIns.rejected, (state, action) => {
            state.status = 'failed';
            state.loading = false;
            state.error = action.payload;
        })
        //fetch stockIn by id
        .addCase(fetchStockInById.pending, (state) => {
            state.status = 'loading';
            state.loading = true;
        })
        .addCase(fetchStockInById.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.loading = false;
            state.stockIn = action.payload;
        })
        .addCase(fetchStockInById.rejected, (state, action) => {
            state.status = 'failed';
            state.loading = false;
            state.error = action.payload;
        })
        //add stockIn
        .addCase(addStockIn.pending, (state) => {
            state.status = 'loading';
            state.loading = true;
        })
        .addCase(addStockIn.fulfilled, (state, action) => {
            state.loading = false;
            state.status = 'succeeded';
            state.stockIns.push(action.payload);
        })
        .addCase(addStockIn.rejected, (state, action) => {
            state.loading = false;
            state.status = 'failed';
            state.error = action.payload;
        })

        .addCase(updateStockIn.pending, () => {})
        .addCase(updateStockIn.fulfilled, () => {})
        .addCase(updateStockIn.rejected, () => {})

        .addCase(deleteStockIn.pending, () => {})
        .addCase(deleteStockIn.fulfilled, () => {})
        .addCase(deleteStockIn.rejected, () => {})
    }
})

export default stockInSlice.reducer;
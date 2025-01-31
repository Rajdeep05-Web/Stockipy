import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = 
// 'http://192.168.29.163:5000/api/v1/customers' || 
"http://localhost:5000/api/v1/customers";

export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async () => {
    const  {data}  = await axios.get(API_URL);
    // console.log(data);
    return data;
});
export const fetchCustomer = createAsyncThunk('customers/fetchCustomer', async (id) => {
    // const { data } = await axios.get(`${API_URL}/${id}`);
    // return data;
});
export const addCustomer = createAsyncThunk('customers/addCustomer', async (customer, {rejectWithValue }) => {//
    try {
        const { data } = await axios.post(`${API_URL}`, customer);
        return data;
        
    } catch (error) {
         // If error.response exists, return the error message; otherwise return a generic message
      return rejectWithValue(error.response?.data?.error || error.message);
    }
});
export const updateCustomer = createAsyncThunk('customers/updateCustomer', async ({ id, customer }, {rejectWithValue}) => {
    try {
        const { data } = await axios.put(`${API_URL}/${id}`, customer);
        return data;  
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});
export const deleteCustomer = createAsyncThunk('customers/deleteCustomer', async (customer) => {
    await axios.delete(`${API_URL}/${customer._id}`);
    return customer._id;
});

const customersSlice = createSlice({
    name: "customers",
    initialState: {
        customers: [],
        status: 'idle',
        error: null,
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            //fetchCustomers
            .addCase(fetchCustomers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.loading = true;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.customers = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.error.message;
            })
            //fetchCustomer
            .addCase(fetchCustomer.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
            })
            .addCase(fetchCustomer.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.customers = action.payload;
            })
            .addCase(fetchCustomer.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.error.message;
            })
            //addCustomer
            .addCase(addCustomer.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
            })
            .addCase(addCustomer.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.customers.push(action.payload);
            })
            .addCase(addCustomer.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload; //error msg from backend
                // console.log(action);
            })

            //updateCustomer
            .addCase(updateCustomer.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.customers = state.customers.map((customer) => {
                    if (customer._id === action.payload._id) {
                        return action.payload;
                    }
                    return customer;
                });
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload; //error msg from backend
            })

            //deteteCustomer
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.customers = state.customers.filter((customer) => customer._id !== action.payload);
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteCustomer.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
            })
    }

})


export default customersSlice.reducer;
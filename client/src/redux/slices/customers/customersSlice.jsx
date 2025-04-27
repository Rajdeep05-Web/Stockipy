import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api/api.js";
import {jwtDecode}  from "jwt-decode";


const API_URL = "/api/v1/customers";
const userStr = localStorage?.getItem("user") || "";
const userId = userStr ? JSON.parse(userStr)?._id : undefined;

export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async (_, {rejectWithValue}) => {
    try {
        const  {data}  = await API.get(`${API_URL}/${userId}`);
        return data?.customerDetails;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});
export const fetchCustomer = createAsyncThunk('customers/fetchCustomer', async (id) => {
    const { data } = await API.get(`${API_URL}/${id}`);
    return data;
});
export const addCustomer = createAsyncThunk('customers/addCustomer', async (clentData, {rejectWithValue }) => {
    try {
        console.log("Step 1 ");

        const customer = clentData.newCustomer;
        // const accessToken = clentData.token;

        //readable token expire time in ist
        // const decoded = jwtDecode(accessToken);
        // const exp = new Date(decoded.exp * 1000).toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
        // console.log("Token expire time: ", exp);

        const { data } = await API.post(`${API_URL}/${userId}`, customer);
        return data?.customerDetails;
        
    } catch (error) {
         // If error.response exists, return the error message; otherwise return a generic message
      return rejectWithValue(error.response?.data?.error || error.message);
    }
});
export const updateCustomer = createAsyncThunk('customers/updateCustomer', async ({ id, customer }, {rejectWithValue}) => {
    console.log("Step 2 ", id, customer);
    try {
        const { data } = await API.put(`${API_URL}/${userId}/${id}`, customer);
        console.log("Step 2 ", data);
        return data;  
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});
export const deleteCustomer = createAsyncThunk('customers/deleteCustomer', async (customer) => {
    await API.delete(`${API_URL}/${customer._id}`);
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
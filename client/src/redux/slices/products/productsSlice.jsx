import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from "../../../api/api.js";

const API_URL =
//  'http://192.168.29.163:5000/api/v1/products' ||
  '/api/v1/products';

//productsSlice - contains the state and reducers for products

//Async Actions for product api calls
export const fetchProducts = createAsyncThunk('products/fetchProducts', //name of the action
async (_, {rejectWithValue}) => {
    try {
        const { data } = await API.get(API_URL);
        return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
});
export const fetchProduct = createAsyncThunk('products/fetchProduct', async (id,{rejectWithValue}) => {
    try {
        const {data} = await API.get(`${API_URL}/${id}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});
export const addProduct = createAsyncThunk('products/addProduct', async (product,{rejectWithValue}) => {
    try {
       const {data}  = await API.post(API_URL, product);
       return data; 
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
   }
}); 
export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, product }, {rejectWithValue}) => {
    try {
        const {data} = await API.put(`${API_URL}/${id}`, product);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});
export const deleteProduct = createAsyncThunk('products/deleteProducts', async (product, {rejectWithValue}) => {
    try {
        await API.delete(`${API_URL}/${product._id}`);
        return product._id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || error.message);
    }
});

//productsSlice
const productsSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        status: "idle", // 'idle', 'loading', 'succeeded', 'failed'
        error: null,
        loading: false,
    },
    reducers: {}, 
    extraReducers: (builder) => { //used for async actions only
        builder
        //handles the action types defined by the `fetchProducts` thunk
       // Fetch Products
     .addCase( fetchProducts.pending, (state) => { 
        state.status = 'loading';
        state.error = null;
        state.loading = true;
     })
     .addCase( fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.products = action.payload;
    })
    .addCase( fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
    })
    //fetch Product
    .addCase(fetchProduct.fulfilled, (state,action) => {
        state.status = "succeeded";
        state.loading = false;
        state.products = action.payload;
    })
    .addCase(fetchProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
    })
    .addCase(fetchProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.loading = true
    })
     // Add Product
     .addCase(addProduct.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.loading = false;
        state.status = "succeeded";
        state.products = action.payload;
    }) 
    .addCase(addProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
    })
    .addCase(addProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.loading = true;
    })
    // Update Product
    .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
            state.products[index] = action.payload;
        }
    })
    .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.loading = false;
    })
    .addCase(updateProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.loading = true;
    })
    // Delete Product
    .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product._id !== action.payload);
    })
    .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
    })
    .addCase(deleteProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.loading = true;
    });
    }, 
});

export default productsSlice.reducer;

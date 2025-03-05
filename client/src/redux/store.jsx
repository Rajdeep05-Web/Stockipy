import { configureStore } from '@reduxjs/toolkit';
import countersReducer from './slices/counter/counterSlice';
import productsReducer from './slices/products/productsSlice';
import customersReducer from './slices/customers/customersSlice';
import vendorsReducer from './slices/vendor/vendorsSlice';
import stockInReducer from './slices/stock/stockInSlice';
import fileReducer from './slices/file/fileSlice';
import authReducer from './slices/auth/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    counter: countersReducer,
    products: productsReducer,
    customers: customersReducer,
    vendors: vendorsReducer,
    stockIns: stockInReducer,
    file: fileReducer,
  },
})

export default store;
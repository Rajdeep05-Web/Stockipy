import { configureStore } from '@reduxjs/toolkit';
import countersReducer from './slices/counter/counterSlice';
import productsReducer from './slices/products/productsSlice';
import customersReducer from './slices/customers/customersSlice';
import vendorsReducer from './slices/vendor/vendorsSlice';
import stockInReducer from './slices/stock/stockInSlice';
import fileReducer from './slices/file/fileSlice';

const store = configureStore({
  reducer: {
    counter: countersReducer,
    products: productsReducer,
    customers: customersReducer,
    vendors: vendorsReducer,
    stockIns: stockInReducer,
    file: fileReducer,
  },
})

export default store;
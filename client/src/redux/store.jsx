import { configureStore } from '@reduxjs/toolkit';
import countersReducer from './slices/counter/counterSlice';
import productsReducer from './slices/products/productsSlice';
import customersReducer from './slices/customers/customersSlice';
import vendorsReducer from './slices/vendor/vendorsSlice';
import stockInReducer from './slices/stock/stockInSlice';

const store = configureStore({
  reducer: {
    counter: countersReducer,
    products: productsReducer,
    customers: customersReducer,
    vendors: vendorsReducer,
    stockIns: stockInReducer
  },
})

export default store;
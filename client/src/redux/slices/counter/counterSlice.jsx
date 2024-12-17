import { createSlice } from '@reduxjs/toolkit'

const countersSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment : (state) => state + 1,
    decrement : (state) => state - 1,
  },
})

export const { increment, decrement } = countersSlice.actions
export default countersSlice.reducer
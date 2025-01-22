// src/redux/slices/fileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  file: null,
  previewURL: '',
};

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: { //reducers for synchronous actions
    setFile: (state, action) => {
      state.file = action.payload.file;
      state.previewURL = action.payload.previewURL;
    },
    clearFile: (state) => {
      state.file = null;
      state.previewURL = '';
    },
  },
});

export const { setFile, clearFile } = fileSlice.actions;
export default fileSlice.reducer;

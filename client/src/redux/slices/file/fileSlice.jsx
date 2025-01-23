// src/redux/slices/fileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  file: null,
  previewURL: '',
  uploadStatus: 'idle', // 'idle' | 'uploading' | 'succeeded' | 'failed'
  uploadError: null,
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
      state.uploadStatus = 'idle';
      state.uploadError = null;
    },
  },
});

export const { setFile, clearFile } = fileSlice.actions;
export default fileSlice.reducer;

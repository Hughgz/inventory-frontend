import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 🎯 Async thunk để gọi API tạo phiếu nhập
export const createImportReceipt = createAsyncThunk(
  'importReceipts/create',
  async ({ data, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/import-receipts?userId=${userId}`,
        data
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const importReceiptSlice = createSlice({
  name: 'importReceipts',
  initialState: {
    loading: false,
    error: null,
    createdReceipt: null,
  },
  reducers: {
    resetImportReceipt(state) {
      state.loading = false;
      state.error = null;
      state.createdReceipt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createImportReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createImportReceipt.fulfilled, (state, action) => {
        state.loading = false;
        state.createdReceipt = action.payload;
      })
      .addCase(createImportReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetImportReceipt } = importReceiptSlice.actions;
export default importReceiptSlice.reducer;

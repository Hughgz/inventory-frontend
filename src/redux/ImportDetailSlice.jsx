import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as importDetailApi from '../api/importDetailApi';

// Async thunk để lấy chi tiết phiếu nhập theo mã phiếu nhập
export const fetchImportDetailsByReceiptId = createAsyncThunk(
  'importDetails/fetchByReceiptId',
  async (importReceiptId, { rejectWithValue }) => {
    try {
      const response = await importDetailApi.getImportDetailsByReceiptId(importReceiptId);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk để lấy chi tiết phiếu nhập theo ID của chi tiết
export const fetchImportDetailById = createAsyncThunk(
  'importDetails/fetchById',
  async (importDetailId, { rejectWithValue }) => {
    try {
      const response = await importDetailApi.getImportDetailById(importDetailId);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk để lấy chi tiết phiếu nhập kèm thông tin vật tư
export const fetchImportDetailsWithMaterialByReceiptId = createAsyncThunk(
  'importDetails/fetchWithMaterialByReceiptId',
  async (importReceiptId, { rejectWithValue }) => {
    try {
      const response = await importDetailApi.getImportDetailsWithMaterialByReceiptId(importReceiptId);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const importDetailSlice = createSlice({
  name: 'importDetails',
  initialState: {
    loading: false,
    error: null,
    importDetails: [],
    currentImportDetail: null,
    importDetailsWithMaterial: []
  },
  reducers: {
    clearImportDetailError(state) {
      state.error = null;
    },
    resetImportDetails(state) {
      state.importDetails = [];
      state.currentImportDetail = null;
      state.importDetailsWithMaterial = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch import details by receipt ID
      .addCase(fetchImportDetailsByReceiptId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImportDetailsByReceiptId.fulfilled, (state, action) => {
        state.loading = false;
        state.importDetails = action.payload;
      })
      .addCase(fetchImportDetailsByReceiptId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch import detail by ID
      .addCase(fetchImportDetailById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImportDetailById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentImportDetail = action.payload;
      })
      .addCase(fetchImportDetailById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch import details with material by receipt ID
      .addCase(fetchImportDetailsWithMaterialByReceiptId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImportDetailsWithMaterialByReceiptId.fulfilled, (state, action) => {
        state.loading = false;
        state.importDetailsWithMaterial = action.payload;
      })
      .addCase(fetchImportDetailsWithMaterialByReceiptId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearImportDetailError, resetImportDetails } = importDetailSlice.actions;
export default importDetailSlice.reducer; 
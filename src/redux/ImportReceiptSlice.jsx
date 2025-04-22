import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as importReceiptApi from '../api/importReceiptApi';

// 🎯 Async thunk để gọi API tạo phiếu nhập
export const createImportReceipt = createAsyncThunk(
  'importReceipts/create',
  async ({ data, userId }, { rejectWithValue }) => {
    try {
      const response = await importReceiptApi.createImportReceipt(data, userId);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Lấy tất cả phiếu nhập kho
export const fetchAllImportReceipts = createAsyncThunk(
  'importReceipts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await importReceiptApi.getAllImportReceipts();
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Lấy phiếu nhập kho theo ID
export const fetchImportReceiptById = createAsyncThunk(
  'importReceipts/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await importReceiptApi.getImportReceiptById(id);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Tìm kiếm phiếu nhập kho
export const searchImportReceipts = createAsyncThunk(
  'importReceipts/search',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await importReceiptApi.searchImportReceipts(searchParams);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Phê duyệt phiếu nhập kho
export const approveImportReceipt = createAsyncThunk(
  'importReceipts/approve',
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      const response = await importReceiptApi.approveImportReceipt(id, userId);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Hủy phiếu nhập kho
export const cancelImportReceipt = createAsyncThunk(
  'importReceipts/cancel',
  async ({ id, userId, reason }, { rejectWithValue }) => {
    try {
      const response = await importReceiptApi.cancelImportReceipt(id, userId, reason);
      return response;
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
    importReceipts: [],
    currentReceipt: null,
    searchResults: []
  },
  reducers: {
    resetImportReceipt(state) {
      state.loading = false;
      state.error = null;
      state.createdReceipt = null;
    },
    clearError(state) {
      state.error = null;
    },
    resetCurrentReceipt(state) {
      state.currentReceipt = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create import receipt
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
      })
      
      // Fetch all import receipts
      .addCase(fetchAllImportReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllImportReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.importReceipts = action.payload;
      })
      .addCase(fetchAllImportReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch import receipt by ID
      .addCase(fetchImportReceiptById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImportReceiptById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReceipt = action.payload;
      })
      .addCase(fetchImportReceiptById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Search import receipts
      .addCase(searchImportReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchImportReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchImportReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Approve import receipt
      .addCase(approveImportReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveImportReceipt.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật trạng thái của phiếu trong danh sách nếu nó tồn tại
        if (state.importReceipts.length > 0) {
          state.importReceipts = state.importReceipts.map(receipt => 
            receipt.id === action.payload.id ? action.payload : receipt
          );
        }
        // Cập nhật phiếu hiện tại nếu đang xem
        if (state.currentReceipt && state.currentReceipt.id === action.payload.id) {
          state.currentReceipt = action.payload;
        }
      })
      .addCase(approveImportReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Cancel import receipt
      .addCase(cancelImportReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelImportReceipt.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật trạng thái của phiếu trong danh sách nếu nó tồn tại
        if (state.importReceipts.length > 0) {
          state.importReceipts = state.importReceipts.map(receipt => 
            receipt.id === action.payload.id ? action.payload : receipt
          );
        }
        // Cập nhật phiếu hiện tại nếu đang xem
        if (state.currentReceipt && state.currentReceipt.id === action.payload.id) {
          state.currentReceipt = action.payload;
        }
      })
      .addCase(cancelImportReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetImportReceipt, clearError, resetCurrentReceipt } = importReceiptSlice.actions;
export default importReceiptSlice.reducer;

// redux/ExportReceiptSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as exportReceiptApi from '../api/exportReceiptApi';

// 🎯 Async thunk để gọi API tạo phiếu xuất kho
export const createExportReceipt = createAsyncThunk(
  'exportReceipts/create',
  async ({ data, userId }, { rejectWithValue }) => {
    try {
      const response = await exportReceiptApi.createExportReceipt(data, userId);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Lấy tất cả phiếu xuất kho
export const fetchAllExportReceipts = createAsyncThunk(
  'exportReceipts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await exportReceiptApi.getAllExportReceipts();
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Lấy phiếu xuất kho theo ID
export const fetchExportReceiptById = createAsyncThunk(
  'exportReceipts/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await exportReceiptApi.getExportReceiptById(id);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Tìm kiếm phiếu xuất kho
export const searchExportReceipts = createAsyncThunk(
  'exportReceipts/search',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await exportReceiptApi.searchExportReceipts(searchParams);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Phê duyệt phiếu xuất kho
export const approveExportReceipt = createAsyncThunk(
  'exportReceipts/approve',
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      const response = await exportReceiptApi.approveExportReceipt(id, userId);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Hủy phiếu xuất kho
export const cancelExportReceipt = createAsyncThunk(
  'exportReceipts/cancel',
  async ({ id, userId, reason }, { rejectWithValue }) => {
    try {
      const response = await exportReceiptApi.cancelExportReceipt(id, userId, reason);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Lấy phiếu xuất kho theo trạng thái
export const fetchExportReceiptsByStatus = createAsyncThunk(
  'exportReceipts/fetchByStatus',
  async (status, { rejectWithValue }) => {
    try {
      const response = await exportReceiptApi.getExportReceiptsByStatus(status);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const exportReceiptSlice = createSlice({
  name: 'exportReceipts',
  initialState: {
    loading: false,
    error: null,
    createdReceipt: null,
    exportReceipts: [],
    currentReceipt: null,
    searchResults: []
  },
  reducers: {
    resetExportReceipt(state) {
      state.loading = false;
      state.error = null;
      state.createdReceipt = null;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create export receipt
      .addCase(createExportReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExportReceipt.fulfilled, (state, action) => {
        state.loading = false;
        state.createdReceipt = action.payload;
      })
      .addCase(createExportReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch all export receipts
      .addCase(fetchAllExportReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllExportReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.exportReceipts = action.payload;
      })
      .addCase(fetchAllExportReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch export receipt by ID
      .addCase(fetchExportReceiptById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExportReceiptById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReceipt = action.payload;
      })
      .addCase(fetchExportReceiptById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Search export receipts
      .addCase(searchExportReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchExportReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchExportReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Approve export receipt
      .addCase(approveExportReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveExportReceipt.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật trạng thái của phiếu trong danh sách nếu nó tồn tại
        if (state.exportReceipts.length > 0) {
          state.exportReceipts = state.exportReceipts.map(receipt => 
            receipt.id === action.payload.id ? action.payload : receipt
          );
        }
        // Cập nhật phiếu hiện tại nếu đang xem
        if (state.currentReceipt && state.currentReceipt.id === action.payload.id) {
          state.currentReceipt = action.payload;
        }
      })
      .addCase(approveExportReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Cancel export receipt
      .addCase(cancelExportReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelExportReceipt.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật trạng thái của phiếu trong danh sách nếu nó tồn tại
        if (state.exportReceipts.length > 0) {
          state.exportReceipts = state.exportReceipts.map(receipt => 
            receipt.id === action.payload.id ? action.payload : receipt
          );
        }
        // Cập nhật phiếu hiện tại nếu đang xem
        if (state.currentReceipt && state.currentReceipt.id === action.payload.id) {
          state.currentReceipt = action.payload;
        }
      })
      .addCase(cancelExportReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch export receipts by status
      .addCase(fetchExportReceiptsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExportReceiptsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.exportReceipts = action.payload;
      })
      .addCase(fetchExportReceiptsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetExportReceipt, clearError } = exportReceiptSlice.actions;
export default exportReceiptSlice.reducer;

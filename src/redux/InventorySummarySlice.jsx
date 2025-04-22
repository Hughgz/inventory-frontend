import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getInventorySummary } from '../api/inventoryApi';

// Hàm helper để chuyển đổi timestamp thành đối tượng Date
export const getDateFromTimestamp = (timestamp) => new Date(timestamp);

// Hàm helper để lấy ngày đầu tháng hiện tại
export const getFirstDayOfCurrentMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
};

// Async thunk để gọi API lấy dữ liệu tổng hợp xuất nhập tồn
export const fetchInventorySummary = createAsyncThunk(
  'inventorySummary/fetch',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      // Chuyển đổi timestamp thành đối tượng Date trước khi gửi API
      const startDateObj = typeof startDate === 'number' ? new Date(startDate) : startDate;
      const endDateObj = typeof endDate === 'number' ? new Date(endDate) : endDate;
      
      const response = await getInventorySummary(startDateObj, endDateObj);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const inventorySummarySlice = createSlice({
  name: 'inventorySummary',
  initialState: {
    summaryData: [],
    loading: false,
    error: null,
    dateRange: {
      // Lưu trữ timestamp thay vì đối tượng Date
      startDate: getFirstDayOfCurrentMonth(),
      endDate: new Date().getTime()
    }
  },
  reducers: {
    setDateRange(state, action) {
      // Xử lý cả trường hợp nếu action.payload có chứa đối tượng Date
      if (action.payload.startDate instanceof Date) {
        state.dateRange.startDate = action.payload.startDate.getTime();
      } else {
        state.dateRange.startDate = action.payload.startDate;
      }
      
      if (action.payload.endDate instanceof Date) {
        state.dateRange.endDate = action.payload.endDate.getTime();
      } else {
        state.dateRange.endDate = action.payload.endDate;
      }
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventorySummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventorySummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summaryData = action.payload;
      })
      .addCase(fetchInventorySummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Không thể tải dữ liệu. Vui lòng thử lại sau.';
      });
  },
});

export const { setDateRange, clearError } = inventorySummarySlice.actions;
export default inventorySummarySlice.reducer; 
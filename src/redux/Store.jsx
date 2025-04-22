import { configureStore } from '@reduxjs/toolkit';
import importReceiptReducer from './ImportReceiptSlice';
import exportReceiptReducer from './ExportReceiptSlice';
import customerReducer from './CustomerSlice';
import authReducer from './AuthSlice';
import inventorySummaryReducer from './InventorySummarySlice';
import importDetailReducer from './ImportDetailSlice';
import { setupAxiosInterceptors } from '../api/authApi';

// Setup axios interceptors to add the token to all requests
setupAxiosInterceptors();

const store = configureStore({
  reducer: {
    importReceipts: importReceiptReducer,
    exportReceipts: exportReceiptReducer,
    customers: customerReducer,
    auth: authReducer,
    inventorySummary: inventorySummaryReducer,
    importDetails: importDetailReducer,
    // thêm reducer khác nếu có
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Bỏ qua việc kiểm tra các action types này
        ignoredActions: [
          'inventorySummary/setDateRange',
          'inventorySummary/fetch',
        ],
        // Bỏ qua các paths này trong state
        ignoredPaths: [
          'inventorySummary.dateRange.startDate',
          'inventorySummary.dateRange.endDate',
        ],
      },
    }),
});

export default store;

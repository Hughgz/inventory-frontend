import { configureStore } from '@reduxjs/toolkit';
import importReceiptReducer from './ImportReceiptSlice';

const store = configureStore({
  reducer: {
    importReceipts: importReceiptReducer,
    // thêm reducer khác nếu có
  },
});

export default store;

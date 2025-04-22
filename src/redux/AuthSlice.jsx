import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../api/authApi';

// Get user from local storage if available
const user = authApi.getCurrentUser();

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({ phoneNumber, password }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(phoneNumber, password);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại";
      return rejectWithValue(message);
    }
  }
);

// Async thunk for registration
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại";
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  user: user ? user : null,
  isLoggedIn: !!user,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authApi.logout();
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 
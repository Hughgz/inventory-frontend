import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as customerApi from '../api/customerApi';

// Async thunks
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const data = await customerApi.getAllCustomers();
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to fetch customers');
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchCustomerById',
  async (customerId, { rejectWithValue }) => {
    try {
      const data = await customerApi.getCustomerById(customerId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to fetch customer');
    }
  }
);

export const createCustomerAsync = createAsyncThunk(
  'customers/createCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      const data = await customerApi.createCustomer(customerData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to create customer');
    }
  }
);

export const updateCustomerAsync = createAsyncThunk(
  'customers/updateCustomer',
  async ({ customerId, customerData }, { rejectWithValue }) => {
    try {
      const data = await customerApi.updateCustomer(customerId, customerData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to update customer');
    }
  }
);

export const toggleCustomerStatusAsync = createAsyncThunk(
  'customers/toggleCustomerStatus',
  async ({ customerId, isActive }, { rejectWithValue }) => {
    try {
      await customerApi.updateCustomerStatus(customerId, isActive);
      return { customerId, isActive };
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to update customer status');
    }
  }
);

const initialState = {
  customers: [],
  selectedCustomer: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

export const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all customers
      .addCase(fetchCustomers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch customer by ID
      .addCase(fetchCustomerById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Create customer
      .addCase(createCustomerAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCustomerAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.customers.push(action.payload);
      })
      .addCase(createCustomerAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update customer
      .addCase(updateCustomerAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCustomerAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.customers.findIndex(customer => customer.customerId === action.payload.customerId);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      .addCase(updateCustomerAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Toggle customer status
      .addCase(toggleCustomerStatusAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(toggleCustomerStatusAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { customerId, isActive } = action.payload;
        const index = state.customers.findIndex(customer => customer.customerId === customerId);
        if (index !== -1) {
          state.customers[index].isActive = isActive;
        }
      })
      .addCase(toggleCustomerStatusAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearSelectedCustomer, clearError } = customerSlice.actions;

export default customerSlice.reducer; 
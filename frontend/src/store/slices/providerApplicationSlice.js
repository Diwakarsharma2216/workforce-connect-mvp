import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

// Async thunk for creating an application (provider applying on behalf of craftworker)
export const createProviderApplication = createAsyncThunk(
  'providerApplication/create',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/provider/applications', applicationData);
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to create application');
      }

      toast.success('Application submitted successfully!');
      return data.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to create application');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

// Async thunk for listing provider applications
export const listProviderApplications = createAsyncThunk(
  'providerApplication/list',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) {
        queryParams.append('status', filters.status);
      }

      const url = queryParams.toString() 
        ? `/provider/applications?${queryParams.toString()}`
        : '/provider/applications';

      const response = await axiosInstance.get(url);
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to fetch applications');
      }

      return data.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch applications');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

const initialState = {
  applications: [],
  loading: false,
  error: null,
};

const providerApplicationSlice = createSlice({
  name: 'providerApplication',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create provider application reducers
    builder
      .addCase(createProviderApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProviderApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload); // Add new application at the beginning
        state.error = null;
      })
      .addCase(createProviderApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // List provider applications reducers
    builder
      .addCase(listProviderApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listProviderApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
        state.error = null;
      })
      .addCase(listProviderApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = providerApplicationSlice.actions;
export default providerApplicationSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

// Async thunk for creating an application
export const createApplication = createAsyncThunk(
  'application/create',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/craftworker/applications', applicationData);
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

// Async thunk for listing applications
export const listApplications = createAsyncThunk(
  'application/list',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) {
        queryParams.append('status', filters.status);
      }

      const url = queryParams.toString() 
        ? `/craftworker/applications?${queryParams.toString()}`
        : '/craftworker/applications';

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

// Async thunk for getting a single application
export const getApplication = createAsyncThunk(
  'application/get',
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/craftworker/applications/${applicationId}`);
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to fetch application');
      }

      return data.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch application');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

// Async thunk for deleting/withdrawing an application
export const deleteApplication = createAsyncThunk(
  'application/delete',
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/craftworker/applications/${applicationId}`);
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to withdraw application');
      }

      toast.success('Application withdrawn successfully!');
      return applicationId;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to withdraw application');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

const initialState = {
  applications: [],
  currentApplication: null,
  loading: false,
  error: null,
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
  },
  extraReducers: (builder) => {
    // Create application reducers
    builder
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload); // Add new application at the beginning
        state.error = null;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // List applications reducers
    builder
      .addCase(listApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
        state.error = null;
      })
      .addCase(listApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get application reducers
    builder
      .addCase(getApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload;
        state.error = null;
      })
      .addCase(getApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete application reducers
    builder
      .addCase(deleteApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = state.applications.filter(app => app._id !== action.payload);
        if (state.currentApplication && state.currentApplication._id === action.payload) {
          state.currentApplication = null;
        }
        state.error = null;
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentApplication } = applicationSlice.actions;
export default applicationSlice.reducer;


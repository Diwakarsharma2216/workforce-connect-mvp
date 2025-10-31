import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';

// Async thunk for listing public jobs (for providers to browse)
export const listProviderJobs = createAsyncThunk(
  'providerJob/list',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.location) {
        queryParams.append('location', filters.location);
      }
      if (filters.skills && filters.skills.length > 0) {
        filters.skills.forEach(skill => queryParams.append('skills', skill));
      }
      if (filters.status) {
        queryParams.append('status', filters.status);
      }

      const url = queryParams.toString() 
        ? `/provider/jobs?${queryParams.toString()}`
        : '/provider/jobs';

      const response = await axiosInstance.get(url);
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to fetch jobs');
      }

      return data.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch jobs');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

// Async thunk for getting a single public job
export const getProviderJob = createAsyncThunk(
  'providerJob/get',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/provider/jobs/${jobId}`);
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to fetch job');
      }

      return data.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch job');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

const initialState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
};

const providerJobSlice = createSlice({
  name: 'providerJob',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    // List provider jobs reducers
    builder
      .addCase(listProviderJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listProviderJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
        state.error = null;
      })
      .addCase(listProviderJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get provider job reducers
    builder
      .addCase(getProviderJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProviderJob.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
        state.error = null;
      })
      .addCase(getProviderJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentJob } = providerJobSlice.actions;
export default providerJobSlice.reducer;


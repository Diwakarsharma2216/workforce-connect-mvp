import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';

// Async thunk for listing public jobs (for craftworkers to browse)
export const listPublicJobs = createAsyncThunk(
  'publicJob/list',
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
        ? `/craftworker/jobs?${queryParams.toString()}`
        : '/craftworker/jobs';

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
export const getPublicJob = createAsyncThunk(
  'publicJob/get',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/craftworker/jobs/${jobId}`);
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

const publicJobSlice = createSlice({
  name: 'publicJob',
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
    // List public jobs reducers
    builder
      .addCase(listPublicJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listPublicJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
        state.error = null;
      })
      .addCase(listPublicJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get public job reducers
    builder
      .addCase(getPublicJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPublicJob.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
        state.error = null;
      })
      .addCase(getPublicJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentJob } = publicJobSlice.actions;
export default publicJobSlice.reducer;


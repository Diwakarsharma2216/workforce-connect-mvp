import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

// Async thunk for creating a job
export const createJob = createAsyncThunk(
  'job/create',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/company/jobs', jobData);
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to create job');
      }

      toast.success('Job created successfully!');
      return data.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to create job');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

// Async thunk for listing jobs
export const listJobs = createAsyncThunk(
  'job/list',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) {
        queryParams.append('status', filters.status);
      }

      const url = queryParams.toString() 
        ? `/company/jobs?${queryParams.toString()}`
        : '/company/jobs';

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

// Async thunk for getting a single job
export const getJob = createAsyncThunk(
  'job/get',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/company/jobs/${jobId}`);
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

// Async thunk for updating a job
export const updateJob = createAsyncThunk(
  'job/update',
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/company/jobs/${jobId}`, jobData);
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to update job');
      }

      toast.success('Job updated successfully!');
      return data.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to update job');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

// Async thunk for deleting a job
export const deleteJob = createAsyncThunk(
  'job/delete',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/company/jobs/${jobId}`);
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to delete job');
      }

      toast.success('Job deleted successfully!');
      return jobId;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to delete job');
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

const jobSlice = createSlice({
  name: 'job',
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
    // Create job reducers
    builder
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload); // Add new job at the beginning
        state.error = null;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // List jobs reducers
    builder
      .addCase(listJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
        state.error = null;
      })
      .addCase(listJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get job reducers
    builder
      .addCase(getJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJob.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
        state.error = null;
      })
      .addCase(getJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update job reducers
    builder
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobs.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.currentJob && state.currentJob._id === action.payload._id) {
          state.currentJob = action.payload;
        }
        state.error = null;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete job reducers
    builder
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter(job => job._id !== action.payload);
        if (state.currentJob && state.currentJob._id === action.payload) {
          state.currentJob = null;
        }
        state.error = null;
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;


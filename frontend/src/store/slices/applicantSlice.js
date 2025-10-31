import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

// Async thunk for listing applicants for a job
export const listApplicants = createAsyncThunk(
  'applicant/list',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/company/jobs/${jobId}/applicants`);
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to fetch applicants');
      }

      return { jobId, applicants: data.data };
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch applicants');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

// Async thunk for updating application status
export const updateApplicationStatus = createAsyncThunk(
  'applicant/updateStatus',
  async ({ applicationId, status, notes }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/company/applications/${applicationId}/status`, {
        status,
        notes,
      });
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to update application status');
      }

      const statusText = status === 'approved' ? 'approved' : 'rejected';
      toast.success(`Application ${statusText} successfully!`);
      return data.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to update application status');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

const initialState = {
  applicantsByJob: {}, // { jobId: [applicants] }
  loading: false,
  error: null,
};

const applicantSlice = createSlice({
  name: 'applicant',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearApplicants: (state, action) => {
      if (action.payload) {
        // Clear applicants for a specific job
        delete state.applicantsByJob[action.payload];
      } else {
        // Clear all applicants
        state.applicantsByJob = {};
      }
    },
  },
  extraReducers: (builder) => {
    // List applicants reducers
    builder
      .addCase(listApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.applicantsByJob[action.payload.jobId] = action.payload.applicants;
        state.error = null;
      })
      .addCase(listApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update application status reducers
    builder
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update the applicant in the appropriate job's applicant list
        const updatedApplication = action.payload;
        Object.keys(state.applicantsByJob).forEach(jobId => {
          const applicants = state.applicantsByJob[jobId];
          const index = applicants.findIndex(app => app._id === updatedApplication._id);
          if (index !== -1) {
            state.applicantsByJob[jobId][index] = updatedApplication;
          }
        });
        state.error = null;
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearApplicants } = applicantSlice.actions;
export default applicantSlice.reducer;


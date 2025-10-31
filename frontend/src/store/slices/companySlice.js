import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

// Async thunk for getting company profile
export const getCompanyProfile = createAsyncThunk(
  'company/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/company/profile');
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to fetch company profile');
      }

      return data.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch company profile');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

// Async thunk for updating company profile
export const updateCompanyProfile = createAsyncThunk(
  'company/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/company/profile', profileData);
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to update company profile');
      }

      toast.success('Profile updated successfully!');
      return data.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to update company profile');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get company profile reducers
    builder
      .addCase(getCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(getCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update company profile reducers
    builder
      .addCase(updateCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearProfile } = companySlice.actions;
export default companySlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

// Async thunk for getting craftworker profile
export const getCraftworkerProfile = createAsyncThunk(
  'craftworker/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/craftworker/profile');
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to fetch craftworker profile');
      }

      return data.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch craftworker profile');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

// Async thunk for updating craftworker profile
export const updateCraftworkerProfile = createAsyncThunk(
  'craftworker/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/craftworker/profile', profileData);
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to update craftworker profile');
      }

      toast.success('Profile updated successfully!');
      return data.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to update craftworker profile');
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

const craftworkerSlice = createSlice({
  name: 'craftworker',
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
    // Get craftworker profile reducers
    builder
      .addCase(getCraftworkerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCraftworkerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(getCraftworkerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update craftworker profile reducers
    builder
      .addCase(updateCraftworkerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCraftworkerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateCraftworkerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearProfile } = craftworkerSlice.actions;
export default craftworkerSlice.reducer;


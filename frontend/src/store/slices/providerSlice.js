import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

// Async thunk for getting provider profile
export const getProviderProfile = createAsyncThunk(
  'provider/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/provider/profile');
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to fetch provider profile');
      }

      return data.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch provider profile');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

// Async thunk for updating provider profile
export const updateProviderProfile = createAsyncThunk(
  'provider/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/provider/profile', profileData);
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to update provider profile');
      }

      toast.success('Profile updated successfully!');
      return data.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to update provider profile');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

// Async thunk for getting roster
export const getRoster = createAsyncThunk(
  'provider/getRoster',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/provider/roster');
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to fetch roster');
      }

      return data.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch roster');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

// Async thunk for searching craftworkers
export const searchCraftworkers = createAsyncThunk(
  'provider/searchCraftworkers',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      if (filters.location) {
        queryParams.append('location', filters.location);
      }
      if (filters.skills && filters.skills.length > 0) {
        filters.skills.forEach(skill => queryParams.append('skills', skill));
      }
      if (filters.page) {
        queryParams.append('page', filters.page);
      }
      if (filters.limit) {
        queryParams.append('limit', filters.limit);
      }

      const url = queryParams.toString() 
        ? `/provider/craftworkers/search?${queryParams.toString()}`
        : '/provider/craftworkers/search';

      const response = await axiosInstance.get(url);
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to search craftworkers');
      }

      return data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to search craftworkers');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

// Async thunk for adding craftworker to roster
export const addToRoster = createAsyncThunk(
  'provider/addToRoster',
  async (craftsmanId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/provider/roster', { craftsmanId });
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to add craftworker to roster');
      }

      toast.success('Craftworker added to roster successfully!');
      return data.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to add craftworker to roster');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

// Async thunk for removing craftworker from roster
export const removeFromRoster = createAsyncThunk(
  'provider/removeFromRoster',
  async (craftsmanId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/provider/roster/${craftsmanId}`);
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to remove craftworker from roster');
      }

      toast.success('Craftworker removed from roster successfully!');
      return craftsmanId;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to remove craftworker from roster');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

// Async thunk for updating roster status
export const updateRosterStatus = createAsyncThunk(
  'provider/updateRosterStatus',
  async ({ craftsmanId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/provider/roster/${craftsmanId}/status`, { status });
      const data = response.data;

      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to update roster status');
      }

      toast.success(`Roster status updated to ${status}!`);
      return { craftsmanId, status, rosterItem: data.data };
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to update roster status');
      }
      return rejectWithValue(error.message || 'An error occurred. Please try again.');
    }
  }
);

const initialState = {
  profile: null,
  roster: [],
  searchResults: [],
  searchPagination: null,
  loading: false,
  searchLoading: false,
  error: null,
};

const providerSlice = createSlice({
  name: 'provider',
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
    // Get provider profile reducers
    builder
      .addCase(getProviderProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProviderProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(getProviderProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update provider profile reducers
    builder
      .addCase(updateProviderProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProviderProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateProviderProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get roster reducers
    builder
      .addCase(getRoster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoster.fulfilled, (state, action) => {
        state.loading = false;
        state.roster = action.payload;
        state.error = null;
      })
      .addCase(getRoster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add to roster reducers
    builder
      .addCase(addToRoster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToRoster.fulfilled, (state, action) => {
        state.loading = false;
        state.roster = action.payload; // API returns updated roster
        state.error = null;
      })
      .addCase(addToRoster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Remove from roster reducers
    builder
      .addCase(removeFromRoster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromRoster.fulfilled, (state, action) => {
        state.loading = false;
        state.roster = state.roster.filter(
          (item) => item.craftsmanId?._id?.toString() !== action.payload.toString() && 
                   item.craftsmanId?.toString() !== action.payload.toString()
        );
        state.error = null;
      })
      .addCase(removeFromRoster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update roster status reducers
    builder
      .addCase(updateRosterStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRosterStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { craftsmanId, status } = action.payload;
        const index = state.roster.findIndex(
          (item) => item.craftsmanId?._id?.toString() === craftsmanId.toString() ||
                   item.craftsmanId?.toString() === craftsmanId.toString()
        );
        if (index !== -1) {
          state.roster[index].status = status;
        }
        state.error = null;
      })
      .addCase(updateRosterStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Search craftworkers reducers
    builder
      .addCase(searchCraftworkers.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchCraftworkers.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.data || [];
        state.searchPagination = action.payload.pagination || null;
        state.error = null;
      })
      .addCase(searchCraftworkers.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearProfile } = providerSlice.actions;
export default providerSlice.reducer;


import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from './slices/authSlice';
import companyReducer from './slices/companySlice';
import jobReducer from './slices/jobSlice';
import applicantReducer from './slices/applicantSlice';
import craftworkerReducer from './slices/craftworkerSlice';
import publicJobReducer from './slices/publicJobSlice';
import applicationReducer from './slices/applicationSlice';
import providerReducer from './slices/providerSlice';
import providerApplicationReducer from './slices/providerApplicationSlice';
import providerJobReducer from './slices/providerJobSlice';

// Persist configuration for auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'profile', 'accessToken', 'refreshToken', 'isAuthenticated'], // Only persist these fields
  // Don't persist loading, error, errors - these should reset on page reload
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    company: companyReducer,
    job: jobReducer,
    applicant: applicantReducer,
    craftworker: craftworkerReducer,
    publicJob: publicJobReducer,
    application: applicationReducer,
    provider: providerReducer,
    providerApplication: providerApplicationReducer,
    providerJob: providerJobReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
      },
    }),
});

export const persistor = persistStore(store);

export default store;


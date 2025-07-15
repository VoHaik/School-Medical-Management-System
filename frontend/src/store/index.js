// Redux Store Configuration for Medical Management
import { configureStore } from '@reduxjs/toolkit';
import dashboardSlice from './slices/dashboardSlice';
import medicalSlice from './slices/medicalSlice';
import studentsSlice from './slices/studentsSlice';
import inventorySlice from './slices/inventorySlice';
import reportsSlice from './slices/reportsSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardSlice,
    medical: medicalSlice,
    students: studentsSlice,
    inventory: inventorySlice,
    reports: reportsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types for TypeScript usage
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// Dashboard Redux Slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as dashboardAPI from '../../services/dashboardAPI';

// Async thunks
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getDashboardData();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
);

export const updateDashboardStats = createAsyncThunk(
  'dashboard/updateStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getLatestStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update stats');
    }
  }
);

const initialState = {
  // Statistics
  stats: {
    todaysAppointments: 0,
    pendingMedications: 0,
    activeAlerts: 0,
    studentsScreenedToday: 0,
    totalStudentsUnderCare: 0,
    criticalCases: 0,
    followUpsRequired: 0,
    vaccinesAdministered: 0
  },
  
  // Activity Feed
  recentActivity: [],
  
  // Tasks
  upcomingTasks: [],
  
  // Health Summary
  healthSummary: {
    totalStudentsUnderCare: 0,
    followUpsRequired: 0,
    criticalCases: 0,
    vaccinesGivenThisMonth: 0
  },
  
  // Loading and Error States
  loading: false,
  error: null,
  lastUpdated: null,
  
  // Real-time Updates
  autoRefresh: true,
  refreshInterval: 300000, // 5 minutes
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Stats Updates
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    
    // Activity Updates
    addActivity: (state, action) => {
      state.recentActivity.unshift(action.payload);
      // Keep only last 10 activities
      if (state.recentActivity.length > 10) {
        state.recentActivity = state.recentActivity.slice(0, 10);
      }
    },
    
    updateActivity: (state, action) => {
      const index = state.recentActivity.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.recentActivity[index] = { ...state.recentActivity[index], ...action.payload };
      }
    },
    
    // Task Updates
    addTask: (state, action) => {
      state.upcomingTasks.push(action.payload);
    },
    
    updateTask: (state, action) => {
      const index = state.upcomingTasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.upcomingTasks[index] = { ...state.upcomingTasks[index], ...action.payload };
      }
    },
    
    removeTask: (state, action) => {
      state.upcomingTasks = state.upcomingTasks.filter(t => t.id !== action.payload);
    },
    
    // Health Summary Updates
    updateHealthSummary: (state, action) => {
      state.healthSummary = { ...state.healthSummary, ...action.payload };
    },
    
    // Settings
    setAutoRefresh: (state, action) => {
      state.autoRefresh = action.payload;
    },
    
    setRefreshInterval: (state, action) => {
      state.refreshInterval = action.payload;
    },
    
    // Error Handling
    clearError: (state) => {
      state.error = null;
    },
    
    // Manual refresh
    setLastUpdated: (state) => {
      state.lastUpdated = new Date().toISOString();
    }
  },
  
  extraReducers: (builder) => {
    // Fetch Dashboard Data
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || initialState.stats;
        state.recentActivity = action.payload.recentActivity || [];
        state.upcomingTasks = action.payload.upcomingTasks || [];
        state.healthSummary = action.payload.healthSummary || initialState.healthSummary;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
    // Update Dashboard Stats
      .addCase(updateDashboardStats.pending, (state) => {
        // Don't show loading for background updates
      })
      .addCase(updateDashboardStats.fulfilled, (state, action) => {
        state.stats = { ...state.stats, ...action.payload };
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateDashboardStats.rejected, (state, action) => {
        // Silently fail for background updates
        console.warn('Background stats update failed:', action.payload);
      });
  }
});

// Action creators
export const {
  updateStats,
  addActivity,
  updateActivity,
  addTask,
  updateTask,
  removeTask,
  updateHealthSummary,
  setAutoRefresh,
  setRefreshInterval,
  clearError,
  setLastUpdated
} = dashboardSlice.actions;

// Selectors
export const selectDashboardStats = (state) => state.dashboard.stats;
export const selectRecentActivity = (state) => state.dashboard.recentActivity;
export const selectUpcomingTasks = (state) => state.dashboard.upcomingTasks;
export const selectHealthSummary = (state) => state.dashboard.healthSummary;
export const selectDashboardLoading = (state) => state.dashboard.loading;
export const selectDashboardError = (state) => state.dashboard.error;
export const selectLastUpdated = (state) => state.dashboard.lastUpdated;
export const selectAutoRefresh = (state) => state.dashboard.autoRefresh;
export const selectRefreshInterval = (state) => state.dashboard.refreshInterval;

// Computed selectors
export const selectHighPriorityTasks = (state) => 
  state.dashboard.upcomingTasks.filter(task => task.priority === 'high');

export const selectCriticalAlerts = (state) => 
  state.dashboard.recentActivity.filter(activity => 
    activity.priority === 'high' && activity.type === 'alert'
  );

export const selectPendingActivities = (state) => 
  state.dashboard.recentActivity.filter(activity => activity.status === 'pending');

export default dashboardSlice.reducer;

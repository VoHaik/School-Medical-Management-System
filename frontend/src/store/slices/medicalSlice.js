// Medical Management Redux Slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as medicalAPI from '../../services/medicalAPI';

// Async thunks for API calls
export const fetchStudents = createAsyncThunk(
  'medical/fetchStudents',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await medicalAPI.getStudents(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

export const recordMedicalEvent = createAsyncThunk(
  'medical/recordEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await medicalAPI.recordMedicalEvent(eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to record medical event');
    }
  }
);

export const updateStudentHealth = createAsyncThunk(
  'medical/updateStudentHealth',
  async ({ studentId, healthData }, { rejectWithValue }) => {
    try {
      const response = await medicalAPI.updateStudentHealth(studentId, healthData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update student health');
    }
  }
);

export const fetchMedicalEvents = createAsyncThunk(
  'medical/fetchEvents',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await medicalAPI.getMedicalEvents(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch medical events');
    }
  }
);

const initialState = {
  // Students
  students: [],
  selectedStudent: null,
  studentLoading: false,
  studentError: null,
  
  // Medical Events
  medicalEvents: [],
  eventLoading: false,
  eventError: null,
  
  // Medications
  medications: [],
  medicationLoading: false,
  medicationError: null,
  
  // Health Checkups
  checkups: [],
  checkupLoading: false,
  checkupError: null,
  
  // Vaccinations
  vaccinations: [],
  vaccinationLoading: false,
  vaccinationError: null,
  
  // Filters and Search
  filters: {
    searchTerm: '',
    grade: '',
    healthStatus: '',
    dateRange: { start: null, end: null }
  },
  
  // UI State
  selectedTab: 0,
  modalOpen: false,
  bulkActionMode: false,
  selectedItems: [],
  
  // Statistics
  stats: {
    totalStudents: 0,
    activeAlerts: 0,
    recentEvents: 0,
    pendingFollowUps: 0
  }
};

const medicalSlice = createSlice({
  name: 'medical',
  initialState,
  reducers: {
    // Student Actions
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
    },
    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
    },
    updateStudentInList: (state, action) => {
      const index = state.students.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = { ...state.students[index], ...action.payload };
      }
    },
    
    // Medical Event Actions
    addMedicalEvent: (state, action) => {
      state.medicalEvents.unshift(action.payload);
    },
    updateMedicalEvent: (state, action) => {
      const index = state.medicalEvents.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.medicalEvents[index] = { ...state.medicalEvents[index], ...action.payload };
      }
    },
    removeMedicalEvent: (state, action) => {
      state.medicalEvents = state.medicalEvents.filter(e => e.id !== action.payload);
    },
    
    // Filter Actions
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
    },
    setGradeFilter: (state, action) => {
      state.filters.grade = action.payload;
    },
    setHealthStatusFilter: (state, action) => {
      state.filters.healthStatus = action.payload;
    },
    setDateRangeFilter: (state, action) => {
      state.filters.dateRange = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    // UI Actions
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
    setModalOpen: (state, action) => {
      state.modalOpen = action.payload;
    },
    toggleBulkActionMode: (state) => {
      state.bulkActionMode = !state.bulkActionMode;
      if (!state.bulkActionMode) {
        state.selectedItems = [];
      }
    },
    toggleItemSelection: (state, action) => {
      const itemId = action.payload;
      const index = state.selectedItems.indexOf(itemId);
      if (index > -1) {
        state.selectedItems.splice(index, 1);
      } else {
        state.selectedItems.push(itemId);
      }
    },
    selectAllItems: (state, action) => {
      state.selectedItems = action.payload;
    },
    clearSelection: (state) => {
      state.selectedItems = [];
    },
    
    // Statistics Actions
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    }
  },
  
  extraReducers: (builder) => {
    // Fetch Students
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.studentLoading = true;
        state.studentError = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.studentLoading = false;
        state.students = action.payload;
        state.stats.totalStudents = action.payload.length;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.studentLoading = false;
        state.studentError = action.payload;
      })
      
    // Record Medical Event
      .addCase(recordMedicalEvent.pending, (state) => {
        state.eventLoading = true;
        state.eventError = null;
      })
      .addCase(recordMedicalEvent.fulfilled, (state, action) => {
        state.eventLoading = false;
        state.medicalEvents.unshift(action.payload);
        state.stats.recentEvents += 1;
      })
      .addCase(recordMedicalEvent.rejected, (state, action) => {
        state.eventLoading = false;
        state.eventError = action.payload;
      })
      
    // Update Student Health
      .addCase(updateStudentHealth.pending, (state) => {
        state.studentLoading = true;
        state.studentError = null;
      })
      .addCase(updateStudentHealth.fulfilled, (state, action) => {
        state.studentLoading = false;
        const index = state.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = { ...state.students[index], ...action.payload };
        }
        if (state.selectedStudent?.id === action.payload.id) {
          state.selectedStudent = { ...state.selectedStudent, ...action.payload };
        }
      })
      .addCase(updateStudentHealth.rejected, (state, action) => {
        state.studentLoading = false;
        state.studentError = action.payload;
      })
      
    // Fetch Medical Events
      .addCase(fetchMedicalEvents.pending, (state) => {
        state.eventLoading = true;
        state.eventError = null;
      })
      .addCase(fetchMedicalEvents.fulfilled, (state, action) => {
        state.eventLoading = false;
        state.medicalEvents = action.payload;
      })
      .addCase(fetchMedicalEvents.rejected, (state, action) => {
        state.eventLoading = false;
        state.eventError = action.payload;
      });
  }
});

// Action creators
export const {
  setSelectedStudent,
  clearSelectedStudent,
  updateStudentInList,
  addMedicalEvent,
  updateMedicalEvent,
  removeMedicalEvent,
  setSearchTerm,
  setGradeFilter,
  setHealthStatusFilter,
  setDateRangeFilter,
  clearFilters,
  setSelectedTab,
  setModalOpen,
  toggleBulkActionMode,
  toggleItemSelection,
  selectAllItems,
  clearSelection,
  updateStats
} = medicalSlice.actions;

// Selectors
export const selectStudents = (state) => state.medical.students;
export const selectSelectedStudent = (state) => state.medical.selectedStudent;
export const selectMedicalEvents = (state) => state.medical.medicalEvents;
export const selectFilters = (state) => state.medical.filters;
export const selectStats = (state) => state.medical.stats;
export const selectLoading = (state) => ({
  students: state.medical.studentLoading,
  events: state.medical.eventLoading,
  medications: state.medical.medicationLoading,
  checkups: state.medical.checkupLoading,
  vaccinations: state.medical.vaccinationLoading
});
export const selectErrors = (state) => ({
  students: state.medical.studentError,
  events: state.medical.eventError,
  medications: state.medical.medicationError,
  checkups: state.medical.checkupError,
  vaccinations: state.medical.vaccinationError
});

// Filtered selectors with memoization
export const selectFilteredStudents = (state) => {
  const { students, filters } = state.medical;
  const { searchTerm, grade, healthStatus } = filters;
  
  return students.filter(student => {
    if (searchTerm && !student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !student.studentId.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (grade && student.grade !== grade) {
      return false;
    }
    
    if (healthStatus && student.healthProfile?.status !== healthStatus) {
      return false;
    }
    
    return true;
  });
};

export const selectFilteredMedicalEvents = (state) => {
  const { medicalEvents, filters } = state.medical;
  const { searchTerm, dateRange } = filters;
  
  return medicalEvents.filter(event => {
    if (searchTerm && !event.studentName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !event.type.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (dateRange.start && new Date(event.date) < new Date(dateRange.start)) {
      return false;
    }
    
    if (dateRange.end && new Date(event.date) > new Date(dateRange.end)) {
      return false;
    }
    
    return true;
  });
};

export default medicalSlice.reducer;

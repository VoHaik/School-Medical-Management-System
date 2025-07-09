import axios from 'axios';

const API_URL = '/api'; // Set to /api so all requests automatically get the /api prefix

// Helper function to get the auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token'); // Or however you store your token
};

// Axios instance with default settings
const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Generic error handler
const handleApiError = (error, context) => {
  console.error(`API Error in ${context}:`, error.response || error.message);
  
  // Extract detailed error information
  if (error.response) {
    // The request was made and the server responded with a status code outside of 2xx
    console.error('Response status:', error.response.status);
    console.error('Response data:', error.response.data);
    console.error('Response headers:', error.response.headers);
    
    if (error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else if (error.response.data && error.response.data.errors) {
      // Handle validation errors from Spring Boot
      const validationErrors = Object.values(error.response.data.errors).join(', ');
      throw new Error(`Validation error: ${validationErrors}`);
    } else if (error.response.status === 400) {
      throw new Error(`Bad request: The server could not understand the request. Please check your input data.`);
    } else if (error.response.status === 401) {
      throw new Error(`Authentication failed: Please log in again.`);
    } else if (error.response.status === 403) {
      throw new Error(`Access denied: You don't have permission to perform this action.`);
    } else if (error.response.status === 500) {
      throw new Error(`Server error: An internal server error occurred. Please try again later.`);
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error('Request was made but no response received:', error.request);
    throw new Error(`Network error: No response received from server. Please check your connection.`);
  } else {
    // Something happened in setting up the request
    console.error('Error setting up request:', error.message);
  }
  
  throw new Error(`Failed to ${context}. Please try again.`);
};

// Health Event APIs
export const getAllHealthEvents = async () => {
  try {
    const response = await apiClient.get('/health-events');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch health events');
  }
};

export const getHealthEventById = async (eventId) => {
  try {
    const response = await apiClient.get(`/health-events/${eventId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch health event by ID');
  }
};

export const createHealthEvent = async (eventData) => {
  try {
    const response = await apiClient.post('/health-events', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating health event:', error.response || error);
    console.error('Request data that caused error:', eventData);
    handleApiError(error, 'create health event');
  }
};

export const updateHealthEvent = async (eventId, eventData) => {
  try {
    const response = await apiClient.put(`/health-events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'update health event');
  }
};

export const deleteHealthEvent = async (eventId) => {
  try {
    const response = await apiClient.delete(`/health-events/${eventId}`);
    return response.data; // Or handle no content response
  } catch (error) {
    console.error('Delete API error details:', {
      message: error.message,
      response: error.response,
      request: error.request
    });
    handleApiError(error, 'delete health event');
  }
};

// Legacy API function names for backward compatibility
export const getAllHealthCheckupEvents = getAllHealthEvents;
export const getHealthCheckupEventById = getHealthEventById;
export const createHealthCheckupEvent = createHealthEvent;
export const updateHealthCheckupEvent = updateHealthEvent;
export const deleteHealthCheckupEvent = deleteHealthEvent;

// Grade Level APIs
export const getAllGradeLevels = async () => {
  try {
    const response = await apiClient.get('/grade-levels');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch grade levels');
  }
};

// Vaccine APIs
export const getAllVaccines = async () => {
  try {
    const response = await apiClient.get('/vaccines');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch vaccines');
  }
};

// Checkup Type APIs
export const getAllCheckupTypes = async () => {
  try {
    const response = await apiClient.get('/health-checkup-types');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch checkup types');
  }
};

// Student Health Checkup APIs
export const getStudentHealthCheckupsByEventId = async (eventId) => {
  try {
    const response = await apiClient.get(`/health-checkup-records/event/${eventId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch student health checkups by event ID');
  }
};

export const getStudentHealthCheckupsByStudentId = async (studentId) => {
  try {
    const response = await apiClient.get(`/health-checkup-records/student/${studentId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch student health checkups by student ID');
  }
};

export const createStudentHealthCheckup = async (checkupData) => {
  try {
    const response = await apiClient.post('/health-checkup-records', checkupData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'create student health checkup');
  }
};

export const updateStudentHealthCheckup = async (checkupId, checkupData) => {
  try {
    const response = await apiClient.put(`/health-checkup-records/${checkupId}`, checkupData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'update student health checkup');
  }
};

// Note: This consent endpoint may not be needed for health checkups
// export const recordStudentHealthCheckupConsent = async (studentId, eventId, consent) => {
//   try {
//     const response = await apiClient.post(`/health-checkup-records/event/${eventId}/student/${studentId}/consent`, { consent });
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'record student health checkup consent');
//   }
// };

export const getStudentHealthCheckupById = async (checkupRecordId) => {
  try {
    const response = await apiClient.get(`/health-checkup-records/${checkupRecordId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch student health checkup by ID');
  }
};

// If you need to delete a student health checkup record:
// export const deleteStudentHealthCheckup = async (checkupId) => {
//   try {
//     const response = await apiClient.delete(`/student-health-checkups/${checkupId}`);
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'delete student health checkup');
//   }
// };

// User/Student APIs (assuming a general user/student endpoint)
export const getAllStudents = async () => {
  try {
    const response = await apiClient.get('/students');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch all students');
  }
};

// For admin/nurse access with full permissions
export const getAllStudentsAdmin = async () => {
  try {
    const response = await apiClient.get('/students');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch all students (admin)');
  }
};

// Get all students with their health data combined
export const getAllStudentsWithHealthData = async () => {
  try {
    const [students, healthDeclarations] = await Promise.all([
      getAllStudents(),
      // Assuming there's an endpoint for health declarations
      apiClient.get('/health-declarations').catch(() => ({ data: [] }))
    ]);
    
    // Combine students with their health data
    const studentsWithHealth = students.map(student => {
      const healthData = healthDeclarations.data.find(
        declaration => declaration.studentCode === student.studentCode || declaration.studentCode === student.username
      );
      
      return {
        ...student,
        healthDeclaration: healthData || null,
        hasHealthDeclaration: !!healthData
      };
    });
    
    return studentsWithHealth;
  } catch (error) {
    handleApiError(error, 'fetch students with health data');
  }
};

// Get health declaration by student code
export const getHealthDeclarationByStudentCode = async (studentCode) => {
  try {
    const response = await apiClient.get(`/health-declarations/student/${studentCode}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // No health declaration found
    }
    handleApiError(error, 'fetch health declaration by student code');
  }
};

// Nurse edit health declaration
export const nurseEditHealthDeclaration = async (studentCode, healthData) => {
  try {
    const response = await apiClient.put(`/health-declarations/student/${studentCode}`, healthData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'update health declaration');
  }
};

// Notification APIs
export const getUserNotifications = async (unreadOnly = false) => {
  try {
    const response = await apiClient.get(`/notifications?unreadOnly=${unreadOnly}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch user notifications');
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiClient.patch(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'mark notification as read');
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await apiClient.patch('/notifications/read-all');
    return response.data;
  } catch (error) {
    handleApiError(error, 'mark all notifications as read');
  }
};

// User Profile APIs
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/auth/user/profile');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch user profile');
  }
};

// Add other API functions here as needed for other features (Medication, Vaccination, etc.)

// Grade Level APIs
export const getAllActiveGradeLevels = async () => {
  try {
    const response = await apiClient.get('/grade-levels/for-selection');
    return response.data;
  } catch (error) {
    console.error('Error fetching grade levels:', error);
    handleApiError(error, 'fetch active grade levels');
  }
};

export const getGradeLevelById = async (gradeId) => {
  try {
    const response = await apiClient.get(`/grade-levels/${gradeId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch grade level by ID');
  }
};

export const getGradeLevelByNumber = async (gradeNumber) => {
  try {
    const response = await apiClient.get(`/grade-levels/number/${gradeNumber}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch grade level by number');
  }
};

export const getGradeLevelsByRange = async (minGrade, maxGrade) => {
  try {
    const response = await apiClient.get(`/grade-levels/range?minGrade=${minGrade}&maxGrade=${maxGrade}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch grade levels by range');
  }
};

export const getGradeLevelsByAge = async (age) => {
  try {
    const response = await apiClient.get(`/grade-levels/age/${age}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch grade levels by age');
  }
};

export const getGradeDisplayOptions = async () => {
  try {
    const response = await apiClient.get('/grade-levels/display-options');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch grade display options');
  }
};

export const createGradeLevel = async (gradeLevelData) => {
  try {
    const response = await apiClient.post('/grade-levels', gradeLevelData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'create grade level');
  }
};

export const updateGradeLevel = async (gradeId, gradeLevelData) => {
  try {
    const response = await apiClient.put(`/grade-levels/${gradeId}`, gradeLevelData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'update grade level');
  }
};

export const deleteGradeLevel = async (gradeId) => {
  try {
    const response = await apiClient.delete(`/grade-levels/${gradeId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'delete grade level');
  }
};

export const initializeStandardGradeLevels = async () => {
  try {
    const response = await apiClient.post('/grade-levels/initialize');
    return response.data;
  } catch (error) {
    handleApiError(error, 'initialize standard grade levels');
  }
};

// Vaccination Consent APIs
export const getPendingVaccinationConsents = async (studentCode) => {
  try {
    const response = await apiClient.get(`/parent/vaccination-consent/student/${studentCode}/pending`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch pending vaccination consents');
  }
};

export const getSubmittedVaccinationConsents = async (studentCode) => {
  try {
    const response = await apiClient.get(`/parent/vaccination-consent/student/${studentCode}/submitted`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch submitted vaccination consents');
  }
};

export const submitVaccinationConsent = async (consentId, consentData) => {
  try {
    const response = await apiClient.post(`/parent/vaccination-consent/${consentId}/respond`, {
      status: consentData.consentStatus,
      notes: consentData.parentNotes || ''
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'submit vaccination consent');
  }
};

export const getStudentVaccinationInfo = async (studentId) => {
  try {
    const response = await apiClient.get(`/students/${studentId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch student vaccination info');
  }
};

// Get parent's children (students)
export const getParentStudents = async () => {
  try {
    const response = await apiClient.get('/parent/students');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch parent students');
  }
};

// Vaccination Management APIs for Nurses/Admins
export const sendVaccinationConsents = async (eventId) => {
  try {
    const response = await apiClient.post(`/vaccination-management/event/${eventId}/send-consents`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'send vaccination consents');
  }
};

export const getVaccinationEventConsents = async (eventId) => {
  try {
    const response = await apiClient.get(`/vaccination-management/event/${eventId}/consents`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch vaccination event consents');
  }
};

export const getVaccinationRecords = async (eventId) => {
  try {
    const response = await apiClient.get(`/vaccination-management/event/${eventId}/records`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch vaccination records');
  }
};

export const createVaccinationRecord = async (recordData) => {
  try {
    const response = await apiClient.post('/vaccination-management/records', recordData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'create vaccination record');
  }
};

export const updateVaccinationRecord = async (recordId, recordData) => {
  try {
    const response = await apiClient.put(`/vaccination-management/record/${recordId}`, recordData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'update vaccination record');
  }
};

// Delete vaccination record
export const deleteVaccinationRecord = async (recordId) => {
  try {
    const response = await apiClient.delete(`/vaccination-management/record/${recordId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'delete vaccination record');
  }
};

// Get all vaccination records for vaccination management
export const getAllVaccinationRecords = async () => {
  try {
    const response = await apiClient.get('/vaccination-management/records');
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    handleApiError(error, 'fetch all vaccination records');
  }
};

// Get vaccination statistics/summary
export const getVaccinationStatistics = async () => {
  try {
    const response = await apiClient.get('/vaccination-management/statistics');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch vaccination statistics');
  }
};

// Get vaccination records by status
export const getVaccinationRecordsByStatus = async (status) => {
  try {
    const response = await apiClient.get(`/vaccination-management/records?status=${status}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch vaccination records by status');
  }
};

// Health Event APIs for parents
export const getUpcomingHealthEventsForStudent = async (studentCode) => {
  try {
    const response = await apiClient.get(`/health-events/upcoming/student/${studentCode}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch upcoming health events for student');
  }
};

// Get vaccination history for a student (for parents to view results)
export const getStudentVaccinationHistory = async (studentCode) => {
  try {
    const response = await apiClient.get(`/vaccination-management/student/${studentCode}/history`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch student vaccination history');
  }
};

// Health Checkup Record APIs
export const getAllHealthCheckupRecords = async () => {
  try {
    const response = await apiClient.get('/health-checkup-records');
    return response.data;
  } catch (error) {
    console.error('API: Error in getAllHealthCheckupRecords:', error);
    handleApiError(error, 'fetch all health checkup records');
  }
};

export const getHealthCheckupRecordById = async (checkupId) => {
  try {
    const response = await apiClient.get(`/health-checkup-records/${checkupId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch health checkup record by ID');
  }
};

export const getHealthCheckupRecordsByStudent = async (studentId) => {
  try {
    const response = await apiClient.get(`/health-checkup-records/student/${studentId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch health checkup records by student');
  }
};

export const getHealthCheckupRecordsByEvent = async (eventId) => {
  try {
    const response = await apiClient.get(`/health-checkup-records/event/${eventId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch health checkup records by event');
  }
};

export const createHealthCheckupRecord = async (checkupData) => {
  try {
    const response = await apiClient.post('/health-checkup-records', checkupData);
    return response.data;
  } catch (error) {
    console.error('Error creating health checkup record:', error);
    handleApiError(error, 'create health checkup record');
  }
};

export const updateHealthCheckupRecord = async (checkupId, checkupData) => {
  try {
    const response = await apiClient.put(`/health-checkup-records/${checkupId}`, checkupData);
    return response.data;
  } catch (error) {
    console.error('Error updating health checkup record:', error);
    handleApiError(error, 'update health checkup record');
  }
};

export const deleteHealthCheckupRecord = async (checkupId) => {
  try {
    const response = await apiClient.delete(`/health-checkup-records/${checkupId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'delete health checkup record');
  }
};

export const getHealthCheckupStatistics = async () => {
  try {
    const response = await apiClient.get('/health-checkup-records/statistics');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch health checkup statistics');
  }
};

export const getHealthCheckupRecordsByStatus = async (status) => {
  try {
    const response = await apiClient.get(`/health-checkup-records?status=${status}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch health checkup records by status');
  }
};

// Nurses Management APIs
export const getAllNurses = async () => {
  try {
    const response = await apiClient.get('/nurses');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch nurses');
  }
};

// Health Checkup Types APIs
export const getAllHealthCheckupTypes = async () => {
  try {
    const response = await apiClient.get('/health-checkup-types');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch health checkup types');
  }
};

export const getHealthCheckupTypeById = async (typeId) => {
  try {
    const response = await apiClient.get(`/health-checkup-types/${typeId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch health checkup type by ID');
  }
};

export const searchHealthCheckupTypes = async (searchTerm) => {
  try {
    const response = await apiClient.get(`/health-checkup-types/search?term=${encodeURIComponent(searchTerm)}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'search health checkup types');
  }
};

export const createHealthCheckupType = async (typeData) => {
  try {
    const response = await apiClient.post('/health-checkup-types', typeData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'create health checkup type');
  }
};

export const updateHealthCheckupType = async (typeId, typeData) => {
  try {
    const response = await apiClient.put(`/health-checkup-types/${typeId}`, typeData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'update health checkup type');
  }
};

export const deleteHealthCheckupType = async (typeId) => {
  try {
    const response = await apiClient.delete(`/health-checkup-types/${typeId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'delete health checkup type');
  }
};

// ADMIN APIS - Simple admin functionality
// ========================================

// Admin User Management APIs - Using existing student/nurse data
export const getAllUsers = async () => {
  try {
    // Get all users from existing endpoints
    const [students, nurses] = await Promise.all([
      getAllStudents(),
      getAllNurses()
    ]);
    
    // Generate phone numbers for demo purposes
    const generatePhoneNumber = (index) => {
      const baseNumber = 900000000;
      return `+84 ${Math.floor((baseNumber + index) / 1000000)} ${Math.floor(((baseNumber + index) % 1000000) / 1000)} ${(baseNumber + index) % 1000}`;
    };
    
    // Combine and format as user data
    const users = [
      ...(students || []).map((student, index) => ({
        id: student.id || student.studentCode,
        username: student.studentCode || student.username,
        fullName: student.name || student.fullName,
        email: student.email || `${student.studentCode || 'student'}@school.edu`,
        phone: student.phoneNumber || student.phone || generatePhoneNumber(index + 100),
        role: 'STUDENT',
        status: student.status || 'active',
        lastLogin: student.lastLogin || null,
        createdAt: student.createdAt || new Date().toISOString(),
        grade: student.grade || student.gradeLevel?.gradeName
      })),
      ...(nurses || []).map((nurse, index) => ({
        id: nurse.id || nurse.nurseId,
        username: nurse.nurseCode || nurse.username,
        fullName: nurse.fullName || nurse.name,
        email: nurse.email || `${nurse.nurseCode || 'nurse'}@school.edu`,
        phone: nurse.phoneNumber || nurse.phone || generatePhoneNumber(index + 200),
        role: 'NURSE',
        status: nurse.status || 'active',
        lastLogin: nurse.lastLogin || null,
        createdAt: nurse.createdAt || new Date().toISOString(),
        qualification: nurse.qualification,
        specialization: nurse.specialization
      }))
    ];
    
    return users;
  } catch (error) {
    handleApiError(error, 'fetch all users for admin');
  }
};

// Update user information
export const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'update user');
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'delete user');
  }
};

// Activate user
export const activateUser = async (userId) => {
  try {
    const response = await apiClient.put(`/admin/users/${userId}/activate`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'activate user');
  }
};

// Deactivate user
export const deactivateUser = async (userId) => {
  try {
    const response = await apiClient.put(`/admin/users/${userId}/deactivate`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'deactivate user');
  }
};

// Admin Dashboard Statistics - Using real backend data
export const getAdminDashboardStats = async () => {
  try {
    const response = await apiClient.get('/admin/dashboard/stats');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch admin dashboard statistics');
  }
};

// Get system reports with real data
export const getSystemReports = async (reportType = 'overview', startDate = null, endDate = null) => {
  try {
    const params = new URLSearchParams();
    if (reportType) params.append('reportType', reportType);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiClient.get(`/admin/reports?${params.toString()}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch system reports');
  }
};

// Data Export Functions for Backup
export const exportStudents = async () => {
  try {
    const response = await getAllStudentsAdmin();
    return response || [];
  } catch (error) {
    console.error('Error exporting students:', error);
    handleApiError(error, 'export students data');
    return [];
  }
};

export const exportHealthEvents = async () => {
  try {
    const response = await getAllHealthEvents();
    return response || [];
  } catch (error) {
    console.error('Error exporting health events:', error);
    handleApiError(error, 'export health events data');
    return [];
  }
};

export const exportUsers = async () => {
  try {
    const response = await getAllUsers();
    return response || [];
  } catch (error) {
    console.error('Error exporting users:', error);
    handleApiError(error, 'export users data');
    return [];
  }
};

export const exportHealthCheckups = async () => {
  try {
    // Use getAllStudentsWithHealthData to get checkup records
    const response = await getAllStudentsWithHealthData();
    
    // Extract health checkup data from students
    const healthCheckups = [];
    if (Array.isArray(response)) {
      response.forEach(student => {
        if (student.healthCheckups && Array.isArray(student.healthCheckups)) {
          student.healthCheckups.forEach(checkup => {
            healthCheckups.push({
              ...checkup,
              studentName: student.fullName,
              studentCode: student.studentCode,
              gradeLevel: student.gradeLevel
            });
          });
        }
      });
    }
    
    return healthCheckups || [];
  } catch (error) {
    console.error('Error exporting health checkups:', error);
    handleApiError(error, 'export health checkups data');
    return [];
  }
};

// Student API functions
export const getStudentHealthProfile = async () => {
  try {
    const response = await apiClient.get('/student/health-profile');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch student health profile');
  }
};

export const getStudentMedicalHistory = async () => {
  try {
    const response = await apiClient.get('/student/medical-history');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch student medical history');
  }
};

export const getStudentVaccinationRecords = async () => {
  try {
    const response = await apiClient.get('/student/vaccination-records');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch student vaccination records');
  }
};

export { apiClient };
export default apiClient;

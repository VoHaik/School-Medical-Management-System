import axios from 'axios';

const API_URL = '/api'; // Adjust if your Spring Boot backend is on a different port/path

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
    console.log('Sending health event data to API:', eventData);
    const response = await apiClient.post('/health-events', eventData);
    console.log('API response for creating health event:', response.data);
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
    handleApiError(error, 'delete health event');
  }
};

// Legacy API function names for backward compatibility
export const getAllHealthCheckupEvents = getAllHealthEvents;
export const getHealthCheckupEventById = getHealthEventById;
export const createHealthCheckupEvent = createHealthEvent;
export const updateHealthCheckupEvent = updateHealthEvent;
export const deleteHealthCheckupEvent = deleteHealthEvent;

// Student Health Checkup APIs
export const getStudentHealthCheckupsByEventId = async (eventId) => {
  try {
    const response = await apiClient.get(`/student-health-checkups/event/${eventId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch student health checkups by event ID');
  }
};

export const getStudentHealthCheckupsByStudentId = async (studentId) => {
  try {
    const response = await apiClient.get(`/student-health-checkups/student/${studentId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch student health checkups by student ID');
  }
};

export const createStudentHealthCheckup = async (checkupData) => {
  try {
    const response = await apiClient.post('/student-health-checkups', checkupData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'create student health checkup');
  }
};

export const updateStudentHealthCheckup = async (checkupId, checkupData) => {
  try {
    const response = await apiClient.put(`/student-health-checkups/${checkupId}`, checkupData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'update student health checkup');
  }
};

export const recordStudentHealthCheckupConsent = async (studentId, eventId, consent) => {
  try {
    const response = await apiClient.post(`/student-health-checkups/event/${eventId}/student/${studentId}/consent`, { consent });
    return response.data;
  } catch (error) {
    handleApiError(error, 'record student health checkup consent');
  }
};

export const getStudentHealthCheckupById = async (checkupRecordId) => {
  try {
    const response = await apiClient.get(`/student-health-checkups/${checkupRecordId}`);
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
    // Assuming your backend has an endpoint like /users?role=STUDENT or /students
    // Adjust the endpoint as per your backend API design
    const response = await apiClient.get('/users/role/STUDENT'); // Example endpoint
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch all students');
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

// Example for Medication Request (assuming similar structure)
export const getAllMedicationRequests = async () => {
  try {
    const response = await apiClient.get('/medication-requests');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch medication requests');
  }
};

// ... other medication request functions (create, update, delete)

// Example for Student Vaccination (assuming similar structure)
export const getStudentVaccinationsByStudentId = async (studentId) => {
  try {
    const response = await apiClient.get(`/student-vaccinations/student/${studentId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch student vaccinations');
  }
};

// ... other vaccination related functions

// Health Declaration APIs
export const getHealthDeclarationByStudentCode = async (studentCode) => {
  try {
    const response = await apiClient.get(`/health-declaration?studentCode=${studentCode}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch health declaration');
  }
};

export const getHealthDeclarationHistory = async (studentCode) => {
  try {
    const response = await apiClient.get(`/health-declaration/history?studentCode=${studentCode}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch health declaration history');
  }
};

export const getPendingHealthDeclarations = async () => {
  try {
    const response = await apiClient.get('/health-declaration/pending');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch pending health declarations');
  }
};

// Function to get all students with their health data
export const getAllStudentsWithHealthData = async () => {
  try {
    // First get all students
    const students = await apiClient.get('/students');
    
    // Then fetch health data for each student
    const studentsWithHealthData = await Promise.all(
      students.data.map(async (student) => {
        try {
          // Try to get health declaration for this student
          const healthData = await getHealthDeclarationByStudentCode(student.studentCode);
          return {
            ...student,
            healthData: healthData || null
          };
        } catch (error) {
          console.warn(`Failed to fetch health data for student ${student.studentCode}:`, error);
          return {
            ...student,
            healthData: null
          };
        }
      })
    );
    
    return studentsWithHealthData;
  } catch (error) {
    handleApiError(error, 'fetch students with health data');
  }
};

// Function for nurse to edit student health profile
export const nurseEditHealthDeclaration = async (studentCode, healthData) => {
  try {
    console.log(`Making PUT request to: /health-declaration/nurse-edit/${studentCode}`);
    console.log('Request data:', healthData);
    const response = await apiClient.put(`/health-declaration/nurse-edit/${studentCode}`, healthData);
    console.log('Response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error details:', error.response || error);
    handleApiError(error, 'edit student health profile');
    throw error; // Re-throw để frontend có thể handle
  }
};

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
    const response = await apiClient.post(`/parent/vaccination-consent/${consentId}/submit`, consentData);
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
    const response = await apiClient.put(`/vaccination-management/records/${recordId}`, recordData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'update vaccination record');
  }
};

export default apiClient;

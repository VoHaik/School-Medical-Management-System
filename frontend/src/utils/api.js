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
  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(`Failed to ${context}. Please try again.`);
};

// Health Checkup Event APIs
export const getAllHealthCheckupEvents = async () => {
  try {
    const response = await apiClient.get('/health-checkup-events');
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch health checkup events');
  }
};

export const getHealthCheckupEventById = async (eventId) => {
  try {
    const response = await apiClient.get(`/health-checkup-events/${eventId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetch health checkup event by ID');
  }
};

export const createHealthCheckupEvent = async (eventData) => {
  try {
    const response = await apiClient.post('/health-checkup-events', eventData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'create health checkup event');
  }
};

export const updateHealthCheckupEvent = async (eventId, eventData) => {
  try {
    const response = await apiClient.put(`/health-checkup-events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'update health checkup event');
  }
};

export const deleteHealthCheckupEvent = async (eventId) => {
  try {
    const response = await apiClient.delete(`/health-checkup-events/${eventId}`);
    return response.data; // Or handle no content response
  } catch (error) {
    handleApiError(error, 'delete health checkup event');
  }
};

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

export default apiClient;

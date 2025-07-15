// English UI with Vietnamese Content Support Configuration
// File: frontend/src/config/i18n.js

export const I18N_CONFIG = {
  // Default language for UI elements
  defaultLanguage: 'en',
  
  // Supported languages
  supportedLanguages: ['en', 'vi'],
  
  // UI Text in English (interface language)
  ui: {
    // Navigation
    dashboard: 'Dashboard',
    students: 'Students',
    healthRecords: 'Health Records',
    medications: 'Medications',
    events: 'Events',
    reports: 'Reports',
    settings: 'Settings',
    logout: 'Logout',
    
    // Common Actions
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    print: 'Print',
    
    // Health Events
    healthEvents: 'Health Events',
    createEvent: 'Create Event',
    eventName: 'Event Name',
    eventType: 'Event Type',
    description: 'Description',
    scheduledDate: 'Scheduled Date',
    location: 'Location',
    status: 'Status',
    targetGradeLevels: 'Target Grade Levels',
    typesOfCheckups: 'Types of Checkups',
    
    // Student Information
    studentCode: 'Student Code',
    fullName: 'Full Name',
    className: 'Class Name',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    address: 'Address',
    phoneNumber: 'Phone Number',
    emergencyContact: 'Emergency Contact',
    
    // Health Records
    healthDeclaration: 'Health Declaration',
    medicalHistory: 'Medical History',
    allergies: 'Allergies',
    chronicIllnesses: 'Chronic Illnesses',
    currentMedications: 'Current Medications',
    vaccinationRecord: 'Vaccination Record',
    
    // Status Options
    planned: 'Planned',
    inProgress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    
    // Event Types
    healthCheckup: 'Health Checkup',
    vaccination: 'Vaccination',
    
    // Checkup Types
    vision: 'Vision',
    hearing: 'Hearing',
    dental: 'Dental',
    scoliosis: 'Scoliosis',
    general: 'General',
    
    // Messages
    saveSuccess: 'Saved successfully',
    saveError: 'Error saving data',
    deleteConfirm: 'Are you sure you want to delete this item?',
    noData: 'No data available',
    loading: 'Loading...',
    
    // Validation Messages
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    invalidPhone: 'Please enter a valid phone number',
    invalidDate: 'Please enter a valid date'
  },
  
  // Content localization settings
  content: {
    // Vietnamese content will be stored in database as NVARCHAR
    // and displayed properly with UTF-8 encoding
    encoding: 'UTF-8',
    
    // Date format preferences
    dateFormat: {
      en: 'MM/DD/YYYY',
      vi: 'DD/MM/YYYY'
    },
    
    // Number format preferences
    numberFormat: {
      en: 'en-US',
      vi: 'vi-VN'
    }
  }
};

// Utility functions for handling Vietnamese content
export const ContentUtils = {
  // Ensure proper encoding for Vietnamese text
  encodeVietnamese: (text) => {
    if (!text) return '';
    return text.normalize('NFC'); // Canonical composition form
  },
  
  // Format Vietnamese names properly
  formatVietnameseName: (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  },
  
  // Search function that works with Vietnamese diacritics
  searchVietnamese: (searchTerm, targetText) => {
    if (!searchTerm || !targetText) return false;
    
    const normalize = (str) => str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics for search
    
    return normalize(targetText).includes(normalize(searchTerm));
  }
};

export default I18N_CONFIG;

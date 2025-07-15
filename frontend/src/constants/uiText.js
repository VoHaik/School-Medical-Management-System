// English UI Constants - All interface text in English
// File: frontend/src/constants/uiText.js

export const UI_TEXT = {
  // Navigation & Pages
  dashboard: 'Dashboard',
  students: 'Students',
  healthRecords: 'Health Records',
  medications: 'Medications',
  events: 'Events',
  reports: 'Reports',
  settings: 'Settings',
  profile: 'Profile',
  logout: 'Logout',

  // Health Checkup Events
  healthEvents: 'Health Events',
  createNewEvent: 'CREATE NEW EVENT',
  createAndOrganizeEventManagement: 'Create and Organize Event Management',
  eventManagement: 'Event Management',
  
  // Event Types
  healthCheckup: 'Health Checkup',
  vaccination: 'Vaccination',
  unknown: 'Unknown',
  
  // Event Status
  planned: 'Planned',
  collectingConsent: 'Collecting Consent',
  inProgress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  
  // Form Fields
  eventName: 'Event Name',
  eventType: 'Event Type',
  description: 'Description',
  startDate: 'Start Date',
  endDate: 'End Date',
  scheduledDate: 'Scheduled Date',
  location: 'Location',
  status: 'Status',
  targetGradeLevels: 'Target Grade Levels',
  gradeLevel: 'Grade Level',
  gradeLevels: 'Grade Levels',
  typesOfCheckups: 'Types of Checkups',
  
  // Common Actions
  save: 'Save',
  cancel: 'Cancel',
  edit: 'Edit',
  delete: 'Delete',
  view: 'View',
  add: 'Add',
  remove: 'Remove',
  search: 'Search',
  filter: 'Filter',
  export: 'Export',
  print: 'Print',
  submit: 'Submit',
  reset: 'Reset',
  close: 'Close',
  back: 'Back',
  next: 'Next',
  previous: 'Previous',
  
  // Student Management
  studentCode: 'Student Code',
  studentName: 'Student Name',
  fullName: 'Full Name',
  firstName: 'First Name',
  lastName: 'Last Name',
  className: 'Class Name',
  dateOfBirth: 'Date of Birth',
  gender: 'Gender',
  address: 'Address',
  phoneNumber: 'Phone Number',
  email: 'Email',
  emergencyContact: 'Emergency Contact',
  viewStudents: 'View Students',
  studentList: 'Student List',
  
  // Health Records
  healthDeclaration: 'Health Declaration',
  medicalHistory: 'Medical History',
  allergies: 'Allergies',
  chronicIllnesses: 'Chronic Illnesses',
  currentMedications: 'Current Medications',
  vaccinationRecord: 'Vaccination Record',
  height: 'Height',
  weight: 'Weight',
  bloodPressure: 'Blood Pressure',
  temperature: 'Temperature',
  
  // Checkup Types
  vision: 'Vision',
  hearing: 'Hearing',
  dental: 'Dental',
  scoliosis: 'Scoliosis',
  general: 'General',
  physical: 'Physical',
  
  // Time & Date
  date: 'Date',
  time: 'Time',
  createdAt: 'Created At',
  updatedAt: 'Updated At',
  
  // Common Labels
  name: 'Name',
  type: 'Type',
  notes: 'Notes',
  result: 'Result',
  results: 'Results',
  details: 'Details',
  eventDetails: 'Event Details',
  information: 'Information',
  summary: 'Summary',
  
  // Status Messages
  loading: 'Loading...',
  saving: 'Saving...',
  noData: 'No data available',
  notSpecified: 'Not specified',
  notAvailable: 'N/A',
  
  // Success Messages
  saveSuccess: 'Saved successfully',
  createSuccess: 'Created successfully',
  updateSuccess: 'Updated successfully',
  deleteSuccess: 'Deleted successfully',
  
  // Error Messages
  saveError: 'Error saving data',
  loadError: 'Error loading data',
  deleteError: 'Error deleting data',
  networkError: 'Network error occurred',
  
  // Validation Messages
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidPhone: 'Please enter a valid phone number',
  invalidDate: 'Please enter a valid date',
  
  // Confirmation Messages
  deleteConfirm: 'Are you sure you want to delete this item?',
  unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?',
  
  // Buttons
  createEvent: 'Create Event',
  editEvent: 'Edit Event',
  deleteEvent: 'Delete Event',
  viewEvent: 'View Event',
  
  // Gender Options
  male: 'Male',
  female: 'Female',
  other: 'Other',
    // School Information
  school: 'School',
  class: 'Class',
  grade: 'Grade',
  academicYear: 'Academic Year',
  
  // Grade Levels (1-12)
  grade1: 'Grade 1',
  grade2: 'Grade 2',
  grade3: 'Grade 3',
  grade4: 'Grade 4',
  grade5: 'Grade 5',
  grade6: 'Grade 6',
  grade7: 'Grade 7',
  grade8: 'Grade 8',
  grade9: 'Grade 9',
  grade10: 'Grade 10',
  grade11: 'Grade 11',
  grade12: 'Grade 12',
  allGrades: 'All Grades',
  primarySchool: 'Primary School (Grades 1-5)',
  secondarySchool: 'Secondary School (Grades 6-9)',
  highSchool: 'High School (Grades 10-12)',
  
  // Medical Staff
  nurse: 'Nurse',
  doctor: 'Doctor',
  physician: 'Physician',
  
  // File Operations
  upload: 'Upload',
  download: 'Download',
  attachment: 'Attachment',
  file: 'File',
  
  // Permissions & Roles
  admin: 'Admin',
  schoolNurse: 'School Nurse',
  parent: 'Parent',
  student: 'Student'
};

// Event Status Color Mapping for UI
export const STATUS_COLORS = {
  PLANNED: 'info',
  CONSENT_COLLECTION: 'secondary', 
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'error'
};

// Event Type Color Mapping for UI
export const EVENT_TYPE_COLORS = {
  HEALTH_CHECKUP: 'primary',
  VACCINATION: 'secondary'
};

export default UI_TEXT;

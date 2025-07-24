import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useAlert } from '../../hooks/useAlert'; // Import useAlert hook

const schema = yup.object().shape({
  studentCode: yup.string().required('Student selection is required'),
  eventType: yup.string().required('Event type is required'),
  severity: yup.string().required('Severity is required'),
  symptoms: yup.array().min(1, 'At least one symptom is required'),
  description: yup.string().required('Description is required'),
  actionTaken: yup.string().required('Action taken is required'),
  medicationGiven: yup.string(),
  parentNotified: yup.boolean(),
  referredTo: yup.string(),
  followUpRequired: yup.boolean(),
  followUpDate: yup.date().nullable().when('followUpRequired', {
    is: (val) => val === true, // Corrected condition for .when
    then: (schema) => schema.required('Follow-up date is required').typeError('Invalid date'), // Corrected usage of then
  }),
  status: yup.string().required('Status is required') // Added status field
});

const MedicalEvents = () => {
  const { successAlert, errorAlert, deleteConfirm } = useAlert(); // Initialize useAlert hook
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: 'today',
    severity: '',
    eventType: '',
    status: '',
    studentCode: ''
  });

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      symptoms: [],
      parentNotified: false,
      followUpRequired: false,
      studentCode: '',
      eventType: '',
      severity: '',
      description: '',
      actionTaken: '',
      medicationGiven: '',
      referredTo: '',
      followUpDate: null, // Ensure it's null by default
      status: 'active' // Added default status
    }
  });

  const watchFollowUpRequired = watch('followUpRequired');

  // useEffect to fetch students on component mount
  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs once on mount

  // useEffect to fetch medical events when filters change or on initial load (due to initial filters state)
  useEffect(() => {
    fetchMedicalEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchMedicalEvents = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const token = localStorage.getItem('token');

      const queryParams = { }; // Initialize as an empty object

      if (filters.severity) queryParams.severity = filters.severity;
      if (filters.eventType) queryParams.eventType = filters.eventType;
      if (filters.status) queryParams.status = filters.status;
      if (filters.studentCode) queryParams.studentCode = filters.studentCode;

      const today = new Date();
      let startDate, endDate;

      switch (filters.dateRange) {
        case 'today':
          startDate = today;
          endDate = today;
          break;
        case 'week':
          const currentDay = today.getDay();
          const firstDayOfWeek = new Date(today);
          firstDayOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
          startDate = firstDayOfWeek;
          
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);          break;
        case 'month':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);          break;
        case 'all':
        default:
          break;
      }

      const formatDateToYYYYMMDD = (date) => {
        if (!date) return null;
        return date.toISOString().split('T')[0];
      };

      if (startDate && filters.dateRange !== 'all') queryParams.startDate = formatDateToYYYYMMDD(startDate);
      if (endDate && filters.dateRange !== 'all') queryParams.endDate = formatDateToYYYYMMDD(endDate);
      
      // queryParams are already filtered by only adding them if they have a value

      const response = await axios.get('/api/medical-events', {
        headers: { Authorization: `Bearer ${token}` },
        params: queryParams
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching medical events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (selectedEvent) {
        await axios.put(`/api/medical-events/${selectedEvent.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        successAlert('Medical event updated successfully!');
      } else {
        await axios.post('/api/medical-events', data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        successAlert('Medical event recorded successfully!');
      }
      
      reset();
      setShowForm(false);
      setSelectedEvent(null);
      fetchMedicalEvents();
    } catch (error) {
      console.error('Error saving medical event:', error);
      errorAlert('Error saving medical event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmed = await deleteConfirm('Are you sure you want to delete this medical event?');
    if (confirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/medical-events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        successAlert('Medical event deleted successfully!');
        fetchMedicalEvents(); // Refresh the list
      } catch (error) {
        console.error('Error deleting medical event:', error);
        errorAlert('Error deleting medical event. Please try again.');
      }
    }
  };

  const handleSymptomChange = (symptom, checked, field) => {
    const currentSymptoms = field.value || [];
    if (checked) {
      field.onChange([...currentSymptoms, symptom]);
    } else {
      field.onChange(currentSymptoms.filter(s => s !== symptom));
    }
  };

  const editEvent = (event) => {
    setSelectedEvent(event);
    reset({
      ...event, 
      studentCode: event.studentCode || '', // DTO directly provides studentCode
      // Ensure date fields are correctly formatted if necessary
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : null, // Added for consistency if needed by a date picker for eventDate
      followUpDate: event.followUpDate ? new Date(event.followUpDate).toISOString().split('T')[0] : null,
      // Ensure symptoms is an array
      symptoms: Array.isArray(event.symptoms) ? event.symptoms : [],
      // status will be spread from event if present, or use existing if not in event for some reason
      status: event.status || 'active', 
    });
    setShowForm(true);
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
      critical: 'bg-red-500 text-white'
    };
    return badges[severity] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      follow_up: 'bg-yellow-100 text-yellow-800',
      referred: 'bg-purple-100 text-purple-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medical Events Management</h1>
              <p className="text-gray-600 mt-1">Record and manage medical incidents and health events</p>
            </div>
            <button
              onClick={() => {
                setSelectedEvent(null);
                reset();
                setShowForm(!showForm);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <i className="fas fa-plus mr-2"></i>
              {showForm ? 'Cancel' : 'Record Event'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4"> {/* Changed to md:grid-cols-5 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
              <select
                value={filters.studentCode}
                onChange={(e) => handleFilterChange('studentCode', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Students</option>
                {students.map(student => (
                  <option key={student.studentCode} value={student.studentCode}>
                    {student.fullName} ({student.studentCode})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
              <select
                value={filters.eventType}
                onChange={(e) => handleFilterChange('eventType', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Types</option>
                <option value="injury">Injury</option>
                <option value="illness">Illness</option>
                <option value="accident">Accident</option>
                <option value="emergency">Emergency</option>
                <option value="medication">Medication Related</option>
                <option value="outbreak">Disease Outbreak</option>
                <option value="fall">Fall</option>
                <option value="fever">Fever</option>
                <option value="allergic_reaction">Allergic Reaction</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
                <option value="follow_up">Follow-up Required</option>
                <option value="referred">Referred</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={fetchMedicalEvents}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Medical Event Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedEvent ? 'Edit Medical Event' : 'Record New Medical Event'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student *
                  </label>
                  <Controller
                    name="studentCode"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select student</option>
                        {students.map(student => (
                          // Assuming student object has studentCode, fullName, className
                          <option key={student.studentCode} value={student.studentCode}>
                            {student.fullName} - {student.className} ({student.studentCode})
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.studentCode && (
                    <p className="text-red-600 text-sm mt-1">{errors.studentCode.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <Controller
                    name="eventType"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select event type</option>
                        <option value="injury">Injury</option>
                        <option value="illness">Illness</option>
                        <option value="accident">Accident</option>
                        <option value="emergency">Emergency</option>
                        <option value="medication">Medication Related</option>
                        <option value="outbreak">Disease Outbreak</option>
                        <option value="fall">Fall</option>
                        <option value="fever">Fever</option>
                        <option value="allergic_reaction">Allergic Reaction</option>
                        <option value="other">Other</option>
                      </select>
                    )}
                  />
                  {errors.eventType && (
                    <p className="text-red-600 text-sm mt-1">{errors.eventType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity *
                  </label>
                  <Controller
                    name="severity"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select severity</option>
                        <option value="low">Low - Minor issue, self-care</option>
                        <option value="medium">Medium - Requires attention</option>
                        <option value="high">High - Urgent care needed</option>
                        <option value="critical">Critical - Emergency response</option>
                      </select>
                    )}
                  />
                  {errors.severity && (
                    <p className="text-red-600 text-sm mt-1">{errors.severity.message}</p>
                  )}
                </div>
              </div>

              {/* Status Field - ADDED */}
              <div className="mt-6 mb-6"> {/* Added mb-6 for spacing */}
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="active">Active</option>
                      <option value="resolved">Resolved</option>
                      <option value="follow_up">Follow-up Required</option>
                      <option value="referred">Referred</option>
                    </select>
                  )}
                />
                {errors.status && (
                  <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
                )}
              </div>


              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symptoms Observed *
                </label>
                <Controller
                  name="symptoms"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        'Fever', 'Headache', 'Nausea', 'Vomiting', 'Dizziness',
                        'Pain', 'Swelling', 'Rash', 'Difficulty breathing', 'Fatigue',
                        'Confusion', 'Bleeding', 'Bruising', 'Loss of consciousness', 'Other'
                      ].map(symptom => (
                        <label key={symptom} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(field.value || []).includes(symptom)}
                            onChange={(e) => handleSymptomChange(symptom, e.target.checked, field)}
                            className="mr-2"
                          />
                          <span className="text-sm">{symptom}</span>
                        </label>
                      ))}
                    </div>
                  )}
                />
                {errors.symptoms && (
                  <p className="text-red-600 text-sm mt-1">{errors.symptoms.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      rows="4"
                      placeholder="Provide detailed description of the incident, circumstances, and observations..."
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Action Taken */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Taken *
                </label>
                <Controller
                  name="actionTaken"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      rows="3"
                      placeholder="Describe the immediate actions taken, treatments provided, and care given..."
                    />
                  )}
                />
                {errors.actionTaken && (
                  <p className="text-red-600 text-sm mt-1">{errors.actionTaken.message}</p>
                )}
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medication Given
                  </label>
                  <Controller
                    name="medicationGiven"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="List any medications administered"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referred To
                  </label>
                  <Controller
                    name="referredTo"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Doctor, hospital, or specialist if referred"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <Controller
                  name="parentNotified"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="mr-2"
                      />
                      <span className="text-sm">Parent/Guardian notified</span>
                    </label>
                  )}
                />

                <Controller
                  name="followUpRequired"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="mr-2"
                      />
                      <span className="text-sm">Follow-up required</span>
                    </label>
                  )}
                />

                {watchFollowUpRequired && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Follow-up Date *
                    </label>
                    <Controller
                      name="followUpDate"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      )}
                    />
                    {errors.followUpDate && (
                      <p className="text-red-600 text-sm mt-1">{errors.followUpDate.message}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedEvent(null);
                    reset();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : (selectedEvent ? 'Update Event' : 'Record Event')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Medical Events</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date/Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No medical events found
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {event.studentCode} {/* Display student code */}
                        </div>
                        {/* Student's full name and class are not directly in event DTO */}
                        {/* To display them, you might need to find the student in the `students` array */}
                        {/* Example: students.find(s => s.studentCode === event.studentCode)?.fullName */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {event.eventType?.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {Array.isArray(event.symptoms) ? event.symptoms.slice(0, 2).join(', ') : ''}
                          {Array.isArray(event.symptoms) && event.symptoms.length > 2 && '...'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityBadge(event.severity)}`}>
                          {event.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(event.status)}`}>
                          {event.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'N/A'}
                        <br />
                        {event.eventDate ? new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => editEvent(event)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-600 hover:text-red-900 mr-4"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalEvents; // Ensure component is exported

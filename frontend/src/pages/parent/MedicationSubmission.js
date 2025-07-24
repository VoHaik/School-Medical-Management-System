import React, { useState, useEffect, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form'; // Removed useWatch as frequency is now a direct input or part of notes
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { useAlert } from '../../hooks/useAlert';

// Updated schema for MedicationRequestDTO
const schema = yup.object().shape({
  studentCode: yup.string().required('Child selection is required'),
  medicationName: yup.string().required('Medication name is required'),
  dosage: yup.string().required('Dosage is required'),
  frequency: yup.string().required('Frequency is required (e.g., Once a day, Twice a day at 8am and 5pm)'),
  startDate: yup.date().required('Start date is required').typeError('Start date must be a valid date'),
  endDate: yup.date().required('End date is required').min(yup.ref('startDate'), 'End date cannot be before start date').typeError('End date must be a valid date'),
  reason: yup.string().required('Reason for medication is required'),
  notes: yup.string().nullable() // Optional notes
});

// Consider renaming the component to MedicationRequest or ParentMedicationRequests
const MedicationSubmission = () => {
  const { currentUser } = useContext(AuthContext);
  const { successAlert, errorAlert, cancelConfirm } = useAlert();
  const location = useLocation();
  const navigate = useNavigate(); // For navigation
  const [children, setChildren] = useState([]);
  const [selectedStudentCode, setSelectedStudentCode] = useState('');
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [requests, setRequests] = useState([]); // Renamed from submissions
  const [loadingRequests, setLoadingRequests] = useState(true); // Renamed from loading
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      studentCode: '',
      medicationName: '',
      dosage: '',
      frequency: '',
      startDate: '', // Initialize as empty string for date inputs
      endDate: '',
      reason: '',
      notes: ''
    }
  });

  // Removed useWatch for frequency as it's now a direct input or part of notes

  // Effect to fetch children
  useEffect(() => {
    const fetchChildren = async () => {
      if (currentUser && currentUser.username) {
        setLoadingChildren(true);
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`/api/users/students-by-parent/${currentUser.username}`, { // Assuming this endpoint exists
            headers: { Authorization: `Bearer ${token}` }
          });
          setChildren(response.data || []);
          if (response.data && response.data.length > 0) {
            if (location.state?.studentCode) {
              setSelectedStudentCode(location.state.studentCode);
              setValue('studentCode', location.state.studentCode);
            } else {
              // Optionally auto-select the first child
              // setSelectedStudentCode(response.data[0].studentCode);
              // setValue('studentCode', response.data[0].studentCode);
            }
          }
        } catch (error) {
          console.error('Error fetching children:', error.response ? error.response.data : error);
        } finally {
          setLoadingChildren(false);
        }
      }
    };
    fetchChildren();
  }, [currentUser, location.state, setValue]);

  // Effect to fetch medication requests for the selected child
  useEffect(() => {
    if (selectedStudentCode) {
      fetchMedicationRequests(); // Renamed function
    } else {
      setRequests([]); // Renamed state variable
      setLoadingRequests(false); // Renamed state variable
    }
  }, [selectedStudentCode]);

  const fetchMedicationRequests = async () => { // Renamed function
    if (!selectedStudentCode) return;
    setLoadingRequests(true); // Renamed state variable
    try {
      const token = localStorage.getItem('token');
      // Fetching requests for the selected student by the authenticated parent
      const response = await axios.get(`/api/medication-requests/student/${selectedStudentCode}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data); // Renamed state variable
    } catch (error) {
      console.error('Error fetching medication requests:', error.response ? error.response.data : error);
      setRequests([]); // Clear requests on error
    } finally {
      setLoadingRequests(false); // Renamed state variable
    }
  };

  const onSubmit = async (data) => {
    if (!selectedStudentCode) {
      errorAlert('Vui lòng chọn con em trước.');
      return;
    }
    setSubmitting(true);

    const payload = {
      studentCode: selectedStudentCode, // Use selectedStudentCode directly
      medicationName: data.medicationName,
      dosage: data.dosage,
      frequency: data.frequency,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      notes: data.notes
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/medication-requests', payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' // Ensure correct content type
        }
      });
      
      successAlert('Yêu cầu sử dụng thuốc đã được gửi thành công!');
      reset({
        studentCode: selectedStudentCode, 
        medicationName: '',
        dosage: '',
        frequency: '',
        startDate: '',
        endDate: '',
        reason: '',
        notes: ''
      });
      setShowForm(false);
      fetchMedicationRequests(); // Refresh requests for the current child
    } catch (error) {
      console.error('Error submitting medication request:', error.response ? error.response.data : error);
      const errorMessage = error.response?.data?.error || 'Lỗi khi gửi yêu cầu sử dụng thuốc. Vui lòng thử lại.';
      errorAlert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChildChange = (e) => {
    const studentCodeValue = e.target.value;
    setSelectedStudentCode(studentCodeValue);
    setValue('studentCode', studentCodeValue);
    if (!studentCodeValue) {
        setShowForm(false);
        setRequests([]); // Clear requests if no child is selected
    }
  };

  // handleTimeChange is removed as administrationTime field is removed

  const getStatusBadge = (status) => {
    const statusFormatted = status ? status.toLowerCase() : '';
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      administered: 'bg-blue-100 text-blue-800',
      cancelled_by_parent: 'bg-gray-100 text-gray-800',
      cancelled_by_nurse: 'bg-gray-200 text-gray-800'
    };
    return badges[statusFormatted] || 'bg-gray-100 text-gray-800';
  };
  
  const handleCancelRequest = async (requestId) => {
    const confirmed = await cancelConfirm('yêu cầu sử dụng thuốc này');
    if (!confirmed) return;
    try {
        const token = localStorage.getItem('token');
        await axios.put(`/api/medication-requests/${requestId}/cancel`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        successAlert('Yêu cầu sử dụng thuốc đã được hủy thành công.');
        fetchMedicationRequests(); // Refresh the list
    } catch (error) {
        console.error('Error cancelling medication request:', error.response ? error.response.data : error);
        const errorMessage = error.response?.data?.error || 'Lỗi khi hủy yêu cầu sử dụng thuốc.';
        errorAlert(errorMessage);
    }
  };

  if (loadingChildren && !children.length) { // Show initial loading if children are being fetched for the first time
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Medication Requests</h1>
                    <p className="text-gray-600 mt-1">Submit and manage medication requests for your child.</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <label htmlFor="child-select" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Child
                    </label>
                    <select
                        id="child-select"
                        name="child-select"
                        value={selectedStudentCode}
                        onChange={handleChildChange}
                        disabled={loadingChildren || children.length === 0}
                        className="w-full sm:w-auto p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">{loadingChildren ? 'Loading children...' : (children.length === 0 ? 'No children found' : '-- Select a Child --')}</option>
                        {children.map(child => (
                        <option key={child.studentCode} value={child.studentCode}>{child.fullName} ({child.studentCode})</option>
                        ))}
                    </select>
                    {/* Error for studentCode is handled by react-hook-form if form is submitted without selection */}
                </div>
            </div>
            {selectedStudentCode && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        disabled={!selectedStudentCode}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'} mr-2`}></i>
                        {showForm ? 'Cancel New Request' : 'New Medication Request'}
                    </button>
                </div>
            )}
          </div>
        </div>

        {showForm && selectedStudentCode && (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Submit New Medication Request</h2>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* studentCode is implicitly set via selectedStudentCode in onSubmit */}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="medicationName" className="block text-sm font-medium text-gray-700 mb-2">
                    Medication Name *
                  </label>
                  <Controller
                    name="medicationName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="medicationName"
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter medication name"
                      />
                    )}
                  />
                  {errors.medicationName && (
                    <p className="text-red-600 text-sm mt-1">{errors.medicationName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-2">
                    Dosage *
                  </label>
                  <Controller
                    name="dosage"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="dosage"
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., 5mg, 1 tablet"
                      />
                    )}
                  />
                  {errors.dosage && (
                    <p className="text-red-600 text-sm mt-1">{errors.dosage.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency *
                  </label>
                  <Controller
                    name="frequency"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="frequency"
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., Once daily, Twice daily at 8am & 5pm"
                      />
                    )}
                  />
                  {errors.frequency && (
                    <p className="text-red-600 text-sm mt-1">{errors.frequency.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="startDate"
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    )}
                  />
                  {errors.startDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="endDate"
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    )}
                  />
                  {errors.endDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.endDate.message}</p>
                  )}
                </div>

                 <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Medication *
                  </label>
                  <Controller
                    name="reason"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        id="reason"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        rows="3"
                        placeholder="Describe the medical condition requiring this medication"
                      />
                    )}
                  />
                  {errors.reason && (
                    <p className="text-red-600 text-sm mt-1">{errors.reason.message}</p>
                  )}
                </div>
              </div>

              {/* Removed sections for administration times, prescribedBy, sideEffects, storage, emergency contact, signature, doctor note */}

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes / Instructions
                </label>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      id="notes"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      rows="4"
                      placeholder="Any additional information, specific administration instructions, or details for the nurse (e.g., 'Administer with food', 'Student knows how to take it')"
                    />
                  )}
                />
                {/* errors.notes is not shown as it's optional, but you can add if needed */}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    reset({
                        studentCode: selectedStudentCode, 
                        medicationName: '',
                        dosage: '',
                        frequency: '',
                        startDate: '',
                        endDate: '',
                        reason: '',
                        notes: ''
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        )}

        {selectedStudentCode && (
            <div className="bg-white rounded-lg shadow mt-8">
                <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                    Medication Requests for {children.find(c => c.studentCode === selectedStudentCode)?.fullName || 'Selected Child'}
                </h2>
                </div>
                
                {loadingRequests && (
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading requests...</p>
                    </div>
                )}

                {!loadingRequests && requests.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No medication requests found for this child.
                    </div>
                )}

                {!loadingRequests && requests.length > 0 && (
                    <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates (Start-End)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested On</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {requests.map((request) => (
                            <tr key={request.requestId} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{request.medicationName}</div>
                                <div className="text-sm text-gray-500">Dosage: {request.dosage}</div>
                                <div className="text-sm text-gray-500">Freq: {request.frequency}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                                  {request.status ? request.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(request.requestDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button 
                                  onClick={() => navigate(`/parent/medication-request/${request.requestId}`, { state: { requestDetail: request } })} 
                                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                  View Details
                                </button>
                                {(request.status === 'PENDING') && (
                                  <button 
                                    onClick={() => handleCancelRequest(request.requestId)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Cancel Request
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default MedicationSubmission;

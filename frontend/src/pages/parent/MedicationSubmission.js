import React, { useState, useEffect, useContext } from 'react'; // Added useContext
import { useForm, Controller, useWatch } from 'react-hook-form'; // Added useWatch
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; // Added AuthContext import
import { useLocation } from 'react-router-dom'; // Added useLocation

const schema = yup.object().shape({
  studentCode: yup.string().required('Child selection is required'), // Changed studentId to studentCode
  medicationName: yup.string().required('Medication name is required'),
  dosage: yup.string().required('Dosage is required'),
  frequency: yup.string().required('Frequency is required'),
  administrationTime: yup.array().min(1, 'At least one administration time is required'),
  duration: yup.string().required('Duration is required'),
  instructions: yup.string().required('Instructions are required'),
  prescribedBy: yup.string().required('Prescribing doctor is required'),
  reason: yup.string().required('Reason for medication is required'),
  sideEffects: yup.string(),
  storageInstructions: yup.string(),
  emergencyContact: yup.string().required('Emergency contact is required'),
  parentSignature: yup.boolean().oneOf([true], 'Parent signature is required'),
  doctorNote: yup.mixed()
});

const MedicationSubmission = () => {
  const { currentUser } = useContext(AuthContext); // Get currentUser
  const location = useLocation(); // Added to get state from navigation
  const [children, setChildren] = useState([]);
  const [selectedStudentCode, setSelectedStudentCode] = useState(''); // Changed selectedStudentId to selectedStudentCode
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true); // This will now be for submissions
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm({ // Added setValue
    resolver: yupResolver(schema),
    defaultValues: {
      studentCode: '', // Changed studentId to studentCode
      administrationTime: [],
      parentSignature: false,
      frequency: '', // Ensure frequency has a default value
      otherTimes: '' // Add otherTimes to defaultValues
    }
  });

  const frequencyValue = useWatch({ // Use useWatch
    control,
    name: 'frequency', // The field to watch
  });

  // Effect to fetch children
  useEffect(() => {
    const fetchChildren = async () => {
      if (currentUser && currentUser.username) { // Use username (parent_code)
        setLoadingChildren(true);
        try {
          const token = localStorage.getItem('token');
          // Assuming /api/parent/students returns children with studentCode
          const response = await axios.get(`/api/parent/students`, { 
            headers: { Authorization: `Bearer ${token}` }
          });
          setChildren(response.data || []);
          if (response.data && response.data.length > 0) {
            // If studentCode is passed via navigation state, set it
            if (location.state?.studentCode) {
              setSelectedStudentCode(location.state.studentCode);
              setValue('studentCode', location.state.studentCode); // Also set in RHF
            } else {
              // Optionally, auto-select the first child if no specific child is passed
              // setSelectedStudentCode(response.data[0].studentCode); 
              // setValue('studentCode', response.data[0].studentCode);
            }
          }
        } catch (error) {
          console.error('Error fetching children:', error);
          // Handle error (e.g., show a message to the user)
        } finally {
          setLoadingChildren(false);
        }
      }
    };
    fetchChildren();
  }, [currentUser, location.state, setValue]); // Added location.state and setValue to dependencies

  // Effect to fetch medication submissions for the selected child
  useEffect(() => {
    if (selectedStudentCode) { // Changed selectedStudentId to selectedStudentCode
      fetchMedicationSubmissions();
    } else {
      setSubmissions([]); // Clear submissions if no child is selected
      setLoading(false); // Stop loading if no child selected
    }
  }, [selectedStudentCode]); // Re-run when selectedStudentCode changes

  const fetchMedicationSubmissions = async () => {
    if (!selectedStudentCode) return; // Don't fetch if no child is selected // Changed selectedStudentId to selectedStudentCode
    setLoading(true); // For submissions loading
    try {
      const token = localStorage.getItem('token');
      // API endpoint should use studentCode
      const response = await axios.get(`/api/medication-submissions/student/${selectedStudentCode}`, { // Changed API endpoint and parameter
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching medication submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedStudentCode) { // Changed selectedStudentId to selectedStudentCode
      alert('Please select a child first.');
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      const submissionData = { ...data }; 
      // studentCode is already in submissionData from RHF
      delete submissionData.doctorNote; 

      formData.append('submission', new Blob([JSON.stringify(submissionData)], { type: 'application/json' }));

      if (data.doctorNote && data.doctorNote[0]) {
        formData.append('doctorNote', data.doctorNote[0]);
      }

      await axios.post('/api/medication-submissions', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
        }
      });
      
      alert('Medication submission successful!');
      reset({ 
        studentCode: selectedStudentCode, // Keep selected studentCode
        medicationName: '',
        dosage: '',
        frequency: '',
        administrationTime: [],
        duration: '',
        instructions: '',
        prescribedBy: '',
        reason: '',
        sideEffects: '',
        storageInstructions: '',
        emergencyContact: '',
        parentSignature: false,
        doctorNote: null
      });
      setShowForm(false);
      fetchMedicationSubmissions(); // Refresh submissions for the current child
    } catch (error) {
      console.error('Error submitting medication:', error.response ? error.response.data : error);
      alert('Error submitting medication. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChildChange = (e) => {
    const studentCodeValue = e.target.value; // Changed studentId to studentCodeValue
    setSelectedStudentCode(studentCodeValue); // Changed setSelectedStudentId to setSelectedStudentCode
    setValue('studentCode', studentCodeValue); // Update form state with studentCode
    if (!studentCodeValue) {
        setShowForm(false); // Hide form if no child is selected
    }
  };

  const handleTimeChange = (time, checked, field) => {
    const currentTimes = field.value || [];
    if (checked) {
      field.onChange([...currentTimes, time]);
    } else {
      field.onChange(currentTimes.filter(t => t !== time));
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      administered: 'bg-blue-100 text-blue-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (loadingChildren && !currentUser) { // Show initial loading if current user or children are loading
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Medication Submissions</h1>
                    <p className="text-gray-600 mt-1">Submit and manage medication requests for your child</p>
                </div>
                {/* Child Selector */}
                <div className="mt-4 sm:mt-0">
                    <label htmlFor="child-select" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Child
                    </label>
                    <select
                        id="child-select"
                        name="child-select"
                        value={selectedStudentCode} // Changed selectedStudentId to selectedStudentCode
                        onChange={handleChildChange}
                        disabled={loadingChildren || children.length === 0}
                        className="w-full sm:w-auto p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">{loadingChildren ? 'Loading children...' : '-- Select a Child --'}</option>
                        {children.map(child => (
                        <option key={child.studentCode} value={child.studentCode}>{child.fullName}</option> // Changed child.id to child.studentCode
                        ))}
                    </select>
                    {errors.studentCode && !selectedStudentCode && ( // Show error if studentCode is required and not selected
                        <p className="text-red-600 text-sm mt-1">{errors.studentCode.message}</p> // Changed errors.studentId to errors.studentCode
                    )}
                </div>
            </div>
            {selectedStudentCode && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        disabled={!selectedStudentCode} // Changed selectedStudentId to selectedStudentCode
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'} mr-2`}></i>
                        {showForm ? 'Cancel' : 'New Submission'}
                    </button>
                </div>
            )}
          </div>
        </div>

        {/* Medication Submission Form */}
        {showForm && selectedStudentCode && ( // Changed selectedStudentId to selectedStudentCode
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Submit New Medication Request</h2>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Hidden studentId field for form submission, already handled by setValue and defaultValues */}
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medication Name *
                  </label>
                  <Controller
                    name="medicationName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dosage *
                  </label>
                  <Controller
                    name="dosage"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency *
                  </label>
                  <Controller
                    name="frequency"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select frequency</option>
                        <option value="once_daily">Once daily</option>
                        <option value="twice_daily">Twice daily</option>
                        <option value="three_times_daily">Three times daily</option>
                        <option value="four_times_daily">Four times daily</option>
                        <option value="as_needed">As needed</option>
                        <option value="other">Other</option>
                      </select>
                    )}
                  />
                  {errors.frequency && (
                    <p className="text-red-600 text-sm mt-1">{errors.frequency.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., 7 days, 2 weeks, ongoing"
                      />
                    )}
                  />
                  {errors.duration && (
                    <p className="text-red-600 text-sm mt-1">{errors.duration.message}</p>
                  )}
                </div>
              </div>

              {/* Administration Times */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Administration Times *
                </label>
                <Controller
                  name="administrationTime"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'morning', label: 'Morning (8:00 AM)' },
                        { value: 'noon', label: 'Noon (12:00 PM)' },
                        { value: 'afternoon', label: 'Afternoon (3:00 PM)' },
                        { value: 'evening', label: 'Evening (6:00 PM)' },
                        { value: 'before_breakfast', label: 'Before Breakfast' },
                        { value: 'after_breakfast', label: 'After Breakfast' },
                        { value: 'before_lunch', label: 'Before Lunch' },
                        { value: 'after_lunch', label: 'After Lunch' }
                      ].map(time => (
                        <label key={time.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(field.value || []).includes(time.value)}
                            onChange={(e) => handleTimeChange(time.value, e.target.checked, field)}
                            className="mr-2"
                          />
                          <span className="text-sm">{time.label}</span>
                        </label>
                      ))}

                      {/* Additional time slots for "Other" frequency */}
                      {frequencyValue === 'other' && ( // Use frequencyValue here
                        <>
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Specify Other Times
                            </label>
                            <Controller
                              name="otherTimes"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="text"
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                  placeholder="e.g., 10:00 AM, 2:00 PM"
                                />
                              )}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                />
                {errors.administrationTime && (
                  <p className="text-red-600 text-sm mt-1">{errors.administrationTime.message}</p>
                )}
              </div>

              {/* Medical Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prescribed By *
                  </label>
                  <Controller
                    name="prescribedBy"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Doctor's name and contact"
                      />
                    )}
                  />
                  {errors.prescribedBy && (
                    <p className="text-red-600 text-sm mt-1">{errors.prescribedBy.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact *
                  </label>
                  <Controller
                    name="emergencyContact"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Parent/Guardian contact number"
                      />
                    )}
                  />
                  {errors.emergencyContact && (
                    <p className="text-red-600 text-sm mt-1">{errors.emergencyContact.message}</p>
                  )}
                </div>
              </div>

              {/* Detailed Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Medication *
                  </label>
                  <Controller
                    name="reason"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Administration Instructions *
                  </label>
                  <Controller
                    name="instructions"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        rows="3"
                        placeholder="Detailed instructions for administering the medication"
                      />
                    )}
                  />
                  {errors.instructions && (
                    <p className="text-red-600 text-sm mt-1">{errors.instructions.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Possible Side Effects
                  </label>
                  <Controller
                    name="sideEffects"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        rows="2"
                        placeholder="List any known side effects and what to watch for"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Storage Instructions
                  </label>
                  <Controller
                    name="storageInstructions"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., Store in refrigerator, Keep at room temperature"
                      />
                    )}
                  />
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor's Note/Prescription
                </label>
                <Controller
                  name="doctorNote"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => onChange(e.target.files)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  )}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload doctor's note or prescription (PDF, JPG, PNG files only)
                </p>
              </div>

              {/* Consent */}
              <div className="border-t border-gray-200 pt-6">
                <div className="space-y-4">
                  <Controller
                    name="parentSignature"
                    control={control}
                    render={({ field }) => (
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="mt-1 mr-3"
                        />
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">Parent/Guardian Consent *</p>
                          <p className="text-gray-600">
                            I hereby give my consent for the school medical staff to administer the above-mentioned 
                            medication to my child as prescribed. I understand that I am responsible for providing 
                            the medication in its original container with proper labeling, and I will notify the 
                            school immediately of any changes to the medication regimen.
                          </p>
                        </div>
                      </label>
                    )}
                  />
                  {errors.parentSignature && (
                    <p className="text-red-600 text-sm">{errors.parentSignature.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    reset({ studentCode: selectedStudentCode, administrationTime: [], parentSignature: false }); // Reset form but keep studentId
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

        {/* Submissions List */}
        {selectedStudentCode && ( // Only show submissions list if a child is selected
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                    Previous Submissions for {children.find(c => c.studentCode === selectedStudentCode)?.fullName || 'Selected Child'}
                </h2>
                </div>
                
                {loading && ( // Loading indicator for submissions
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading submissions...</p>
                    </div>
                )}

                {!loading && submissions.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No medication submissions found for this child.
                    </div>
                )}

                {!loading && submissions.length > 0 && (
                    <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Medication
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dosage
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Frequency
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Submitted
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {submissions.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                              No medication submissions found
                            </td>
                          </tr>
                        ) : (
                          submissions.map((submission) => (
                            <tr key={submission.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {submission.medicationName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {submission.reason}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {submission.dosage}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {submission.frequency}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(submission.status)}`}>
                                  {submission.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(submission.submittedAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                                  View Details
                                </button>
                                {submission.status === 'pending' && (
                                  <button className="text-red-600 hover:text-red-900">
                                    Cancel
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
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

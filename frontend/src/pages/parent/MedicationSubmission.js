import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const schema = yup.object().shape({
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
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      administrationTime: [],
      parentSignature: false
    }
  });

  useEffect(() => {
    fetchMedicationSubmissions();
  }, []);

  const fetchMedicationSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/medication-submissions', {
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
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Append all form data
      Object.keys(data).forEach(key => {
        if (key === 'doctorNote' && data[key]?.[0]) {
          formData.append('doctorNote', data[key][0]);
        } else if (Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });

      await axios.post('/api/medication-submissions', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('Medication submission successful!');
      reset();
      setShowForm(false);
      fetchMedicationSubmissions();
    } catch (error) {
      console.error('Error submitting medication:', error);
      alert('Error submitting medication. Please try again.');
    } finally {
      setSubmitting(false);
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

  if (loading) {
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
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medication Submissions</h1>
              <p className="text-gray-600 mt-1">Submit and manage medication requests for your child</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <i className="fas fa-plus mr-2"></i>
              {showForm ? 'Cancel' : 'New Submission'}
            </button>
          </div>
        </div>

        {/* Medication Submission Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Submit New Medication Request</h2>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
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
                  onClick={() => setShowForm(false)}
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
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Previous Submissions</h2>
          </div>
          
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
        </div>
      </div>
    </div>
  );
};

export default MedicationSubmission;

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import AllergyItem from '../../components/parent/AllergyItem';
import ChronicIllnessItem from '../../components/parent/ChronicIllnessItem';
import EmergencyContactItem from '../../components/parent/EmergencyContactItem';
import VaccinationItem from '../../components/parent/VaccinationItem';
import { useLocation, Link } from 'react-router-dom'; // Added Link
import { useAlert } from '../../hooks/useAlert';

const schema = yup.object().shape({
  studentCode: yup.string().required("Child selection is required"),
  allergies: yup.array().of(yup.string().nullable()), // Allow null or empty strings initially
  chronicIllnesses: yup.array().of(yup.string().nullable()), // Allow null or empty strings initially
  medicalHistory: yup.string().nullable(),
  emergencyContacts: yup.array().of(yup.object().shape({
    name: yup.string().required("Contact name is required"),
    relationship: yup.string().required("Relationship is required"),
    phone: yup.string().required("Phone number is required"),
    isEmergency: yup.boolean()
  })).min(1, "At least one emergency contact is required"),
  visionStatus: yup.string().nullable(),
  hearingStatus: yup.string().nullable(),
  vaccinations: yup.array().of(yup.object().shape({
    vaccineName: yup.string().required("Vaccine name is required"), 
    vaccinationDate: yup.date().required("Date administered is required").typeError("Invalid date"), 
    notes: yup.string().nullable()
  })),
  specialNeeds: yup.string().nullable(),
  physicalLimitations: yup.string().nullable(),
  mentalHealthConcerns: yup.string().nullable(),
  dietaryRestrictions: yup.string().nullable()
});

const HealthDeclaration = () => {
  const { currentUser } = useContext(AuthContext);
  const { successAlert, errorAlert, cancelConfirm } = useAlert();
  const location = useLocation(); // Added to get state from navigation
  const [children, setChildren] = useState([]);
  
  const [selectedStudentCode, setSelectedStudentCode] = useState('');
  const [initialLoading, setInitialLoading] = useState(true); // For children list
  const [isFetchingDeclaration, setIsFetchingDeclaration] = useState(false); // For health data for a selected child
  const [submitting, setSubmitting] = useState(false); // For form submission (save/submit)
    const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      studentCode: '',
      allergies: [],
      chronicIllnesses: [],
      emergencyContacts: [{ name: '', relationship: '', phone: '', isEmergency: true }],
      vaccinations: [],
      visionStatus: '',
      hearingStatus: '',
      specialNeeds: '',
      physicalLimitations: '',
      mentalHealthConcerns: '',
      dietaryRestrictions: '',
      medicalHistory: ''
    }
  });

  // Effect to fetch parent's children
  useEffect(() => {
    const fetchChildren = async () => {
      if (currentUser && currentUser.username) { // Use username (parent_code)
        setInitialLoading(true);
        try {
          const token = localStorage.getItem('token');
          // Assuming /api/parent/students returns children with studentCode
          const childrenResponse = await axios.get(`/api/parent/students`, { 
            headers: { Authorization: `Bearer ${token}` }
          });
          setChildren(childrenResponse.data || []);
          // If studentCode is passed via navigation state, set it
          if (location.state?.studentCode) {
            setSelectedStudentCode(location.state.studentCode);
            setValue('studentCode', location.state.studentCode); // Also set in RHF
          }

        } catch (error) {
          console.error('Error fetching children:', error);
          setChildren([]);
        } finally {
          setInitialLoading(false);
        }
      } else if (!currentUser) {
        setInitialLoading(true); // Still waiting for currentUser
      } else {
        setInitialLoading(false); // currentUser loaded but no ID, or other issue
        setChildren([]);
      }
    };
    fetchChildren();  }, [currentUser, location.state, setValue]); // Added setValue to dependencies  // Reset form to empty defaults with optionally keeping the student code
  const resetFormToDefaults = useCallback((studentCodeToKeep = '') => {
    reset({
      studentCode: studentCodeToKeep,
      allergies: [],
      chronicIllnesses: [],
      emergencyContacts: [{ name: '', relationship: '', phone: '', isEmergency: true }],
      vaccinations: [],
      visionStatus: '',
      hearingStatus: '',
      specialNeeds: '',
      physicalLimitations: '',
      mentalHealthConcerns: '',
      dietaryRestrictions: '',
      medicalHistory: ''
    });  }, [reset]);
  // Effect to handle student code changes (but not fetch previous declaration data)
  const fetchHealthDeclaration = useCallback(async (studentCodeToFetch) => {
    if (!studentCodeToFetch) {
      resetFormToDefaults(''); // Reset with empty student code
      return;
    }
    
    // Just set the form to defaults with the selected student code
    resetFormToDefaults(studentCodeToFetch);
    setIsFetchingDeclaration(false);
    
  }, [resetFormToDefaults]);

  // This useEffect listens to selectedStudentCode and calls fetchHealthDeclaration
  useEffect(() => {
    fetchHealthDeclaration(selectedStudentCode);
  }, [selectedStudentCode, fetchHealthDeclaration]);  const onSubmit = async (formData) => {
    if (!selectedStudentCode) {
      errorAlert("Vui lòng chọn con em trước.");
      return;
    }
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');      
      // Prepare health declaration data
      const dataToSubmit = {
        ...formData,
        studentCode: selectedStudentCode // Ensure student code is included
      };
        // Submit the health declaration to the correct endpoint
      const response = await axios.post(
        `/api/health-declaration`, 
        dataToSubmit,
        { headers: { Authorization: `Bearer ${token}` } }
      );        
      
      // Show success alert with information about viewing the health declaration and checking status
      successAlert(
        'Tờ khai sức khỏe đã được gửi thành công!\n\n' + 
        'Tờ khai của bạn sẽ được xem xét bởi nhân viên y tế của trường. ' +
        'Bạn có thể xem trạng thái tờ khai (Đang chờ, Đã duyệt, hoặc Từ chối) ' +
        'trong phần Hồ sơ sức khỏe.'
      );
      
      // Reset form and clear student selection after successful submission
      resetFormToDefaults('');
      setSelectedStudentCode('');
    } catch (error) {
      console.error('Error submitting health declaration:', error);
      errorAlert('Lỗi khi gửi tờ khai sức khỏe. Vui lòng thử lại. ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };  const handleCancel = async () => {
    // Confirm before cancelling
    const confirmed = await cancelConfirm();
    if (confirmed) {
      // Reset the form to defaults and clear student selection
      resetFormToDefaults('');
      // Clear student selection
      setSelectedStudentCode('');
    }
  };

  const addArrayItem = useCallback((fieldName, defaultItem) => {
    const currentValues = watch(fieldName) || [];
    setValue(fieldName, [...currentValues, defaultItem]);
  }, [watch, setValue]);

  const removeArrayItem = useCallback((fieldName, index) => {
    const currentValues = watch(fieldName) || [];
    setValue(fieldName, currentValues.filter((_, i) => i !== index));
  }, [watch, setValue]);

  // For simple string array items (allergies, chronicIllnesses)
  const handleSimpleArrayItemChange = useCallback((fieldName, index, value) => {
    const currentValues = watch(fieldName) || [];
    const newValues = [...currentValues];
    newValues[index] = value;
    setValue(fieldName, newValues);
  }, [watch, setValue]);

  // For array of objects items (medications, emergencyContacts, vaccinations)
  const handleNestedObjectArrayItemChange = useCallback((fieldName, index, event) => {
    const { name, value, type, checked } = event.target;
    const currentValues = watch(fieldName) || [];
    const newValues = [...currentValues];
    newValues[index] = {
         ...newValues[index],
         [name]: type === 'checkbox' ? checked : value 
    };
    setValue(fieldName, newValues);
  }, [watch, setValue]);


  // Main loading state: waiting for currentUser to determine if parent can access
  if (!currentUser && initialLoading) { 
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        <p className="ml-4 text-lg text-gray-700">Loading user information...</p>
      </div>
    );
  }
  // If currentUser is loaded but not a parent or no ID (should be handled by ProtectedRoute, but as a fallback)
  if (!currentUser || !currentUser.id) {
      return <div className="p-6 text-center text-red-500">Access Denied or User not properly loaded.</div>;
  }

  // Skeleton Loader for the form content area
  const FormSkeleton = () => (
    <div className="p-6 space-y-8 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div> {/* Section Title */}
          <div className="space-y-2">
            <div className="h-10 bg-gray-300 rounded"></div> {/* Input Field */}
            {i < 2 && <div className="h-8 bg-gray-300 rounded w-1/4 mt-2"></div>} {/* Add Button Placeholder */}
          </div>
        </div>
      ))}
      {/* Buttons Placeholder */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
        <div className="h-10 bg-gray-300 rounded w-28"></div> {/* Save Draft */}
        <div className="h-10 bg-gray-300 rounded w-36"></div> {/* Submit */}
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg">          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Health Declaration</h1>
              <div className="space-x-2">
                <Link 
                  to="/parent/health-records" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Health Records
                </Link>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Submit a new health declaration for your child. You can view all submitted declarations in the Health Records section.</p>
            {/* Child Selector */}
            <div className="mt-4">
              <label htmlFor="studentCodeSelect" className="block text-sm font-medium text-gray-700 mb-1">
                Select Child
              </label>
              {initialLoading && children.length === 0 ? (
                <div className="h-10 bg-gray-300 rounded animate-pulse w-full p-2 border border-gray-300"></div>
              ) : (
                <select
                  id="studentCodeSelect"
                  value={selectedStudentCode}
                  onChange={(e) => {
                    const newStudentCode = e.target.value;
                    setSelectedStudentCode(newStudentCode);
                    setValue('studentCode', newStudentCode); // Update RHF studentCode field
                  }}
                  className={`w-full p-2 border ${errors.studentCode ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                  disabled={children.length === 0 || initialLoading || isFetchingDeclaration}
                >
                  <option value="">-- Select a child --</option>                  {children.map(child => (
                    <option key={child.studentCode} value={child.studentCode}>
                      {child.fullName}
                    </option>
                  ))}
                </select>
              )}
              {/* This error refers to the RHF studentCode */}
              {errors.studentCode && <p className="text-red-600 text-sm mt-1">{errors.studentCode.message}</p>}
              {!initialLoading && children.length === 0 && <p className="text-sm text-gray-500 mt-1">No children found for your account.</p>}
            </div>
          </div>

          {isFetchingDeclaration && selectedStudentCode ? (
            <FormSkeleton />
          ) : !selectedStudentCode && !initialLoading ? (
            // Message to show if children are loaded but none is selected yet
            <p className="p-6 text-gray-600 text-center">Please select a child to view or complete their health declaration.</p>
          ) : selectedStudentCode && !isFetchingDeclaration ? (
            // Only render form if a child is selected and data is not being fetched
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
              {/* Hidden studentCode field for react-hook-form validation, value set by fetch/reset */}
              <Controller name="studentCode" control={control} render={({ field }) => <input type="hidden" {...field} />} />

              {/* Allergies Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Allergies</h3>
                <Controller
                  name="allergies"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      {(field.value || []).map((allergy, index) => (
                        <AllergyItem
                          key={`allergy-${index}`} 
                          allergy={allergy}
                          index={index}
                          onChange={(idx, val) => handleSimpleArrayItemChange('allergies', idx, val)}
                          onRemove={() => removeArrayItem('allergies', index)}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('allergies', '')}
                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                        disabled={isFetchingDeclaration || submitting}
                      >
                        <i className="fas fa-plus mr-1"></i> Add Allergy
                      </button>
                    </div>
                  )}
                />
                 {errors.allergies?.map((err, i) => err && <p key={`err-allergy-${i}`} className="text-red-600 text-sm mt-1">{err.message || "Allergy entry cannot be empty."}</p>)}
              </div>              {/* Chronic Illnesses Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Chronic Illnesses</h3>
                <Controller
                  name="chronicIllnesses"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      {(field.value || []).map((illness, index) => (
                        <ChronicIllnessItem
                          key={`chronic-${index}`}
                          illness={illness}
                          index={index}
                          onChange={(idx, val) => handleSimpleArrayItemChange('chronicIllnesses', idx, val)}
                          onRemove={() => removeArrayItem('chronicIllnesses', index)}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('chronicIllnesses', '')}
                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                        disabled={isFetchingDeclaration || submitting}
                      >
                        <i className="fas fa-plus mr-1"></i> Add Chronic Illness
                      </button>
                    </div>
                  )}
                />
                {errors.chronicIllnesses?.map((err, i) => err && <p key={`err-chronic-${i}`} className="text-red-600 text-sm mt-1">{err.message || "Chronic illness entry cannot be empty."}</p>)}
              </div>
              
              {/* Medical History Section */}
              <div className="space-y-1">
                <label htmlFor="medicalHistory" className="block text-lg font-semibold text-gray-900">Relevant Medical History</label>
                <Controller
                    name="medicalHistory"
                    control={control}
                    render={({ field }) => (
                        <textarea
                            {...field}
                            id="medicalHistory"
                            rows="4"
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Describe any relevant past surgeries, hospitalizations, or significant medical conditions."
                            disabled={isFetchingDeclaration || submitting}
                        />
                    )}
                />
                {errors.medicalHistory && <p className="text-red-600 text-sm mt-1">{errors.medicalHistory.message}</p>}
              </div>

              {/* Emergency Contacts Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts</h3>
                <Controller
                  name="emergencyContacts"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-4">
                      {(field.value || []).map((contact, index) => (
                        <EmergencyContactItem
                          key={`contact-${index}`}
                          contact={contact}
                          index={index}
                          onChange={(idx, e) => handleNestedObjectArrayItemChange('emergencyContacts', idx, e)}
                          onRemove={() => removeArrayItem('emergencyContacts', index)}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('emergencyContacts', { name: '', relationship: '', phone: '', isEmergency: true })}
                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                        disabled={isFetchingDeclaration || submitting}
                      >
                        <i className="fas fa-plus mr-1"></i> Add Emergency Contact
                      </button>
                    </div>
                  )}
                />
                {errors.emergencyContacts && <p className="text-red-600 text-sm mt-1">{errors.emergencyContacts.message || "Please ensure all emergency contact fields are correctly filled (name, relationship, phone are required)."}</p>}
              </div>

              {/* Vision and Hearing Status Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <label htmlFor="visionStatus" className="block text-lg font-semibold text-gray-900">Vision Status</label>
                    <Controller
                        name="visionStatus"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="text"
                                id="visionStatus"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g., Wears glasses, 20/20"
                                disabled={isFetchingDeclaration || submitting}
                            />
                        )}
                    />
                    {errors.visionStatus && <p className="text-red-600 text-sm mt-1">{errors.visionStatus.message}</p>}
                </div>
                <div className="space-y-1">
                    <label htmlFor="hearingStatus" className="block text-lg font-semibold text-gray-900">Hearing Status</label>
                    <Controller
                        name="hearingStatus"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="text"
                                id="hearingStatus"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g., Normal, Uses hearing aids"
                                disabled={isFetchingDeclaration || submitting}
                            />
                        )}
                    />
                    {errors.hearingStatus && <p className="text-red-600 text-sm mt-1">{errors.hearingStatus.message}</p>}
                </div>
              </div>

              {/* Vaccinations Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Vaccinations</h3>
                <Controller
                  name="vaccinations"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-4">
                      {(field.value || []).map((vaccination, index) => (
                        <VaccinationItem
                          key={`vaccination-${index}`}
                          vaccination={vaccination}
                          index={index}
                          onChange={(idx, e) => handleNestedObjectArrayItemChange('vaccinations', idx, e)}
                          onRemove={() => removeArrayItem('vaccinations', index)}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('vaccinations', { vaccineName: '', vaccinationDate: '', notes: '' })}
                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                        disabled={isFetchingDeclaration || submitting}
                      >
                        <i className="fas fa-plus mr-1"></i> Add Vaccination
                      </button>
                    </div>
                  )}
                />
                {errors.vaccinations && <p className="text-red-600 text-sm mt-1">Please ensure all vaccination fields are correctly filled (vaccine name and date are required).</p>}
              </div>

              {/* Other Health Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Health Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    {/* Special Needs */}
                    <div className="space-y-1">
                        <label htmlFor="specialNeeds" className="block text-sm font-medium text-gray-700">Special Needs or Accommodations</label>
                        <Controller name="specialNeeds" control={control} render={({ field }) => ( <textarea {...field} id="specialNeeds" rows="3" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Describe any special needs..." disabled={isFetchingDeclaration || submitting}/> )}/>
                        {errors.specialNeeds && <p className="text-red-600 text-sm mt-1">{errors.specialNeeds.message}</p>}
                    </div>
                    {/* Physical Limitations */}
                    <div className="space-y-1">
                        <label htmlFor="physicalLimitations" className="block text-sm font-medium text-gray-700">Physical Limitations or Activity Restrictions</label>
                        <Controller name="physicalLimitations" control={control} render={({ field }) => ( <textarea {...field} id="physicalLimitations" rows="3" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Describe any physical limitations..." disabled={isFetchingDeclaration || submitting}/> )}/>
                        {errors.physicalLimitations && <p className="text-red-600 text-sm mt-1">{errors.physicalLimitations.message}</p>}
                    </div>
                    {/* Mental Health Concerns */}
                    <div className="space-y-1">
                        <label htmlFor="mentalHealthConcerns" className="block text-sm font-medium text-gray-700">Mental or Emotional Health Concerns</label>
                        <Controller name="mentalHealthConcerns" control={control} render={({ field }) => ( <textarea {...field} id="mentalHealthConcerns" rows="3" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Describe any mental health concerns..." disabled={isFetchingDeclaration || submitting}/> )}/>
                        {errors.mentalHealthConcerns && <p className="text-red-600 text-sm mt-1">{errors.mentalHealthConcerns.message}</p>}
                    </div>
                    {/* Dietary Restrictions */}
                    <div className="space-y-1">
                        <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700">Dietary Restrictions or Preferences</label>
                        <Controller name="dietaryRestrictions" control={control} render={({ field }) => ( <textarea {...field} id="dietaryRestrictions" rows="3" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., Vegetarian, Gluten-free..." disabled={isFetchingDeclaration || submitting}/> )}/>
                        {errors.dietaryRestrictions && <p className="text-red-600 text-sm mt-1">{errors.dietaryRestrictions.message}</p>}
                    </div>
                </div>
              </div>              {/* Submission Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || isFetchingDeclaration || !selectedStudentCode || initialLoading}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Declaration'}
                </button>
              </div>
            </form>
          ) : null} 
          {/* Fallback for when no child is selected and children have loaded, or initial child loading is still in progress and no child selected */}
          { !selectedStudentCode && !initialLoading && children.length > 0 &&
             <p className="p-6 text-gray-600 text-center">Please select a child to continue.</p>
          }
          { !selectedStudentCode && initialLoading &&
             <p className="p-6 text-gray-600 text-center">Loading children...</p> // This might briefly show if children array is empty during initial load
          }

        </div>
      </div>
    </div>
  );
};

export default HealthDeclaration;

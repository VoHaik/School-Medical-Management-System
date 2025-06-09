import React, { useState, useEffect, useContext } from 'react'; // Added useContext
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const schema = yup.object().shape({
  studentId: yup.string().required("Child selection is required"), // Added studentId
  allergies: yup.array().of(yup.string()),
  chronicIllnesses: yup.array().of(yup.string()),
  medications: yup.array().of(yup.object().shape({
    name: yup.string().required(),
    dosage: yup.string().required(),
    frequency: yup.string().required(),
    instructions: yup.string()
  })),
  medicalHistory: yup.string(),
  emergencyContacts: yup.array().of(yup.object().shape({
    name: yup.string().required(),
    relationship: yup.string().required(),
    phone: yup.string().required(),
    isEmergency: yup.boolean()
  })),
  visionStatus: yup.string(),
  hearingStatus: yup.string(),
  vaccinations: yup.array().of(yup.object().shape({
    vaccine: yup.string().required("Vaccine name is required"),
    dateAdministered: yup.date().required("Date administered is required").typeError("Invalid date"),
    nextDue: yup.date().nullable().typeError("Invalid date")
  })),
  specialNeeds: yup.string(),
  physicalLimitations: yup.string(),
  mentalHealthConcerns: yup.string(),
  dietaryRestrictions: yup.string()
});

const HealthDeclaration = () => {
  const { currentUser } = useContext(AuthContext); // Get currentUser
  const [children, setChildren] = useState([]); // State for parent's children
  const [selectedStudentId, setSelectedStudentId] = useState(''); // State for selected child
  // const [student, setStudent] = useState(null); // Keep if student details are shown separately
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({ // Added reset
    resolver: yupResolver(schema),
    defaultValues: {
      studentId: '', // Default for studentId
      allergies: [],
      chronicIllnesses: [],
      medications: [],
      emergencyContacts: [{ name: '', relationship: '', phone: '', isEmergency: true }],
      vaccinations: []
    }
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      if (currentUser && currentUser.id) {
        setLoading(true);
        try {
          // Fetch parent's children
          const token = localStorage.getItem('token');
          const childrenResponse = await axios.get(`/api/students/parent/${currentUser.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setChildren(childrenResponse.data || []);
          if (childrenResponse.data && childrenResponse.data.length > 0) {
            // Optionally pre-select the first child or wait for user selection
            // setSelectedStudentId(childrenResponse.data[0].student_id); // Assuming student_id is the identifier
            // setValue('studentId', childrenResponse.data[0].student_id);
          }
        } catch (error) {
          console.error('Error fetching children:', error);
        } finally {
          setLoading(false); // Move loading false here or after health declaration fetch
        }
      } else {
        setLoading(false); // No user, stop loading
      }
    };
    fetchInitialData();
  }, [currentUser]);

  // Effect to fetch health declaration when selectedStudentId changes
  useEffect(() => {
    if (selectedStudentId) {
      fetchHealthDeclaration(selectedStudentId);
    } else {
      // Reset form if no student is selected or student changes
      reset({ // Reset with default values, keeping studentId if needed or clearing it
        studentId: selectedStudentId,
        allergies: [],
        chronicIllnesses: [],
        medications: [],
        emergencyContacts: [{ name: '', relationship: '', phone: '', isEmergency: true }],
        vaccinations: [],
        visionStatus: '',
        hearingStatus: '',
        specialNeeds: '',
        physicalLimitations: '',
        mentalHealthConcerns: '',
        dietaryRestrictions: '',
        medicalHistory: ''
      });
    }
  }, [selectedStudentId, reset, setValue]);

  const fetchHealthDeclaration = async (studentIdToFetch) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/health-declaration?studentId=${studentIdToFetch}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // The backend now returns the DTO directly, or 404 if not found.
      // It does not wrap it in a `healthDeclaration` object.
      if (response.data) { // Check if data exists (i.e., not a 404)
        const declarationData = response.data;
        // Ensure studentId from fetched data doesn\'t override the selected one if they differ
        // This might not be necessary if the backend DTO for GET doesn\'t include studentId,
        // or if we trust it matches studentIdToFetch.
        // For safety, we can explicitly set the form\'s studentId to the one we fetched for.
        
        Object.keys(declarationData).forEach(key => {
          // Ensure `vaccinations` dates are correctly formatted for date inputs if necessary
          if (key === 'vaccinations' && declarationData[key]) {
            const formattedVaccinations = declarationData[key].map(v => ({
              ...v,
              dateAdministered: v.dateAdministered ? new Date(v.dateAdministered).toISOString().split('T')[0] : '',
              nextDue: v.nextDue ? new Date(v.nextDue).toISOString().split('T')[0] : null,
            }));
            setValue(key, formattedVaccinations);
          } else {
            setValue(key, declarationData[key]);
          }
        });
        // Explicitly set the studentId in the form to the one we fetched for,
        // as the DTO might not always contain it or it might be named differently.
        setValue('studentId', studentIdToFetch);

      } else {
        // This case might not be hit if backend returns 404, which goes to catch block.
        // If backend returns 200 with null/empty body for "not found", this is relevant.
        const currentStudentId = watch('studentId');
        reset({
            studentId: currentStudentId, // Keep selected studentId
            allergies: [], chronicIllnesses: [], medications: [],
            emergencyContacts: [{ name: '', relationship: '', phone: '', isEmergency: true }],
            vaccinations: [], visionStatus: '', hearingStatus: '',
            specialNeeds: '', physicalLimitations: '', mentalHealthConcerns: '',
            dietaryRestrictions: '', medicalHistory: ''
        });
      }
      // setStudent(response.data.student); // This might be part of the children list already
    } catch (error) {
      console.error('Error fetching health declaration:', error);
      // If it\'s a 404, it means no declaration exists, so reset the form for a new entry.
      // For other errors, you might want to inform the user.
      const currentStudentId = watch('studentId'); // or studentIdToFetch
      reset({
          studentId: currentStudentId, // Keep selected studentId
          allergies: [], chronicIllnesses: [], medications: [],
          emergencyContacts: [{ name: '', relationship: '', phone: '', isEmergency: true }],
          vaccinations: [], visionStatus: '', hearingStatus: '',
          specialNeeds: '', physicalLimitations: '', mentalHealthConcerns: '',
          dietaryRestrictions: '', medicalHistory: '',
          // Reset any other fields that might have been populated
          isDraft: false // Assuming a new form is not a draft
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData) => { // Renamed data to formData for clarity
    setSubmitting(true);
    const dataToSubmit = { ...formData, isDraft: false }; // Explicitly set isDraft for final submission
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/health-declaration', dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Health declaration submitted successfully!');
      // Optionally, re-fetch or clear form
    } catch (error) {
      console.error('Error submitting health declaration:', error);
      alert('Error submitting health declaration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const addArrayItem = (fieldName, defaultItem) => {
    const currentValues = watch(fieldName) || [];
    setValue(fieldName, [...currentValues, defaultItem]);
  };

  const removeArrayItem = (fieldName, index) => {
    const currentValues = watch(fieldName) || [];
    setValue(fieldName, currentValues.filter((_, i) => i !== index));
  };

  const handleSaveAsDraft = async () => { // Made async
    const formData = watch(); // Get all form data
    const dataToSubmit = { ...formData, isDraft: true }; // Set isDraft to true
    setSubmitting(true); // Use submitting state to indicate activity
    console.log("Attempting to save as Draft. Data:", dataToSubmit);
    try {
      const token = localStorage.getItem('token');
      // Ensure studentId is in dataToSubmit; it should be from the form
      if (!dataToSubmit.studentId) {
        alert("Please select a child before saving a draft.");
        setSubmitting(false);
        return;
      }
      await axios.post('/api/health-declaration', dataToSubmit, { // Same endpoint, backend handles isDraft
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Health declaration saved as draft successfully!');
    } catch (error) {
      console.error('Error saving health declaration as draft:', error);
      alert('Error saving draft. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) { // Simplified initial loading check
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Health Declaration</h1>
            {/* Child Selector */}
            <div className="mt-4">
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                Select Child
              </label>
              <Controller
                name="studentId"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="studentId"
                    className={`w-full p-2 border ${errors.studentId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setSelectedStudentId(e.target.value); // Update state for useEffect to trigger fetch
                    }}
                  >
                    <option value="">-- Select a child --</option>
                    {children.map(child => (
                      // Ensure child.student_id and child.fullName are correct properties from your API
                      <option key={child.student_id || child.id} value={child.student_id || child.id}> 
                        {child.fullName}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.studentId && <p className="text-red-600 text-sm mt-1">{errors.studentId.message}</p>}
            </div>
            {selectedStudentId && loading && <p className="text-gray-600 mt-2">Loading health data for selected child...</p>}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Allergies Section - No change needed here unless studentId impacts it directly */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Allergies</h3>
              <Controller
                name="allergies"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    {(field.value || []).map((allergy, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={allergy}
                          onChange={(e) => {
                            const newAllergies = [...(field.value || [])];
                            newAllergies[index] = e.target.value;
                            field.onChange(newAllergies);
                          }}
                          className="flex-1 p-2 border border-gray-300 rounded-md"
                          placeholder="Enter allergy"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('allergies', index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('allergies', '')}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <i className="fas fa-plus mr-1"></i> Add Allergy
                    </button>
                  </div>
                )}
              />
            </div>

            {/* Chronic Illnesses Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Chronic Illnesses</h3>
              <Controller
                name="chronicIllnesses"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    {(field.value || []).map((illness, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={illness}
                          onChange={(e) => {
                            const newIllnesses = [...(field.value || [])];
                            newIllnesses[index] = e.target.value;
                            field.onChange(newIllnesses);
                          }}
                          className="flex-1 p-2 border border-gray-300 rounded-md"
                          placeholder="Enter chronic illness"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('chronicIllnesses', index)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('chronicIllnesses', '')}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <i className="fas fa-plus mr-1"></i> Add Chronic Illness
                    </button>
                  </div>
                )}
              />
            </div>

            {/* Current Medications Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Current Medications</h3>
              <Controller
                name="medications"
                control={control}
                render={({ field }) => (
                  <div className="space-y-4">
                    {(field.value || []).map((medication, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-md space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={medication.name || ''}
                            onChange={(e) => {
                              const newMedications = [...(field.value || [])];
                              newMedications[index] = { ...medication, name: e.target.value };
                              field.onChange(newMedications);
                            }}
                            className="p-2 border border-gray-300 rounded-md"
                            placeholder="Medication name"
                          />
                          <input
                            type="text"
                            value={medication.dosage || ''}
                            onChange={(e) => {
                              const newMedications = [...(field.value || [])];
                              newMedications[index] = { ...medication, dosage: e.target.value };
                              field.onChange(newMedications);
                            }}
                            className="p-2 border border-gray-300 rounded-md"
                            placeholder="Dosage"
                          />
                          <input
                            type="text"
                            value={medication.frequency || ''}
                            onChange={(e) => {
                              const newMedications = [...(field.value || [])];
                              newMedications[index] = { ...medication, frequency: e.target.value };
                              field.onChange(newMedications);
                            }}
                            className="p-2 border border-gray-300 rounded-md"
                            placeholder="Frequency (e.g., twice daily)"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem('medications', index)}
                            className="p-2 text-red-600 hover:text-red-800 self-start"
                          >
                            <i className="fas fa-trash"></i> Remove
                          </button>
                        </div>
                        <textarea
                          value={medication.instructions || ''}
                          onChange={(e) => {
                            const newMedications = [...(field.value || [])];
                            newMedications[index] = { ...medication, instructions: e.target.value };
                            field.onChange(newMedications);
                          }}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Special instructions"
                          rows="2"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('medications', { name: '', dosage: '', frequency: '', instructions: '' })}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <i className="fas fa-plus mr-1"></i> Add Medication
                    </button>
                  </div>
                )}
              />
            </div>

            {/* Vision and Hearing Status - No change needed here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vision Status</label>
                <Controller
                  name="visionStatus"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="">Select vision status</option>
                      <option value="normal">Normal</option>
                      <option value="corrected">Corrected (glasses/contacts)</option>
                      <option value="impaired">Impaired</option>
                      <option value="blind">Blind</option>
                    </select>
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hearing Status</label>
                <Controller
                  name="hearingStatus"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="">Select hearing status</option>
                      <option value="normal">Normal</option>
                      <option value="corrected">Corrected (hearing aid)</option>
                      <option value="impaired">Impaired</option>
                      <option value="deaf">Deaf</option>
                    </select>
                  )}
                />
              </div>
            </div>

            {/* Emergency Contacts - No change needed here */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts</h3>
              <Controller
                name="emergencyContacts"
                control={control}
                render={({ field }) => (
                  <div className="space-y-4">
                    {(field.value || []).map((contact, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            value={contact.name || ''}
                            onChange={(e) => {
                              const newContacts = [...(field.value || [])];
                              newContacts[index] = { ...contact, name: e.target.value };
                              field.onChange(newContacts);
                            }}
                            className="p-2 border border-gray-300 rounded-md"
                            placeholder="Contact name"
                          />
                          <input
                            type="text"
                            value={contact.relationship || ''}
                            onChange={(e) => {
                              const newContacts = [...(field.value || [])];
                              newContacts[index] = { ...contact, relationship: e.target.value };
                              field.onChange(newContacts);
                            }}
                            className="p-2 border border-gray-300 rounded-md"
                            placeholder="Relationship"
                          />
                          <input
                            type="tel"
                            value={contact.phone || ''}
                            onChange={(e) => {
                              const newContacts = [...(field.value || [])];
                              newContacts[index] = { ...contact, phone: e.target.value };
                              field.onChange(newContacts);
                            }}
                            className="p-2 border border-gray-300 rounded-md"
                            placeholder="Phone number"
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={contact.isEmergency || false}
                              onChange={(e) => {
                                const newContacts = [...(field.value || [])];
                                newContacts[index] = { ...contact, isEmergency: e.target.checked };
                                field.onChange(newContacts);
                              }}
                              className="mr-2"
                            />
                            Primary emergency contact
                          </label>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeArrayItem('emergencyContacts', index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <i className="fas fa-trash"></i> Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('emergencyContacts', { name: '', relationship: '', phone: '', isEmergency: false })}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <i className="fas fa-plus mr-1"></i> Add Emergency Contact
                    </button>
                  </div>
                )}
              />
            </div>

            {/* Vaccinations Section - ADDED */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Vaccinations</h3>
              <Controller
                name="vaccinations"
                control={control}
                render={({ field }) => (
                  <div className="space-y-4">
                    {(field.value || []).map((vaccination, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-md space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                          <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vaccine Name*</label>
                            <input
                              type="text"
                              value={vaccination.vaccine || ''}
                              onChange={(e) => {
                                const newVaccinations = [...(field.value || [])];
                                newVaccinations[index] = { ...vaccination, vaccine: e.target.value };
                                field.onChange(newVaccinations);
                              }}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="e.g., MMR, DTaP"
                            />
                            {errors.vaccinations?.[index]?.vaccine && <p className="text-red-500 text-xs mt-1">{errors.vaccinations[index].vaccine.message}</p>}
                          </div>
                          <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Administered*</label>
                            <input
                              type="date"
                              value={vaccination.dateAdministered ? new Date(vaccination.dateAdministered).toISOString().split('T')[0] : ''}
                              onChange={(e) => {
                                const newVaccinations = [...(field.value || [])];
                                newVaccinations[index] = { ...vaccination, dateAdministered: e.target.value ? new Date(e.target.value) : null };
                                field.onChange(newVaccinations);
                              }}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.vaccinations?.[index]?.dateAdministered && <p className="text-red-500 text-xs mt-1">{errors.vaccinations[index].dateAdministered.message}</p>}
                          </div>
                          <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Next Due Date</label>
                            <input
                              type="date"
                              value={vaccination.nextDue ? new Date(vaccination.nextDue).toISOString().split('T')[0] : ''}
                              onChange={(e) => {
                                const newVaccinations = [...(field.value || [])];
                                newVaccinations[index] = { ...vaccination, nextDue: e.target.value ? new Date(e.target.value) : null };
                                field.onChange(newVaccinations);
                              }}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                             {errors.vaccinations?.[index]?.nextDue && <p className="text-red-500 text-xs mt-1">{errors.vaccinations[index].nextDue.message}</p>}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('vaccinations', index)}
                          className="p-2 text-red-600 hover:text-red-800 self-start mt-2"
                        >
                          <i className="fas fa-trash"></i> Remove Vaccination
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('vaccinations', { vaccine: '', dateAdministered: null, nextDue: null })}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <i className="fas fa-plus mr-1"></i> Add Vaccination Record
                    </button>
                  </div>
                )}
              />
            </div>

            {/* Additional Information - No change needed here */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Needs</label>
                <Controller
                  name="specialNeeds"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows="3"
                      placeholder="Describe any special needs..."
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Physical Limitations</label>
                <Controller
                  name="physicalLimitations"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows="3"
                      placeholder="Describe any physical limitations..."
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions</label>
                <Controller
                  name="dietaryRestrictions"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows="3"
                      placeholder="Describe any dietary restrictions..."
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                <Controller
                  name="medicalHistory"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows="4"
                      placeholder="Provide relevant medical history..."
                    />
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSaveAsDraft} // Added onClick handler
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Declaration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HealthDeclaration;

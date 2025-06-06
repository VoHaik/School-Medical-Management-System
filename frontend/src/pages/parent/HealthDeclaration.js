import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const schema = yup.object().shape({
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
    vaccine: yup.string().required(),
    dateAdministered: yup.date().required(),
    nextDue: yup.date()
  })),
  specialNeeds: yup.string(),
  physicalLimitations: yup.string(),
  mentalHealthConcerns: yup.string(),
  dietaryRestrictions: yup.string()
});

const HealthDeclaration = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      allergies: [],
      chronicIllnesses: [],
      medications: [],
      emergencyContacts: [{ name: '', relationship: '', phone: '', isEmergency: true }],
      vaccinations: []
    }
  });

  useEffect(() => {
    fetchHealthDeclaration();
  }, []);

  const fetchHealthDeclaration = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/health-declaration', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.healthDeclaration) {
        const data = response.data.healthDeclaration;
        Object.keys(data).forEach(key => {
          setValue(key, data[key]);
        });
      }
      setStudent(response.data.student);
    } catch (error) {
      console.error('Error fetching health declaration:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/health-declaration', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Health declaration submitted successfully!');
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

  if (loading) {
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
            {student && (
              <p className="text-gray-600 mt-1">
                Student: {student.fullName} - Class: {student.className}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Allergies Section */}
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

            {/* Vision and Hearing Status */}
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

            {/* Emergency Contacts */}
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

            {/* Additional Information */}
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

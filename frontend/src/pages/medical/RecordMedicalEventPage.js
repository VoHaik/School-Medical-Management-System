import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const RecordMedicalEventPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedStudent = searchParams.get('student');

  const [formData, setFormData] = useState({
    studentId: preSelectedStudent || '',
    studentName: '',
    eventDate: new Date().toISOString().slice(0, 16), // Current datetime
    location: '',
    eventType: '',
    description: '',
    symptoms: '',
    actionsTaken: '',
    medicationsUsed: [],
    suppliesUsed: [],
    outcome: '',
    followUpRequired: false,
    followUpNotes: '',
    parentNotified: false,
    parentNotificationTime: '',
    emergencyServices: false,
    witnessName: '',
    nurseNotes: ''
  });

  const [studentSearch, setStudentSearch] = useState('');
  const [studentSuggestions, setStudentSuggestions] = useState([]);
  const [showStudentSuggestions, setShowStudentSuggestions] = useState(false);
  const [availableItems, setAvailableItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for students and supplies
  const mockStudents = [
    { id: 'STU001', name: 'Emma Johnson', class: '5A', grade: 5 },
    { id: 'STU002', name: 'Michael Chen', class: '6B', grade: 6 },
    { id: 'STU003', name: 'Sophia Rodriguez', class: '4C', grade: 4 },
    { id: 'STU004', name: 'Daniel Kim', class: '5B', grade: 5 },
    { id: 'STU005', name: 'Olivia Thompson', class: '3A', grade: 3 }
  ];

  const mockSupplies = [
    { id: 1, name: 'Band-Aids', type: 'Supply', quantity: 100 },
    { id: 2, name: 'Ibuprofen 200mg', type: 'Medication', quantity: 50 },
    { id: 3, name: 'Ice Pack', type: 'Supply', quantity: 10 },
    { id: 4, name: 'Antiseptic Wipes', type: 'Supply', quantity: 75 },
    { id: 5, name: 'Acetaminophen', type: 'Medication', quantity: 30 }
  ];

  useEffect(() => {
    // Set current date and time
    const now = new Date();
    const localDateTime = now.toISOString().slice(0, 16);
    setFormData(prev => ({ ...prev, eventDate: localDateTime }));
    
    // Set available supplies
    setAvailableItems(mockSupplies);

    // If student is pre-selected, populate the student info
    if (preSelectedStudent) {
      const student = mockStudents.find(s => s.id === preSelectedStudent);
      if (student) {
        setFormData(prev => ({
          ...prev,
          studentId: student.id,
          studentName: student.name
        }));
        setStudentSearch(student.name);
      }
    }
  }, [preSelectedStudent]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleStudentSearch = (value) => {
    setStudentSearch(value);
    if (value.length > 0) {
      const filtered = mockStudents.filter(student =>
        student.name.toLowerCase().includes(value.toLowerCase()) ||
        student.id.toLowerCase().includes(value.toLowerCase())
      );
      setStudentSuggestions(filtered);
      setShowStudentSuggestions(true);
    } else {
      setShowStudentSuggestions(false);
    }
  };

  const selectStudent = (student) => {
    setFormData(prev => ({
      ...prev,
      studentId: student.id,
      studentName: student.name
    }));
    setStudentSearch(student.name);
    setShowStudentSuggestions(false);
  };

  const addMedicationOrSupply = (type) => {
    const newItem = { itemId: '', name: '', quantity: '', unit: '', notes: '' };
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], newItem]
    }));
  };

  const updateMedicationOrSupply = (type, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeMedicationOrSupply = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.studentId) newErrors.studentId = 'Student selection is required';
    if (!formData.eventType) newErrors.eventType = 'Event type is required';
    if (formData.eventType === 'Other' && !formData.customEventType) {
      newErrors.customEventType = 'Custom event type is required';
    }
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.actionsTaken) newErrors.actionsTaken = 'Actions taken is required';
    if (!formData.outcome) newErrors.outcome = 'Outcome is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      console.log('Submitting medical event:', formData);
      
      // Mock successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Medical event recorded successfully!');
      navigate('/medical/event-log');
    } catch (error) {
      console.error('Error submitting medical event:', error);
      alert('Error recording medical event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventTypes = [
    'Injury - Fall',
    'Injury - Cut/Laceration',
    'Injury - Bruise/Contusion',
    'Injury - Sprain/Strain',
    'Illness - Fever',
    'Illness - Nausea/Vomiting',
    'Illness - Headache',
    'Illness - Stomach Ache',
    'Allergic Reaction',
    'Asthma Episode',
    'Medication Administration',
    'First Aid Treatment',
    'Other'
  ];

  const locations = [
    'Classroom',
    'Playground',
    'Gymnasium',
    'Cafeteria',
    'Hallway',
    'Bathroom',
    'Library',
    'Nurse Office',
    'School Bus',
    'Other'
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Record New Medical Event</h1>
        <p className="text-gray-600">Document medical incidents, treatments, and outcomes for student health records</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded">
        {/* Student Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Student *</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by student name or ID..." 
              className={`w-full p-3 border rounded ${errors.studentId ? 'border-red-500' : 'border-gray-300'}`}
              value={studentSearch}
              onChange={(e) => handleStudentSearch(e.target.value)}
              onFocus={() => studentSearch && setShowStudentSuggestions(true)}
            />
            {showStudentSuggestions && studentSuggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-b max-h-40 overflow-y-auto">
                {studentSuggestions.map(student => (
                  <div
                    key={student.id}
                    onClick={() => selectStudent(student)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-gray-500">ID: {student.id} • Class: {student.class}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.studentId && <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>}
          {formData.studentName && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
              <span className="text-green-800">Selected: {formData.studentName} (ID: {formData.studentId})</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Event Details</h3>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">Event Type *</label>
              <select 
                className={`w-full p-2 border rounded ${errors.eventType ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.eventType}
                onChange={(e) => handleInputChange('eventType', e.target.value)}
              >
                <option value="">Select event type...</option>
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.eventType && <p className="text-red-500 text-sm mt-1">{errors.eventType}</p>}
            </div>

            {formData.eventType === 'Other' && (
              <div>
                <label className="block text-gray-700 font-medium mb-1">Custom Event Type *</label>
                <input 
                  type="text" 
                  className={`w-full p-2 border rounded ${errors.customEventType ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.customEventType}
                  onChange={(e) => handleInputChange('customEventType', e.target.value)}
                  placeholder="Describe the event type..."
                />
                {errors.customEventType && <p className="text-red-500 text-sm mt-1">{errors.customEventType}</p>}
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-1">Severity</label>
              <select 
                className="w-full p-2 border rounded"
                value={formData.severity}
                onChange={(e) => handleInputChange('severity', e.target.value)}
              >
                <option value="Minor">Minor</option>
                <option value="Moderate">Moderate</option>
                <option value="Serious">Serious</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Location</label>
              <select 
                className="w-full p-2 border rounded"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              >
                <option value="">Select location...</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Date & Time</label>
              <input 
                type="datetime-local" 
                className="w-full p-2 border rounded"
                value={formData.eventDate}
                onChange={(e) => handleInputChange('eventDate', e.target.value)}
              />
            </div>
          </div>

          {/* Medical Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Medical Information</h3>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">Description *</label>
              <textarea 
                className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                rows="3"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what happened..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Symptoms</label>
              <textarea 
                className="w-full p-2 border rounded"
                rows="2"
                value={formData.symptoms}
                onChange={(e) => handleInputChange('symptoms', e.target.value)}
                placeholder="List observed symptoms..."
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Actions Taken *</label>
              <textarea 
                className={`w-full p-2 border rounded ${errors.actionsTaken ? 'border-red-500' : 'border-gray-300'}`}
                rows="3"
                value={formData.actionsTaken}
                onChange={(e) => handleInputChange('actionsTaken', e.target.value)}
                placeholder="Describe treatment provided..."
              />
              {errors.actionsTaken && <p className="text-red-500 text-sm mt-1">{errors.actionsTaken}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Outcome *</label>
              <input 
                type="text" 
                className={`w-full p-2 border rounded ${errors.outcome ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.outcome}
                onChange={(e) => handleInputChange('outcome', e.target.value)}
                placeholder="e.g., Returned to class, Sent home, Referred to hospital..."
              />
              {errors.outcome && <p className="text-red-500 text-sm mt-1">{errors.outcome}</p>}
            </div>
          </div>
        </div>

        {/* Follow-up and Notifications */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Follow-up</h3>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData.followUpRequired}
                  onChange={(e) => handleInputChange('followUpRequired', e.target.checked)}
                  className="mr-2"
                />
                <span className="font-medium">Follow-up required</span>
              </label>
            </div>

            {formData.followUpRequired && (
              <div>
                <label className="block text-gray-700 font-medium mb-1">Follow-up Instructions</label>
                <textarea 
                  className="w-full p-2 border rounded"
                  rows="3"
                  value={formData.followUpNotes}
                  onChange={(e) => handleInputChange('followUpNotes', e.target.value)}
                  placeholder="Describe required follow-up care..."
                />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Parent Notification</h3>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={formData.parentNotified}
                  onChange={(e) => handleInputChange('parentNotified', e.target.checked)}
                  className="mr-2"
                />
                <span className="font-medium">Parent/Guardian notified</span>
              </label>
            </div>

            {formData.parentNotified && (
              <div>
                <label className="block text-gray-700 font-medium mb-1">Notification Method</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={formData.parentNotificationTime}
                  onChange={(e) => handleInputChange('parentNotificationTime', e.target.value)}
                >
                  <option value="">Select method...</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Email">Email</option>
                  <option value="Text Message">Text Message</option>
                  <option value="In Person">In Person</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-1">Additional Nurse Notes</label>
          <textarea 
            className="w-full p-2 border rounded"
            rows="3"
            value={formData.nurseNotes}
            onChange={(e) => handleInputChange('nurseNotes', e.target.value)}
            placeholder="Any additional observations or notes..."
          />
        </div>

        {/* Submit Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={() => navigate('/medical/dashboard')}
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Recording...' : 'Record Medical Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecordMedicalEventPage;

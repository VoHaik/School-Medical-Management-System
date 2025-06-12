import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PeriodicCheckupsListPage = () => {
  const [checkupCycles, setCheckupCycles] = useState([
    {
      id: 1,
      name: 'Annual Health Checkup 2025',
      type: 'Annual Physical Examination',
      targetGrades: [9, 10, 11, 12],
      status: 'In Progress',
      startDate: '2025-05-01',
      endDate: '2025-07-31',
      totalStudents: 450,
      consentsReceived: 380,
      consentsApproved: 340,
      consentsDeclined: 40,
      checkupsCompleted: 180,
      abnormalFindings: 25,
      createdDate: '2025-04-15'
    },
    {
      id: 2,
      name: 'Vision & Hearing Screening - Grade 10',
      type: 'Vision and Hearing Test',
      targetGrades: [10],
      status: 'Consent Collection',
      startDate: '2025-08-01',
      endDate: '2025-09-15',
      totalStudents: 120,
      consentsReceived: 85,
      consentsApproved: 75,
      consentsDeclined: 10,
      checkupsCompleted: 0,
      abnormalFindings: 0,
      createdDate: '2025-07-15'
    },
    {
      id: 3,
      name: 'BMI Assessment - All Grades',
      type: 'Height, Weight & BMI',
      targetGrades: [9, 10, 11, 12],
      status: 'Completed',
      startDate: '2025-03-01',
      endDate: '2025-04-30',
      totalStudents: 450,
      consentsReceived: 450,
      consentsApproved: 425,
      consentsDeclined: 25,
      checkupsCompleted: 425,
      abnormalFindings: 45,
      createdDate: '2025-02-15'
    }
  ]);

  const [showNewCycleForm, setShowNewCycleForm] = useState(false);
  const [newCycle, setNewCycle] = useState({
    name: '',
    type: '',
    targetGrades: [],
    startDate: '',
    endDate: '',
    description: '',
    checkupComponents: []
  });

  const checkupTypes = [
    'Annual Physical Examination',
    'Vision and Hearing Test',
    'Height, Weight & BMI',
    'Dental Examination',
    'Immunization Status Check',
    'Mental Health Screening',
    'Sports Physical',
    'Custom Checkup'
  ];

  const checkupComponents = [
    'Height & Weight Measurement',
    'Vision Test (Snellen Chart)',
    'Hearing Test',
    'Blood Pressure',
    'Heart Rate & Pulse',
    'Dental Examination',
    'Skin Examination',
    'Posture Assessment',
    'Mental Health Questionnaire',
    'Immunization Record Review'
  ];

  const statusColors = {
    'Planning': 'bg-gray-100 text-gray-800',
    'Consent Collection': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };

  const handleNewCycleSubmit = (e) => {
    e.preventDefault();
    const cycle = {
      ...newCycle,
      id: Date.now(),
      status: 'Planning',
      totalStudents: 0,
      consentsReceived: 0,
      consentsApproved: 0,
      consentsDeclined: 0,
      checkupsCompleted: 0,
      abnormalFindings: 0,
      createdDate: new Date().toISOString().slice(0, 10)
    };
    setCheckupCycles(prev => [cycle, ...prev]);
    setNewCycle({
      name: '',
      type: '',
      targetGrades: [],
      startDate: '',
      endDate: '',
      description: '',
      checkupComponents: []
    });
    setShowNewCycleForm(false);
    alert('New checkup cycle created successfully!');
  };

  const handleGradeSelection = (grade) => {
    setNewCycle(prev => ({
      ...prev,
      targetGrades: prev.targetGrades.includes(grade) 
        ? prev.targetGrades.filter(g => g !== grade)
        : [...prev.targetGrades, grade]
    }));
  };

  const handleComponentSelection = (component) => {
    setNewCycle(prev => ({
      ...prev,
      checkupComponents: prev.checkupComponents.includes(component) 
        ? prev.checkupComponents.filter(c => c !== component)
        : [...prev.checkupComponents, component]
    }));
  };

  const getProgressPercentage = (completed, total) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const sendConsentForms = (cycleId) => {
    alert(`Consent forms sent for checkup cycle ID: ${cycleId}`);
  };

  const CheckupCycleCard = ({ cycle }) => (
    <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{cycle.name}</h3>
          <p className="text-gray-600">{cycle.type}</p>
          <p className="text-sm text-gray-500">
            Target Grades: {cycle.targetGrades.join(', ')} | 
            Period: {cycle.startDate} to {cycle.endDate}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[cycle.status]}`}>
          {cycle.status}
        </span>
      </div>

      {/* Progress Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{cycle.totalStudents}</p>
          <p className="text-xs text-gray-500">Total Students</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">{cycle.consentsReceived}</p>
          <p className="text-xs text-gray-500">Consents Received</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{cycle.consentsApproved}</p>
          <p className="text-xs text-gray-500">Approved</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{cycle.checkupsCompleted}</p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{cycle.abnormalFindings}</p>
          <p className="text-xs text-gray-500">Abnormal Findings</p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-2 mb-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Consent Collection</span>
            <span>{getProgressPercentage(cycle.consentsReceived, cycle.totalStudents)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{width: `${getProgressPercentage(cycle.consentsReceived, cycle.totalStudents)}%`}}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Checkup Progress</span>
            <span>{getProgressPercentage(cycle.checkupsCompleted, cycle.consentsApproved)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{width: `${getProgressPercentage(cycle.checkupsCompleted, cycle.consentsApproved)}%`}}
            ></div>
          </div>
        </div>
      </div>

      {/* Alert for Abnormal Findings */}
      {cycle.abnormalFindings > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-3 mb-4">
          <div className="flex">
            <span className="text-orange-400 mr-2">⚠️</span>
            <p className="text-orange-700 text-sm">
              {cycle.abnormalFindings} students require follow-up consultations
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Link 
          to={`/medical/periodic-checkups/${cycle.id}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          View Details
        </Link>
        {cycle.status === 'Planning' && (
          <button 
            onClick={() => sendConsentForms(cycle.id)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Send Consent Forms
          </button>
        )}
        {cycle.status === 'Consent Collection' && (
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">
            Start Checkups
          </button>
        )}
        {cycle.status === 'In Progress' && (
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm">
            Record Results
          </button>
        )}
        {cycle.abnormalFindings > 0 && (
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm">
            Schedule Consultations
          </button>
        )}
      </div>
    </div>
  );

  const NewCycleForm = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleNewCycleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">New Health Checkup Cycle</h2>
            <button
              type="button"
              onClick={() => setShowNewCycleForm(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Cycle Name *</label>
                <input
                  type="text"
                  value={newCycle.name}
                  onChange={(e) => setNewCycle(prev => ({...prev, name: e.target.value}))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Annual Health Checkup 2025"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Checkup Type *</label>
                <select
                  value={newCycle.type}
                  onChange={(e) => setNewCycle(prev => ({...prev, type: e.target.value}))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Type</option>
                  {checkupTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Target Grades *</label>
              <div className="grid grid-cols-4 gap-2">
                {[9, 10, 11, 12].map(grade => (
                  <label key={grade} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newCycle.targetGrades.includes(grade)}
                      onChange={() => handleGradeSelection(grade)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">Grade {grade}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Start Date *</label>
                <input
                  type="date"
                  value={newCycle.startDate}
                  onChange={(e) => setNewCycle(prev => ({...prev, startDate: e.target.value}))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">End Date *</label>
                <input
                  type="date"
                  value={newCycle.endDate}
                  onChange={(e) => setNewCycle(prev => ({...prev, endDate: e.target.value}))}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Checkup Components</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {checkupComponents.map(component => (
                  <label key={component} className="flex items-start">
                    <input
                      type="checkbox"
                      checked={newCycle.checkupComponents.includes(component)}
                      onChange={() => handleComponentSelection(component)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <span className="ml-2 text-gray-700 text-sm">{component}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                value={newCycle.description}
                onChange={(e) => setNewCycle(prev => ({...prev, description: e.target.value}))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Additional information about the checkup cycle..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setShowNewCycleForm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Create Cycle
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Periodic Health Checkups</h1>
        <button
          onClick={() => setShowNewCycleForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center"
        >
          <span className="mr-2">+</span> New Checkup Cycle
        </button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <p className="text-blue-600 font-semibold">Total Cycles</p>
          <p className="text-2xl font-bold text-blue-800">{checkupCycles.length}</p>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-yellow-600 font-semibold">In Progress</p>
          <p className="text-2xl font-bold text-yellow-800">
            {checkupCycles.filter(c => c.status === 'In Progress').length}
          </p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <p className="text-green-600 font-semibold">Completed</p>
          <p className="text-2xl font-bold text-green-800">
            {checkupCycles.filter(c => c.status === 'Completed').length}
          </p>
        </div>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-red-600 font-semibold">Follow-ups Needed</p>
          <p className="text-2xl font-bold text-red-800">
            {checkupCycles.reduce((total, c) => total + c.abnormalFindings, 0)}
          </p>
        </div>
      </div>

      {/* Cycles List */}
      <div className="space-y-6">
        {checkupCycles.length > 0 ? (
          checkupCycles.map(cycle => (
            <CheckupCycleCard key={cycle.id} cycle={cycle} />
          ))
        ) : (
          <div className="bg-white border rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg">No health checkup cycles found.</p>
            <p className="text-gray-400 text-sm mt-2">Create your first checkup cycle to get started.</p>
          </div>
        )}
      </div>

      {showNewCycleForm && <NewCycleForm />}
    </div>
  );
};

export default PeriodicCheckupsListPage;

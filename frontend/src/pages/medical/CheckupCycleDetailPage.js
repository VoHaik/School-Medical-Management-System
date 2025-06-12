import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CheckupCycleDetailPage = () => {
  const { cycleId } = useParams();
  const navigate = useNavigate();
  
  const [cycle, setCycle] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [studentList, setStudentList] = useState([]);
  const [consentStats, setConsentStats] = useState({});
  const [checkupResults, setCheckupResults] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with API calls
  useEffect(() => {
    const mockCycle = {
      id: cycleId,
      name: 'Annual Health Checkup 2025',
      status: 'In Progress',
      description: 'Comprehensive annual health screening for all students',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      targetGrades: ['1', '2', '3', '4', '5', '6'],
      components: [
        'Height & Weight Measurement',
        'Vision Screening',
        'Hearing Test',
        'Dental Examination',
        'General Physical Examination',
        'Blood Pressure Check'
      ],
      totalStudents: 450,
      completedCheckups: 180,
      pendingConsents: 95,
      abnormalFindings: 12
    };

    const mockStudents = [
      { id: 1, name: 'John Smith', grade: '5A', consentStatus: 'received', checkupStatus: 'completed', lastCheckup: '2025-01-15', abnormalFindings: false },
      { id: 2, name: 'Emma Johnson', grade: '4B', consentStatus: 'received', checkupStatus: 'scheduled', lastCheckup: null, abnormalFindings: false },
      { id: 3, name: 'Michael Brown', grade: '6A', consentStatus: 'pending', checkupStatus: 'pending', lastCheckup: null, abnormalFindings: false },
      { id: 4, name: 'Sophia Davis', grade: '3C', consentStatus: 'received', checkupStatus: 'completed', lastCheckup: '2025-01-18', abnormalFindings: true },
      { id: 5, name: 'James Wilson', grade: '5B', consentStatus: 'declined', checkupStatus: 'not_applicable', lastCheckup: null, abnormalFindings: false }
    ];

    const mockResults = [
      { id: 1, studentName: 'John Smith', grade: '5A', checkupDate: '2025-01-15', height: '142cm', weight: '38kg', vision: 'Normal', hearing: 'Normal', findings: 'All normal' },
      { id: 4, studentName: 'Sophia Davis', grade: '3C', checkupDate: '2025-01-18', height: '125cm', weight: '28kg', vision: 'Requires glasses', hearing: 'Normal', findings: 'Vision correction needed' }
    ];

    setCycle(mockCycle);
    setStudentList(mockStudents);
    setCheckupResults(mockResults);
    setConsentStats({
      received: 250,
      pending: 95,
      declined: 15,
      total: 360
    });
  }, [cycleId]);

  const getStatusColor = (status) => {
    const colors = {
      'Planning': 'bg-gray-100 text-gray-800',
      'Consent Collection': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getConsentStatusColor = (status) => {
    const colors = {
      'received': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'declined': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCheckupStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'not_applicable': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredStudents = studentList.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.grade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.checkupStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSendNotifications = () => {
    setShowNotificationModal(true);
  };

  const handleRecordResult = (student) => {
    setSelectedStudent(student);
    setShowResultModal(true);
  };

  const handleUpdateStatus = (newStatus) => {
    setCycle(prev => ({ ...prev, status: newStatus }));
  };

  if (!cycle) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={() => navigate('/nurse/checkups')}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
          >
            ← Back to Checkup Cycles
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{cycle.name}</h1>
          <p className="text-gray-600 mt-1">{cycle.description}</p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cycle.status)}`}>
            {cycle.status}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{cycle.totalStudents}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{cycle.completedCheckups}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-600">Pending Consents</p>
              <p className="text-2xl font-bold text-gray-900">{cycle.pendingConsents}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-600">Abnormal Findings</p>
              <p className="text-2xl font-bold text-gray-900">{cycle.abnormalFindings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'students', name: 'Student Management' },
            { id: 'results', name: 'Checkup Results' },
            { id: 'actions', name: 'Actions' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Cycle Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium">{new Date(cycle.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End Date:</span>
                <span className="font-medium">{new Date(cycle.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Target Grades:</span>
                <span className="font-medium">{cycle.targetGrades.join(', ')}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Consent Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Received:</span>
                <span className="font-medium text-green-600">{consentStats.received}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending:</span>
                <span className="font-medium text-yellow-600">{consentStats.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Declined:</span>
                <span className="font-medium text-red-600">{consentStats.declined}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total:</span>
                  <span className="font-bold">{consentStats.total}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Checkup Components</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {cycle.components.map((component, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm">{component}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold">Student Management</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="pending">Pending</option>
                  <option value="not_applicable">Not Applicable</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consent Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Checkup Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Checkup</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className={student.abnormalFindings ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          {student.abnormalFindings && (
                            <div className="text-xs text-red-600">⚠ Abnormal findings</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.grade}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConsentStatusColor(student.consentStatus)}`}>
                        {student.consentStatus.charAt(0).toUpperCase() + student.consentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCheckupStatusColor(student.checkupStatus)}`}>
                        {student.checkupStatus.replace('_', ' ').charAt(0).toUpperCase() + student.checkupStatus.replace('_', ' ').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.lastCheckup ? new Date(student.lastCheckup).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleRecordResult(student)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Record Result
                      </button>
                      <button
                        onClick={() => navigate(`/nurse/students/${student.id}/health-profile`)}
                        className="text-green-600 hover:text-green-900"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Checkup Results</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Height</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vision</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Findings</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {checkupResults.map((result) => (
                  <tr key={result.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.grade}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(result.checkupDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.height}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.weight}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.vision}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.findings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Workflow Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={handleSendNotifications}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 text-left"
              >
                📧 Send Notifications to Parents
              </button>
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 text-left">
                📋 Prepare Student List for Examination
              </button>
              <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 text-left">
                📝 Bulk Record Results
              </button>
              <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 text-left">
                📤 Send Results to Parents
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Status Management</h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleUpdateStatus('Consent Collection')}
                className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 text-left"
              >
                📋 Start Consent Collection
              </button>
              <button 
                onClick={() => handleUpdateStatus('In Progress')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 text-left"
              >
                🏃 Mark In Progress
              </button>
              <button 
                onClick={() => handleUpdateStatus('Completed')}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 text-left"
              >
                ✅ Mark Completed
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Schedule Consultations</h3>
            <p className="text-gray-600 mb-4">Students with abnormal findings requiring follow-up consultations:</p>
            <div className="space-y-2">
              {studentList.filter(s => s.abnormalFindings).map(student => (
                <div key={student.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">{student.name} - {student.grade}</span>
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    Schedule Consultation
                  </button>
                </div>
              ))}
              {studentList.filter(s => s.abnormalFindings).length === 0 && (
                <p className="text-gray-500">No students currently require follow-up consultations.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Send Notifications</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Type</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>Consent Form Required</option>
                  <option>Checkup Scheduled</option>
                  <option>Results Available</option>
                  <option>Follow-up Required</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>All Parents</option>
                  <option>Parents with Pending Consents</option>
                  <option>Parents of Completed Checkups</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded-md h-24"
                  placeholder="Enter notification message..."
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowNotificationModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Handle send notification
                  setShowNotificationModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Send Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Recording Modal */}
      {showResultModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Record Checkup Results - {selectedStudent.name}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <input type="number" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input type="number" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vision Test</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>Normal</option>
                  <option>Requires glasses</option>
                  <option>Follow-up needed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hearing Test</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>Normal</option>
                  <option>Hearing aid needed</option>
                  <option>Follow-up needed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure</label>
                <input type="text" placeholder="120/80" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                <input type="number" step="0.1" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">General Findings</label>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded-md h-24"
                  placeholder="Enter any notable findings or observations..."
                ></textarea>
              </div>
              <div className="col-span-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Requires follow-up consultation</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowResultModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Handle save result
                  setShowResultModal(false);
                  setSelectedStudent(null);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckupCycleDetailPage;

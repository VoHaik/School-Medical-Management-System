import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VaccinationCampaignDetailPage = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  
  const [campaign, setCampaign] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [studentList, setStudentList] = useState([]);
  const [consentStats, setConsentStats] = useState({});
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showVaccinationModal, setShowVaccinationModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [inventoryItems, setInventoryItems] = useState([]);

  // Mock data - replace with API calls
  useEffect(() => {
    const mockCampaign = {
      id: campaignId,
      name: 'Flu Vaccination Drive 2025',
      status: 'In Progress',
      description: 'Annual influenza vaccination campaign for all eligible students',
      startDate: '2025-02-15',
      endDate: '2025-03-15',
      vaccineType: 'Influenza Vaccine (Quadrivalent)',
      targetGrades: ['3', '4', '5', '6'],
      totalStudents: 320,
      completedVaccinations: 145,
      pendingConsents: 68,
      adverseReactions: 2,
      scheduledSessions: [
        { date: '2025-02-20', time: '09:00-12:00', venue: 'Health Room A' },
        { date: '2025-02-22', time: '09:00-12:00', venue: 'Health Room A' },
        { date: '2025-02-24', time: '09:00-12:00', venue: 'Health Room A' }
      ]
    };

    const mockStudents = [
      { id: 1, name: 'John Smith', grade: '5A', consentStatus: 'received', vaccinationStatus: 'completed', vaccinationDate: '2025-02-20', reactions: false },
      { id: 2, name: 'Emma Johnson', grade: '4B', consentStatus: 'received', vaccinationStatus: 'scheduled', vaccinationDate: null, reactions: false },
      { id: 3, name: 'Michael Brown', grade: '6A', consentStatus: 'pending', vaccinationStatus: 'pending', vaccinationDate: null, reactions: false },
      { id: 4, name: 'Sophia Davis', grade: '3C', consentStatus: 'received', vaccinationStatus: 'completed', vaccinationDate: '2025-02-20', reactions: true },
      { id: 5, name: 'James Wilson', grade: '5B', consentStatus: 'declined', vaccinationStatus: 'not_applicable', vaccinationDate: null, reactions: false }
    ];

    const mockRecords = [
      { 
        id: 1, 
        studentName: 'John Smith', 
        grade: '5A', 
        vaccinationDate: '2025-02-20', 
        vaccineType: 'Influenza Vaccine', 
        batchNumber: 'FLU2025-001', 
        administrator: 'Nurse Mary',
        reactions: 'None reported'
      },
      { 
        id: 4, 
        studentName: 'Sophia Davis', 
        grade: '3C', 
        vaccinationDate: '2025-02-20', 
        vaccineType: 'Influenza Vaccine', 
        batchNumber: 'FLU2025-001', 
        administrator: 'Nurse Mary',
        reactions: 'Mild soreness at injection site'
      }
    ];

    const mockInventory = [
      { id: 1, name: 'Influenza Vaccine (Quadrivalent)', currentStock: 180, used: 145, remaining: 35 },
      { id: 2, name: 'Disposable Syringes (1ml)', currentStock: 200, used: 145, remaining: 55 },
      { id: 3, name: 'Alcohol Swabs', currentStock: 500, used: 290, remaining: 210 },
      { id: 4, name: 'Bandages', currentStock: 300, used: 145, remaining: 155 }
    ];

    setCampaign(mockCampaign);
    setStudentList(mockStudents);
    setVaccinationRecords(mockRecords);
    setInventoryItems(mockInventory);
    setConsentStats({
      received: 195,
      pending: 68,
      declined: 22,
      total: 285
    });
  }, [campaignId]);

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

  const getVaccinationStatusColor = (status) => {
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
    const matchesFilter = filterStatus === 'all' || student.vaccinationStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSendConsents = () => {
    setShowConsentModal(true);
  };

  const handleRecordVaccination = (student) => {
    setSelectedStudent(student);
    setShowVaccinationModal(true);
  };

  const handleUpdateStatus = (newStatus) => {
    setCampaign(prev => ({ ...prev, status: newStatus }));
  };

  if (!campaign) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={() => navigate('/nurse/vaccinations')}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
          >
            ← Back to Vaccination Campaigns
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
          <p className="text-gray-600 mt-1">{campaign.description}</p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
            {campaign.status}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.totalStudents}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-600">Vaccinated</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.completedVaccinations}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-600">Pending Consents</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.pendingConsents}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-600">Adverse Reactions</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.adverseReactions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Campaign Progress</span>
          <span>{Math.round((campaign.completedVaccinations / campaign.totalStudents) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full" 
            style={{ width: `${(campaign.completedVaccinations / campaign.totalStudents) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'students', name: 'Student Management' },
            { id: 'records', name: 'Vaccination Records' },
            { id: 'inventory', name: 'Inventory Usage' },
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
            <h3 className="text-lg font-semibold mb-4">Campaign Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Vaccine Type:</span>
                <span className="font-medium">{campaign.vaccineType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium">{new Date(campaign.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End Date:</span>
                <span className="font-medium">{new Date(campaign.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Target Grades:</span>
                <span className="font-medium">{campaign.targetGrades.join(', ')}</span>
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
            <h3 className="text-lg font-semibold mb-4">Scheduled Vaccination Sessions</h3>
            <div className="space-y-3">
              {campaign.scheduledSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium">{new Date(session.date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-600">{session.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{session.venue}</div>
                    <div className="text-sm text-blue-600">View Details</div>
                  </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccination Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccination Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className={student.reactions ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          {student.reactions && (
                            <div className="text-xs text-red-600">⚠ Adverse reaction reported</div>
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
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVaccinationStatusColor(student.vaccinationStatus)}`}>
                        {student.vaccinationStatus.replace('_', ' ').charAt(0).toUpperCase() + student.vaccinationStatus.replace('_', ' ').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.vaccinationDate ? new Date(student.vaccinationDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleRecordVaccination(student)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Record Vaccination
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

      {activeTab === 'records' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Vaccination Records</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administrator</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reactions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vaccinationRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.grade}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(record.vaccinationDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.vaccineType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.batchNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.administrator}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.reactions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Inventory Usage</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initial Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage %</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.currentStock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.used}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.remaining}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.round((item.used / item.currentStock) * 100)}%
                    </td>
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
                onClick={handleSendConsents}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 text-left"
              >
                📧 Send Consent Forms
              </button>
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 text-left">
                📋 Prepare Student List for Vaccination
              </button>
              <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 text-left">
                💉 Bulk Record Vaccinations
              </button>
              <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 text-left">
                🔍 Post-Vaccination Monitoring
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
            <h3 className="text-lg font-semibold mb-4">Adverse Reactions Monitoring</h3>
            <p className="text-gray-600 mb-4">Students with reported adverse reactions requiring monitoring:</p>
            <div className="space-y-2">
              {studentList.filter(s => s.reactions).map(student => (
                <div key={student.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">{student.name} - {student.grade}</span>
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    Review Reaction
                  </button>
                </div>
              ))}
              {studentList.filter(s => s.reactions).length === 0 && (
                <p className="text-gray-500">No adverse reactions reported.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Consent Form Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Send Consent Forms</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>All Parents</option>
                  <option>Parents with Pending Consents</option>
                  <option>Specific Grade Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Consent Deadline</label>
                <input type="date" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message</label>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded-md h-24"
                  placeholder="Enter additional information for parents..."
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowConsentModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Handle send consent
                  setShowConsentModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Send Consent Forms
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vaccination Recording Modal */}
      {showVaccinationModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Record Vaccination - {selectedStudent.name}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vaccination Date</label>
                <input type="date" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input type="time" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vaccine Type</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>Influenza Vaccine (Quadrivalent)</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batch Number</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Injection Site</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>Left Upper Arm</option>
                  <option>Right Upper Arm</option>
                  <option>Left Thigh</option>
                  <option>Right Thigh</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Administrator</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Nurse name" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pre-vaccination Assessment</label>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded-md h-20"
                  placeholder="Any concerns or observations before vaccination..."
                ></textarea>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Post-vaccination Observations</label>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded-md h-20"
                  placeholder="Immediate reactions or observations..."
                ></textarea>
              </div>
              <div className="col-span-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Student experienced adverse reaction</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowVaccinationModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Handle save vaccination
                  setShowVaccinationModal(false);
                  setSelectedStudent(null);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Record Vaccination
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationCampaignDetailPage;

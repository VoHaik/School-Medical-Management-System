import React, { useState, useEffect } from 'react';
import { 
  FaBandAid, FaAmbulance, FaExclamationTriangle, FaCheckCircle, 
  FaPlus, FaEdit, FaEye, FaCalendarAlt, FaClock, FaUser,
  FaPhoneAlt, FaMapMarkerAlt, FaNotesMedical, FaSearch,
  FaFilter, FaDownload, FaPrint, FaUserNurse
} from 'react-icons/fa';
import PageHeader from '../../components/PageHeader';

const EmergencyLog = () => {
  const [emergencyLogs, setEmergencyLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample emergency logs data
  const sampleLogs = [
    {
      id: 'EMG001',
      date: '2025-06-12',
      time: '10:30 AM',
      studentName: 'James Wilson',
      studentId: 'S006',
      grade: '10B',
      incidentType: 'Medical Emergency',
      severity: 'high',
      status: 'resolved',
      location: 'PE Gymnasium',
      description: 'Student experienced hypoglycemic episode during physical education class.',
      initialAssessment: 'Student appeared dizzy, sweating, and complained of feeling weak. Blood glucose reading: 65 mg/dL.',
      treatmentProvided: 'Administered glucose tablets (15g). Student rested for 15 minutes. Rechecked blood glucose: 110 mg/dL.',
      staffInvolved: ['Nurse Martinez', 'Coach Thompson', 'Principal Adams'],
      parentNotified: true,
      parentContact: 'Patricia Wilson - 555-0609',
      emergencyServicesContacted: false,
      followUpRequired: true,
      followUpNotes: 'Schedule meeting with parents to review diabetes management plan for PE activities.',
      reportedBy: 'Coach Thompson',
      handledBy: 'Nurse Martinez',
      timeResolved: '11:00 AM',
      additionalNotes: 'Student returned to class after blood glucose stabilized. Parents picked up at lunch for medical consultation.'
    },
    {
      id: 'EMG002',
      date: '2025-06-11',
      time: '2:15 PM',
      studentName: 'Marcus Williams',
      studentId: 'S002',
      grade: '7B',
      incidentType: 'Allergic Reaction',
      severity: 'critical',
      status: 'resolved',
      location: 'School Cafeteria',
      description: 'Student experienced severe allergic reaction after consuming lunch containing peanuts.',
      initialAssessment: 'Student developed hives, difficulty breathing, and swelling of face/throat. Anaphylactic reaction suspected.',
      treatmentProvided: 'EpiPen administered immediately. Called 911. Monitored vitals until paramedics arrived.',
      staffInvolved: ['Nurse Johnson', 'Cafeteria Manager', 'Vice Principal'],
      parentNotified: true,
      parentContact: 'Jennifer Williams - 555-0203',
      emergencyServicesContacted: true,
      emergencyResponse: '911 called at 2:18 PM. Paramedics arrived at 2:25 PM.',
      hospitalTransport: 'Springfield General Hospital',
      followUpRequired: true,
      followUpNotes: 'Review cafeteria allergen protocols. Update emergency action plan.',
      reportedBy: 'Cafeteria Manager',
      handledBy: 'Nurse Johnson',
      timeResolved: '2:45 PM',
      additionalNotes: 'Student recovered fully at hospital. Returned to school next day with updated allergy management plan.'
    },
    {
      id: 'EMG003',
      date: '2025-06-10',
      time: '11:45 AM',
      studentName: 'Sophia Johnson',
      studentId: 'S009',
      grade: '9B',
      incidentType: 'Injury',
      severity: 'medium',
      status: 'resolved',
      location: 'Chemistry Lab',
      description: 'Student sustained minor chemical burn on hand during lab experiment.',
      initialAssessment: 'Small chemical burn (1 inch diameter) on left hand from acid splash. No deep tissue damage.',
      treatmentProvided: 'Immediate flush with water for 15 minutes. Applied sterile dressing. Pain assessment: 3/10.',
      staffInvolved: ['Nurse Martinez', 'Chemistry Teacher - Dr. Lee'],
      parentNotified: true,
      parentContact: 'Sarah Johnson - 555-0812',
      emergencyServicesContacted: false,
      followUpRequired: false,
      reportedBy: 'Dr. Lee',
      handledBy: 'Nurse Martinez',
      timeResolved: '12:15 PM',
      additionalNotes: 'Student remained comfortable. Parent instructed on home care. No signs of infection.'
    },
    {
      id: 'EMG004',
      date: '2025-06-09',
      time: '9:20 AM',
      studentName: 'Isabella Martinez',
      studentId: 'S007',
      grade: '8C',
      incidentType: 'Mental Health Crisis',
      severity: 'high',
      status: 'resolved',
      location: 'School Counselor Office',
      description: 'Student experienced severe anxiety attack during morning classes.',
      initialAssessment: 'Student hyperventilating, trembling, expressing feelings of panic and inability to breathe.',
      treatmentProvided: 'Guided breathing exercises. Provided calm, quiet environment. Monitored until symptoms subsided.',
      staffInvolved: ['School Counselor Adams', 'Nurse Johnson', 'Homeroom Teacher'],
      parentNotified: true,
      parentContact: 'Carlos Martinez - 555-0711',
      emergencyServicesContacted: false,
      followUpRequired: true,
      followUpNotes: 'Schedule follow-up with school counselor. Review coping strategies.',
      reportedBy: 'Homeroom Teacher',
      handledBy: 'School Counselor Adams & Nurse Johnson',
      timeResolved: '10:00 AM',
      additionalNotes: 'Student stabilized and remained at school. Parents consulted about ongoing anxiety management.'
    },
    {
      id: 'EMG005',
      date: '2025-06-08',
      time: '3:10 PM',
      studentName: 'Alexander Brown',
      studentId: 'S008',
      grade: '11A',
      incidentType: 'Sports Injury',
      severity: 'medium',
      status: 'pending',
      location: 'Soccer Field',
      description: 'Student twisted ankle during soccer practice.',
      initialAssessment: 'Swelling and tenderness in left ankle. Unable to bear weight. No visible deformity.',
      treatmentProvided: 'Applied ice pack. Elevated leg. Wrapped ankle with elastic bandage.',
      staffInvolved: ['Nurse Martinez', 'Soccer Coach Wilson'],
      parentNotified: true,
      parentContact: 'Michelle Brown - 555-0913',
      emergencyServicesContacted: false,
      followUpRequired: true,
      followUpNotes: 'Recommend X-ray to rule out fracture. Follow up with orthopedist if pain persists.',
      reportedBy: 'Coach Wilson',
      handledBy: 'Nurse Martinez',
      timeResolved: 'Ongoing',
      additionalNotes: 'Parent picked up student for medical evaluation. Return to sports pending medical clearance.'
    }
  ];

  useEffect(() => {
    // Simulate loading emergency logs
    setEmergencyLogs(sampleLogs);
    setFilteredLogs(sampleLogs);
  }, []);

  useEffect(() => {
    let filtered = emergencyLogs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.incidentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter(log => log.severity === severityFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    setFilteredLogs(filtered);
  }, [emergencyLogs, searchTerm, severityFilter, statusFilter]);

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Critical</span>;
      case 'high':
        return <span className="px-2 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">High</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Low</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">{severity}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full flex items-center"><FaCheckCircle className="mr-1" /> Resolved</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full flex items-center"><FaClock className="mr-1" /> Pending</span>;
      case 'ongoing':
        return <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full flex items-center"><FaExclamationTriangle className="mr-1" /> Ongoing</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">{status}</span>;
    }
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader
        title="Emergency & Incident Log"
        subtitle="Record and track all medical emergencies, incidents, and safety events in the school."
        icon={<FaBandAid className="text-3xl text-red-600" />}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">{emergencyLogs.length}</p>
              <p className="text-sm text-gray-600">Total Incidents</p>
            </div>
            <FaBandAid className="text-2xl text-red-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">{emergencyLogs.filter(log => log.severity === 'critical' || log.severity === 'high').length}</p>
              <p className="text-sm text-gray-600">High Priority</p>
            </div>
            <FaExclamationTriangle className="text-2xl text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">{emergencyLogs.filter(log => log.status === 'pending' || log.status === 'ongoing').length}</p>
              <p className="text-sm text-gray-600">Pending Follow-up</p>
            </div>
            <FaClock className="text-2xl text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">{emergencyLogs.filter(log => log.status === 'resolved').length}</p>
              <p className="text-sm text-gray-600">Resolved</p>
            </div>
            <FaCheckCircle className="text-2xl text-green-500" />
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                placeholder="Search by student name, incident type, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select
              id="severity"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="resolved">Resolved</option>
              <option value="pending">Pending</option>
              <option value="ongoing">Ongoing</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center shadow-sm"
          >
            <FaPlus className="mr-2" /> New Emergency Log
          </button>
          
          <div className="flex space-x-2">
            <button className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center">
              <FaDownload className="mr-2" /> Export
            </button>
            <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <FaPrint className="mr-2" /> Print
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Logs Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  'Date/Time', 'Student', 'Incident Type', 'Location', 'Severity', 'Status', 'Handled By', 'Actions'
                ].map(header => (
                  <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.date}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <FaClock className="mr-1" /> {log.time}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.studentName}</div>
                    <div className="text-xs text-gray-500">{log.grade} - {log.studentId}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{log.incidentType}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 flex items-center">
                    <FaMapMarkerAlt className="mr-1 text-gray-400" /> {log.location}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{getSeverityBadge(log.severity)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(log.status)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 flex items-center">
                    <FaUserNurse className="mr-1 text-blue-500" /> {log.handledBy}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewDetails(log)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100"
                    >
                      <FaEye size={16} />
                    </button>
                    <button className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100">
                      <FaEdit size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-500">
                    <FaBandAid size={32} className="mx-auto mb-2 text-gray-400" />
                    <p>No emergency logs found. Try adjusting your filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaBandAid className="mr-2 text-red-600" />
                Emergency Log Details - {selectedLog.id}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Incident Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Date:</span> {selectedLog.date}</p>
                    <p><span className="font-medium">Time:</span> {selectedLog.time}</p>
                    <p><span className="font-medium">Location:</span> {selectedLog.location}</p>
                    <p><span className="font-medium">Type:</span> {selectedLog.incidentType}</p>
                    <p><span className="font-medium">Severity:</span> {getSeverityBadge(selectedLog.severity)}</p>
                    <p><span className="font-medium">Status:</span> {getStatusBadge(selectedLog.status)}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Student Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedLog.studentName}</p>
                    <p><span className="font-medium">Student ID:</span> {selectedLog.studentId}</p>
                    <p><span className="font-medium">Grade:</span> {selectedLog.grade}</p>
                    <p><span className="font-medium">Parent Contact:</span> {selectedLog.parentContact}</p>
                    <p><span className="font-medium">Parent Notified:</span> {selectedLog.parentNotified ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Description and Assessment */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Incident Description</h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedLog.description}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Initial Assessment</h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedLog.initialAssessment}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Treatment Provided</h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedLog.treatmentProvided}</p>
              </div>

              {/* Staff and Emergency Response */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Staff Involved</h4>
                  <ul className="space-y-1">
                    {selectedLog.staffInvolved.map((staff, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <FaUser className="mr-2 text-blue-500" /> {staff}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Emergency Response</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Emergency Services Called:</span> {selectedLog.emergencyServicesContacted ? 'Yes' : 'No'}</p>
                    {selectedLog.emergencyResponse && (
                      <p><span className="font-medium">Response Details:</span> {selectedLog.emergencyResponse}</p>
                    )}
                    {selectedLog.hospitalTransport && (
                      <p><span className="font-medium">Hospital:</span> {selectedLog.hospitalTransport}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Follow-up and Additional Notes */}
              {selectedLog.followUpRequired && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Follow-up Required</h4>
                  <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                    {selectedLog.followUpNotes}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Additional Notes</h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedLog.additionalNotes}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyLog;

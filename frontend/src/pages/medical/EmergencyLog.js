/**
 * EmergencyLog Component
 * 
 * This component manages emergency and incident logs for the school medical management system.
 * It provides functionality to:
 * - View all emergency logs with filtering and search capabilities
 * - Display detailed information about each incident
 * - Add new emergency logs
 * - Export and print reports
 * 
 * Features:
 * - Real-time search and filtering by severity and status
 * - Statistics dashboard showing key metrics
 * - Detailed modal view for each incident
 * - Responsive design for mobile and desktop
 * 
 * @author School Medical Management System
 * @version 1.0.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FaBandAid, FaAmbulance, FaExclamationTriangle, FaCheckCircle, 
  FaPlus, FaEdit, FaEye, FaCalendarAlt, FaClock, FaUser,
  FaPhoneAlt, FaMapMarkerAlt, FaNotesMedical, FaSearch,
  FaFilter, FaDownload, FaPrint, FaUserNurse
} from 'react-icons/fa';
import PageHeader from '../../components/PageHeader';

/**
 * Main EmergencyLog functional component
 * Manages emergency logs, filtering, and UI state
 */
const EmergencyLog = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Emergency logs data
  const [emergencyLogs, setEmergencyLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  
  // Modal states
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // ============================================================================
  // SAMPLE DATA
  // ============================================================================
  
  /**
   * Sample emergency logs data for demonstration
   * In production, this would be fetched from the backend API
   */
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
    }  ];

  // ============================================================================
  // COMPUTED VALUES (MEMOIZED)
  // ============================================================================
  
  /**
   * Statistics computed from emergency logs
   * Memoized to prevent unnecessary recalculations
   */
  const statistics = useMemo(() => ({
    totalIncidents: emergencyLogs.length,
    highPriority: emergencyLogs.filter(log => 
      log.severity === 'critical' || log.severity === 'high'
    ).length,
    pendingFollowup: emergencyLogs.filter(log => 
      log.status === 'pending' || log.status === 'ongoing'
    ).length,
    resolved: emergencyLogs.filter(log => log.status === 'resolved').length
  }), [emergencyLogs]);

  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  /**
   * Initial data loading effect
   * In production, this would fetch data from the API
   */
  useEffect(() => {
    // TODO: Replace with actual API call
    // fetchEmergencyLogs().then(setEmergencyLogs);
    setEmergencyLogs(sampleLogs);
    setFilteredLogs(sampleLogs);
  }, []);

  /**
   * Filter and search effect
   * Updates filteredLogs whenever search term or filters change
   */
  useEffect(() => {
    let filtered = emergencyLogs;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.incidentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(log => log.severity === severityFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    setFilteredLogs(filtered);
  }, [emergencyLogs, searchTerm, severityFilter, statusFilter]);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Returns appropriate severity badge component based on severity level
   * @param {string} severity - The severity level ('critical', 'high', 'medium', 'low')
   * @returns {JSX.Element} Severity badge component
   */
  const getSeverityBadge = useCallback((severity) => {
    const severityConfig = {
      critical: { color: 'red', label: 'Critical' },
      high: { color: 'orange', label: 'High' },
      medium: { color: 'yellow', label: 'Medium' },
      low: { color: 'green', label: 'Low' }
    };

    const config = severityConfig[severity] || { color: 'gray', label: severity };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold text-${config.color}-800 bg-${config.color}-100 rounded-full`}>
        {config.label}
      </span>
    );
  }, []);

  /**
   * Returns appropriate status badge component based on status
   * @param {string} status - The status ('resolved', 'pending', 'ongoing')
   * @returns {JSX.Element} Status badge component
   */
  const getStatusBadge = useCallback((status) => {
    const statusConfig = {
      resolved: { 
        icon: FaCheckCircle, 
        color: 'green', 
        label: 'Resolved' 
      },
      pending: { 
        icon: FaClock, 
        color: 'yellow', 
        label: 'Pending' 
      },
      ongoing: { 
        icon: FaExclamationTriangle, 
        color: 'blue', 
        label: 'Ongoing' 
      }
    };

    const config = statusConfig[status] || { 
      icon: null, 
      color: 'gray', 
      label: status 
    };
    
    const IconComponent = config.icon;
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold text-${config.color}-800 bg-${config.color}-100 rounded-full flex items-center`}>
        {IconComponent && <IconComponent className="mr-1" />} 
        {config.label}
      </span>
    );
  }, []);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handles viewing detailed information for a specific log
   * @param {Object} log - The emergency log object to view
   */
  const handleViewDetails = useCallback((log) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  }, []);

  /**
   * Handles closing the detail modal
   */
  const handleCloseDetailModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedLog(null);
  }, []);

  /**
   * Handles search input changes with debouncing
   * @param {Event} e - Input change event
   */
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  /**
   * Handles severity filter changes
   * @param {Event} e - Select change event
   */
  const handleSeverityFilterChange = useCallback((e) => {
    setSeverityFilter(e.target.value);
  }, []);

  /**
   * Handles status filter changes
   * @param {Event} e - Select change event
   */
  const handleStatusFilterChange = useCallback((e) => {
    setStatusFilter(e.target.value);
  }, []);

  /**
   * Handles adding new emergency log
   * TODO: Implement modal for adding new logs
   */
  const handleAddNewLog = useCallback(() => {
    setShowAddModal(true);
    // TODO: Implement add log functionality
  }, []);

  /**
   * Handles exporting emergency logs
   * TODO: Implement export functionality
   */
  const handleExport = useCallback(() => {
    // TODO: Implement export to CSV/PDF functionality
    console.log('Exporting emergency logs...');
  }, []);

  /**
   * Handles printing emergency logs
   * TODO: Implement print functionality
   */
  const handlePrint = useCallback(() => {
    // TODO: Implement print functionality
    window.print();
  }, []);

  // ============================================================================
  // RENDER HELPER COMPONENTS
  // ============================================================================

  /**
   * Renders the statistics cards section
   */
  const renderStatisticsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Incidents"
        value={statistics.totalIncidents}
        icon={FaBandAid}
        color="red"
      />
      <StatCard
        title="High Priority"
        value={statistics.highPriority}
        icon={FaExclamationTriangle}
        color="orange"
      />
      <StatCard
        title="Pending Follow-up"
        value={statistics.pendingFollowup}
        icon={FaClock}
        color="yellow"
      />
      <StatCard
        title="Resolved"
        value={statistics.resolved}
        icon={FaCheckCircle}
        color="green"
      />
    </div>
  );

  /**
   * Renders a statistics card component
   */
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`bg-white p-4 rounded-lg shadow-md border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
        <Icon className={`text-2xl text-${color}-500`} />
      </div>
    </div>
  );

  /**
   * Renders the search and filter bar
   */
  const renderSearchAndFilterBar = () => (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Search Input */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              placeholder="Search by student name, incident type, or location..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* Severity Filter */}
        <div>
          <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
            Severity
          </label>
          <select
            id="severity"
            value={severityFilter}
            onChange={handleSeverityFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="resolved">Resolved</option>
            <option value="pending">Pending</option>
            <option value="ongoing">Ongoing</option>
          </select>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handleAddNewLog}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center shadow-sm"
        >
          <FaPlus className="mr-2" /> New Emergency Log
        </button>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleExport}
            className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            <FaDownload className="mr-2" /> Export
          </button>
          <button 
            onClick={handlePrint}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaPrint className="mr-2" /> Print
          </button>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="Emergency & Incident Log"
        subtitle="Record and track all medical emergencies, incidents, and safety events in the school."
        icon={<FaBandAid className="text-3xl text-red-600" />}
      />

      {/* Statistics Cards Section */}
      {renderStatisticsCards()}

      {/* Search and Filter Bar Section */}
      {renderSearchAndFilterBar()}

      {/* Emergency Logs Table Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header */}
            <thead className="bg-gray-50">
              <tr>
                {[
                  'Date/Time', 'Student', 'Incident Type', 'Location', 
                  'Severity', 'Status', 'Handled By', 'Actions'
                ].map(header => (
                  <th 
                    key={header} 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  {/* Date/Time Column */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.date}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <FaClock className="mr-1" /> {log.time}
                    </div>
                  </td>
                  
                  {/* Student Column */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.studentName}</div>
                    <div className="text-xs text-gray-500">{log.grade} - {log.studentId}</div>
                  </td>
                  
                  {/* Incident Type Column */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {log.incidentType}
                  </td>
                  
                  {/* Location Column */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 flex items-center">
                    <FaMapMarkerAlt className="mr-1 text-gray-400" /> {log.location}
                  </td>
                  
                  {/* Severity Column */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getSeverityBadge(log.severity)}
                  </td>
                  
                  {/* Status Column */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusBadge(log.status)}
                  </td>
                  
                  {/* Handled By Column */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 flex items-center">
                    <FaUserNurse className="mr-1 text-blue-500" /> {log.handledBy}
                  </td>
                  
                  {/* Actions Column */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewDetails(log)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100 transition-colors"
                      title="View Details"
                    >
                      <FaEye size={16} />
                    </button>
                    <button 
                      className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100 transition-colors"
                      title="Edit Log"
                    >
                      <FaEdit size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                /* No Data Row */
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
        <EmergencyLogDetailModal
          log={selectedLog}
          onClose={handleCloseDetailModal}
          getSeverityBadge={getSeverityBadge}
          getStatusBadge={getStatusBadge}
        />
      )}
    </div>
  );
};

// ============================================================================
// DETAIL MODAL COMPONENT
// ============================================================================

/**
 * Emergency Log Detail Modal Component
 * Displays comprehensive details about a specific emergency log
 * 
 * @param {Object} props - Component props
 * @param {Object} props.log - The emergency log object to display
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {Function} props.getSeverityBadge - Function to get severity badge
 * @param {Function} props.getStatusBadge - Function to get status badge
 */
const EmergencyLogDetailModal = ({ log, onClose, getSeverityBadge, getStatusBadge }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaBandAid className="mr-2 text-red-600" />
            Emergency Log Details - {log.id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
            title="Close Modal"
          >
            &times;
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaNotesMedical className="mr-2 text-blue-600" />
                Incident Information
              </h4>
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <DetailItem label="Date" value={log.date} />
                <DetailItem label="Time" value={log.time} />
                <DetailItem label="Location" value={log.location} />
                <DetailItem label="Type" value={log.incidentType} />
                <DetailItem label="Severity" value={getSeverityBadge(log.severity)} />
                <DetailItem label="Status" value={getStatusBadge(log.status)} />
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaUser className="mr-2 text-green-600" />
                Student Information
              </h4>
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <DetailItem label="Name" value={log.studentName} />
                <DetailItem label="Student ID" value={log.studentId} />
                <DetailItem label="Grade" value={log.grade} />
                <DetailItem label="Parent Contact" value={log.parentContact} />
                <DetailItem 
                  label="Parent Notified" 
                  value={log.parentNotified ? 'Yes' : 'No'} 
                />
              </div>
            </div>
          </div>

          {/* Description Sections */}
          <DetailSection
            title="Incident Description"
            icon={FaExclamationTriangle}
            content={log.description}
          />

          <DetailSection
            title="Initial Assessment"
            icon={FaNotesMedical}
            content={log.initialAssessment}
          />

          <DetailSection
            title="Treatment Provided"
            icon={FaBandAid}
            content={log.treatmentProvided}
          />

          {/* Staff and Emergency Response Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaUserNurse className="mr-2 text-purple-600" />
                Staff Involved
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-1">
                  {log.staffInvolved.map((staff, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <FaUser className="mr-2 text-blue-500" /> {staff}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaAmbulance className="mr-2 text-red-600" />
                Emergency Response
              </h4>
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <DetailItem 
                  label="Emergency Services Called" 
                  value={log.emergencyServicesContacted ? 'Yes' : 'No'} 
                />
                {log.emergencyResponse && (
                  <DetailItem label="Response Details" value={log.emergencyResponse} />
                )}
                {log.hospitalTransport && (
                  <DetailItem label="Hospital" value={log.hospitalTransport} />
                )}
              </div>
            </div>
          </div>

          {/* Follow-up Section */}
          {log.followUpRequired && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FaClock className="mr-2 text-yellow-600" />
                Follow-up Required
              </h4>
              <div className="text-gray-700 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                {log.followUpNotes}
              </div>
            </div>
          )}

          {/* Additional Notes Section */}
          <DetailSection
            title="Additional Notes"
            icon={FaNotesMedical}
            content={log.additionalNotes}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

/**
 * Detail Item Component - renders a label-value pair
 */
const DetailItem = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="font-medium text-gray-600">{label}:</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

/**
 * Detail Section Component - renders a section with title and content
 */
const DetailSection = ({ title, icon: Icon, content }) => (
  <div>
    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
      <Icon className="mr-2 text-blue-600" />
      {title}
    </h4>
    <div className="text-gray-700 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-200">
      {content}
    </div>
  </div>
);
};

export default EmergencyLog;

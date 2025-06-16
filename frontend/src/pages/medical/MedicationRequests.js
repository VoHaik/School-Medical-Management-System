import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaPills, FaClock, FaCheck, FaTimes, FaExclamationTriangle, 
  FaEye, FaSearch, FaFilter, FaDownload, FaEnvelope, FaPhone
} from 'react-icons/fa';

const MedicationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sample data - in real application, this would come from the backend API
  const [sampleRequests] = useState([
    {
      requestId: 1,
      student: {
        id: 'S001',
        name: 'Emma Johnson',
        grade: '8A',
        photo: '/api/placeholder/32/32'
      },
      parent: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '555-0102'
      },
      medicationName: 'Albuterol Inhaler',
      dosage: '2 puffs',
      frequency: 'As needed for asthma',
      startDate: '2024-01-15',
      endDate: '2024-06-15',
      reason: 'Exercise-induced asthma management during school hours',
      status: 'PENDING',
      requestDate: '2024-01-10T10:30:00',
      notes: null,
      prescribedBy: 'Dr. Michael Chen, Pediatric Pulmonologist',
      administrationInstructions: 'Administer 2 puffs via spacer device before PE classes or when student experiences breathing difficulty. Wait 1 minute between puffs.',
      sideEffects: 'May cause mild throat irritation or shakiness',
      emergencyContact: '555-0102 (Mother)',
      storageInstructions: 'Store at room temperature, keep away from heat'
    },
    {
      requestId: 2,
      student: {
        id: 'S002',
        name: 'Marcus Williams',
        grade: '7B',
        photo: '/api/placeholder/32/32'
      },
      parent: {
        name: 'Jennifer Williams',
        email: 'jen.williams@email.com',
        phone: '555-0203'
      },
      medicationName: 'EpiPen Auto-Injector',
      dosage: '0.15mg',
      frequency: 'Emergency use only',
      startDate: '2024-01-20',
      endDate: '2024-12-31',
      reason: 'Severe peanut allergy - emergency treatment',
      status: 'APPROVED',
      requestDate: '2024-01-08T14:20:00',
      approvedBy: 'Nurse Johnson',
      actionDate: '2024-01-09T09:15:00',
      notes: 'Approved. Staff training scheduled for EpiPen administration.',
      prescribedBy: 'Dr. Lisa Park, Allergist',
      administrationInstructions: 'In case of severe allergic reaction: inject into outer thigh muscle, call 911 immediately, keep student calm and lying down',
      sideEffects: 'Rapid heartbeat, anxiety following injection (normal response)',
      emergencyContact: '555-0203 (Mother), 555-0204 (Father)',
      storageInstructions: 'Store at room temperature, do not refrigerate, protect from light'
    },
    {
      requestId: 3,
      student: {
        id: 'S003',
        name: 'Sophia Rodriguez',
        grade: '9A',
        photo: '/api/placeholder/32/32'
      },
      parent: {
        name: 'Maria Rodriguez',
        email: 'maria.rodriguez@email.com',
        phone: '555-0305'
      },
      medicationName: 'Concerta 18mg',
      dosage: '1 tablet',
      frequency: 'Once daily in the morning',
      startDate: '2024-01-22',
      endDate: '2024-06-30',
      reason: 'ADHD management for academic focus',
      status: 'PENDING',
      requestDate: '2024-01-12T16:45:00',
      notes: null,
      prescribedBy: 'Dr. Amanda Thompson, Child Psychiatrist',
      administrationInstructions: 'Give one tablet with water in the morning before classes begin. Do not crush or break tablet.',
      sideEffects: 'Decreased appetite, difficulty sleeping, mood changes',
      emergencyContact: '555-0305 (Mother)',
      storageInstructions: 'Store in locked cabinet, controlled substance'
    },
    {
      requestId: 4,
      student: {
        id: 'S004',
        name: 'Benjamin Davis',
        grade: '11C',
        photo: '/api/placeholder/32/32'
      },
      parent: {
        name: 'Robert Davis',
        email: 'robert.davis@email.com',
        phone: '555-0406'
      },
      medicationName: 'ProAir HFA Inhaler',
      dosage: '2 puffs',
      frequency: 'As needed for asthma symptoms',
      startDate: '2024-01-25',
      endDate: '2024-12-31',
      reason: 'Exercise-induced asthma, PE class participation',
      status: 'APPROVED',
      requestDate: '2024-01-15T11:30:00',
      approvedBy: 'Nurse Martinez',
      actionDate: '2024-01-16T08:45:00',
      notes: 'Approved for PE activities. Student trained on proper inhaler technique.',
      prescribedBy: 'Dr. Sarah Kim, Pulmonologist',
      administrationInstructions: 'Shake inhaler well, exhale fully, place lips around mouthpiece, inhale slowly and deeply while pressing down, hold breath for 10 seconds',
      sideEffects: 'Mild throat irritation, possible slight tremor',
      emergencyContact: '555-0406 (Father), 555-0407 (Mother)',
      storageInstructions: 'Store at room temperature, keep track of remaining doses'
    },
    {
      requestId: 5,
      student: {
        id: 'S005',
        name: 'Chloe Thompson',
        grade: '6A',
        photo: '/api/placeholder/32/32'
      },
      parent: {
        name: 'Linda Thompson',
        email: 'linda.thompson@email.com',
        phone: '555-0508'
      },
      medicationName: 'Tylenol (Acetaminophen)',
      dosage: '325mg',
      frequency: 'Every 6 hours as needed',
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      reason: 'Chronic headaches during menstrual cycle',
      status: 'REJECTED',
      requestDate: '2024-01-20T13:15:00',
      rejectedBy: 'Nurse Johnson',
      actionDate: '2024-01-22T10:30:00',
      rejectionReason: 'Over-the-counter medication should be managed at home. Please consult with family doctor for chronic headache evaluation.',
      prescribedBy: 'Self-reported by parent',
      notes: 'Suggested parent schedule appointment with family physician for proper headache assessment.'
    },
    {
      requestId: 6,
      student: {
        id: 'S006',
        name: 'James Wilson',
        grade: '10B',
        photo: '/api/placeholder/32/32'
      },
      parent: {
        name: 'Patricia Wilson',
        email: 'patricia.wilson@email.com',
        phone: '555-0609'
      },
      medicationName: 'Lantus Insulin',
      dosage: '15 units',
      frequency: 'Once daily at lunch',
      startDate: '2024-01-30',
      endDate: '2024-12-31',
      reason: 'Type 1 Diabetes management',
      status: 'APPROVED',
      requestDate: '2024-01-18T09:20:00',
      approvedBy: 'Nurse Martinez',
      actionDate: '2024-01-19T14:00:00',
      notes: 'Approved. Student is trained in self-administration. Blood glucose monitoring supplies provided.',
      prescribedBy: 'Dr. Michael Chen, Endocrinologist',
      administrationInstructions: 'Check blood glucose before administration, inject subcutaneously in rotating sites, record levels in logbook',
      sideEffects: 'Possible hypoglycemia, injection site reactions',
      emergencyContact: '555-0609 (Mother), 555-0610 (Father), Dr. Chen: 555-0900',
      storageInstructions: 'Refrigerate unopened vials, current pen can be stored at room temperature for up to 28 days'
    },
    {
      requestId: 7,
      student: {
        id: 'S007',
        name: 'Isabella Martinez',
        grade: '8C',
        photo: '/api/placeholder/32/32'
      },
      parent: {
        name: 'Carlos Martinez',
        email: 'carlos.martinez@email.com',
        phone: '555-0711'
      },
      medicationName: 'Zoloft (Sertraline)',
      dosage: '25mg',
      frequency: 'Once daily in the morning',
      startDate: '2024-02-05',
      endDate: '2024-08-31',
      reason: 'Anxiety disorder affecting academic performance',
      status: 'UNDER_REVIEW',
      requestDate: '2024-01-25T15:40:00',
      notes: 'Requires additional documentation from prescribing psychiatrist and school counselor consultation.',
      prescribedBy: 'Dr. Amanda Foster, Child Psychiatrist',
      administrationInstructions: 'Take with food to reduce stomach upset, consistent timing important',
      sideEffects: 'Nausea, drowsiness, changes in appetite - monitor closely',
      emergencyContact: '555-0711 (Father), 555-0712 (Mother), Dr. Foster: 555-1200'
    }  ]);

  const fetchMedicationRequests = useCallback(async () => {
    setLoading(true);
    try {
      // In real application, make API call to backend
      // const token = localStorage.getItem('token');
      // const response = await axios.get('/api/medication-requests/all', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // setRequests(response.data);
      
      // For demo, use sample data
      setTimeout(() => {
        setRequests(sampleRequests);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching medication requests:', error);
      setLoading(false);
    }
  }, [sampleRequests]);

  const filterRequests = useCallback(() => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.student.grade.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter]);

  useEffect(() => {
    fetchMedicationRequests();
  }, [fetchMedicationRequests]);

  useEffect(() => {
    filterRequests();
  }, [filterRequests]);

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setApprovalNotes('');
    setShowApprovalModal(true);
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  const submitApproval = async () => {
    if (!selectedRequest) return;
    
    setSubmitting(true);
    try {
      // In real application, make API call
      // const token = localStorage.getItem('token');
      // await axios.put(`/api/medication-requests/${selectedRequest.requestId}/approve`, approvalNotes, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      // Update local state for demo
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.requestId === selectedRequest.requestId
            ? {
                ...req,
                status: 'APPROVED',
                approvedBy: 'Nurse Johnson',
                actionDate: new Date().toISOString(),
                notes: approvalNotes
              }
            : req
        )
      );

      setShowApprovalModal(false);
      setApprovalNotes('');
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const submitRejection = async () => {
    if (!selectedRequest || !rejectionReason.trim()) return;

    setSubmitting(true);
    try {
      // In real application, make API call
      // const token = localStorage.getItem('token');
      // await axios.put(`/api/medication-requests/${selectedRequest.requestId}/reject`, rejectionReason, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      // Update local state for demo
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.requestId === selectedRequest.requestId
            ? {
                ...req,
                status: 'REJECTED',
                approvedBy: 'Nurse Johnson',
                actionDate: new Date().toISOString(),
                notes: rejectionReason
              }
            : req
        )
      );

      setShowRejectionModal(false);
      setRejectionReason('');
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Error rejecting request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLevel = (request) => {
    if (request.medicationName.toLowerCase().includes('epipen') || 
        request.medicationName.toLowerCase().includes('insulin')) {
      return { level: 'Critical', color: 'text-red-600' };
    }
    if (request.medicationName.toLowerCase().includes('inhaler') ||
        request.frequency.toLowerCase().includes('daily')) {
      return { level: 'High', color: 'text-orange-600' };
    }
    return { level: 'Standard', color: 'text-blue-600' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading medication requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaPills className="mr-3 text-blue-600" />
            Medication Requests
          </h1>
          <p className="text-gray-600 mt-1">Review and manage parent medication requests</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
            <FaDownload className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FaPills className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">
                {requests.filter(r => r.status === 'PENDING').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <FaClock className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">
                {requests.filter(r => r.status === 'APPROVED').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheck className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Meds</p>
              <p className="text-3xl font-bold text-red-600">
                {requests.filter(r => getPriorityLevel(r).level === 'Critical').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-red-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student, medication, or parent name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student/Parent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medication Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <FaPills size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-xl font-semibold">No medication requests found</p>
                    <p>Try adjusting your search or filter criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => {
                  const priority = getPriorityLevel(request);
                  return (
                    <tr key={request.requestId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={request.student.photo}
                            alt=""
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {request.student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Grade {request.student.grade} • {request.parent.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">
                          {request.medicationName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.dosage} • {request.frequency}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Duration: {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${priority.color}`}>
                          {priority.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(request.requestDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100"
                          title="View Details"
                        >
                          <FaEye size={16} />
                        </button>
                        {request.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(request)}
                              className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100"
                              title="Approve Request"
                            >
                              <FaCheck size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(request)}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
                              title="Reject Request"
                            >
                              <FaTimes size={16} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Medication Request Details
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Student Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Student Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedRequest.student.name}</p>
                    <p><span className="font-medium">Student ID:</span> {selectedRequest.student.id}</p>
                    <p><span className="font-medium">Grade:</span> {selectedRequest.student.grade}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Parent/Guardian Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedRequest.parent.name}</p>
                    <p className="flex items-center">
                      <FaEnvelope className="mr-2 text-gray-500" size={14} />
                      {selectedRequest.parent.email}
                    </p>
                    <p className="flex items-center">
                      <FaPhone className="mr-2 text-gray-500" size={14} />
                      {selectedRequest.parent.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Medication Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Medication Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><span className="font-medium">Medication:</span> {selectedRequest.medicationName}</p>
                    <p><span className="font-medium">Dosage:</span> {selectedRequest.dosage}</p>
                    <p><span className="font-medium">Frequency:</span> {selectedRequest.frequency}</p>
                    <p><span className="font-medium">Duration:</span> {new Date(selectedRequest.startDate).toLocaleDateString()} - {new Date(selectedRequest.endDate).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p><span className="font-medium">Prescribed by:</span> {selectedRequest.prescribedBy}</p>
                    <p><span className="font-medium">Emergency Contact:</span> {selectedRequest.emergencyContact}</p>
                    <p><span className="font-medium">Priority:</span> 
                      <span className={`ml-2 font-semibold ${getPriorityLevel(selectedRequest).color}`}>
                        {getPriorityLevel(selectedRequest).level}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Medical Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Reason for Medication</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedRequest.reason}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Administration Instructions</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedRequest.administrationInstructions}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Side Effects</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedRequest.sideEffects}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Storage Instructions</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedRequest.storageInstructions}</p>
                  </div>
                </div>
              </div>

              {/* Request Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Request Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><span className="font-medium">Current Status:</span> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                    </p>
                    <p><span className="font-medium">Request Date:</span> {formatDate(selectedRequest.requestDate)}</p>
                  </div>
                  {selectedRequest.approvedBy && (
                    <div className="space-y-2">
                      <p><span className="font-medium">Actioned by:</span> {selectedRequest.approvedBy}</p>
                      <p><span className="font-medium">Action Date:</span> {formatDate(selectedRequest.actionDate)}</p>
                    </div>
                  )}
                </div>
                {selectedRequest.notes && (
                  <div className="mt-4">
                    <p className="font-medium mb-2">Notes:</p>
                    <p className="text-gray-700 bg-white p-3 rounded border">{selectedRequest.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              {selectedRequest.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleReject(selectedRequest);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Reject Request
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleApprove(selectedRequest);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve Request
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Approve Medication Request
              </h3>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to approve the medication request for <strong>{selectedRequest.medicationName}</strong> for student <strong>{selectedRequest.student.name}</strong>?
              </p>
              
              <div>
                <label htmlFor="approvalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  Approval Notes (Optional)
                </label>
                <textarea
                  id="approvalNotes"
                  rows="3"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter any additional notes for this approval..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={submitApproval}
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Approving...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Approve Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Reject Medication Request
              </h3>
              <button
                onClick={() => setShowRejectionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Please provide a reason for rejecting the medication request for <strong>{selectedRequest.medicationName}</strong> for student <strong>{selectedRequest.student.name}</strong>.
              </p>
              
              <div>
                <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  id="rejectionReason"
                  rows="4"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Please explain why this request is being rejected..."
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                disabled={submitting || !rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Rejecting...
                  </>
                ) : (
                  <>
                    <FaTimes className="mr-2" />
                    Reject Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationRequests;

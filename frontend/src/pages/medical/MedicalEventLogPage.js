import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MedicalEventLogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterDateRange, setFilterDateRange] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Mock medical events data
  const [medicalEvents] = useState([
    {
      id: 1,
      studentName: 'Alice Johnson',
      studentId: 'ST001',
      className: '10A',
      eventType: 'Injury - Minor Cut',
      description: 'Small cut on finger from paper during art class',
      symptoms: 'Minor bleeding, no pain reported',
      severity: 'Low',
      location: 'Art Room',
      date: '2025-06-11',
      time: '10:30 AM',
      actionsTaken: 'Cleaned wound, applied antiseptic, bandaged',
      medicationsUsed: [
        { name: 'Antiseptic Solution', quantity: 1, unit: 'application' }
      ],
      suppliesUsed: [
        { name: 'Band-Aid', quantity: 1, unit: 'piece' },
        { name: 'Cotton Swab', quantity: 2, unit: 'pieces' }
      ],
      outcome: 'Returned to class',
      nurseNotes: 'Student handled well, no complications',
      parentNotified: false,
      followUpRequired: false,
      recordedBy: 'Nurse Johnson',
      emergencyServices: false
    },
    {
      id: 2,
      studentName: 'Bob Smith',
      studentId: 'ST002',
      className: '10B',
      eventType: 'Allergic Reaction',
      description: 'Allergic reaction to nuts during lunch',
      symptoms: 'Mild rash on arms, slight itching, no breathing issues',
      severity: 'Medium',
      location: 'Cafeteria',
      date: '2025-06-10',
      time: '12:15 PM',
      actionsTaken: 'Removed from allergen source, monitored breathing, applied cool compress',
      medicationsUsed: [
        { name: 'Antihistamine (Benadryl)', quantity: 1, unit: 'tablet' }
      ],
      suppliesUsed: [
        { name: 'Cool Compress', quantity: 1, unit: 'unit' }
      ],
      outcome: 'Sent home with parent',
      nurseNotes: 'Parents called immediately, reaction subsided within 30 minutes',
      parentNotified: true,
      parentNotificationTime: '2025-06-10 12:20 PM',
      followUpRequired: true,
      followUpNotes: 'Schedule allergy management consultation with parents',
      recordedBy: 'Nurse Johnson',
      emergencyServices: false
    },
    {
      id: 3,
      studentName: 'Carol Davis',
      studentId: 'ST003',
      className: '11A',
      eventType: 'Illness - Fever',
      description: 'Student reported feeling unwell with headache and fatigue',
      symptoms: 'Fever (100.4°F), headache, fatigue, no respiratory symptoms',
      severity: 'Medium',
      location: 'Classroom 11A',
      date: '2025-06-09',
      time: '2:00 PM',
      actionsTaken: 'Temperature taken, provided rest area, monitored symptoms',
      medicationsUsed: [
        { name: 'Paracetamol 500mg', quantity: 1, unit: 'tablet' }
      ],
      suppliesUsed: [
        { name: 'Digital Thermometer', quantity: 1, unit: 'use' },
        { name: 'Thermometer Cover', quantity: 1, unit: 'piece' }
      ],
      outcome: 'Sent home with parent',
      nurseNotes: 'Advised parent to monitor temperature and consult family doctor if fever persists',
      parentNotified: true,
      parentNotificationTime: '2025-06-09 2:15 PM',
      followUpRequired: true,
      followUpNotes: 'Student to return with medical clearance if fever continues',
      recordedBy: 'Nurse Johnson',
      emergencyServices: false
    },
    {
      id: 4,
      studentName: 'David Wilson',
      studentId: 'ST004',
      className: '9C',
      eventType: 'Injury - Fall',
      description: 'Student fell during PE class, twisted ankle',
      symptoms: 'Pain in left ankle, mild swelling, difficulty walking',
      severity: 'High',
      location: 'Gymnasium',
      date: '2025-06-08',
      time: '3:45 PM',
      actionsTaken: 'Applied ice pack, elevated leg, assessed for fracture, called emergency services',
      medicationsUsed: [],
      suppliesUsed: [
        { name: 'Ice Pack', quantity: 2, unit: 'units' },
        { name: 'Elastic Bandage', quantity: 1, unit: 'roll' }
      ],
      outcome: 'Referred to hospital',
      nurseNotes: 'Possible fracture suspected, X-ray needed',
      parentNotified: true,
      parentNotificationTime: '2025-06-08 3:50 PM',
      followUpRequired: true,
      followUpNotes: 'Await medical report from hospital, return-to-sport clearance required',
      recordedBy: 'Nurse Johnson',
      emergencyServices: true,
      witnessName: 'PE Teacher Mr. Brown'
    }
  ]);

  // Filter events based on search and filters
  const filteredEvents = medicalEvents.filter(event => {
    const matchesSearch = event.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.eventType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || event.eventType.includes(filterType);
    const matchesSeverity = filterSeverity === 'All' || event.severity === filterSeverity;
    
    let matchesDate = true;
    if (filterDateRange === 'Today') {
      matchesDate = event.date === '2025-06-11';
    } else if (filterDateRange === 'This Week') {
      // Simple check for this week
      const eventDate = new Date(event.date);
      const today = new Date('2025-06-11');
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = eventDate >= weekAgo && eventDate <= today;
    }
    
    return matchesSearch && matchesType && matchesSeverity && matchesDate;
  });

  const severityColors = {
    'Low': 'bg-green-100 text-green-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'High': 'bg-red-100 text-red-800'
  };

  const EventDetailsModal = ({ event, onClose }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Medical Event Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Student Information</h3>
              <p><strong>Name:</strong> {event.studentName}</p>
              <p><strong>ID:</strong> {event.studentId}</p>
              <p><strong>Class:</strong> {event.className}</p>
            </div>

            {/* Event Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Event Information</h3>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Time:</strong> {event.time}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Type:</strong> {event.eventType}</p>
              <p><strong>Severity:</strong> 
                <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded ${severityColors[event.severity]}`}>
                  {event.severity}
                </span>
              </p>
            </div>

            {/* Description */}
            <div className="md:col-span-2 bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Description</h3>
              <p>{event.description}</p>
            </div>

            {/* Symptoms */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">Symptoms Observed</h3>
              <p>{event.symptoms}</p>
            </div>

            {/* Actions Taken */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Actions Taken</h3>
              <p>{event.actionsTaken}</p>
            </div>

            {/* Medications Used */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Medications Used</h3>
              {event.medicationsUsed.length > 0 ? (
                <ul className="list-disc list-inside">
                  {event.medicationsUsed.map((med, index) => (
                    <li key={index}>{med.name} - {med.quantity} {med.unit}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No medications administered</p>
              )}
            </div>

            {/* Supplies Used */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-indigo-800 mb-2">Supplies Used</h3>
              {event.suppliesUsed.length > 0 ? (
                <ul className="list-disc list-inside">
                  {event.suppliesUsed.map((supply, index) => (
                    <li key={index}>{supply.name} - {supply.quantity} {supply.unit}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No supplies used</p>
              )}
            </div>

            {/* Outcome */}
            <div className="md:col-span-2 bg-pink-50 p-4 rounded-lg">
              <h3 className="font-semibold text-pink-800 mb-2">Outcome</h3>
              <p>{event.outcome}</p>
            </div>

            {/* Notifications and Follow-up */}
            <div className="bg-cyan-50 p-4 rounded-lg">
              <h3 className="font-semibold text-cyan-800 mb-2">Notifications</h3>
              <p><strong>Parent Notified:</strong> {event.parentNotified ? 'Yes' : 'No'}</p>
              {event.parentNotified && event.parentNotificationTime && (
                <p><strong>Notification Time:</strong> {event.parentNotificationTime}</p>
              )}
              <p><strong>Emergency Services:</strong> {event.emergencyServices ? 'Yes' : 'No'}</p>
              {event.witnessName && (
                <p><strong>Witness:</strong> {event.witnessName}</p>
              )}
            </div>

            <div className="bg-teal-50 p-4 rounded-lg">
              <h3 className="font-semibold text-teal-800 mb-2">Follow-up</h3>
              <p><strong>Required:</strong> {event.followUpRequired ? 'Yes' : 'No'}</p>
              {event.followUpRequired && event.followUpNotes && (
                <div className="mt-2">
                  <p><strong>Notes:</strong> {event.followUpNotes}</p>
                </div>
              )}
            </div>

            {/* Nurse Notes */}
            <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Nurse Notes</h3>
              <p>{event.nurseNotes}</p>
              <p className="text-sm text-gray-600 mt-2"><strong>Recorded by:</strong> {event.recordedBy}</p>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Medical Event Log</h1>
        <div className="flex space-x-2">
          <button className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded">
            Export Log
          </button>          <Link 
            to="/medical/events" 
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Record New Event
          </Link>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <p className="text-blue-600 font-semibold">Total Events</p>
          <p className="text-2xl font-bold text-blue-800">{medicalEvents.length}</p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <p className="text-green-600 font-semibold">Low Severity</p>
          <p className="text-2xl font-bold text-green-800">
            {medicalEvents.filter(e => e.severity === 'Low').length}
          </p>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-yellow-600 font-semibold">Medium Severity</p>
          <p className="text-2xl font-bold text-yellow-800">
            {medicalEvents.filter(e => e.severity === 'Medium').length}
          </p>
        </div>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-red-600 font-semibold">High Severity</p>
          <p className="text-2xl font-bold text-red-800">
            {medicalEvents.filter(e => e.severity === 'High').length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 bg-white p-4 shadow rounded">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <input 
              type="text" 
              placeholder="Search by student name, ID, or event type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Injury">Injury</option>
              <option value="Illness">Illness</option>
              <option value="Allergic">Allergic Reaction</option>
            </select>
          </div>
          <div>
            <select 
              value={filterSeverity} 
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Severity</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <select 
              value={filterDateRange} 
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredEvents.length} of {medicalEvents.length} events
          {searchTerm && <span> for "{searchTerm}"</span>}
        </p>
      </div>

      {/* Events Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student & Event</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type & Severity</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Follow-up</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEvents.length > 0 ? filteredEvents.map(event => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div>
                    <div className="font-semibold text-gray-900">{event.studentName}</div>
                    <div className="text-sm text-gray-600">{event.studentId} - {event.className}</div>
                    <div className="text-sm text-gray-500">{event.location}</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-900">{event.date}</div>
                  <div className="text-sm text-gray-600">{event.time}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-900">{event.eventType}</div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityColors[event.severity]}`}>
                    {event.severity}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {event.outcome}
                  {event.parentNotified && (
                    <div className="text-xs text-blue-600 mt-1">Parent Notified</div>
                  )}
                  {event.emergencyServices && (
                    <div className="text-xs text-red-600 mt-1">Emergency Services</div>
                  )}
                </td>
                <td className="py-4 px-4 text-sm">
                  {event.followUpRequired ? (
                    <span className="text-orange-600 font-semibold">Required</span>
                  ) : (
                    <span className="text-green-600">None</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No medical events found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedEvent && (
        <EventDetailsModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
};

export default MedicalEventLogPage;

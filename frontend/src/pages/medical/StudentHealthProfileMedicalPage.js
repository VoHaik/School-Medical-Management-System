import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const StudentHealthProfileMedicalPage = () => {
  const { studentId } = useParams();
  
  // Mock student data - in real app, this would be fetched from API based on studentId
  const [studentData] = useState({
    id: studentId,
    studentCode: 'ST001',
    fullName: 'Alice Johnson',
    dateOfBirth: '2008-05-15',
    gender: 'Female',
    className: '10A',
    grade: 10,
    emergencyContacts: [
      { name: 'Sarah Johnson (Mother)', phone: '555-0123', relationship: 'Mother', primary: true },
      { name: 'Michael Johnson (Father)', phone: '555-0124', relationship: 'Father', primary: false }
    ],
    parentDeclarations: {
      allergies: [
        { name: 'Peanuts', severity: 'Severe', symptoms: 'Anaphylaxis, breathing difficulty', notes: 'Carries EpiPen' },
        { name: 'Shellfish', severity: 'Moderate', symptoms: 'Skin rash, itching', notes: 'Avoid all seafood' }
      ],
      chronicConditions: [
        { name: 'Asthma', severity: 'Mild', medications: 'Albuterol inhaler', notes: 'Triggered by exercise and dust' }
      ],
      medications: [
        { name: 'EpiPen', dosage: '0.3mg', frequency: 'As needed', purpose: 'Severe allergic reactions' },
        { name: 'Albuterol Inhaler', dosage: '2 puffs', frequency: 'As needed', purpose: 'Asthma relief' }
      ],
      medicalHistory: 'Hospitalized at age 6 for severe allergic reaction. Regular check-ups with allergist.',
      dietaryRestrictions: 'Strict avoidance of nuts and shellfish. Lactose intolerant.',
      lastUpdated: '2025-05-01'
    },
    visionHearing: {
      lastVisionTest: '2024-09-15',
      visionResults: { leftEye: '20/20', rightEye: '20/25', notes: 'Slight nearsightedness in right eye' },
      lastHearingTest: '2024-09-15',
      hearingResults: { leftEar: 'Normal', rightEar: 'Normal', notes: 'All frequencies within normal range' }
    },
    immunizations: [
      { vaccine: 'COVID-19 (Pfizer)', date: '2024-08-15', batch: 'CV-2024-08', site: 'Left arm', notes: 'No adverse reactions' },
      { vaccine: 'Influenza 2024', date: '2024-10-01', batch: 'FL-2024-10', site: 'Right arm', notes: 'Annual flu shot' },
      { vaccine: 'Tdap Booster', date: '2023-05-20', batch: 'TD-2023-05', site: 'Left arm', notes: '10-year booster' }
    ],
    medicalEvents: [
      {
        id: 1,
        date: '2025-06-11',
        type: 'Injury - Minor Cut',
        description: 'Small cut on finger from paper during art class',
        severity: 'Low',
        outcome: 'Returned to class',
        nurseNotes: 'Student handled well, no complications'
      },
      {
        id: 2,
        date: '2025-04-22',
        type: 'Asthma Episode',
        description: 'Mild asthma symptoms during PE class',
        severity: 'Medium',
        outcome: 'Used inhaler, rested in health office',
        nurseNotes: 'Responded well to medication, returned to class after 30 minutes'
      }
    ],
    periodicCheckups: [
      {
        id: 1,
        date: '2024-09-15',
        type: 'Annual Health Checkup',
        results: {
          height: '155 cm',
          weight: '48 kg',
          bmi: '20.0',
          bloodPressure: '110/70',
          vision: '20/20 (L), 20/25 (R)',
          hearing: 'Normal',
          dental: 'Good oral health',
          general: 'Healthy, no concerns'
        },
        abnormalities: [],
        recommendations: 'Continue regular exercise, maintain healthy diet'
      }
    ],
    nurseNotes: [
      {
        id: 1,
        date: '2025-06-11',
        nurse: 'Nurse Johnson',
        note: 'Student is well-informed about allergy management. Carries EpiPen consistently.',
        type: 'General Observation'
      },
      {
        id: 2,
        date: '2025-04-22',
        nurse: 'Nurse Johnson',
        note: 'Parents should consider updating asthma action plan with doctor.',
        type: 'Recommendation'
      }
    ]
  });

  const [activeTab, setActiveTab] = useState('general');

  const TabButton = ({ tabId, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(tabId)}
      className={`px-4 py-2 font-medium text-sm rounded-t-lg border-b-2 ${
        isActive 
          ? 'text-blue-600 border-blue-600 bg-blue-50' 
          : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );

  const InfoCard = ({ title, children, className = "" }) => (
    <div className={`bg-white border rounded-lg shadow-sm p-4 ${className}`}>
      <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
      {children}
    </div>
  );

  const renderGeneralTab = () => (
    <div className="space-y-6">
      {/* Student Basic Info */}
      <InfoCard title="Student Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Name:</strong> {studentData.fullName}</p>
            <p><strong>Student ID:</strong> {studentData.studentCode}</p>
            <p><strong>Class:</strong> {studentData.className}</p>
          </div>
          <div>
            <p><strong>Date of Birth:</strong> {studentData.dateOfBirth}</p>
            <p><strong>Gender:</strong> {studentData.gender}</p>
            <p><strong>Grade:</strong> {studentData.grade}</p>
          </div>
        </div>
      </InfoCard>

      {/* Emergency Contacts */}
      <InfoCard title="Emergency Contacts">
        <div className="space-y-2">
          {studentData.emergencyContacts.map((contact, index) => (
            <div key={index} className={`p-3 rounded border ${contact.primary ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.phone}</p>
                </div>
                {contact.primary && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Primary
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </InfoCard>

      {/* Quick Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <h5 className="font-semibold text-red-800">Allergies</h5>
          <p className="text-red-700">{studentData.parentDeclarations.allergies.length} known allergies</p>
        </div>
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
          <h5 className="font-semibold text-orange-800">Chronic Conditions</h5>
          <p className="text-orange-700">{studentData.parentDeclarations.chronicConditions.length} conditions</p>
        </div>
        <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
          <h5 className="font-semibold text-purple-800">Medications</h5>
          <p className="text-purple-700">{studentData.parentDeclarations.medications.length} medications</p>
        </div>
      </div>
    </div>
  );

  const renderHealthDeclarationTab = () => (
    <div className="space-y-6">
      {/* Allergies */}
      <InfoCard title="Allergies" className="border-red-200">
        {studentData.parentDeclarations.allergies.length > 0 ? (
          <div className="space-y-3">
            {studentData.parentDeclarations.allergies.map((allergy, index) => (
              <div key={index} className="bg-red-50 p-3 rounded border border-red-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-red-800">{allergy.name}</p>
                    <p className="text-sm text-red-600">Severity: {allergy.severity}</p>
                    <p className="text-sm text-gray-600">Symptoms: {allergy.symptoms}</p>
                    {allergy.notes && <p className="text-sm text-gray-700 mt-1">Notes: {allergy.notes}</p>}
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    allergy.severity === 'Severe' ? 'bg-red-100 text-red-800' :
                    allergy.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {allergy.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No known allergies</p>
        )}
      </InfoCard>

      {/* Chronic Conditions */}
      <InfoCard title="Chronic Conditions" className="border-orange-200">
        {studentData.parentDeclarations.chronicConditions.length > 0 ? (
          <div className="space-y-3">
            {studentData.parentDeclarations.chronicConditions.map((condition, index) => (
              <div key={index} className="bg-orange-50 p-3 rounded border border-orange-200">
                <p className="font-medium text-orange-800">{condition.name}</p>
                <p className="text-sm text-orange-600">Severity: {condition.severity}</p>
                <p className="text-sm text-gray-600">Medications: {condition.medications}</p>
                {condition.notes && <p className="text-sm text-gray-700 mt-1">Notes: {condition.notes}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No chronic conditions reported</p>
        )}
      </InfoCard>

      {/* Current Medications */}
      <InfoCard title="Current Medications" className="border-purple-200">
        {studentData.parentDeclarations.medications.length > 0 ? (
          <div className="space-y-3">
            {studentData.parentDeclarations.medications.map((med, index) => (
              <div key={index} className="bg-purple-50 p-3 rounded border border-purple-200">
                <p className="font-medium text-purple-800">{med.name}</p>
                <p className="text-sm text-purple-600">Dosage: {med.dosage} | Frequency: {med.frequency}</p>
                <p className="text-sm text-gray-600">Purpose: {med.purpose}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No medications reported</p>
        )}
      </InfoCard>

      {/* Medical History & Dietary Restrictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard title="Medical History">
          <p className="text-gray-700">{studentData.parentDeclarations.medicalHistory || 'No significant medical history reported'}</p>
        </InfoCard>
        <InfoCard title="Dietary Restrictions">
          <p className="text-gray-700">{studentData.parentDeclarations.dietaryRestrictions || 'No dietary restrictions reported'}</p>
        </InfoCard>
      </div>

      <div className="bg-blue-50 p-4 rounded border border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>Last Updated:</strong> {studentData.parentDeclarations.lastUpdated}
        </p>
      </div>
    </div>
  );

  const renderMedicalEventsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Medical Events History</h3>
        <Link 
          to="/medical/record-event"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
        >
          Record New Event
        </Link>
      </div>

      {studentData.medicalEvents.length > 0 ? (
        <div className="space-y-4">
          {studentData.medicalEvents.map(event => (
            <div key={event.id} className="bg-white border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-800">{event.type}</p>
                  <p className="text-sm text-gray-600">{event.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  event.severity === 'High' ? 'bg-red-100 text-red-800' :
                  event.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {event.severity}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{event.description}</p>
              <p className="text-sm text-gray-600"><strong>Outcome:</strong> {event.outcome}</p>
              <p className="text-sm text-gray-600"><strong>Nurse Notes:</strong> {event.nurseNotes}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded text-center">
          <p className="text-gray-500">No medical events recorded</p>
        </div>
      )}
    </div>
  );

  const renderCheckupsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Periodic Health Checkups</h3>

      {/* Vision & Hearing Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard title="Vision Test Results">
          <p className="text-sm text-gray-600 mb-2">Last Test: {studentData.visionHearing.lastVisionTest}</p>
          <div className="space-y-1">
            <p><strong>Left Eye:</strong> {studentData.visionHearing.visionResults.leftEye}</p>
            <p><strong>Right Eye:</strong> {studentData.visionHearing.visionResults.rightEye}</p>
            <p className="text-sm text-gray-600">Notes: {studentData.visionHearing.visionResults.notes}</p>
          </div>
        </InfoCard>

        <InfoCard title="Hearing Test Results">
          <p className="text-sm text-gray-600 mb-2">Last Test: {studentData.visionHearing.lastHearingTest}</p>
          <div className="space-y-1">
            <p><strong>Left Ear:</strong> {studentData.visionHearing.hearingResults.leftEar}</p>
            <p><strong>Right Ear:</strong> {studentData.visionHearing.hearingResults.rightEar}</p>
            <p className="text-sm text-gray-600">Notes: {studentData.visionHearing.hearingResults.notes}</p>
          </div>
        </InfoCard>
      </div>

      {/* Comprehensive Checkups */}
      {studentData.periodicCheckups.length > 0 ? (
        <div className="space-y-4">
          {studentData.periodicCheckups.map(checkup => (
            <InfoCard key={checkup.id} title={`${checkup.type} - ${checkup.date}`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Height</p>
                  <p className="font-medium">{checkup.results.height}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-medium">{checkup.results.weight}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">BMI</p>
                  <p className="font-medium">{checkup.results.bmi}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Blood Pressure</p>
                  <p className="font-medium">{checkup.results.bloodPressure}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Vision</p>
                  <p className="font-medium">{checkup.results.vision}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hearing</p>
                  <p className="font-medium">{checkup.results.hearing}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dental</p>
                  <p className="font-medium">{checkup.results.dental}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">General Assessment</p>
                <p className="font-medium">{checkup.results.general}</p>
              </div>
              {checkup.recommendations && (
                <div className="mt-4 bg-blue-50 p-3 rounded">
                  <p className="text-sm text-blue-800"><strong>Recommendations:</strong> {checkup.recommendations}</p>
                </div>
              )}
            </InfoCard>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded text-center">
          <p className="text-gray-500">No checkup records available</p>
        </div>
      )}
    </div>
  );

  const renderImmunizationsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Immunization Records</h3>

      {studentData.immunizations.length > 0 ? (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Vaccine</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Site</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studentData.immunizations.map((vaccine, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 font-medium text-gray-900">{vaccine.vaccine}</td>
                  <td className="py-3 px-4 text-gray-600">{vaccine.date}</td>
                  <td className="py-3 px-4 text-gray-600">{vaccine.batch}</td>
                  <td className="py-3 px-4 text-gray-600">{vaccine.site}</td>
                  <td className="py-3 px-4 text-gray-600">{vaccine.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded text-center">
          <p className="text-gray-500">No immunization records available</p>
        </div>
      )}
    </div>
  );

  const renderNurseNotesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Nurse Notes</h3>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm">
          Add New Note
        </button>
      </div>

      {studentData.nurseNotes.length > 0 ? (
        <div className="space-y-4">
          {studentData.nurseNotes.map(note => (
            <div key={note.id} className="bg-white border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-800">{note.type}</p>
                  <p className="text-sm text-gray-600">{note.date} - {note.nurse}</p>
                </div>
              </div>
              <p className="text-gray-700">{note.note}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded text-center">
          <p className="text-gray-500">No nurse notes recorded</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{studentData.fullName}</h1>
          <p className="text-gray-600">Student Health Profile - {studentData.studentCode}</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded">
            Print Profile
          </button>
          <Link 
            to="/medical/student-records" 
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Back to Search
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8 border-b border-gray-200">
          <TabButton tabId="general" label="General Info" isActive={activeTab === 'general'} onClick={setActiveTab} />
          <TabButton tabId="health-declaration" label="Health Declaration" isActive={activeTab === 'health-declaration'} onClick={setActiveTab} />
          <TabButton tabId="medical-events" label="Medical Events" isActive={activeTab === 'medical-events'} onClick={setActiveTab} />
          <TabButton tabId="checkups" label="Checkups" isActive={activeTab === 'checkups'} onClick={setActiveTab} />
          <TabButton tabId="immunizations" label="Immunizations" isActive={activeTab === 'immunizations'} onClick={setActiveTab} />
          <TabButton tabId="nurse-notes" label="Nurse Notes" isActive={activeTab === 'nurse-notes'} onClick={setActiveTab} />
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-screen">
        {activeTab === 'general' && renderGeneralTab()}
        {activeTab === 'health-declaration' && renderHealthDeclarationTab()}
        {activeTab === 'medical-events' && renderMedicalEventsTab()}
        {activeTab === 'checkups' && renderCheckupsTab()}
        {activeTab === 'immunizations' && renderImmunizationsTab()}
        {activeTab === 'nurse-notes' && renderNurseNotesTab()}
      </div>
    </div>
  );
};

export default StudentHealthProfileMedicalPage;

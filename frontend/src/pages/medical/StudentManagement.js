import React, { useState } from 'react';
import { 
  FaSearch, FaUserMd, FaNotesMedical, FaAllergies, FaLungsVirus, FaHistory, 
  FaPlus, FaTimes, FaUserFriends, FaSchool, FaIdCard, FaBirthdayCake, 
  FaVenusMars, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaExclamationTriangle, 
  FaCheckCircle, FaBan, FaUserNurse, FaFileMedicalAlt, 
  FaCalendarAlt, FaStethoscope 
} from 'react-icons/fa';

const StudentManagement = () => {
  const [students] = useState([
    {
      id: 'S001',
      name: 'Michael Johnson',
      grade: '10A',
      class: 'Class 10 - Section A',
      studentId: 'STU-2025-001',
      dateOfBirth: '2008-05-15',
      gender: 'Male',
      email: 'michael.johnson@school.edu',
      phone: '555-0101',
      address: '123 Oak Street, Springfield, IL 62701',
      healthStatus: 'Normal',
      parentDeclared: {
        allergies: ['Peanuts', 'Shellfish'],
        chronicDiseases: ['Mild Asthma'],
        medicalHistory: 'Occasional seasonal allergies. No major surgeries.',
        visionHearing: [
          { test: 'Vision Screening', date: '2024-09-05', leftEye: '20/20', rightEye: '20/25', notes: 'Slight myopia right eye' },
          { test: 'Hearing Test', date: '2024-09-05', leftEar: 'Pass', rightEar: 'Pass', notes: 'Normal hearing' },
        ],
        immunizations: [
          { vaccine: 'MMR', date: '2010-06-01', notes: 'Booster dose' },
          { vaccine: 'Varicella', date: '2010-06-01', notes: '' },
          { vaccine: 'Hepatitis B Series', date: '2009-03-15', notes: 'Completed series' },
          { vaccine: 'Flu Shot', date: '2024-10-15', notes: 'Annual' },
        ],
      },
      medicalEvents: [
        { 
          id: 'ME001', 
          date: '2025-02-10', 
          type: 'Minor Injury', 
          title: 'Scraped Knee', 
          description: 'Fell during recess, scraped left knee.', 
          treatment: 'Cleaned wound, applied antiseptic and bandage.', 
          staffNotified: ['Mr. Harrison (Teacher)'], 
          parentNotified: true, 
          followUp: 'Monitor for infection.'
        },
        { 
          id: 'ME002', 
          date: '2024-11-05', 
          type: 'Illness', 
          title: 'Headache', 
          description: 'Complained of headache after lunch.', 
          treatment: 'Rested in clinic, temperature taken (98.6°F). Parent notified.', 
          staffNotified: [], 
          parentNotified: true, 
          followUp: 'Picked up by parent.'
        },
      ],
      periodicCheckups: [
        { 
          id: 'PC001', 
          date: '2024-09-05', 
          type: 'Annual Physical', 
          height: '160cm', 
          weight: '55kg', 
          bmi: '21.5', 
          visionLeft: '20/20', 
          visionRight: '20/25', 
          hearingLeft: 'Pass', 
          hearingRight: 'Pass', 
          dentalCheck: 'Good', 
          scoliosisScreen: 'Negative', 
          overallStatus: 'Good', 
          abnormalities: 'Slight myopia right eye', 
          recommendedActions: 'Monitor vision, re-check in 1 year.', 
          nurse: 'Nurse Johnson' 
        },
      ],
      nurseNotes: [
        { date: '2025-02-10', note: 'Student was cooperative during first aid for scraped knee.', nurse: 'Nurse Johnson' },
        { date: '2024-09-05', note: 'Annual health check-up completed. Advised on nutrition and importance of wearing glasses for board work.', nurse: 'Nurse Johnson' },
      ],
      emergencyContacts: [
        { name: 'Jane M. Johnson', relationship: 'Mother', phone: '555-0102', email: 'jane.johnson@email.com' },
        { name: 'Robert K. Johnson', relationship: 'Father', phone: '555-0103', email: 'robert.johnson@email.com' }
      ],
    },
    {
      id: 'S002',
      name: 'Emily Davis',
      grade: '11B',
      class: 'Class 11 - Section B',
      studentId: 'STU-2025-002',
      dateOfBirth: '2007-08-22',
      gender: 'Female',
      email: 'emily.davis@school.edu',
      phone: '555-0201',
      address: '456 Pine Avenue, Springfield, IL 62702',
      healthStatus: 'Needs Attention',
      parentDeclared: {
        allergies: ['Lactose Intolerant'],
        chronicDiseases: [],
        medicalHistory: 'No significant medical history.',
        visionHearing: [
          { test: 'Vision Screening', date: '2024-09-10', leftEye: '20/20', rightEye: '20/20', notes: 'Normal vision' },
          { test: 'Hearing Test', date: '2024-09-10', leftEar: 'Pass', rightEar: 'Pass', notes: 'Normal hearing' },
        ],
        immunizations: [
          { vaccine: 'MMR', date: '2009-08-15', notes: 'Initial dose' },
          { vaccine: 'Hepatitis B Series', date: '2008-01-10', notes: 'Completed series' },
          { vaccine: 'Flu Shot', date: '2024-10-20', notes: 'Annual' },
        ],
      },
      medicalEvents: [
        { 
          id: 'ME003', 
          date: '2025-01-15', 
          type: 'Allergic Reaction', 
          title: 'Mild Allergic Reaction', 
          description: 'Experienced mild stomach discomfort after consuming dairy.', 
          treatment: 'Monitored in clinic, given water and rest.', 
          staffNotified: ['Ms. Parker (Teacher)'], 
          parentNotified: true, 
          followUp: 'Reminded about lactose intolerance dietary restrictions.'
        },
      ],
      periodicCheckups: [
        { 
          id: 'PC002', 
          date: '2024-09-10', 
          type: 'Annual Physical', 
          height: '165cm', 
          weight: '58kg', 
          bmi: '21.3', 
          visionLeft: '20/20', 
          visionRight: '20/20', 
          hearingLeft: 'Pass', 
          hearingRight: 'Pass', 
          dentalCheck: 'Good', 
          scoliosisScreen: 'Negative', 
          overallStatus: 'Good', 
          abnormalities: 'None', 
          recommendedActions: 'Continue current health habits.', 
          nurse: 'Nurse Williams' 
        },
      ],
      nurseNotes: [
        { date: '2025-01-15', note: 'Reminded student about carrying lactose-free snacks.', nurse: 'Nurse Williams' },
        { date: '2024-09-10', note: 'Student appears healthy and well-nourished.', nurse: 'Nurse Williams' },
      ],
      emergencyContacts: [
        { name: 'Sarah L. Davis', relationship: 'Mother', phone: '555-0202', email: 'sarah.davis@email.com' },
        { name: 'David M. Davis', relationship: 'Father', phone: '555-0203', email: 'david.davis@email.com' }
      ],
    },
    {
      id: 'S003',
      name: 'David Rodriguez',
      grade: '9C',
      class: 'Class 9 - Section C',
      studentId: 'STU-2025-003',
      dateOfBirth: '2009-03-12',
      gender: 'Male',
      email: 'david.rodriguez@school.edu',
      phone: '555-0301',
      address: '789 Maple Drive, Springfield, IL 62703',
      healthStatus: 'Normal',
      parentDeclared: {
        allergies: [],
        chronicDiseases: [],
        medicalHistory: 'No significant medical history.',
        visionHearing: [
          { test: 'Vision Screening', date: '2024-09-12', leftEye: '20/20', rightEye: '20/20', notes: 'Excellent vision' },
          { test: 'Hearing Test', date: '2024-09-12', leftEar: 'Pass', rightEar: 'Pass', notes: 'Normal hearing' },
        ],
        immunizations: [
          { vaccine: 'MMR', date: '2011-03-01', notes: 'Initial dose' },
          { vaccine: 'Varicella', date: '2011-03-01', notes: '' },
          { vaccine: 'Hepatitis B Series', date: '2010-01-15', notes: 'Completed series' },
          { vaccine: 'Flu Shot', date: '2024-11-01', notes: 'Annual' },
        ],
      },
      medicalEvents: [],
      periodicCheckups: [
        { 
          id: 'PC003', 
          date: '2024-09-12', 
          type: 'Annual Physical', 
          height: '158cm', 
          weight: '52kg', 
          bmi: '20.8', 
          visionLeft: '20/20', 
          visionRight: '20/20', 
          hearingLeft: 'Pass', 
          hearingRight: 'Pass', 
          dentalCheck: 'Excellent', 
          scoliosisScreen: 'Negative', 
          overallStatus: 'Excellent', 
          abnormalities: 'None', 
          recommendedActions: 'Continue regular exercise and healthy diet.', 
          nurse: 'Nurse Johnson' 
        },
      ],
      nurseNotes: [
        { date: '2024-09-12', note: 'Student is in excellent health. Very active and healthy lifestyle.', nurse: 'Nurse Johnson' },
      ],
      emergencyContacts: [
        { name: 'Maria C. Rodriguez', relationship: 'Mother', phone: '555-0302', email: 'maria.rodriguez@email.com' },
        { name: 'Carlos J. Rodriguez', relationship: 'Father', phone: '555-0303', email: 'carlos.rodriguez@email.com' }
      ],
    },
    {
      id: 'S004',
      name: 'Benjamin Davis',
      grade: '11C',
      class: 'Class 11 - Section C',
      studentId: 'STU-2025-004',
      dateOfBirth: '2007-11-28',
      gender: 'Male',
      email: 'benjamin.davis@school.edu',
      phone: '555-0401',
      address: '321 Elm Street, Springfield, IL 62704',
      healthStatus: 'Normal',
      parentDeclared: {
        allergies: ['Environmental allergens (pollen)'],
        chronicDiseases: ['Exercise-induced asthma'],
        medicalHistory: 'Diagnosed with mild asthma in 2019. Well-controlled with inhaler.',
        visionHearing: [
          { test: 'Vision Screening', date: '2024-09-15', leftEye: '20/20', rightEye: '20/20', notes: 'Perfect vision' },
          { test: 'Hearing Test', date: '2024-09-15', leftEar: 'Pass', rightEar: 'Pass', notes: 'Normal hearing' },
        ],
        immunizations: [
          { vaccine: 'MMR', date: '2009-11-01', notes: 'Initial dose' },
          { vaccine: 'Varicella', date: '2009-11-01', notes: '' },
          { vaccine: 'Hepatitis B Series', date: '2008-05-15', notes: 'Completed series' },
          { vaccine: 'Flu Shot', date: '2024-10-10', notes: 'Annual' },
          { vaccine: 'COVID-19', date: '2021-07-15', notes: 'Fully vaccinated' },
        ],
      },
      medicalEvents: [],
      periodicCheckups: [
        { 
          id: 'PC004', 
          date: '2024-09-15', 
          type: 'Sports Physical', 
          height: '175cm', 
          weight: '68kg', 
          bmi: '22.2', 
          visionLeft: '20/20', 
          visionRight: '20/20', 
          hearingLeft: 'Pass', 
          hearingRight: 'Pass', 
          dentalCheck: 'Good', 
          scoliosisScreen: 'Negative',
          overallStatus: 'Good - Cleared for Sports', 
          abnormalities: 'None', 
          recommendedActions: 'Continue asthma management plan for sports activities.', 
          nurse: 'Nurse Martinez' 
        },
      ],
      nurseNotes: [
        { date: '2024-09-15', note: 'Student cleared for all sports activities. Inhaler available in PE office.', nurse: 'Nurse Martinez' },
      ],
      emergencyContacts: [
        { name: 'Michelle A. Davis', relationship: 'Mother', phone: '555-0402', email: 'michelle.davis@email.com' },
        { name: 'Thomas R. Davis', relationship: 'Father', phone: '555-0403', email: 'thomas.davis@email.com' }
      ],
    },
    {
      id: 'S005',
      name: 'Chloe Thompson',
      grade: '6A',
      class: 'Class 6 - Section A',
      studentId: 'STU-2025-005',
      dateOfBirth: '2012-02-14',
      gender: 'Female',
      email: 'chloe.thompson@school.edu',
      phone: '555-0501',
      address: '654 Cedar Lane, Springfield, IL 62705',
      healthStatus: 'Needs Attention',
      parentDeclared: {
        allergies: ['Food coloring (artificial dyes)', 'Dust mites'],
        chronicDiseases: ['Mild ADHD'],
        medicalHistory: 'Recently diagnosed with ADHD. Starting behavioral interventions.',
        visionHearing: [
          { test: 'Vision Screening', date: '2024-09-20', leftEye: '20/30', rightEye: '20/25', notes: 'Slight vision issues, may need glasses' },
          { test: 'Hearing Test', date: '2024-09-20', leftEar: 'Pass', rightEar: 'Pass', notes: 'Normal hearing' },
        ],
        immunizations: [
          { vaccine: 'MMR', date: '2014-02-01', notes: 'Initial dose' },
          { vaccine: 'Varicella', date: '2014-02-01', notes: '' },
          { vaccine: 'Hepatitis B Series', date: '2013-08-15', notes: 'Completed series' },
          { vaccine: 'Flu Shot', date: '2024-10-25', notes: 'Annual' },
        ],
      },
      medicalEvents: [
        { 
          id: 'ME004', 
          date: '2024-12-10', 
          type: 'Behavioral Incident', 
          title: 'Classroom Focus Issues', 
          description: 'Teacher reported difficulty maintaining attention during lessons.', 
          treatment: 'Discussed with school counselor and parents. Implementing classroom accommodations.', 
          staffNotified: ['Ms. Garcia (Teacher)', 'Mr. Smith (Counselor)'], 
          parentNotified: true, 
          followUp: 'Monitor progress with new seating arrangement and break schedule.'
        },
      ],
      periodicCheckups: [
        { 
          id: 'PC005', 
          date: '2024-09-20', 
          type: 'Annual Physical + Vision', 
          height: '145cm', 
          weight: '38kg', 
          bmi: '18.1', 
          visionLeft: '20/30', 
          visionRight: '20/25', 
          hearingLeft: 'Pass', 
          hearingRight: 'Pass', 
          dentalCheck: 'Good', 
          scoliosisScreen: 'Negative',
          overallStatus: 'Good with recommendations', 
          abnormalities: 'Mild vision impairment', 
          recommendedActions: 'Eye exam recommended. Monitor ADHD symptoms and classroom performance.', 
          nurse: 'Nurse Williams' 
        },
      ],
      nurseNotes: [
        { date: '2024-12-10', note: 'Working with parents and teachers on ADHD management strategies. Very cooperative student.', nurse: 'Nurse Williams' },
        { date: '2024-09-20', note: 'Sweet student. Parents very involved and supportive. Recommend vision follow-up.', nurse: 'Nurse Williams' },
      ],
      emergencyContacts: [
        { name: 'Linda K. Thompson', relationship: 'Mother', phone: '555-0502', email: 'linda.thompson@email.com' },
        { name: 'Mark J. Thompson', relationship: 'Father', phone: '555-0503', email: 'mark.thompson@email.com' },
        { name: 'Helen Thompson', relationship: 'Grandmother', phone: '555-0504', email: 'helen.thompson@email.com' }
      ],
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('All');
  const [filterHealthStatus, setFilterHealthStatus] = useState('All');
  const [activeProfileTab, setActiveProfileTab] = useState('general');

  const profileTabs = [
    { name: 'General Info', id: 'general', icon: <FaUserFriends/> },
    { name: 'Parent Declared', id: 'parentDeclared', icon: <FaFileMedicalAlt/> },
    { name: 'Medical Events', id: 'medicalEvents', icon: <FaStethoscope/> },
    { name: 'Check-ups', id: 'periodicCheckups', icon: <FaCalendarAlt/> },
    { name: 'Nurse Notes', id: 'nurseNotes', icon: <FaUserNurse/> },
  ];

  const handleOpenProfile = (student) => {
    setSelectedStudent(student);
    setActiveProfileTab('general');
  };

  const handleCloseProfile = () => {
    setSelectedStudent(null);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.grade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'All' || student.grade === filterGrade;
    const matchesHealthStatus = filterHealthStatus === 'All' || student.healthStatus === filterHealthStatus;
    return matchesSearch && matchesGrade && matchesHealthStatus;
  });

  const getHealthStatusBadge = (status) => {
    switch (status) {
      case 'Normal':
        return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full flex items-center"><FaCheckCircle className="mr-1" /> Normal</span>;
      case 'Needs Attention':
        return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full flex items-center"><FaExclamationTriangle className="mr-1" /> Needs Attention</span>;
      case 'Critical':
        return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full flex items-center"><FaBan className="mr-1" /> Critical</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">{status}</span>;
    }
  };

  const ProfileSection = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">{title}</h3>
      {children}
    </div>
  );

  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3 py-2">
      <div className="text-gray-500 mt-1">{icon}</div>
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-600">{label}:</span>
        <span className="ml-2 text-sm text-gray-800">{value || 'Not specified'}</span>
      </div>
    </div>
  );

  const renderProfileContent = () => {
    if (!selectedStudent) return null;

    switch (activeProfileTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <ProfileSection title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={<FaIdCard />} label="Student ID" value={selectedStudent.studentId} />
                <InfoItem icon={<FaSchool />} label="Grade & Class" value={`${selectedStudent.grade} - ${selectedStudent.class}`} />
                <InfoItem icon={<FaBirthdayCake />} label="Date of Birth" value={new Date(selectedStudent.dateOfBirth).toLocaleDateString()} />
                <InfoItem icon={<FaVenusMars />} label="Gender" value={selectedStudent.gender} />
                <InfoItem icon={<FaPhoneAlt />} label="Phone" value={selectedStudent.phone} />
                <InfoItem icon={<FaEnvelope />} label="Email" value={selectedStudent.email} />
              </div>
              <InfoItem icon={<FaMapMarkerAlt />} label="Address" value={selectedStudent.address} />
            </ProfileSection>

            <ProfileSection title="Emergency Contacts">
              {selectedStudent.emergencyContacts?.map((contact, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoItem icon={<FaUserFriends />} label="Name" value={contact.name} />
                    <InfoItem icon={<FaUserMd />} label="Relationship" value={contact.relationship} />
                    <InfoItem icon={<FaPhoneAlt />} label="Phone" value={contact.phone} />
                  </div>
                  <InfoItem icon={<FaEnvelope />} label="Email" value={contact.email} />
                </div>
              ))}
            </ProfileSection>
          </div>
        );

      case 'parentDeclared':
        return (
          <div className="space-y-6">
            <ProfileSection title="Allergies & Medical Conditions">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
                    <FaAllergies className="mr-2 text-red-500" /> Allergies:
                  </h4>
                  {selectedStudent.parentDeclared?.allergies?.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {selectedStudent.parentDeclared.allergies.map((allergy, index) => (
                        <li key={index}>{allergy}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No known allergies</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
                    <FaLungsVirus className="mr-2 text-blue-500" /> Chronic Diseases:
                  </h4>
                  {selectedStudent.parentDeclared?.chronicDiseases?.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {selectedStudent.parentDeclared.chronicDiseases.map((disease, index) => (
                        <li key={index}>{disease}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No chronic diseases</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-2">Medical History:</h4>
                <p className="text-sm text-gray-700">{selectedStudent.parentDeclared?.medicalHistory || 'No medical history provided'}</p>
              </div>
            </ProfileSection>

            <ProfileSection title="Vision & Hearing Tests">
              {selectedStudent.parentDeclared?.visionHearing?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                      <tr>
                        <th scope="col" className="px-3 py-2">Test Type</th>
                        <th scope="col" className="px-3 py-2">Date</th>
                        <th scope="col" className="px-3 py-2">Left Eye/Ear</th>
                        <th scope="col" className="px-3 py-2">Right Eye/Ear</th>
                        <th scope="col" className="px-3 py-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.parentDeclared.visionHearing.map((test, index) => (
                        <tr key={index} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium text-gray-900">{test.test}</td>
                          <td className="px-3 py-2">{new Date(test.date).toLocaleDateString()}</td>
                          <td className="px-3 py-2">{test.leftEye || test.leftEar}</td>
                          <td className="px-3 py-2">{test.rightEye || test.rightEar}</td>
                          <td className="px-3 py-2">{test.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No vision/hearing test records</p>
              )}
            </ProfileSection>

            <ProfileSection title="Immunizations">
              {selectedStudent.parentDeclared?.immunizations?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                      <tr>
                        <th scope="col" className="px-3 py-2">Vaccine</th>
                        <th scope="col" className="px-3 py-2">Date</th>
                        <th scope="col" className="px-3 py-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.parentDeclared.immunizations.map((vaccine, index) => (
                        <tr key={index} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium text-gray-900">{vaccine.vaccine}</td>
                          <td className="px-3 py-2">{new Date(vaccine.date).toLocaleDateString()}</td>
                          <td className="px-3 py-2">{vaccine.notes || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No immunization records</p>
              )}
            </ProfileSection>
          </div>
        );

      case 'medicalEvents':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Medical Events</h3>
            </div>
            
            {selectedStudent.medicalEvents?.length > 0 ? (
              <div className="space-y-4">
                {selectedStudent.medicalEvents.map((event, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-md font-semibold text-gray-800">{event.title}</h4>
                        <p className="text-sm text-gray-600">{event.type} - {new Date(event.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        event.type === 'Injury' ? 'bg-red-100 text-red-800' :
                        event.type === 'Illness' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Description:</p>
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Treatment:</p>
                        <p className="text-gray-600">{event.treatment}</p>
                      </div>
                    </div>
                    
                    {event.followUp && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="font-medium text-gray-700 text-sm">Follow-up:</p>
                        <p className="text-gray-600 text-sm">{event.followUp}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                      <span>Parent Notified: {event.parentNotified ? 'Yes' : 'No'}</span>
                      {event.staffNotified?.length > 0 && (
                        <span>Staff: {event.staffNotified.join(', ')}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaStethoscope size={48} className="mx-auto mb-4 text-gray-400" />
                <p>No medical events recorded</p>
              </div>
            )}
          </div>
        );

      case 'periodicCheckups':
        return (
          <div className="space-y-6">
            <ProfileSection title="Periodic Health Checkups">
              {selectedStudent.periodicCheckups?.length > 0 ? (
                <div className="space-y-4">
                  {selectedStudent.periodicCheckups.map((checkup, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-md font-semibold text-gray-800">{checkup.type}</h4>
                          <p className="text-sm text-gray-600">{new Date(checkup.date).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          checkup.overallStatus === 'Excellent' ? 'bg-green-100 text-green-800' :
                          checkup.overallStatus === 'Good' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {checkup.overallStatus}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <p className="font-medium text-gray-700">Height:</p>
                          <p className="text-gray-600">{checkup.height}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Weight:</p>
                          <p className="text-gray-600">{checkup.weight}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">BMI:</p>
                          <p className="text-gray-600">{checkup.bmi}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Nurse:</p>
                          <p className="text-gray-600">{checkup.nurse}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <p className="font-medium text-gray-700">Vision L/R:</p>
                          <p className="text-gray-600">{checkup.visionLeft}/{checkup.visionRight}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Hearing L/R:</p>
                          <p className="text-gray-600">{checkup.hearingLeft}/{checkup.hearingRight}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Dental:</p>
                          <p className="text-gray-600">{checkup.dentalCheck}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Scoliosis:</p>
                          <p className="text-gray-600">{checkup.scoliosisScreen}</p>
                        </div>
                      </div>
                      
                      {(checkup.abnormalities || checkup.recommendedActions) && (
                        <div className="pt-4 border-t border-gray-100">
                          {checkup.abnormalities && (
                            <div className="mb-2">
                              <p className="font-medium text-gray-700 text-sm">Abnormalities:</p>
                              <p className="text-gray-600 text-sm">{checkup.abnormalities}</p>
                            </div>
                          )}
                          {checkup.recommendedActions && (
                            <div>
                              <p className="font-medium text-gray-700 text-sm">Recommended Actions:</p>
                              <p className="text-gray-600 text-sm">{checkup.recommendedActions}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaCalendarAlt size={48} className="mx-auto mb-4 text-gray-400" />
                  <p>No periodic checkups recorded</p>
                </div>
              )}
            </ProfileSection>
          </div>
        );

      case 'nurseNotes':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Nurse Notes</h3>
            </div>
            
            {selectedStudent.nurseNotes?.length > 0 ? (
              <div className="space-y-3">
                {selectedStudent.nurseNotes.map((note, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-700">{note.nurse}</span>
                      <span className="text-xs text-gray-500">{new Date(note.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-700">{note.note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaUserNurse size={48} className="mx-auto mb-4 text-gray-400" />
                <p>No nurse notes recorded</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const grades = Array.from(new Set(students.map(s => s.grade))).sort();
  const healthStatuses = ['Normal', 'Needs Attention', 'Critical'];

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaUserFriends className="mr-3 text-blue-600" />
            Student Health Management
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive health records and medical information for students</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="searchStudents" className="block text-sm font-medium text-gray-700 mb-1">Search Students</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="searchStudents"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, ID, or grade..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="filterGrade" className="block text-sm font-medium text-gray-700 mb-1">Filter by Grade</label>
            <select
              id="filterGrade"
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Grades</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="filterHealthStatus" className="block text-sm font-medium text-gray-700 mb-1">Health Status</label>
            <select
              id="filterHealthStatus"
              value={filterHealthStatus}
              onChange={(e) => setFilterHealthStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              {healthStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade & Class</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Checkup</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                          {student.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.grade}</div>
                    <div className="text-sm text-gray-500">{student.class}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.phone}</div>
                    <div className="text-sm text-gray-500">{student.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getHealthStatusBadge(student.healthStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.periodicCheckups?.length > 0 
                      ? new Date(student.periodicCheckups[0].date).toLocaleDateString()
                      : 'No checkups'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleOpenProfile(student)}
                      className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <FaUserFriends size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-xl font-semibold">No students found</p>
                    <p>Try adjusting your search or filter criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-start px-2 py-4 md:items-center">
          <div className="relative bg-gray-50 p-4 sm:p-6 md:p-8 border shadow-2xl rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedStudent.name}</h2>
                  <p className="text-gray-600">{selectedStudent.studentId} • {selectedStudent.grade}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {getHealthStatusBadge(selectedStudent.healthStatus)}
                <button
                  onClick={handleCloseProfile}
                  className="text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-200 rounded-lg p-1">
              {profileTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id)}
                  className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeProfileTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2 hidden sm:inline">{tab.name}</span>
                </button>
              ))}
            </div>

            {/* Profile Content */}
            <div className="overflow-y-auto flex-grow pr-1">
              {renderProfileContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
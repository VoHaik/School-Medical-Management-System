import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  FaPlus, FaEdit, FaTrashAlt, FaSearch, FaFilter, FaHospitalUser, FaEye, FaAssistiveListeningSystems, 
  FaChild, FaBrain, FaTasks, FaCalendarAlt, FaUsers, FaCheckCircle, FaExclamationTriangle, FaChartBar,
  FaFileMedical, FaNotesMedical, FaSyringe, FaUserMd, FaWeight, FaRulerVertical, FaThermometerHalf, FaHeartbeat, FaStethoscope
} from 'react-icons/fa';
import PageHeader from '../../components/PageHeader';

const checkupSchema = yup.object().shape({
  studentId: yup.string().required('Student is required'),
  checkupType: yup.string().required('Checkup type is required'),
  checkupDate: yup.date().required('Checkup date is required').typeError('Invalid date'),
  conductedBy: yup.string().required('Conducted by is required'),
  height: yup.number().positive('Height must be positive').typeError('Invalid height'),
  weight: yup.number().positive('Weight must be positive').typeError('Invalid weight'),
  bmi: yup.number().nullable(),
  bloodPressure: yup.string().matches(/^(\d{2,3}\/\d{2,3})?$/, 'Invalid BP format (e.g., 120/80)').nullable(), // Corrected regex
  heartRate: yup.number().positive('Heart rate must be positive').typeError('Invalid heart rate').nullable(),
  temperature: yup.number().min(35, 'Temp too low').max(43, 'Temp too high').typeError('Invalid temp').nullable(),
  visionLeft: yup.string().nullable(),
  visionRight: yup.string().nullable(),
  hearingLeft: yup.string().nullable(),
  hearingRight: yup.string().nullable(),
  oralHealth: yup.string().nullable(),
  skinCondition: yup.string().nullable(),
  respiratoryHealth: yup.string().nullable(),
  scoliosisCheck: yup.string().nullable(), // Added
  otherObservations: yup.string().nullable(), // Added
  findings: yup.array().of(yup.object().shape({ value: yup.string() })).nullable(),
  recommendations: yup.array().of(yup.object().shape({ value: yup.string() })).nullable(),
  followUpRequired: yup.boolean(),
  followUpDate: yup.date().nullable().typeError('Invalid date'),
  notes: yup.string().nullable(),
  consentObtained: yup.boolean().oneOf([true], 'Consent is required'), // Added
});

const screeningProgramSchema = yup.object().shape({
  programName: yup.string().required('Program name is required'),
  screeningType: yup.string().required('Screening type is required'),
  targetGrades: yup.array().of(yup.string()).min(1, 'At least one grade must be selected').required(),
  startDate: yup.date().required('Start date is required').typeError('Invalid date'),
  endDate: yup.date().required('End date is required').typeError('Invalid date')
    .min(yup.ref('startDate'), "End date can't be before start date"),
  provider: yup.string().required('Healthcare provider is required'),
  description: yup.string().nullable(),
  status: yup.string().oneOf(['planned', 'active', 'completed', 'cancelled']).default('planned'), // Added status
});

const mockStudents = [
  { id: 'S001', name: 'Michael Johnson', grade: '9A', dateOfBirth: '2009-07-12', consentGiven: true },
  { id: 'S002', name: 'Emily Davis', grade: '10B', dateOfBirth: '2008-02-25', consentGiven: false },
  { id: 'S003', name: 'David Rodriguez', grade: '11C', dateOfBirth: '2007-11-08', consentGiven: true },
  { id: 'S004', name: 'Sarah Wilson', grade: '9A', dateOfBirth: '2009-09-01', consentGiven: true },
  { id: 'S005', name: 'Christopher Brown', grade: '12A', dateOfBirth: '2006-04-15', consentGiven: false },
  { id: 'S006', name: 'James Wilson', grade: '10B', dateOfBirth: '2008-01-10', consentGiven: true },
  { id: 'S007', name: 'Isabella Martinez', grade: '8C', dateOfBirth: '2010-06-20', consentGiven: true },
  { id: 'S008', name: 'Alexander Brown', grade: '11A', dateOfBirth: '2007-12-03', consentGiven: false },
  { id: 'S009', name: 'Sophia Johnson', grade: '9B', dateOfBirth: '2009-04-17', consentGiven: true },
  { id: 'S010', name: 'William Garcia', grade: '12B', dateOfBirth: '2006-08-25', consentGiven: true },
];

const mockCheckups = [
  {
    id: 'CHK001',
    studentId: 'S001',
    studentName: 'Michael Johnson',
    grade: '9A',
    checkupType: 'Annual Physical',
    checkupDate: '2025-01-20',
    conductedBy: 'Dr. Evelyn Reed',
    height: 155,
    weight: 48,
    bmi: 20.0,
    bloodPressure: '110/70',
    heartRate: 75,
    temperature: 36.8,
    visionLeft: '20/20',
    visionRight: '20/20',
    hearingLeft: 'Normal',
    hearingRight: 'Normal',
    oralHealth: 'Good, no cavities',
    skinCondition: 'Clear',
    respiratoryHealth: 'Clear to auscultation',
    scoliosisCheck: 'Negative',
    otherObservations: 'Appears well-nourished and active.',
    findings: [{value: 'Healthy development for age'}],
    recommendations: [{value: 'Maintain balanced diet and regular physical activity'}],
    followUpRequired: false,
    notes: 'Student was cooperative during examination.',
    consentObtained: true,
    status: 'completed'  },
  {
    id: 'CHK002',
    studentId: 'S003',
    studentName: 'David Rodriguez',
    grade: '11C',
    checkupType: 'Sports Physical',
    checkupDate: '2025-03-10',
    conductedBy: 'Nurse Alice Faye',
    height: 172,
    weight: 65,
    bmi: 22.0,
    bloodPressure: '118/75',
    heartRate: 68,
    temperature: 37.0,
    visionLeft: '20/25',
    visionRight: '20/20',
    hearingLeft: 'Normal',
    hearingRight: 'Normal',
    oralHealth: 'Good',
    skinCondition: 'Minor acne on face',
    respiratoryHealth: 'Clear',
    scoliosisCheck: 'Negative',
    otherObservations: 'Complains of occasional knee pain after running.',
    findings: [{value: 'Mild myopia, left eye'}, {value: 'Possible patellofemoral pain syndrome'}],
    recommendations: [{value: 'Refer to optometrist for vision check'}, {value: 'Recommend RICE for knee pain, monitor'}],
    followUpRequired: true,
    followUpDate: '2025-04-10',
    notes: 'Provided advice on stretching exercises for knee.',
    consentObtained: true,
    status: 'follow-up-required'
  },
  {
    id: 'CHK003',
    studentId: 'S006',
    studentName: 'James Wilson',
    grade: '10B',
    checkupType: 'Diabetes Management Check',
    checkupDate: '2025-01-15',
    conductedBy: 'Nurse Martinez',
    height: 168,
    weight: 62,
    bmi: 22.0,
    bloodPressure: '125/78',
    heartRate: 78,
    temperature: 36.9,
    visionLeft: '20/20',
    visionRight: '20/20',
    hearingLeft: 'Normal',
    hearingRight: 'Normal',
    oralHealth: 'Good',
    skinCondition: 'Clear',
    respiratoryHealth: 'Clear',
    scoliosisCheck: 'Negative',
    otherObservations: 'Student managing Type 1 diabetes well. Blood glucose levels stable.',
    findings: [{value: 'Good diabetes management'}, {value: 'Normal growth and development'}],
    recommendations: [{value: 'Continue current insulin regimen'}, {value: 'Regular blood glucose monitoring'}],
    followUpRequired: true,
    followUpDate: '2025-04-15',
    notes: 'Student demonstrates excellent self-care with diabetes management.',
    consentObtained: true,
    status: 'completed'
  },
];

const mockPrograms = [
  {
    id: 'PRG001',
    programName: 'Annual School Health Week 2025',
    screeningType: 'Comprehensive',
    targetGrades: ['9', '10', '11', '12'],
    startDate: '2025-09-08',
    endDate: '2025-09-12',
    provider: 'City Health Department & School Nurses',
    description: 'Annual comprehensive health screening including physicals, vision, hearing, and dental checks.',
    status: 'planned',
    totalStudents: 450,
    completedStudents: 0,
    consentFormsSent: 450,
    consentFormsReceived: 0,
  },
  {
    id: 'PRG002',
    programName: 'Grade 9 Vision & Scoliosis Screening',
    screeningType: 'Targeted (Vision, Scoliosis)',
    targetGrades: ['9'],
    startDate: '2025-02-10',
    endDate: '2025-02-14',
    provider: 'Lions Club Volunteers & School Nurse',
    description: 'Targeted screening for early detection of vision problems and scoliosis in 9th graders.',
    status: 'active',
    totalStudents: 120,
    completedStudents: 85,
    consentFormsSent: 120,
    consentFormsReceived: 110,
  },
  {
    id: 'PRG003',
    programName: 'Sports Physical Week',
    screeningType: 'Sports Physical',
    targetGrades: ['10', '11', '12'],
    startDate: '2025-08-15',
    endDate: '2025-08-19',
    provider: 'School Nurses & Sports Medicine Clinic',
    description: 'Pre-season sports physical examinations for all student athletes.',
    status: 'completed',
    totalStudents: 180,
    completedStudents: 175,
    consentFormsSent: 180,
    consentFormsReceived: 178,
  },
];

const HealthCheckups = () => {
  const [activeTab, setActiveTab] = useState('health_records'); // health_records, screening_programs, analytics
  const [checkupModalOpen, setCheckupModalOpen] = useState(false);
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [selectedCheckup, setSelectedCheckup] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [checkups, setCheckups] = useState(mockCheckups);
  const [programs, setPrograms] = useState(mockPrograms);
  const [students, setStudents] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterProgramStatus, setFilterProgramStatus] = useState('all');

  const [currentCheckupStep, setCurrentCheckupStep] = useState(0);

  const { register: registerCheckup, control: controlCheckup, handleSubmit: handleSubmitCheckup, reset: resetCheckup, watch: watchCheckup, formState: { errors: errorsCheckup }, setValue: setCheckupValue } = useForm({
    resolver: yupResolver(checkupSchema),
    defaultValues: {
      findings: [{ value: '' }],
      recommendations: [{ value: '' }],
      followUpRequired: false,
      consentObtained: false,
      checkupDate: new Date().toISOString().split('T')[0], // Default to today
    }
  });

  const { fields: findingFields, append: appendFinding, remove: removeFinding } = useFieldArray({
    control: controlCheckup,
    name: 'findings'
  });

  const { fields: recommendationFields, append: appendRecommendation, remove: removeRecommendation } = useFieldArray({
    control: controlCheckup,
    name: 'recommendations'
  });

  const watchHeight = watchCheckup('height');
  const watchWeight = watchCheckup('weight');

  useEffect(() => {
    if (watchHeight && watchWeight) {
      const heightInMeters = parseFloat(watchHeight) / 100;
      const weightInKg = parseFloat(watchWeight);
      if (heightInMeters > 0 && weightInKg > 0) {
        const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        setCheckupValue('bmi', parseFloat(bmi));
      } else { // Corrected: removed stray backslash
        setCheckupValue('bmi', null);
      }
    } else {
      setCheckupValue('bmi', null);
    }
  }, [watchHeight, watchWeight, setCheckupValue]);

  const { register: registerProgram, handleSubmit: handleSubmitProgram, reset: resetProgram, control: controlProgram, formState: { errors: errorsProgram } } = useForm({
    resolver: yupResolver(screeningProgramSchema),
    defaultValues: {
      targetGrades: [],
      status: 'planned',
      startDate: new Date().toISOString().split('T')[0],
    }
  });

  const handleAddCheckup = () => {
    setSelectedCheckup(null);
    resetCheckup({
      findings: [{ value: '' }],
      recommendations: [{ value: '' }],
      followUpRequired: false,
      consentObtained: false,
      checkupDate: new Date().toISOString().split('T')[0],
      studentId: '', // Clear student selection
    });
    setCurrentCheckupStep(0);
    setCheckupModalOpen(true);
  };

  const handleEditCheckup = (checkup) => {
    setSelectedCheckup(checkup);
    resetCheckup({
        ...checkup,
        checkupDate: checkup.checkupDate ? new Date(checkup.checkupDate).toISOString().split('T')[0] : '',
        followUpDate: checkup.followUpDate ? new Date(checkup.followUpDate).toISOString().split('T')[0] : '',
        findings: checkup.findings && checkup.findings.length > 0 ? checkup.findings : [{value: ''}],
        recommendations: checkup.recommendations && checkup.recommendations.length > 0 ? checkup.recommendations : [{value: ''}],
    });
    setCurrentCheckupStep(0);
    setCheckupModalOpen(true);
  };
  
  const handleDeleteCheckup = (id) => {
    setCheckups(prev => prev.filter(c => c.id !== id));
    // Add API call for deletion here
  };

  const handleAddProgram = () => {
    setSelectedProgram(null);
    resetProgram({
      targetGrades: [],
      status: 'planned',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      programName: '',
      screeningType: '',
      provider: '',
      description: ''
    });
    setProgramModalOpen(true);
  };

  const handleEditProgram = (program) => {
    setSelectedProgram(program);
    resetProgram({
        ...program,
        startDate: program.startDate ? new Date(program.startDate).toISOString().split('T')[0] : '',
        endDate: program.endDate ? new Date(program.endDate).toISOString().split('T')[0] : '',
    });
    setProgramModalOpen(true);
  };

  const handleDeleteProgram = (id) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
    // Add API call for deletion here
  };

  const onCheckupSubmit = (data) => {
    const student = students.find(s => s.id === data.studentId);
    const submissionData = {
        ...data,
        studentName: student ? student.name : 'Unknown Student',
        grade: student ? student.grade : 'N/A',
        bmi: data.bmi ? parseFloat(data.bmi) : null,
        findings: data.findings.filter(f => f.value.trim() !== ''),
        recommendations: data.recommendations.filter(r => r.value.trim() !== ''),
    };

    if (selectedCheckup) {
      setCheckups(prev => prev.map(c => c.id === selectedCheckup.id ? { ...selectedCheckup, ...submissionData } : c));
      // API call to update checkup
    } else {
      setCheckups(prev => [{ ...submissionData, id: `CHK${Date.now()}` }, ...prev]);
      // API call to add new checkup
    }
    setCheckupModalOpen(false);
  };

  const onProgramSubmit = (data) => {
    if (selectedProgram) {
      setPrograms(prev => prev.map(p => p.id === selectedProgram.id ? { ...selectedProgram, ...data } : p));
      // API call to update program
    } else {
      setPrograms(prev => [{ ...data, id: `PRG${Date.now()}`, totalStudents: 0, completedStudents: 0, consentFormsSent:0, consentFormsReceived:0 }, ...prev]);
      // API call to add new program
    }
    setProgramModalOpen(false);
  };
  const filteredCheckups = checkups.filter(checkup => {
    const student = students.find(s => s.id === checkup.studentId);
    const studentName = student?.name?.toLowerCase() || '';
    const studentGrade = student?.grade || '';

    const matchesSearch = studentName.includes(searchTerm.toLowerCase()) ||
                         (checkup.checkupType || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || (checkup.checkupType || '').toLowerCase().replace(' ', '-') === filterType;
    const matchesGradeFilter = filterGrade === 'all' || studentGrade === filterGrade;
    return matchesSearch && matchesType && matchesGradeFilter;
  });

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = (program.programName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (program.screeningType || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterProgramStatus === 'all' || program.status === filterProgramStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusChip = (status) => {
    switch (status) {
      case 'completed': return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Completed</span>;
      case 'follow-up-required': return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Follow-up</span>;
      case 'pending': return <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">Pending</span>;
      case 'planned': return <span className="px-2 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-full">Planned</span>;
      case 'active': return <span className="px-2 py-1 text-xs font-semibold text-teal-800 bg-teal-100 rounded-full">Active</span>;
      case 'cancelled': return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Cancelled</span>;
      default: return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">{status}</span>;
    }
  };

  const getBMICategoryStyle = (bmi) => {
    if (!bmi) return { text: 'N/A', color: 'text-gray-500' };
    if (bmi < 18.5) return { text: `Underweight (${bmi})`, color: 'text-yellow-600 font-semibold' };
    if (bmi < 25) return { text: `Normal (${bmi})`, color: 'text-green-600 font-semibold' };
    if (bmi < 30) return { text: `Overweight (${bmi})`, color: 'text-orange-600 font-semibold' };
    return { text: `Obese (${bmi})`, color: 'text-red-600 font-semibold' };
  };

  const checkupFormSteps = [
    { title: 'Student & Consent', icon: <FaChild className="mr-2" /> },
    { title: 'Basic Info', icon: <FaFileMedical className="mr-2" /> },
    { title: 'Measurements', icon: <FaWeight className="mr-2" /> },
    { title: 'Vital Signs', icon: <FaHeartbeat className="mr-2" /> },
    { title: 'Sensory & Physical', icon: <FaStethoscope className="mr-2" /> },
    { title: 'Findings & Notes', icon: <FaNotesMedical className="mr-2" /> },
  ];

  const nextStep = () => setCurrentCheckupStep(prev => Math.min(prev + 1, checkupFormSteps.length - 1));
  const prevStep = () => setCurrentCheckupStep(prev => Math.max(prev - 1, 0));

  const renderCheckupFormStep = () => {
    const selectedStudentId = watchCheckup('studentId');
    const selectedStudent = students.find(s => s.id === selectedStudentId);

    switch (currentCheckupStep) {
      case 0: // Student & Consent
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">Student</label>
              <select 
                id="studentId" 
                {...registerCheckup('studentId')}
                className={`w-full border p-2 rounded-md shadow-sm ${errorsCheckup.studentId ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>{student.name} ({student.grade})</option>
                ))}
              </select>
              {errorsCheckup.studentId && <p className="text-red-500 text-xs mt-1">{errorsCheckup.studentId.message}</p>}
            </div>
            {selectedStudent && (
                <div className="p-3 bg-indigo-50 rounded-md border border-indigo-200">
                  <p className="text-sm text-indigo-700"><span className="font-semibold">Selected:</span> {selectedStudent.name} ({selectedStudent.grade})</p>
                  <p className="text-sm text-indigo-700"><span className="font-semibold">DOB:</span> {new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</p>
                  <p className={`text-sm ${selectedStudent.consentGiven ? 'text-green-700' : 'text-red-700'}`}>
                    <span className="font-semibold">Parental Consent:</span> {selectedStudent.consentGiven ? 'Obtained' : 'Not Obtained - Cannot Proceed with Full Checkup'}
                  </p>
                </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consent Obtained for this Checkup</label>
              <div className="flex items-center">
                <input type="checkbox" id="consentObtained" {...registerCheckup('consentObtained')} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="consentObtained" className="ml-2 block text-sm text-gray-900">I confirm parental/guardian consent has been obtained.</label>
              </div>
              {errorsCheckup.consentObtained && <p className="text-red-500 text-xs mt-1">{errorsCheckup.consentObtained.message}</p>}
            </div>
          </div>
        );
      case 1: // Basic Info
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="checkupDate" className="block text-sm font-medium text-gray-700 mb-1">Checkup Date</label>
              <input type="date" id="checkupDate" {...registerCheckup('checkupDate')} className={`w-full border p-2 rounded-md shadow-sm ${errorsCheckup.checkupDate ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`} />
              {errorsCheckup.checkupDate && <p className="text-red-500 text-xs mt-1">{errorsCheckup.checkupDate.message}</p>}
            </div>
            <div>
              <label htmlFor="checkupType" className="block text-sm font-medium text-gray-700 mb-1">Checkup Type</label>
              <select id="checkupType" {...registerCheckup('checkupType')} className={`w-full border p-2 rounded-md shadow-sm ${errorsCheckup.checkupType ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}>
                <option value="">Select Type</option>
                <option value="Annual Physical">Annual Physical</option>
                <option value="Sports Physical">Sports Physical</option>
                <option value="Vision Screening">Vision Screening</option>
                <option value="Hearing Screening">Hearing Screening</option>
                <option value="Dental Check">Dental Check</option>
                <option value="Scoliosis Screening">Scoliosis Screening</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Other">Other</option>
              </select>
              {errorsCheckup.checkupType && <p className="text-red-500 text-xs mt-1">{errorsCheckup.checkupType.message}</p>}
            </div>
            <div>
              <label htmlFor="conductedBy" className="block text-sm font-medium text-gray-700 mb-1">Conducted By (Nurse/Doctor)</label>
              <input type="text" id="conductedBy" {...registerCheckup('conductedBy')} placeholder="e.g., Nurse Jane Doe" className={`w-full border p-2 rounded-md shadow-sm ${errorsCheckup.conductedBy ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`} />
              {errorsCheckup.conductedBy && <p className="text-red-500 text-xs mt-1">{errorsCheckup.conductedBy.message}</p>}
            </div>
          </div>
        );
      case 2: // Measurements
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
              <input type="number" step="0.1" id="height" {...registerCheckup('height')} placeholder="e.g., 150.5" className={`w-full border p-2 rounded-md shadow-sm ${errorsCheckup.height ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`} />
              {errorsCheckup.height && <p className="text-red-500 text-xs mt-1">{errorsCheckup.height.message}</p>}
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input type="number" step="0.1" id="weight" {...registerCheckup('weight')} placeholder="e.g., 45.2" className={`w-full border p-2 rounded-md shadow-sm ${errorsCheckup.weight ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`} />
              {errorsCheckup.weight && <p className="text-red-500 text-xs mt-1">{errorsCheckup.weight.message}</p>}
            </div>
            <div>
              <label htmlFor="bmi" className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
              <input type="number" id="bmi" {...registerCheckup('bmi')} readOnly className="w-full border p-2 rounded-md shadow-sm bg-gray-100 cursor-not-allowed focus:outline-none" />
              {watchCheckup('bmi') && <p className={`text-xs mt-1 ${getBMICategoryStyle(watchCheckup('bmi')).color}`}>{getBMICategoryStyle(watchCheckup('bmi')).text}</p>}
            </div>
          </div>
        );
      case 3: // Vital Signs
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="bloodPressure" className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure (e.g., 120/80)</label>
              <input type="text" id="bloodPressure" {...registerCheckup('bloodPressure')} placeholder="e.g., 120/80" className={`w-full border p-2 rounded-md shadow-sm ${errorsCheckup.bloodPressure ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`} />
              {errorsCheckup.bloodPressure && <p className="text-red-500 text-xs mt-1">{errorsCheckup.bloodPressure.message}</p>}
            </div>
            <div>
              <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
              <input type="number" id="heartRate" {...registerCheckup('heartRate')} placeholder="e.g., 72" className={`w-full border p-2 rounded-md shadow-sm ${errorsCheckup.heartRate ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`} />
              {errorsCheckup.heartRate && <p className="text-red-500 text-xs mt-1">{errorsCheckup.heartRate.message}</p>}
            </div>
            <div>
              <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
              <input type="number" step="0.1" id="temperature" {...registerCheckup('temperature')} placeholder="e.g., 36.5" className={`w-full border p-2 rounded-md shadow-sm ${errorsCheckup.temperature ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`} />
              {errorsCheckup.temperature && <p className="text-red-500 text-xs mt-1">{errorsCheckup.temperature.message}</p>}
            </div>
          </div>
        );
      case 4: // Sensory & Physical
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vision (L / R)</label>
                <div className="flex gap-2">
                  <input type="text" {...registerCheckup('visionLeft')} placeholder="Left (e.g., 20/20)" className="w-1/2 border p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                  <input type="text" {...registerCheckup('visionRight')} placeholder="Right (e.g., 20/20)" className="w-1/2 border p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hearing (L / R)</label>
                <div className="flex gap-2">
                  <input type="text" {...registerCheckup('hearingLeft')} placeholder="Left (e.g., Normal)" className="w-1/2 border p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                  <input type="text" {...registerCheckup('hearingRight')} placeholder="Right (e.g., Normal)" className="w-1/2 border p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="oralHealth" className="block text-sm font-medium text-gray-700 mb-1">Oral Health</label>
              <input type="text" id="oralHealth" {...registerCheckup('oralHealth')} placeholder="e.g., Good, no cavities, braces" className="w-full border p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="skinCondition" className="block text-sm font-medium text-gray-700 mb-1">Skin Condition</label>
              <input type="text" id="skinCondition" {...registerCheckup('skinCondition')} placeholder="e.g., Clear, minor rash on arm" className="w-full border p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="respiratoryHealth" className="block text-sm font-medium text-gray-700 mb-1">Respiratory Health</label>
              <input type="text" id="respiratoryHealth" {...registerCheckup('respiratoryHealth')} placeholder="e.g., Clear to auscultation, mild wheeze" className="w-full border p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="scoliosisCheck" className="block text-sm font-medium text-gray-700 mb-1">Scoliosis Check</label>
              <select id="scoliosisCheck" {...registerCheckup('scoliosisCheck')} className="w-full border p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select Result</option>
                <option value="Negative">Negative</option>
                <option value="Positive - Mild">Positive - Mild</option>
                <option value="Positive - Moderate">Positive - Moderate</option>
                <option value="Positive - Severe">Positive - Severe</option>
                <option value="Further Evaluation Needed">Further Evaluation Needed</option>
              </select>
            </div>
             <div>
              <label htmlFor="otherObservations" className="block text-sm font-medium text-gray-700 mb-1">Other Observations/Physical Exam Notes</label>
              <textarea id="otherObservations" {...registerCheckup('otherObservations')} rows="3" placeholder="Note any other relevant physical exam findings..." className="w-full border p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
          </div>
        );
      case 5: // Findings & Notes
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Key Findings</label>
              {findingFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mb-2">
                  <input
                    {...registerCheckup(`findings.${index}.value`)}
                    placeholder="Enter a finding"
                    className="w-full border p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  {findingFields.length > 1 && (
                    <button type="button" onClick={() => removeFinding(index)} className="text-red-500 hover:text-red-700 p-1"><FaTrashAlt /></button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => appendFinding({ value: '' })} className="text-sm text-blue-600 hover:text-blue-800 flex items-center"><FaPlus className="mr-1" /> Add Finding</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recommendations</label>
              {recommendationFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mb-2">
                  <input
                    {...registerCheckup(`recommendations.${index}.value`)}
                    placeholder="Enter a recommendation"
                    className="w-full border p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  {recommendationFields.length > 1 && (
                    <button type="button" onClick={() => removeRecommendation(index)} className="text-red-500 hover:text-red-700 p-1"><FaTrashAlt /></button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => appendRecommendation({ value: '' })} className="text-sm text-blue-600 hover:text-blue-800 flex items-center"><FaPlus className="mr-1" /> Add Recommendation</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Required?</label>
                    <div className="flex items-center">
                        <input type="checkbox" id="followUpRequired" {...registerCheckup('followUpRequired')} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <label htmlFor="followUpRequired" className="ml-2 block text-sm text-gray-900">Yes, follow-up is needed</label>
                    </div>
                </div>
                {watchCheckup('followUpRequired') && (
                    <div>
                        <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700 mb-1">Suggested Follow-up Date</label>
                        <input type="date" id="followUpDate" {...registerCheckup('followUpDate')} className={`w-full border p-2 rounded-md shadow-sm ${errorsCheckup.followUpDate ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`} />
                        {errorsCheckup.followUpDate && <p className="text-red-500 text-xs mt-1">{errorsCheckup.followUpDate.message}</p>}
                    </div>
                )}            </div>            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea id="notes" {...registerCheckup('notes')} rows="3" placeholder="Any other notes or comments..." className="w-full border p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
          </div>
        );      default:
        return null;
    }
  };

  // Calculate statistics for dashboard cards
  const totalCheckups = checkups.length;
  const activeProgramsCount = programs.filter(p => p.status === 'active').length;
  const followUpsRequiredCount = checkups.filter(c => c.followUpRequired).length;
  const overallCompletionRate = students.length > 0 ? Math.round((checkups.filter(c => c.status === 'completed').length / students.length) * 100) : 0;

  const grades = Array.from(new Set(students.map(s => s.grade))).sort();
  const checkupTypes = ['Annual Physical', 'Sports Physical', 'Vision Screening', 'Hearing Screening', 'Dental Check', 'Scoliosis Screening', 'Follow-up', 'Other'];
  const programStatusOptions = ['planned', 'active', 'completed', 'cancelled'];

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">      <PageHeader
        title="Health Checkups & Screening Programs"
        description="Manage student health examinations, screening initiatives, and track overall health metrics."
        icon={FaHospitalUser}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[ 
          { title: 'Total Checkups', value: totalCheckups, icon: <FaFileMedical className="text-blue-500" />, color: 'blue' },
          { title: 'Active Programs', value: activeProgramsCount, icon: <FaTasks className="text-green-500" />, color: 'green' },
          { title: 'Follow-ups Needed', value: followUpsRequiredCount, icon: <FaExclamationTriangle className="text-yellow-500" />, color: 'yellow' },
          { title: 'Completion Rate', value: `${overallCompletionRate}%`, icon: <FaCheckCircle className="text-purple-500" />, color: 'purple' }        ].map(stat => (
          <div key={stat.title} className={`bg-white p-5 rounded-lg shadow-md flex items-center space-x-4 border-l-4 border-${stat.color}-500`}>
            <div className={`p-3 rounded-full bg-${stat.color}-100`}>{stat.icon}</div>
            <div>
              <p className="text-3xl font-semibold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area with Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 px-4 md:px-6" aria-label="Tabs">
            {[ 
              { name: 'Health Records', id: 'health_records', icon: <FaFileMedical /> },
              { name: 'Screening Programs', id: 'screening_programs', icon: <FaTasks /> },
              { name: 'Analytics & Reports', id: 'analytics', icon: <FaChartBar /> }
            ].map(tab => (              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center 
                  ${activeTab === tab.id 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <span className="mr-2">{tab.icon}</span> {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 md:p-6">
          {/* Search and Filter Bar - Common for Records and Programs */} 
          {(activeTab === 'health_records' || activeTab === 'screening_programs') && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-1">
                  <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      id="searchTerm" 
                      placeholder={activeTab === 'health_records' ? 'Search student name, checkup type...' : 'Search program name, type...'}
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {activeTab === 'health_records' && (
                  <>
                    <div>
                      <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
                      <select id="filterType" value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="all">All Types</option>
                        {checkupTypes.map(type => <option key={type.toLowerCase().replace(' ', '-')} value={type.toLowerCase().replace(' ', '-')}>{type}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="filterGrade" className="block text-sm font-medium text-gray-700 mb-1">Filter by Grade</label>
                      <select id="filterGrade" value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="all">All Grades</option>
                        {grades.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'screening_programs' && (
                  <div>
                    <label htmlFor="filterProgramStatus" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                    <select id="filterProgramStatus" value={filterProgramStatus} onChange={(e) => setFilterProgramStatus(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option value="all">All Statuses</option>
                      {programStatusOptions.map(status => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={activeTab === 'health_records' ? handleAddCheckup : handleAddProgram}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
                >
                  <FaPlus className="mr-2" /> {activeTab === 'health_records' ? 'New Health Record' : 'New Screening Program'}
                </button>
              </div>
            </div>
          )}

          {/* Health Records Tab */} 
          {activeTab === 'health_records' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      'Student', 'Type', 'Date', 'Conducted By', 'BMI', 'Vision (L/R)', 'Hearing (L/R)', 'Follow-up', 'Status', 'Actions'
                    ].map(header => (
                      <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCheckups.length > 0 ? filteredCheckups.map((checkup) => {
                    const student = students.find(s => s.id === checkup.studentId);
                    const bmiStyle = getBMICategoryStyle(checkup.bmi);
                    return (
                      <tr key={checkup.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student?.name || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{student?.grade || 'N/A'}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{checkup.checkupType}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{new Date(checkup.checkupDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{checkup.conductedBy}</td>
                        <td className={`px-4 py-3 whitespace-nowrap text-sm ${bmiStyle.color}`}>{bmiStyle.text}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{checkup.visionLeft || '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{checkup.hearingLeft || '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {checkup.followUpRequired ? (
                            <span className="text-yellow-600 font-semibold">Yes {checkup.followUpDate ? `(${new Date(checkup.followUpDate).toLocaleDateString()})` : ''}</span>
                          ) : 'No'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{getStatusChip(checkup.status)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                          <button onClick={() => handleEditCheckup(checkup)} className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100"><FaEdit size={16} /></button>
                          <button onClick={() => handleDeleteCheckup(checkup.id)} className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"><FaTrashAlt size={16} /></button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan="10" className="text-center py-10 text-gray-500"><FaHospitalUser size={32} className="mx-auto mb-2 text-gray-400" /><p>No health records found. Try adjusting filters or add a new record.</p></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Screening Programs Tab */} 
          {activeTab === 'screening_programs' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      'Program Name', 'Type', 'Target Grades', 'Dates (Start-End)', 'Provider', 'Status', 'Progress', 'Actions'
                    ].map(header => (
                      <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPrograms.length > 0 ? filteredPrograms.map((program) => (
                    <tr key={program.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{program.programName}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs" title={program.description}>{program.description}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{program.screeningType}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{program.targetGrades.join(', ')}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{program.provider}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{getStatusChip(program.status)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {program.totalStudents > 0 ? `${Math.round((program.completedStudents / program.totalStudents) * 100)}%` : 'N/A'}
                        <div className="text-xs text-gray-500">({program.completedStudents}/{program.totalStudents} students)</div>
                        <div className="text-xs text-gray-500 mt-1"><span className="font-semibold">Consent:</span> {program.consentFormsReceived}/{program.consentFormsSent} received</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                        <button onClick={() => handleEditProgram(program)} className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100"><FaEdit size={16} /></button>
                        <button onClick={() => handleDeleteProgram(program.id)} className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"><FaTrashAlt size={16} /></button>
                        {/* Add more actions like view details, manage participants etc. */}
                      </td>
                    </tr>
                  )) : (
                     <tr><td colSpan="8" className="text-center py-10 text-gray-500"><FaTasks size={32} className="mx-auto mb-2 text-gray-400" /><p>No screening programs found. Try adjusting filters or add a new program.</p></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Analytics Tab */} 
          {activeTab === 'analytics' && (
            <div className="text-center py-10">
              <FaChartBar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">Analytics & Reports</h3>
              <p className="text-gray-500">This section will display charts and summaries of health data.</p>
              <p className="text-sm text-gray-400 mt-2">(Feature under development)</p>
            </div>
          )}
        </div>
      </div>

      {/* Health Checkup Modal */}
      {checkupModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                {checkupFormSteps[currentCheckupStep].icon}
                {selectedCheckup ? 'Edit Health Record' : 'Add New Health Record'} - <span className="text-blue-600 ml-2">{checkupFormSteps[currentCheckupStep].title}</span>
              </h3>
              <button onClick={() => setCheckupModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={handleSubmitCheckup(onCheckupSubmit)}>
              <div className="p-5 space-y-6" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {/* Stepper Indicator */}
                <div className="mb-6">
                  <ol className="flex items-center w-full">
                    {checkupFormSteps.map((step, index) => (
                      <li key={index} className={`flex w-full items-center ${index < checkupFormSteps.length -1 ? "after:content-[\'\'] after:w-full after:h-1 after:border-b after:border-gray-300 after:border-1 after:inline-block" : ""} ${index <= currentCheckupStep ? 'text-blue-600 dark:text-blue-500 after:border-blue-600': 'text-gray-500 after:border-gray-300'}`}>
                        <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${index <= currentCheckupStep ? 'bg-blue-100' : 'bg-gray-100'}`}>
                          {React.cloneElement(step.icon, {size: 20})}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
                {renderCheckupFormStep()}
              </div>
              <div className="flex justify-between items-center p-5 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={prevStep} 
                  disabled={currentCheckupStep === 0}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div>
                  <button type="button" onClick={() => setCheckupModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-2">
                    Cancel
                  </button>
                  {currentCheckupStep < checkupFormSteps.length - 1 ? (
                    <button 
                      type="button" 
                      onClick={nextStep} 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Next
                    </button>
                  ) : (
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
                      <FaCheckCircle className="mr-2" /> {selectedCheckup ? 'Update Record' : 'Save Record'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Screening Program Modal */}
      {programModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                {selectedProgram ? 'Edit Screening Program' : 'Add New Screening Program'}
              </h3>
              <button onClick={() => setProgramModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={handleSubmitProgram(onProgramSubmit)}>
              <div className="p-5 space-y-6">
                <div>
                  <label htmlFor="programName" className="block text-sm font-medium text-gray-700 mb-1">Program Name</label>
                  <input type="text" id="programName" {...registerProgram('programName')} className={`w-full border p-2 rounded-md shadow-sm ${errorsProgram.programName ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`} />
                  {errorsProgram.programName && <p className="text-red-500 text-xs mt-1">{errorsProgram.programName.message}</p>}
                </div>
                <div>
                  <label htmlFor="screeningType" className="block text-sm font-medium text-gray-700 mb-1">Screening Type</label>
                  <input type="text" id="screeningType" {...registerProgram('screeningType')} className={`w-full border p-2 rounded-md shadow-sm ${errorsProgram.screeningType ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`} />
                  {errorsProgram.screeningType && <p className="text-red-500 text-xs mt-1">{errorsProgram.screeningType.message}</p>}
                </div>
                <div>
                  <label htmlFor="targetGrades" className="block text-sm font-medium text-gray-700 mb-1">Target Grades</label>
                  <select id="targetGrades" {...registerProgram('targetGrades')} multiple className={`w-full border p-2 rounded-md shadow-sm ${errorsProgram.targetGrades ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                  {errorsProgram.targetGrades && <p className="text-red-500 text-xs mt-1">{errorsProgram.targetGrades.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input type="date" id="startDate" {...registerProgram('startDate')} className={`w-full border p-2 rounded-md shadow-sm ${errorsProgram.startDate ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`} />
                    {errorsProgram.startDate && <p className="text-red-500 text-xs mt-1">{errorsProgram.startDate.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input type="date" id="endDate" {...registerProgram('endDate')} className={`w-full border p-2 rounded-md shadow-sm ${errorsProgram.endDate ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`} />
                    {errorsProgram.endDate && <p className="text-red-500 text-xs mt-1">{errorsProgram.endDate.message}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">Healthcare Provider</label>
                  <input type="text" id="provider" {...registerProgram('provider')} className={`w-full border p-2 rounded-md shadow-sm ${errorsProgram.provider ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`} />
                  {errorsProgram.provider && <p className="text-red-500 text-xs mt-1">{errorsProgram.provider.message}</p>}
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea id="description" {...registerProgram('description')} rows="3" className={`w-full border p-2 rounded-md shadow-sm ${errorsProgram.description ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`} placeholder="Brief description of the program..."></textarea>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select id="status" {...registerProgram('status')} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end p-5 border-t border-gray-200">
                <button type="button" onClick={() => setProgramModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-2">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
                  <FaCheckCircle className="mr-2" /> {selectedProgram ? 'Update Program' : 'Save Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCheckups;
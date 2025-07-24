import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAlert } from '../../hooks/useAlert'; // Import useAlert hook
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  Grid,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tab,
  Tabs,
  Badge,
  Tooltip,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Pagination,
  TablePagination
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Vaccines as VaccinesIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  EventAvailable as EventAvailableIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import {
  getAllVaccinationRecords,
  getVaccinationStatistics,
  getVaccinationRecordsByStatus,
  createVaccinationRecord,
  updateVaccinationRecord,
  deleteVaccinationRecord,
  getAllStudents
} from '../../utils/api';
import PageHeader from '../../components/PageHeader';

const vaccinationUpdateSchema = yup.object().shape({
  nextDueDate: yup.date().required('Next due date is required'),
  dose: yup.string().required('Dose is required'),
  vaccineName: yup.string().required('Vaccine name is required'),
  reactions: yup.array().of(yup.string()).min(1, 'At least one reaction status is required'),
  notes: yup.string().required('Notes are required'),
  vaccinationStatus: yup.string().required('Status is required')
});

const vaccinationRecordSchema = yup.object().shape({
  studentId: yup.string().required('Student is required'),
  vaccineType: yup.string().required('Vaccine type is required'),
  vaccineName: yup.string().required('Vaccine name is required'),
  administeredDate: yup.date().required('Administration date is required'),
  administeredBy: yup.string().required('Administered by is required'),
  dose: yup.string().required('Dose is required'),
  nextDueDate: yup.date(),
  reactions: yup.array().of(yup.string()),
  notes: yup.string(),
  consentGiven: yup.boolean().oneOf([true], 'Parent consent is required')
});

const vaccinationCampaignSchema = yup.object().shape({
  campaignName: yup.string().required('Campaign name is required'),
  vaccineType: yup.string().required('Vaccine type is required'),
  targetGrades: yup.array().of(yup.number()).min(1, 'At least one grade must be selected'),
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date().required('End date is required'),
  venue: yup.string().required('Venue is required'),
  provider: yup.string().required('Healthcare provider is required'),
  description: yup.string()
});

function VaccinationManagement() {
  const { successAlert, errorAlert, deleteConfirm } = useAlert(); // Initialize useAlert hook
  // Administration site options
  const administrationSiteOptions = [
    'Left Arm',
    'Right Arm',
    'Left Thigh',
    'Right Thigh',
    'Left Buttock',
    'Right Buttock',
    'Oral',
    'Nasal',
    'Other'
  ];

  const [activeTab, setActiveTab] = useState(0);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedUpdateRecord, setSelectedUpdateRecord] = useState(null);
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [students, setStudents] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [gradeLevels, setGradeLevels] = useState([]); // Add state for grade levels
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [statistics, setStatistics] = useState({
    totalVaccinations: 0,
    completedCount: 0,
    scheduledCount: 0,
    missedCount: 0,
    activeCampaigns: 0,
    totalStudents: 0,
    studentsWithVaccinations: 0,
    vaccinationRate: 0,
    studentCoverage: 0
  });

  // Pagination state
  const [page, setPage] = useState(0);

  const recordForm = useForm({
    resolver: yupResolver(vaccinationRecordSchema),
    defaultValues: {
      reactions: [],
      consentGiven: false
    }
  });

  const campaignForm = useForm({
    resolver: yupResolver(vaccinationCampaignSchema),
    defaultValues: {
      targetGrades: []
    }
  });

  const updateForm = useForm({
    resolver: yupResolver(vaccinationUpdateSchema),
    defaultValues: {
      reactions: [],
      vaccinationStatus: 'COMPLETED',
      dose: '',
      notes: '',
      nextDueDate: ''
    }
  });

  const { fields: reactionFields, append: appendReaction, remove: removeReaction } = useFieldArray({
    control: recordForm.control,
    name: 'reactions'
  });

  const { fields: updateReactionFields, append: appendUpdateReaction, remove: removeUpdateReaction } = useFieldArray({
    control: updateForm.control,
    name: 'reactions'
  });

  useEffect(() => {
    // Load data in proper order - students first, then vaccination records
    const loadData = async () => {
      await fetchStudents();
      await fetchVaccines();
      await fetchGradeLevels();
      await fetchCampaigns();
      await fetchStatistics();
    };
    
    loadData();
  }, []);

  // Refetch vaccination records when students are updated to ensure proper name mapping
  useEffect(() => {
    if (students.length > 0) {
      const loadVaccinationData = async () => {
        await fetchVaccinationRecords();
      };
      loadVaccinationData();
    }
  }, [students.length]); // Use students.length instead of students array to prevent infinite loop

  const fetchVaccinationRecords = async () => {
    try {
      const records = await getAllVaccinationRecords();
      if (records && Array.isArray(records)) {
        // Transform API data to match UI format and handle grouped vaccines
        const transformedRecords = records.map(record => {
          // Find matching student from students list for consistent display
          const matchingStudent = students.find(s => 
            s.id === record.student?.studentCode || 
            s.originalData?.studentId === record.student?.studentId
          );
          
          return {
            id: record.vaccinationRecordId,
            studentId: record.student?.studentCode || 'Unknown ID',
            studentName: matchingStudent?.name || record.student?.fullName || 'Unknown Student',
            grade: matchingStudent?.grade || record.student?.gradeLevel?.gradeName || 'N/A',
            vaccineType: record.healthEvent?.eventType || 'VACCINATION',
            // Handle both grouped vaccine names and individual vaccine name
            vaccineNames: record.vaccineNames || [], // Array of vaccine names for this event
            vaccineName: record.vaccineNames && record.vaccineNames.length > 0 
              ? record.vaccineNames.join(', ') 
              : record.vaccineName || record.healthEvent?.description || 'Unknown Vaccine',
            vaccineCount: record.vaccineCount || (record.vaccineNames ? record.vaccineNames.length : 1),
            isMultiVaccine: record.isMultiVaccine || (record.vaccineNames && record.vaccineNames.length > 1),
            individualVaccines: record.individualVaccines || [], // Individual vaccine details for each vaccine
            eventId: record.healthEvent?.eventId,
            eventName: record.healthEvent?.eventName || 'Vaccination Event',
            administeredDate: record.vaccinationDate || record.scheduledDate,
            administeredBy: record.administeredBy || 'TBD',
            dose: 'Standard', // Not stored in backend model
            nextDueDate: record.nextDueDate,
            reactions: record.adverseReactions ? record.adverseReactions.split(',').filter(r => r.trim()) : [],
            notes: record.notes || '',
            status: record.vaccinationStatus?.toLowerCase() || 'scheduled',
            consentStatus: record.consentStatus || 'PENDING',
            consentDate: record.consentDate || record.consentReceivedDate,
            scheduledDate: record.scheduledDate
          };
        });
        
        setVaccinationRecords(transformedRecords);
        
        // Update statistics based on loaded records
        fetchStatistics();
      } else {
        setVaccinationRecords([]);
      }
    } catch (error) {
      console.error('Error fetching vaccination records:', error);
      // Keep mock data as fallback if API fails
      setVaccinationRecords([
        {
          id: '1',
          studentId: 'S001',
          studentName: 'Võ Đồng Đức Khải',
          grade: '9A',
          vaccineType: 'VACCINATION',
          vaccineNames: ['BCG Vaccine', 'DPT Vaccine', 'Measles Vaccine', 'Japanese Encephalitis Vaccine'],
          vaccineName: 'BCG Vaccine, DPT Vaccine, Measles Vaccine, Japanese Encephalitis Vaccine',
          vaccineCount: 4,
          isMultiVaccine: true,
          eventName: 'Annual Vaccination Campaign 2025',
          healthEvent: {
            eventId: 35,
            eventName: 'Annual Vaccination Campaign 2025',
            eventType: 'VACCINATION'
          },
          individualVaccines: [
            { vaccineName: 'BCG Vaccine' },
            { vaccineName: 'DPT Vaccine' },
            { vaccineName: 'Measles Vaccine' },
            { vaccineName: 'Japanese Encephalitis Vaccine' }
          ],
          administeredDate: '2025-04-07',
          dose: 'Standard',
          nextDueDate: null,
          reactions: [],
          status: 'scheduled',
          consentStatus: 'APPROVED',
          consentDate: '2025-04-07'
        },
        {
          id: '2',
          studentId: 'S002',
          studentName: 'Nguyễn Thị Mai',
          grade: '9B',
          vaccineType: 'VACCINATION',
          vaccineNames: ['Hepatitis B Vaccine'],
          vaccineName: 'Hepatitis B Vaccine',
          vaccineCount: 1,
          isMultiVaccine: false,
          eventName: 'Hepatitis B Campaign',
          administeredDate: '2025-04-10',
          dose: 'Standard',
          nextDueDate: null,
          reactions: [],
          status: 'completed',
          consentStatus: 'APPROVED',
          consentDate: '2025-04-08'
        }
      ]);
    }
  };

  const fetchCampaigns = async () => {
    try {
      // Mock data - replace with actual API call
      setCampaigns([
        {
          id: '1',
          campaignName: 'COVID-19 Booster Campaign',
          vaccineType: 'COVID-19',
          targetGrades: ['10', '11', '12'],
          startDate: '2024-02-01',
          endDate: '2024-02-15',
          venue: 'School Auditorium',
          provider: 'City Health Department',
          description: 'Annual COVID-19 booster vaccination',
          status: 'active',
          totalStudents: 450,
          completedStudents: 320
        },
        {
          id: '2',
          campaignName: 'HPV Vaccination Program',
          vaccineType: 'HPV',
          targetGrades: ['9'],
          startDate: '2024-01-15',
          endDate: '2024-01-30',
          venue: 'Health Office',
          provider: 'Regional Health Service',
          description: 'HPV vaccination for grade 9 students',
          status: 'completed',
          totalStudents: 150,
          completedStudents: 142
        }
      ]);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      if (data && Array.isArray(data)) {
        // Transform API data to match UI expectations
        const transformedStudents = data.map(student => ({
          id: student.studentCode || student.studentId || student.username,
          name: student.fullName || `${student.firstName} ${student.lastName}`.trim(),
          grade: student.gradeLevel?.gradeName || student.className || 'N/A',
          dateOfBirth: student.dateOfBirth,
          // Keep original student data for reference
          originalData: student
        }));
        setStudents(transformedStudents);
      } else {
        console.error('Invalid student data received');
        // Fallback to realistic Vietnamese mock data if API fails
        setStudents([
          { id: 'S001', name: 'Võ Đồng Đức Khải', grade: '9A', dateOfBirth: '2008-05-15' },
          { id: 'S002', name: 'Nguyễn Thị Mai', grade: '9B', dateOfBirth: '2009-03-20' },
          { id: 'S003', name: 'Trần Văn An', grade: '10A', dateOfBirth: '2007-08-10' },
          { id: 'S004', name: 'Lê Thị Hương', grade: '10B', dateOfBirth: '2007-12-25' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      // Fallback to realistic Vietnamese mock data if API fails
      setStudents([
        { id: 'S001', name: 'Võ Đồng Đức Khải', grade: '9A', dateOfBirth: '2008-05-15' },
        { id: 'S002', name: 'Nguyễn Thị Mai', grade: '9B', dateOfBirth: '2009-03-20' },
        { id: 'S003', name: 'Trần Văn An', grade: '10A', dateOfBirth: '2007-08-10' },
        { id: 'S004', name: 'Lê Thị Hương', grade: '10B', dateOfBirth: '2007-12-25' }
      ]);
    }
  };

  const fetchVaccines = async () => {
    try {
      // Mock data - replace with actual API call
      setVaccines([
        { type: 'COVID-19', names: ['Pfizer-BioNTech', 'Moderna', 'AstraZeneca'] },
        { type: 'Influenza', names: ['Flu Shot 2024', 'FluMist'] },
        { type: 'HPV', names: ['Gardasil', 'Cervarix'] },
        { type: 'Hepatitis B', names: ['Engerix-B', 'Recombivax HB'] },
        { type: 'MMR', names: ['M-M-R II', 'Priorix'] }
      ]);
    } catch (error) {
      console.error('Error fetching vaccines:', error);
    }
  };

  // Add function to fetch grade levels
  const fetchGradeLevels = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/grade-levels/for-selection', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setGradeLevels(data);
      } else {
        console.error('Failed to fetch grade levels');
        // Fallback to mock data if API fails
        setGradeLevels([
          { gradeId: 1, gradeName: 'Grade 1', isActive: true },
          { gradeId: 2, gradeName: 'Grade 2', isActive: true },
          { gradeId: 3, gradeName: 'Grade 3', isActive: true },
          { gradeId: 4, gradeName: 'Grade 4', isActive: true },
          { gradeId: 5, gradeName: 'Grade 5', isActive: true },
          { gradeId: 6, gradeName: 'Grade 6', isActive: true },
          { gradeId: 7, gradeName: 'Grade 7', isActive: true },
          { gradeId: 8, gradeName: 'Grade 8', isActive: true },
          { gradeId: 9, gradeName: 'Grade 9', isActive: true },
          { gradeId: 10, gradeName: 'Grade 10', isActive: true },
          { gradeId: 11, gradeName: 'Grade 11', isActive: true },
          { gradeId: 12, gradeName: 'Grade 12', isActive: true }
        ]);
      }
    } catch (error) {
      console.error('Error fetching grade levels:', error);
      // Fallback to mock data
      setGradeLevels([
        { gradeId: 1, gradeName: 'Grade 1', isActive: true },
        { gradeId: 2, gradeName: 'Grade 2', isActive: true },
        { gradeId: 3, gradeName: 'Grade 3', isActive: true },
        { gradeId: 4, gradeName: 'Grade 4', isActive: true },
        { gradeId: 5, gradeName: 'Grade 5', isActive: true },
        { gradeId: 6, gradeName: 'Grade 6', isActive: true },
        { gradeId: 7, gradeName: 'Grade 7', isActive: true },
        { gradeId: 8, gradeName: 'Grade 8', isActive: true },
        { gradeId: 9, gradeName: 'Grade 9', isActive: true },
        { gradeId: 10, gradeName: 'Grade 10', isActive: true },
        { gradeId: 11, gradeName: 'Grade 11', isActive: true },
        { gradeId: 12, gradeName: 'Grade 12', isActive: true }
      ]);
    }
  };

  // Add function to fetch statistics
  const fetchStatistics = async () => {
    try {
      const stats = await getVaccinationStatistics();
      
      if (stats) {
        setStatistics({
          totalVaccinations: stats.totalVaccinations || 0,
          completedCount: stats.completedCount || 0,
          scheduledCount: stats.scheduledCount || 0,
          missedCount: stats.missedCount || 0,
          activeCampaigns: stats.activeCampaigns || 0,
          totalStudents: stats.totalStudents || 0,
          studentsWithVaccinations: stats.studentsWithVaccinations || 0,
          vaccinationRate: stats.vaccinationRate || 0,
          studentCoverage: stats.studentCoverage || 0
        });
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Keep default values if API fails
      const completedRecords = vaccinationRecords.filter(r => r.status === 'completed').length;
      const scheduledRecords = vaccinationRecords.filter(r => r.status === 'scheduled').length;
      const totalRecords = vaccinationRecords.length;
      
      setStatistics({
        totalVaccinations: totalRecords,
        completedCount: completedRecords,
        scheduledCount: scheduledRecords,
        missedCount: 0,
        activeCampaigns: campaigns.filter(c => c.status === 'active').length,
        totalStudents: students.length || 0,
        studentsWithVaccinations: new Set(vaccinationRecords.map(r => r.studentId)).size,
        vaccinationRate: totalRecords > 0 ? Math.round((completedRecords / totalRecords) * 100) : 0,
        studentCoverage: students.length > 0 ? Math.round((new Set(vaccinationRecords.map(r => r.studentId)).size / students.length) * 100) : 0
      });
    }
  };

  const handleAddRecord = () => {
    setSelectedRecord(null);
    recordForm.reset();
    setRecordDialogOpen(true);
  };

  const handleEditRecord = (record) => {
    setSelectedRecord(record);
    recordForm.reset(record);
    setRecordDialogOpen(true);
  };

  const handleAddCampaign = () => {
    setSelectedCampaign(null);
    campaignForm.reset();
    setCampaignDialogOpen(true);
  };

  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    campaignForm.reset(campaign);
    setCampaignDialogOpen(true);
  };

  const handleUpdateVaccination = (record) => {
    setSelectedUpdateRecord(record);
    
    // Parse existing reactions if they exist
    const existingReactions = record.adverseReactions 
      ? record.adverseReactions.split(',').map(r => r.trim()).filter(r => r)
      : ['None']; // Default to 'None' if no reactions recorded
    
    updateForm.reset({
      nextDueDate: record.nextDueDate ? new Date(record.nextDueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      dose: record.dose || '1st dose',
      vaccineName: record.vaccineName || '',
      reactions: existingReactions,
      notes: record.notes || 'No additional notes',
      vaccinationStatus: record.status || 'COMPLETED'
    });
    setUpdateDialogOpen(true);
  };

  const handleDeleteVaccination = async (record) => {
    const confirmed = await deleteConfirm(`Are you sure you want to delete the vaccination record for ${record.studentName}?`);
    if (confirmed) {
      try {
        await deleteVaccinationRecord(record.id);
        // Refresh the vaccination records list
        await fetchVaccinationRecords();
        successAlert('Vaccination record deleted successfully');
        } catch (error) {
        console.error('Error deleting vaccination record:', error);
        // Show error message (optional - you can add a snackbar/toast)
        errorAlert('Failed to delete vaccination record. Please try again.');
      }
    }
  };

  const onRecordSubmit = async (data) => {
    try {
      setRecordDialogOpen(false);
      fetchVaccinationRecords();
    } catch (error) {
      console.error('Error saving vaccination record:', error);
    }
  };

  const onUpdateSubmit = async (data) => {
    try {
      
      // Transform data to match backend API format
      const updateData = {
        vaccinationStatus: data.vaccinationStatus,
        vaccinationDate: new Date().toISOString().split('T')[0], // Auto-set to today's date
        nextDueDate: data.nextDueDate,
        dose: data.dose,
        vaccineName: data.vaccineName,
        adverseReactions: data.reactions.join(', '),
        notes: data.notes
      };

      await updateVaccinationRecord(selectedUpdateRecord.id, updateData);
      
      setUpdateDialogOpen(false);
      await fetchVaccinationRecords(); // Refresh the list
    } catch (error) {
      console.error('Error updating vaccination record:', error);
    }
  };

  const onCampaignSubmit = async (data) => {
    try {
      setCampaignDialogOpen(false);
      fetchCampaigns();
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  const filteredRecords = vaccinationRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.vaccineType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesGrade = filterGrade === 'all' || record.grade.includes(filterGrade);
    return matchesSearch && matchesStatus && matchesGrade;
  });

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.vaccineType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'primary';
      case 'scheduled': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getConsentStatusColor = (consentStatus) => {
    switch (consentStatus) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'PENDING': return 'warning';
      default: return 'default';
    }
  };

  const getCompletionPercentage = (completed, total) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Vaccination Management"
        subtitle="Manage student vaccinations and vaccination campaigns"
        icon={<VaccinesIcon />}
      />

      {/* Statistics Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent className="text-center">
              <VaccinesIcon className="text-4xl text-blue-500 mb-2" />
              <Typography variant="h4">{statistics.completedCount || 0}</Typography>
              <Typography color="textSecondary">Completed Vaccinations</Typography>
              <Typography variant="caption" color="textSecondary">
                {statistics.totalVaccinations || 0} total records
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent className="text-center">
              <ScheduleIcon className="text-4xl text-green-500 mb-2" />
              <Typography variant="h4">{statistics.scheduledCount || 0}</Typography>
              <Typography color="textSecondary">Scheduled Vaccinations</Typography>
              <Typography variant="caption" color="textSecondary">
                {statistics.activeCampaigns || 0} active campaigns
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent className="text-center">
              <GroupIcon className="text-4xl text-purple-500 mb-2" />
              <Typography variant="h4">{statistics.studentsWithVaccinations || 0}</Typography>
              <Typography color="textSecondary">Students with Records</Typography>
              <Typography variant="caption" color="textSecondary">
                {statistics.totalStudents || 0} total students
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent className="text-center">
              <CheckCircleIcon className="text-4xl text-orange-500 mb-2" />
              <Typography variant="h4">{statistics.vaccinationRate || 0}%</Typography>
              <Typography color="textSecondary">Completion Rate</Typography>
              <Typography variant="caption" color="textSecondary">
                {statistics.studentCoverage || 0}% student coverage
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Vaccination Records" />
            <Tab label="Campaigns" />
            <Tab label="Schedule" />
            <Tab label="Reports" />
          </Tabs>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <Box className="flex gap-4 mb-4">
            <TextField
              placeholder="Search records or campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon className="mr-2 text-gray-500" />
              }}
              className="flex-1"
            />
            {activeTab === 0 && (
              <>
                <FormControl className="min-w-32">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Status"
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className="min-w-32">
                  <InputLabel>Grade</InputLabel>
                  <Select
                    value={filterGrade}
                    label="Grade"
                    onChange={(e) => setFilterGrade(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="9">Grade 9</MenuItem>
                    <MenuItem value="10">Grade 10</MenuItem>
                    <MenuItem value="11">Grade 11</MenuItem>
                    <MenuItem value="12">Grade 12</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          </Box>

          {/* Tab Content */}
          {activeTab === 0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Vaccine</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Consent Status</TableCell>
                    <TableCell>Next Due</TableCell>
                    <TableCell>Reactions</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRecords.slice(page * 10, page * 10 + 10).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <Typography variant="subtitle2">{record.studentName}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {record.grade}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {/* Show event name as main title */}
                          <Typography variant="subtitle2" className="font-semibold text-purple-700">
                            {record.healthEvent?.eventName || record.eventName || 'Vaccination Event'}
                          </Typography>
                          
                          {/* Show individual vaccines if available */}
                          {record.vaccineNames && record.vaccineNames.length > 0 ? (
                            <div className="mt-1">
                              <Typography variant="caption" color="primary" className="font-semibold">
                                {record.vaccineNames.length} vaccine{record.vaccineNames.length > 1 ? 's' : ''} in this event:
                              </Typography>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {record.vaccineNames.map((vaccine, index) => (
                                  <Chip
                                    key={index}
                                    label={vaccine}
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                    sx={{ fontSize: '0.75rem', height: '20px' }}
                                  />
                                ))}
                              </div>
                            </div>
                          ) : record.individualVaccines && record.individualVaccines.length > 0 ? (
                            <div className="mt-1">
                              <Typography variant="caption" color="primary" className="font-semibold">
                                {record.individualVaccines.length} vaccine{record.individualVaccines.length > 1 ? 's' : ''} in this event:
                              </Typography>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {record.individualVaccines.map((vaccine, index) => (
                                  <Chip
                                    key={index}
                                    label={vaccine.vaccineName || 'Unknown Vaccine'}
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                    sx={{ fontSize: '0.75rem', height: '20px' }}
                                  />
                                ))}
                              </div>
                            </div>
                          ) : record.vaccineName ? (
                            <div className="mt-1">
                              <Typography variant="caption" color="primary" className="font-semibold">
                                1 vaccine in this event:
                              </Typography>
                              <div className="mt-1">
                                <Chip
                                  label={record.vaccineName}
                                  size="small"
                                  variant="outlined"
                                  color="secondary"
                                  sx={{ fontSize: '0.75rem', height: '20px' }}
                                />
                              </div>
                            </div>
                          ) : (
                            <Typography variant="caption" color="textSecondary" className="italic">
                              Vaccine information not available
                            </Typography>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(record.administeredDate || record.scheduledDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            record.consentStatus === 'REJECTED' ? 'DECLINED' : 
                            record.consentStatus === 'APPROVED' ? 'APPROVED' :
                            record.status === 'missed' && record.consentStatus !== 'APPROVED' ? 'DECLINED' :
                            (record.consentStatus || 'PENDING')
                          }
                          color={
                            record.consentStatus === 'REJECTED' || (record.status === 'missed' && record.consentStatus !== 'APPROVED') ? 'error' :
                            record.consentStatus === 'APPROVED' ? 'success' : 'warning'
                          }
                          size="small"
                        />
                        {record.consentDate && (
                          <Typography variant="caption" display="block" color="textSecondary">
                            {new Date(record.consentDate).toLocaleDateString()}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.nextDueDate ? new Date(record.nextDueDate).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {record.reactions.length > 0 ? (
                          record.reactions.map((reaction, index) => (
                            <Chip key={index} label={reaction} size="small" className="mr-1" />
                          ))
                        ) : (
                          <Typography variant="caption" color="textSecondary">None</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={record.status}
                          color={getStatusColor(record.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Update Vaccination">
                          <IconButton 
                            color="primary"
                            onClick={() => handleUpdateVaccination(record)}
                            disabled={record.consentStatus !== 'APPROVED'}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDeleteVaccination(record)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={filteredRecords.length}
                rowsPerPage={10}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPageOptions={[]}
              />
            </TableContainer>
          )}

          {activeTab === 1 && (
            <Grid container spacing={3}>
              {filteredCampaigns.map((campaign) => (
                <Grid item xs={12} md={6} lg={4} key={campaign.id}>
                  <Card>
                    <CardHeader
                      title={campaign.campaignName}
                      subheader={`${campaign.vaccineType} - ${campaign.targetGrades.join(', ')}`}
                      action={
                        <Chip
                          label={campaign.status}
                          color={getStatusColor(campaign.status)}
                          size="small"
                        />
                      }
                    />
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" className="mb-2">
                        {campaign.description}
                      </Typography>
                      <Typography variant="body2" className="mb-2">
                        <strong>Period:</strong> {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" className="mb-2">
                        <strong>Venue:</strong> {campaign.venue}
                      </Typography>
                      <Typography variant="body2" className="mb-2">
                        <strong>Provider:</strong> {campaign.provider}
                      </Typography>
                      <div className="mt-4">
                        <Box className="flex justify-between items-center mb-2">
                          <Typography variant="body2">Progress</Typography>
                          <Typography variant="body2">
                            {campaign.completedStudents}/{campaign.totalStudents} ({getCompletionPercentage(campaign.completedStudents, campaign.totalStudents)}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={getCompletionPercentage(campaign.completedStudents, campaign.totalStudents)}
                          className="mb-2"
                        />
                      </div>
                      <Box className="flex gap-2 mt-3">
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditCampaign(campaign)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          startIcon={<EventAvailableIcon />}
                          color="primary"
                        >
                          Schedule
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {activeTab === 2 && (
            <div className="text-center py-8">
              <ScheduleIcon className="text-6xl text-gray-400 mb-4" />
              <Typography variant="h6" color="textSecondary">
                Vaccination Schedule
              </Typography>
              <Typography color="textSecondary" className="mb-4">
                View and manage upcoming vaccination schedules and appointments.
              </Typography>
              <Button variant="outlined" startIcon={<ScheduleIcon />}>
                View Schedule
              </Button>
            </div>
          )}

          {activeTab === 3 && (
            <div className="text-center py-8">
              <BarChartIcon className="text-6xl text-gray-400 mb-4" />
              <Typography variant="h6" color="textSecondary">
                Vaccination Reports
              </Typography>
              <Typography color="textSecondary" className="mb-4">
                Generate comprehensive reports on vaccination coverage, campaign effectiveness, and compliance rates.
              </Typography>
              <Button variant="outlined" startIcon={<AssignmentIcon />}>
                Generate Report
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vaccination Record Dialog */}
      <Dialog open={recordDialogOpen} onClose={() => setRecordDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRecord ? 'Edit Vaccination Record' : 'Add New Vaccination Record'}
        </DialogTitle>
        <form onSubmit={recordForm.handleSubmit(onRecordSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={students}
                  value={students.find(s => s.id === recordForm.watch('studentId')) || null}
                  getOptionLabel={(option) => `${option.name} - Class ${option.grade}`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Student"
                      required
                      error={!!recordForm.formState.errors.studentId}
                      helperText={recordForm.formState.errors.studentId?.message}
                    />
                  )}
                  onChange={(event, value) => {
                    recordForm.setValue('studentId', value?.id || '');
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Vaccine Type</InputLabel>
                  <Select
                    {...recordForm.register('vaccineType')}
                    error={!!recordForm.formState.errors.vaccineType}
                  >
                    {vaccines.map((vaccine) => (
                      <MenuItem key={vaccine.type} value={vaccine.type}>
                        {vaccine.type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vaccine Name"
                  {...recordForm.register('vaccineName')}
                  error={!!recordForm.formState.errors.vaccineName}
                  helperText={recordForm.formState.errors.vaccineName?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Batch Number"
                  {...recordForm.register('batchNumber')}
                  error={!!recordForm.formState.errors.batchNumber}
                  helperText={recordForm.formState.errors.batchNumber?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...recordForm.register('consentGiven')}
                      color="primary"
                    />
                  }
                  label="Parent/Guardian consent has been obtained"
                />
                {recordForm.formState.errors.consentGiven && (
                  <Typography color="error" variant="caption">
                    {recordForm.formState.errors.consentGiven?.message}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRecordDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedRecord ? 'Update' : 'Add'} Record
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Campaign Dialog */}
      <Dialog open={campaignDialogOpen} onClose={() => setCampaignDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedCampaign ? 'Edit Campaign' : 'Add New Campaign'}
        </DialogTitle>
        <form onSubmit={campaignForm.handleSubmit(onCampaignSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Campaign Name"
                  {...campaignForm.register('campaignName')}
                  error={!!campaignForm.formState.errors.campaignName}
                  helperText={campaignForm.formState.errors.campaignName?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Vaccine Type</InputLabel>
                  <Select
                    {...campaignForm.register('vaccineType')}
                    error={!!campaignForm.formState.errors.vaccineType}
                  >
                    {vaccines.map((vaccine) => (
                      <MenuItem key={vaccine.type} value={vaccine.type}>
                        {vaccine.type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  options={gradeLevels}
                  getOptionLabel={(option) => option.gradeName || `Grade ${option.gradeNumber}`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Target Grades"
                      error={!!campaignForm.formState.errors.targetGrades}
                      helperText={campaignForm.formState.errors.targetGrades?.message}
                    />
                  )}
                  onChange={(event, value) => {
                    // Convert selected grade levels to array of grade IDs
                    const gradeIds = value.map(grade => grade.gradeId);
                    campaignForm.setValue('targetGrades', gradeIds);
                  }}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.gradeName} ({option.vietnameseName})
                    </li>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCampaignDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedCampaign ? 'Update' : 'Create'} Campaign
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Vaccination Update Dialog */}
      <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Update Vaccination Record
          {selectedUpdateRecord && (
            <Typography variant="subtitle2" color="textSecondary">
              {selectedUpdateRecord.studentName} - {selectedUpdateRecord.vaccineName}
            </Typography>
          )}
        </DialogTitle>
        <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Next Due Date *"
                  type="date"
                  {...updateForm.register('nextDueDate')}
                  error={!!updateForm.formState.errors.nextDueDate}
                  helperText={updateForm.formState.errors.nextDueDate?.message}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  inputProps={{ required: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dose *"
                  {...updateForm.register('dose')}
                  error={!!updateForm.formState.errors.dose}
                  helperText={updateForm.formState.errors.dose?.message}
                  placeholder="e.g., 1st dose, 2nd dose, Booster"
                  required
                  inputProps={{ required: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vaccine Name *"
                  {...updateForm.register('vaccineName')}
                  error={!!updateForm.formState.errors.vaccineName}
                  helperText={updateForm.formState.errors.vaccineName?.message}
                  placeholder="e.g., BCG Vaccine, DPT Vaccine"
                  required
                  inputProps={{ required: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!updateForm.formState.errors.vaccinationStatus}>
                  <InputLabel>Vaccination Status *</InputLabel>
                  <Select
                    {...updateForm.register('vaccinationStatus')}
                    required
                  >
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                    <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                    <MenuItem value="MISSED">Missed</MenuItem>
                  </Select>
                  {updateForm.formState.errors.vaccinationStatus && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {updateForm.formState.errors.vaccinationStatus.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adverse Reactions *"
                  multiline
                  rows={3}
                  placeholder="Enter any adverse reactions or symptoms separated by commas (required)"
                  error={!!updateForm.formState.errors.reactions}
                  helperText={updateForm.formState.errors.reactions?.message || "Please enter 'None' if no adverse reactions occurred"}
                  defaultValue={updateForm.getValues('reactions')?.join(', ')}
                  onChange={(e) => {
                    const reactions = e.target.value.split(',').map(r => r.trim()).filter(r => r);
                    updateForm.setValue('reactions', reactions);
                    updateForm.trigger('reactions'); // Trigger validation
                  }}
                  required
                  inputProps={{ required: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes *"
                  multiline
                  rows={3}
                  {...updateForm.register('notes')}
                  error={!!updateForm.formState.errors.notes}
                  helperText={updateForm.formState.errors.notes?.message}
                  placeholder="Additional notes about the vaccination (required)"
                  required
                  inputProps={{ required: true }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Update Vaccination
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default VaccinationManagement;
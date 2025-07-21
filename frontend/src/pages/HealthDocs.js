import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import jsPDF from 'jspdf';
import { 
  Download, 
  Description, 
  LocalHospital, 
  HealthAndSafety,
  VaccinesOutlined,
  MedicalInformation,
  Assessment
} from '@mui/icons-material';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Box,
  Alert,
  Snackbar,
  Chip
} from '@mui/material';
import { ENGLISH_UI } from '../constants/englishUI';

const HealthDocs = () => {
  const { currentUser } = useContext(AuthContext);
  const [downloading, setDownloading] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const createHealthDeclarationPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let y = 20;

    // Header
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('FPT JUNIOR HIGH SCHOOL', pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.text('STUDENT HEALTH DECLARATION FORM', pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Student Information
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('I. STUDENT INFORMATION:', margin, y);
    y += 10;

    doc.setFont(undefined, 'normal');
    doc.text('Full Name: ___________________________________', margin, y);
    doc.text('Class: ____________', pageWidth - 100, y);
    y += 10;
    doc.text('Date of Birth: _______________', margin, y);
    doc.text('Gender: ☐ Male ☐ Female', pageWidth - 100, y);
    y += 10;
    doc.text('Address: _________________________________________________', margin, y);
    y += 15;

    // Health Status
    doc.setFont(undefined, 'bold');
    doc.text('II. HEALTH STATUS:', margin, y);
    y += 10;

    doc.setFont(undefined, 'normal');
    doc.text('General health condition:', margin, y);
    y += 8;
    doc.text('☐ Excellent    ☐ Good    ☐ Fair    ☐ Poor', margin + 10, y);
    y += 12;

    doc.text('Medical conditions (if any):', margin, y);
    y += 8;
    doc.text('_________________________________________________', margin, y);
    y += 8;
    doc.text('_________________________________________________', margin, y);
    y += 12;

    doc.text('Allergies (food, medication, other):', margin, y);
    y += 8;
    doc.text('_________________________________________________', margin, y);
    y += 12;

    doc.text('Current medications:', margin, y);
    y += 8;
    doc.text('_________________________________________________', margin, y);
    y += 15;

    // Emergency Contact
    doc.setFont(undefined, 'bold');
    doc.text('III. EMERGENCY CONTACT INFORMATION:', margin, y);
    y += 10;

    doc.setFont(undefined, 'normal');
    doc.text('Parent/Guardian Name: ________________________________', margin, y);
    y += 10;
    doc.text('Phone Number: ________________', margin, y);
    doc.text('Relationship: ________________', pageWidth - 120, y);
    y += 15;

    // Signature
    doc.setFont(undefined, 'bold');
    doc.text('IV. CONFIRMATION:', margin, y);
    y += 10;

    doc.setFont(undefined, 'normal');
    doc.text('Date: ___/___/______', margin, y);
    doc.text('Parent/Guardian Signature', pageWidth - 80, y);
    y += 20;
    doc.text('(Sign and print name clearly)', pageWidth - 80, y);

    return doc;
  };

  const createVaccinationPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let y = 20;

    // Header
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('STUDENT VACCINATION SCHEDULE', pageWidth / 2, y, { align: 'center' });
    y += 15;

    doc.setFontSize(12);
    doc.text('Full name: ________________________', margin, y);
    doc.text('Class: ________', pageWidth - 80, y);
    y += 15;

    // Vaccination table
    doc.setFont(undefined, 'bold');
    doc.text('MANDATORY VACCINATION SCHEDULE:', margin, y);
    y += 10;

    const vaccines = [
      { name: 'Diphtheria - Whooping Cough - Tetanus (DPT)', age: '6 years old', status: '☐ Vaccinated ☐ Not vaccinated' },
      { name: 'Measles - Mumps - Rubella (MMR)', age: '9 months, 18 months', status: '☐ Vaccinated ☐ Not vaccinated' },
      { name: 'Polio (OPV/IPV)', age: 'According to schedule', status: '☐ Vaccinated ☐ Not vaccinated' },
      { name: 'Hepatitis B', age: 'Newborn', status: '☐ Vaccinated ☐ Not vaccinated' },
      { name: 'Chickenpox', age: '12-15 months', status: '☐ Vaccinated ☐ Not vaccinated' },
      { name: 'Seasonal flu', age: 'Annually', status: '☐ Vaccinated ☐ Not vaccinated' }
    ];

    doc.setFont(undefined, 'normal');
    vaccines.forEach(vaccine => {
      doc.text(vaccine.name, margin, y);
      y += 6;
      doc.text(`Thời gian: ${vaccine.age}`, margin + 10, y);
      doc.text(vaccine.status, pageWidth - 120, y - 3);
      y += 8;
    });

    y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('NOTES:', margin, y);
    y += 8;
    doc.setFont(undefined, 'normal');
    doc.text('- Please bring vaccination records for verification', margin, y);
    y += 6;
    doc.text('- Contact school health office if you have any questions', margin, y);

    return doc;
  };

  const createMedicationRequestPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let y = 20;

    // Header
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('SCHOOL MEDICATION REQUEST FORM', pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Student Info
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Student name: ____________________________', margin, y);
    doc.text('Class: ________', pageWidth - 80, y);
    y += 10;
    doc.text('Date of birth: _______________', margin, y);
    y += 15;

    // Medication Details
    doc.setFont(undefined, 'bold');
    doc.text('MEDICATION INFORMATION:', margin, y);
    y += 10;

    doc.setFont(undefined, 'normal');
    doc.text('Medication name: ____________________________________', margin, y);
    y += 10;
    doc.text('Dosage: ____________________________________', margin, y);
    y += 10;
    doc.text('Administration time: _______________________________', margin, y);
    y += 10;
    doc.text('Treatment period: From _______ to _______', margin, y);
    y += 15;

    // Special Instructions
    doc.setFont(undefined, 'bold');
    doc.text('SPECIAL INSTRUCTIONS:', margin, y);
    y += 10;

    doc.setFont(undefined, 'normal');
    doc.text('_________________________________________________', margin, y);
    y += 8;
    doc.text('_________________________________________________', margin, y);
    y += 15;

    // Doctor Info
    doc.setFont(undefined, 'bold');
    doc.text('PRESCRIBING DOCTOR INFORMATION:', margin, y);
    y += 10;

    doc.setFont(undefined, 'normal');
    doc.text('Doctor name: _______________________________', margin, y);
    y += 10;
    doc.text('Doctor signature: _______________________________', margin, y);
    y += 15;

    // Parent confirmation
    doc.setFont(undefined, 'bold');
    doc.text('PARENT CONFIRMATION:', margin, y);
    y += 10;

    doc.setFont(undefined, 'normal');
    doc.text('Ngày: ___/___/______', margin, y);
    doc.text('Ký tên phụ huynh', pageWidth - 80, y);

    return doc;
  };

  const createEmergencyPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let y = 20;

    // Header
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('QUY TRÌNH XỬ LÝ KHẨN CẤP Y TẾ', pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Emergency Steps
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('CÁC BƯỚC XỬ LÝ KHẨN CẤP:', margin, y);
    y += 10;

    const steps = [
      '1. Đánh giá tình trạng và đảm bảo an toàn',
      '2. Gọi cấp cứu 115 nếu cần thiết',
      '3. Thông báo ngay cho y tế trường',
      '4. Liên hệ phụ huynh/người giám hộ',
      '5. Record and report the incident'
    ];

    doc.setFont(undefined, 'normal');
    steps.forEach(step => {
      doc.text(step, margin, y);
      y += 8;
    });

    y += 10;

    // Emergency Contacts
    doc.setFont(undefined, 'bold');
    doc.text('DANH BẠ KHẨN CẤP:', margin, y);
    y += 10;

    doc.setFont(undefined, 'normal');
    doc.text('Y tế trường: (024) 123-4567 - Máy lẻ 100', margin, y);
    y += 8;
    doc.text('Hiệu trưởng: (024) 123-4567 - Máy lẻ 200', margin, y);
    y += 8;
    doc.text('Cấp cứu: 115', margin, y);
    y += 8;
    doc.text('Cảnh sát: 113', margin, y);
    y += 8;
    doc.text('Cứu hỏa: 114', margin, y);

    return doc;
  };

  const createPDF = (documentType, fileName) => {
    let doc;
    
    switch (documentType) {
      case 'health-forms':
        doc = createHealthDeclarationPDF();
        break;
      case 'vaccination-guide':
        doc = createVaccinationPDF();
        break;
      case 'medication-forms':
        doc = createMedicationRequestPDF();
        break;
      case 'emergency-procedures':
        doc = createEmergencyPDF();
        break;
      default:
        // Generic PDF for other documents
        doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text(fileName, pageWidth / 2, 30, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text('Important medical documents for students, parents and staff.', margin, 50);
        doc.text('Please refer to the specific guidelines and procedures in this document.', margin, 65);
        doc.text('For more detailed information, please contact the school health office.', margin, 80);
        
        // Footer
        doc.text(`Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`, margin, 250);
        doc.text('Liên hệ: health@fpt-junior.edu.vn | (024) 123-4567', margin, 265);
        break;
    }

    // Save the PDF
    const safeFileName = fileName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    doc.save(`${safeFileName}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleDownload = async (documentType, fileName) => {
    setDownloading(prev => ({ ...prev, [documentType]: true }));
    
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate and download PDF
      createPDF(documentType, fileName);
      showMessage(`${fileName} downloaded successfully!`);
    } catch (error) {
      console.error('Download error:', error);
      showMessage('Download failed. Please try again.', 'error');
    } finally {
      setDownloading(prev => ({ ...prev, [documentType]: false }));
    }
  };

  const documents = [
    {
      id: 'health-forms',
      title: ENGLISH_UI.healthDeclarationForm,
      description: 'Download health declaration forms and templates for students',
      icon: <Assessment className="text-blue-600" />,
      category: ENGLISH_UI.forms,
      roles: ['All']
    },
    {
      id: 'vaccination-guide',
      title: ENGLISH_UI.vaccinationGuidelines,
      description: 'Complete vaccination schedules and requirements for students',
      icon: <VaccinesOutlined className="text-green-600" />,
      category: ENGLISH_UI.guidelines,
      roles: ['All']
    },
    {
      id: 'medical-records',
      title: 'Medical Record Templates',
      description: 'Templates for storing student medical records',
      icon: <MedicalInformation className="text-purple-600" />,
      category: 'Templates',
      roles: ['SchoolNurse', 'Admin']
    },
    {
      id: 'emergency-procedures',
      title: ENGLISH_UI.emergencyProcedures,
      description: 'Emergency response procedures and contact information',
      icon: <LocalHospital className="text-red-600" />,
      category: ENGLISH_UI.emergency,
      roles: ['All']
    },
    {
      id: 'health-policies',
      title: ENGLISH_UI.schoolHealthPolicies,
      description: 'Official school health policies and regulations',
      icon: <HealthAndSafety className="text-orange-600" />,
      category: ENGLISH_UI.policies,
      roles: ['All']
    },
    {
      id: 'medication-forms',
      title: 'Medication Request Forms',
      description: 'Forms for requesting medication administration at school',
      icon: <Description className="text-indigo-600" />,
      category: ENGLISH_UI.forms,
      roles: ['Parent', 'SchoolNurse', 'Admin']
    }
  ];

  const userRole = currentUser?.roles?.[0] || '';
  const filteredDocuments = documents.filter(doc => 
    doc.roles.includes('All') || doc.roles.includes(userRole)
  );

  const getCategoryColor = (category) => {
    const colors = {
      'Forms': 'primary',
      'Guidelines': 'success',
      'Templates': 'secondary',
      'Emergency': 'error',
      'Policies': 'warning',
    };
    return colors[category] || 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1565c0' }}>
          <LocalHospital sx={{ fontSize: '3rem', mr: 2, verticalAlign: 'middle' }} />
          {ENGLISH_UI.healthDocumentation} Center
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Download essential health documents, forms, and guidelines for {ENGLISH_UI.schoolName} health management system
        </Typography>
      </Box>

      {/* Role-based access info */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2">
          <strong>Access Level:</strong> {userRole || 'Guest'} - You can access documents marked for your role or public documents.
        </Typography>
      </Alert>

      {/* Documents Grid */}
      <Grid container spacing={3}>
        {filteredDocuments.map((doc) => (
          <Grid item xs={12} md={6} lg={4} key={doc.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {doc.icon}
                  <Typography variant="h6" component="h3" sx={{ ml: 1, fontWeight: 'bold' }}>
                    {doc.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {doc.description}
                </Typography>
                
                <Chip 
                  label={doc.category} 
                  color={getCategoryColor(doc.category)} 
                  size="small" 
                  sx={{ mb: 1 }}
                />
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={() => handleDownload(doc.id, doc.title)}
                  disabled={downloading[doc.id]}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(45deg, #1565c0 30%, #42a5f5 90%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #0d47a1 30%, #1976d2 90%)',
                    }
                  }}
                >
                  {downloading[doc.id] ? 'Downloading...' : 'Download PDF'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Footer Info */}
      <Box sx={{ mt: 6, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#1565c0', fontWeight: 'bold' }}>
          Cần Hỗ Trợ?
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          If you cannot find the document you are looking for or need support, please contact the school health office:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2"><strong>Điện thoại:</strong> (024) 123-4567</Typography>
          <Typography variant="body2"><strong>Email:</strong> health@fpt-junior.edu.vn</Typography>
          <Typography variant="body2"><strong>Giờ làm việc:</strong> Thứ 2 - Thứ 6: 8:00 AM - 4:00 PM</Typography>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HealthDocs;

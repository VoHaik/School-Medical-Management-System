import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../hooks/useAlert'; // Import useAlert hook
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Paper
} from '@mui/material';
import {
  Description as DocumentIcon,
  Vaccines as VaccineIcon,
  Warning as EmergencyIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const HealthDocuments = () => {
  const { errorAlert } = useAlert(); // Initialize useAlert hook
  const navigate = useNavigate();

  const healthDocuments = [
    {
      title: "Health Policy",
      description: "Comprehensive school health policies and procedures for students and staff.",
      icon: <DocumentIcon sx={{ color: '#1976d2', fontSize: 40 }} />,
      filename: "health-policy.pdf"
    },
    {
      title: "Vaccination Guidelines", 
      description: "Essential guidelines and schedules for required and recommended student vaccinations.",
      icon: <VaccineIcon sx={{ color: '#2e7d32', fontSize: 40 }} />,
      filename: "vaccination-guidelines.pdf"
    },
    {
      title: "Emergency Procedures",
      description: "Critical procedures and protocols for handling various medical emergencies at school.",
      icon: <EmergencyIcon sx={{ color: '#d32f2f', fontSize: 40 }} />,
      filename: "emergency-procedures.pdf"
    }
  ];

  // Generate PDF dynamically since backend requires authentication
  const generateDocumentPDF = async (doc) => {
    try {
      // Import jsPDF dynamically to avoid bundle size issues
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF();

      // Add document title
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(doc.title, 20, 30);

      // Add school name and date
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("FPT Junior High School Health Management System", 20, 45);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 55);

      // Add description
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Overview:", 20, 75);
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const splitDescription = pdf.splitTextToSize(doc.description, 170);
      pdf.text(splitDescription, 20, 85);

      // Add content based on document type
      let yPosition = 105;
      
      if (doc.title === "Health Policy") {
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Health Policy Guidelines", 20, yPosition);
        yPosition += 15;
        
        const healthPolicyContent = [
          "1. Student Health Requirements",
          "   • Annual health examinations required",
          "   • Vaccination records must be up to date", 
          "   • Emergency contact information mandatory",
          "",
          "2. Medication Administration",
          "   • All medications require physician authorization",
          "   • Parents must provide written consent",
          "   • Proper storage and documentation required",
          "",
          "3. Emergency Procedures", 
          "   • Immediate notification of parents/guardians",
          "   • Emergency services contact when necessary",
          "   • Detailed incident documentation",
          "",
          "4. Health Record Confidentiality",
          "   • HIPAA compliance maintained",
          "   • Access limited to authorized personnel",
          "   • Secure storage and transmission",
          "",
          "5. Health Office Procedures",
          "   • Daily health assessments when needed",
          "   • Proper documentation of all visits",
          "   • Communication with parents and teachers",
          "",
          "6. Special Health Needs",
          "   • Individual care plans for chronic conditions",
          "   • Accommodation for students with disabilities",
          "   • Regular monitoring and follow-up"
        ];
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        healthPolicyContent.forEach(line => {
          pdf.text(line, 20, yPosition);
          yPosition += 6;
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
        });
        
      } else if (doc.title === "Vaccination Guidelines") {
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Vaccination Schedule & Requirements", 20, yPosition);
        yPosition += 15;
        
        const vaccinationContent = [
          "Required Vaccinations for School Entry:",
          "",
          "• Hepatitis B (3 doses)",
          "• DTaP/Tdap (Diphtheria, Tetanus, Pertussis)",
          "• Polio (IPV - 4 doses)",
          "• MMR (Measles, Mumps, Rubella - 2 doses)",
          "• Varicella (Chickenpox - 2 doses)",
          "• Haemophilus influenzae type b (Hib)",
          "• Pneumococcal (PCV13)",
          "",
          "Age-Specific Requirements:",
          "",
          "• Ages 4-6: Pre-school boosters",
          "  - DTaP booster",
          "  - MMR booster",
          "  - Varicella booster",
          "  - IPV booster",
          "",
          "• Ages 11-12: Middle school entry",
          "  - Tdap booster",
          "  - HPV vaccine series",
          "  - Meningococcal conjugate vaccine",
          "",
          "• Ages 16-18: High school requirements",
          "  - Meningococcal booster",
          "  - Annual flu vaccination recommended",
          "",
          "Documentation Required:",
          "",
          "• Official vaccination records from healthcare provider",
          "• Physician certification of immunization status",
          "• Medical exemption forms (if applicable)",
          "• Religious exemption documentation (where permitted)",
          "",
          "Special Considerations:",
          "",
          "• Students with compromised immune systems",
          "• International students - additional requirements",
          "• Catch-up schedules for incomplete vaccinations"
        ];
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        vaccinationContent.forEach(line => {
          pdf.text(line, 20, yPosition);
          yPosition += 6;
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
        });
        
      } else if (doc.title === "Emergency Procedures") {
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Medical Emergency Response Protocol", 20, yPosition);
        yPosition += 15;
        
        const emergencyContent = [
          "EMERGENCY RESPONSE STEPS:",
          "",
          "1. ASSESS the situation",
          "   • Ensure scene safety for all persons",
          "   • Check student for responsiveness",
          "   • Evaluate severity of medical condition",
          "   • Note any obvious injuries or symptoms",
          "",
          "2. ALERT emergency services",
          "   • Call 911 immediately for life-threatening emergencies",
          "   • Contact school nurse or health office",
          "   • Notify school administration",
          "   • Request assistance from nearby staff",
          "",
          "3. ASSIST the student",
          "   • Provide first aid if properly trained",
          "   • Keep student comfortable and calm",
          "   • Do NOT move student if spinal injury suspected",
          "   • Monitor vital signs if trained to do so",
          "",
          "4. COMMUNICATE with parents/guardians",
          "   • Contact parents immediately",
          "   • Provide clear, factual information",
          "   • Inform of actions taken and current status",
          "   • Document all communications",
          "",
          "5. DOCUMENT the incident",
          "   • Record time, date, and circumstances",
          "   • Note witnesses present",
          "   • Document all actions taken",
          "   • Complete incident report form",
          "",
          "SPECIFIC EMERGENCY PROCEDURES:",
          "",
          "Allergic Reactions:",
          "• Administer EpiPen if prescribed and trained",
          "• Call 911 immediately",
          "• Monitor breathing and consciousness",
          "",
          "Seizures:",
          "• Clear area of objects that could cause injury",
          "• Do NOT restrain or put anything in mouth",
          "• Time the seizure duration",
          "• Position on side after seizure ends",
          "",
          "Head Injuries:",
          "• Do NOT move the student",
          "• Monitor for consciousness changes",
          "• Apply ice to reduce swelling if appropriate",
          "• Watch for signs of concussion",
          "",
          "Diabetic Emergencies:",
          "• Check for medical alert bracelet",
          "• If conscious and able to swallow, give glucose",
          "• Call 911 for unconscious students",
          "",
          "EMERGENCY CONTACT NUMBERS:",
          "",
          "• Emergency Services: 911",
          "• School Health Office: (024) 123-4567",
          "• Poison Control Center: 1-800-222-1222",
          "• School Main Office: (024) 123-4560",
          "",
          "This document should be accessible to all staff members",
          "and reviewed annually for updates and accuracy."
        ];
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        emergencyContent.forEach(line => {
          pdf.text(line, 20, yPosition);
          yPosition += 6;
          
          // Add new page if content is too long
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
        });
      }

      // Add footer to all pages
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Page ${i} of ${pageCount}`, 20, 285);
        pdf.text("FPT Junior High School Health Management System - Official Document", 105, 285, { align: 'center' });
      }

      // Save the PDF
      pdf.save(doc.filename);
      
    } catch (error) {
      errorAlert('Sorry, there was an error generating the PDF. Please try again later.');
      console.error('PDF generation error:', error);
    }
  };

  const handleDownloadDocument = async (doc) => {
    try {
      await generateDocumentPDF(doc);
    } catch (error) {
      errorAlert('Sorry, there was an error downloading the document. Please try again later.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Navigation Back */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>

        {/* Page Header */}
        <Paper sx={{ p: 4, mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
            Health Documentation Center
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            Access important health documents and guidelines for FPT Junior High School
          </Typography>
        </Paper>

        {/* Health Documentation Section */}
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, textAlign: 'center', color: 'text.primary' }}>
          Available Documents
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, color: 'text.secondary' }}>
          Download official health policies, vaccination guidelines, and emergency procedures.
        </Typography>
        
        <Grid container spacing={4}>
          {healthDocuments.map((doc, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ 
                height: '100%', 
                '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' }, 
                transition: 'all 0.3s ease-in-out' 
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    {doc.icon}
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    {doc.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.6 }}>
                    {doc.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    startIcon={<DocumentIcon />}
                    onClick={() => handleDownloadDocument(doc)}
                    sx={{ 
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': {
                        transform: 'scale(1.02)'
                      }
                    }}
                  >
                    Download PDF
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Additional Info */}
        <Paper sx={{ p: 4, mt: 6, bgcolor: 'info.light' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'info.dark' }}>
            Document Information
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            All documents are generated in PDF format and contain the most current information as of the generation date.
            For questions about these policies or procedures, please contact the school health office.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <strong>Health Office Contact:</strong> (024) 123-4567 | health@fpt-junior.edu.vn
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default HealthDocuments;

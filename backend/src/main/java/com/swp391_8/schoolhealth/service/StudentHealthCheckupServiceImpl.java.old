package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.StudentHealthCheckupDTO;
import com.swp391_8.schoolhealth.dto.StudentHealthCheckupRequestDTO;
import com.swp391_8.schoolhealth.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import com.swp391_8.schoolhealth.repository.StudentHealthCheckupRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.HealthEventRepository; 
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.StudentHealthCheckup;
import com.swp391_8.schoolhealth.model.HealthEvent; 
import com.swp391_8.schoolhealth.model.ERole; 
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder; 

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import java.math.RoundingMode;


@Service
public class StudentHealthCheckupServiceImpl implements StudentHealthCheckupService {

    @Autowired
    private StudentHealthCheckupRepository studentHealthCheckupRepository;

    @Autowired
    private StudentRepository studentRepository;

    // Assuming HealthCheckupEventRepository is still relevant and correctly named.
    // If it was for a general event system that's removed, this might need adjustment.
    @Autowired
    private HealthEventRepository healthEventRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SecurityService securityService;

    @Override
    @Transactional
    public StudentHealthCheckupDTO createStudentHealthCheckup(StudentHealthCheckupRequestDTO requestDTO, Authentication authentication) {
        Student student = studentRepository.findByStudentCode(requestDTO.getStudentCode())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with code: " + requestDTO.getStudentCode()));

        User conductedByUser = null;
        if (securityService.isNurse(authentication) || securityService.isAdmin(authentication)) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            conductedByUser = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Conducting user (nurse/admin) not found"));
        } else {
            throw new AccessDeniedException("User not authorized to create health checkups.");
        }

        HealthEvent event = null;
        if (requestDTO.getEventId() != null) {
            event = healthEventRepository.findById(requestDTO.getEventId())
                    .orElseThrow(() -> new ResourceNotFoundException("HealthEvent not found with ID: " + requestDTO.getEventId()));
        }
        StudentHealthCheckup checkup = new StudentHealthCheckup();
        checkup.setStudent(student);
        checkup.setHealthEvent(event);
        checkup.setConductedByUser(conductedByUser); // Corrected: setConductedByUser
        checkup.setCheckupDate(requestDTO.getCheckupDate());
        
        // Map all relevant fields from requestDTO to checkup
        checkup.setVisionLeft(requestDTO.getVisionLeft());
        checkup.setVisionRight(requestDTO.getVisionRight());
        checkup.setVisionNotes(requestDTO.getVisionNotes());
        checkup.setHearingLeft(requestDTO.getHearingLeft());
        checkup.setHearingRight(requestDTO.getHearingRight());
        checkup.setHearingNotes(requestDTO.getHearingNotes());
        checkup.setDentalOralHealthStatus(requestDTO.getDentalOralHealthStatus());
        checkup.setDentalNotes(requestDTO.getDentalNotes());
        checkup.setScoliosisScreeningResult(requestDTO.getScoliosisScreeningResult());
        checkup.setScoliosisNotes(requestDTO.getScoliosisNotes());
        checkup.setBloodPressureSystolic(requestDTO.getBloodPressureSystolic());
        checkup.setBloodPressureDiastolic(requestDTO.getBloodPressureDiastolic());
        checkup.setHeartRate(requestDTO.getHeartRate());
        checkup.setTemperatureCelsius(requestDTO.getTemperatureCelsius());
        checkup.setHeightCm(requestDTO.getHeightCm());
        checkup.setWeightKg(requestDTO.getWeightKg());
        // BMI and BMI Category should be calculated based on height and weight
        if (requestDTO.getHeightCm() != null && requestDTO.getWeightKg() != null && requestDTO.getHeightCm() > 0) {
            double heightInMeters = requestDTO.getHeightCm() / 100.0;
            double bmi = requestDTO.getWeightKg() / (heightInMeters * heightInMeters);
            checkup.setBmi(bmi);
            // Add logic to determine BMI category based on 'bmi' value
            checkup.setBmiCategory(calculateBmiCategory(bmi)); 
        }
        checkup.setGeneralObservations(requestDTO.getGeneralObservations());
        checkup.setRecommendations(requestDTO.getRecommendations());
        
        // Consent status should typically be handled by a separate flow (e.g., recordConsent or updateConsentStatus)
        // For direct recording, it might be PENDING_VERIFICATION or based on prior consent.
        // For now, let's assume it's PENDING status from the entity's enum definition
        checkup.setParentConsentStatus(StudentHealthCheckup.ConsentStatus.PENDING);

        StudentHealthCheckup savedCheckup = studentHealthCheckupRepository.save(checkup);

        // Notify parent(s) about the scheduled/created health checkup
        List<User> parents = userRepository.findParentsByStudentCode(student.getStudentCode());
        if (!parents.isEmpty()) {
            for (User parentUser : parents) { // Ensure parentUser is of type User
                // Assuming a general notification for creation. Consent might be separate.
                String messageToParent = String.format("A health checkup has been scheduled/recorded for your child %s on %s.",
                        student.getFullName(), savedCheckup.getCheckupDate());
                String linkToParent = String.format("/parent/health-checkups/student/%s/checkup/%d",
                        student.getStudentCode(), savedCheckup.getCheckupResultId());
                notificationService.createNotification(parentUser, "HEALTH_CHECKUP_SCHEDULED", messageToParent, linkToParent); // parentUser is User
            }
        }
        return convertToDTO(savedCheckup);
    }

    @Override
    @Transactional
    public void requestConsentFromParent(Integer checkupId, Authentication authentication) {
        StudentHealthCheckup checkup = studentHealthCheckupRepository.findById(checkupId)
                .orElseThrow(() -> new ResourceNotFoundException("Health checkup not found: " + checkupId));
        Student student = checkup.getStudent();
        List<User> parents = userRepository.findParentsByStudentCode(student.getStudentCode());

        if (parents.isEmpty()) {
            throw new ResourceNotFoundException("No parents found for student: " + student.getStudentCode());
        }

        for (User parentUser : parents) { // Ensure parentUser is of type User
            sendHealthCheckupConsentNotificationToParent(parentUser, student, checkup, "/parent/consent/health-checkup/" + checkupId);
        }
    }

    @Override
    @Transactional
    public StudentHealthCheckupDTO recordParentConsent(Integer checkupId, boolean consent, String notes, Authentication authentication) {
        StudentHealthCheckup checkup = studentHealthCheckupRepository.findById(checkupId)
                .orElseThrow(() -> new ResourceNotFoundException("Health checkup not found: " + checkupId));
        Student student = checkup.getStudent();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User parentUser = userRepository.findById(userDetails.getId()) 
                .orElseThrow(() -> new ResourceNotFoundException("Parent user not found"));

        if (!securityService.isParentOfStudentByCode(authentication, student.getStudentCode())) { 
            throw new AccessDeniedException("User is not an authorized parent for this student.");
        }
        checkup.setParentConsentStatus(consent ? StudentHealthCheckup.ConsentStatus.CONSENTED : StudentHealthCheckup.ConsentStatus.REJECTED);
        checkup.setConsentByParent(parentUser); // parentUser is already User type, should be fine 
        if (consent) {
            checkup.setConsentDate(LocalDate.now());
        } else {
            checkup.setConsentDate(null);
        }
        checkup.setParentCommunicationNotes(notes);

        StudentHealthCheckup updatedCheckup = studentHealthCheckupRepository.save(checkup);

        User conductedBy = checkup.getConductedByUser();
        
        if (conductedBy != null && conductedBy.getRole().getRoleName().equals(ERole.ROLE_SCHOOLNURSE.name())) { 
             sendHealthCheckupConsentResultNotificationToNurse(conductedBy, parentUser, student, checkup, consent); 
        } else {
            List<User> nurses = userRepository.findByRole_RoleName(ERole.ROLE_SCHOOLNURSE.name());
            for (User nurse : nurses) {
                sendHealthCheckupConsentResultNotificationToNurse(nurse, parentUser, student, checkup, consent); 
            }
        }
        return convertToDTO(updatedCheckup);
    }
    @Override
    @Transactional
    public StudentHealthCheckupDTO updateStudentHealthCheckup(Integer checkupId, StudentHealthCheckupRequestDTO requestDTO, Authentication authentication) {
        StudentHealthCheckup checkup = studentHealthCheckupRepository.findById(checkupId)
                .orElseThrow(() -> new ResourceNotFoundException("StudentHealthCheckup record not found with id: " + checkupId));

        boolean resultsPreviouslyUnavailable = checkup.getCheckupDate() == null; 

        // Update fields from DTO - map DTO fields to entity fields carefully
        checkup.setCheckupDate(requestDTO.getCheckupDate());
        checkup.setVisionLeft(requestDTO.getVisionLeft());
        checkup.setVisionRight(requestDTO.getVisionRight());
        checkup.setVisionNotes(requestDTO.getVisionNotes());
        checkup.setHearingLeft(requestDTO.getHearingLeft());
        checkup.setHearingRight(requestDTO.getHearingRight());
        checkup.setHearingNotes(requestDTO.getHearingNotes());
        checkup.setDentalOralHealthStatus(requestDTO.getDentalOralHealthStatus());
        checkup.setDentalNotes(requestDTO.getDentalNotes());
        checkup.setScoliosisScreeningResult(requestDTO.getScoliosisScreeningResult());
        checkup.setScoliosisNotes(requestDTO.getScoliosisNotes());
        checkup.setBloodPressureSystolic(requestDTO.getBloodPressureSystolic());
        checkup.setBloodPressureDiastolic(requestDTO.getBloodPressureDiastolic());
        checkup.setHeartRate(requestDTO.getHeartRate());
        checkup.setTemperatureCelsius(requestDTO.getTemperatureCelsius());
        checkup.setHeightCm(requestDTO.getHeightCm());
        checkup.setWeightKg(requestDTO.getWeightKg());
    
        // Calculate BMI and BMI Category if height and weight are present
        if (requestDTO.getHeightCm() != null && requestDTO.getWeightKg() != null && requestDTO.getHeightCm() > 0) {
            double heightInMeters = requestDTO.getHeightCm() / 100.0;
            double bmi = requestDTO.getWeightKg() / (heightInMeters * heightInMeters);
            checkup.setBmi(bmi);
            checkup.setBmiCategory(calculateBmiCategory(bmi)); // Ensure this method exists and is correct
        } else {
            checkup.setBmi(null);
            checkup.setBmiCategory(null);
        }
        checkup.setGeneralObservations(requestDTO.getGeneralObservations());
        checkup.setRecommendations(requestDTO.getRecommendations());
    
        // Set conductedByUser if provided in DTO and user exists
        if (requestDTO.getConductedByUserName() != null && !requestDTO.getConductedByUserName().isEmpty()) { // Check DTO for username
            User conductedByUser = userRepository.findByUsername(requestDTO.getConductedByUserName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + requestDTO.getConductedByUserName()));
            checkup.setConductedByUser(conductedByUser); // Corrected: setConductedByUser
        }
    
        StudentHealthCheckup updatedRecord = studentHealthCheckupRepository.save(checkup);
    
        boolean resultsNowAvailable = updatedRecord.getCheckupDate() != null;
    
        if (resultsPreviouslyUnavailable && resultsNowAvailable) {
            sendResultsAvailableNotifications(updatedRecord);
        }
    
        return convertToDTO(updatedRecord);
    }
    
    private void sendResultsAvailableNotifications(StudentHealthCheckup record) {
        Student student = record.getStudent();
        // HealthEvent event = record.getHealthEvent(); // Event might be null, handle gracefully

        if (student == null) { // Removed event null check as it might not always be present
            return;
        }

        String studentFullName = student.getFullName() != null ? student.getFullName() : student.getStudentCode();
        String eventName = record.getHealthEvent() != null && record.getHealthEvent().getEventName() != null 
                            ? record.getHealthEvent().getEventName() 
                            : "General Checkup"; // Default if event or event name is null

        String messageToParent = String.format("Health checkup results for %s for your child %s are now available.", // Adjusted message
                eventName, studentFullName);
        String linkToParent = String.format("/parent/health-checkups/student/%s/checkup/%d", // Adjusted link
                student.getStudentCode(), record.getCheckupResultId());

        List<User> parents = userRepository.findParentsByStudentCode(student.getStudentCode());
        for (User parent : parents) { // Ensure parent is of type User
            notificationService.createNotification(parent, "HEALTH_CHECKUP_RESULTS_AVAILABLE", messageToParent, linkToParent); // Corrected parameter order
        }
    }

    private void sendConsentUpdateNotifications(StudentHealthCheckup record) {
        Student student = record.getStudent();
        User consentingParent = record.getConsentByParent(); // Ensure getConsentByParent returns User

        if (student == null || consentingParent == null) { 
            return;
        }
        String studentFullName = student.getFullName() != null ? student.getFullName() : student.getStudentCode();
        String eventName = record.getHealthEvent() != null && record.getHealthEvent().getEventName() != null 
                            ? record.getHealthEvent().getEventName() 
                            : "General Checkup"; 
        String parentFullName = consentingParent.getFullName() != null ? consentingParent.getFullName() : consentingParent.getUsername(); // consentingParent is User, getUsername() is valid

        String consentStatusStr = record.getParentConsentStatus() != null ? record.getParentConsentStatus().toString().toLowerCase() : "updated";
        
        // Notification to other parent(s) if any
        String messageToOtherParents = String.format("Consent status for health checkup %s for child %s has been updated to %s by %s.", // Adjusted message
                                               eventName, studentFullName, consentStatusStr, parentFullName);
        String linkToParentDashboard = String.format("/parent/health-checkups/student/%s/checkup/%d", // Adjusted link
                                               student.getStudentCode(), record.getCheckupResultId());

        List<User> allParents = userRepository.findParentsByStudentCode(student.getStudentCode());
        for (User p : allParents) { // p is User type
            if (!p.getUserId().equals(consentingParent.getUserId())) { 
                notificationService.createNotification(p, "HEALTH_CHECKUP_CONSENT_UPDATED_BY_OTHER_PARENT", messageToOtherParents, linkToParentDashboard);
            }
        }

        // Notification to nurses
        String messageToNurse = String.format("Parent %s has updated consent to %s for health checkup %s for student %s (%s). Notes: %s", // Adjusted message
                                        parentFullName, consentStatusStr, eventName, studentFullName, student.getStudentCode(), record.getParentCommunicationNotes());
        String linkToNurseDashboard = String.format("/nurse/health-checkups/student/%s/checkup/%d",  // Adjusted link
                                              student.getStudentCode(), record.getCheckupResultId());
        
        List<User> nurses = userRepository.findByRole_RoleName(ERole.ROLE_SCHOOLNURSE.name()); 
        for (User nurse : nurses) {
            notificationService.createNotification(nurse, "HEALTH_CHECKUP_CONSENT_UPDATED_BY_PARENT", messageToNurse, linkToNurseDashboard);
        }
    }

    private StudentHealthCheckupDTO convertToDTO(StudentHealthCheckup record) {
        if (record == null) return null;
        StudentHealthCheckupDTO dto = new StudentHealthCheckupDTO();
        dto.setCheckupResultId(record.getCheckupResultId());
        if (record.getStudent() != null) {
            dto.setStudentCode(record.getStudent().getStudentCode());
            dto.setStudentName(record.getStudent().getFullName());
        }
        if (record.getHealthEvent() != null) {
            dto.setEventId(record.getHealthEvent().getEventId());
            dto.setEventName(record.getHealthEvent().getEventName());
        }
        dto.setParentConsentStatus(record.getParentConsentStatus() != null ? record.getParentConsentStatus().name() : null);
        dto.setConsentDate(record.getConsentDate());
        if (record.getConsentByParent() != null) {
            dto.setConsentByParentUsername(record.getConsentByParent().getUsername()); // Ensure getConsentByParent() returns User
        }
        dto.setParentCommunicationNotes(record.getParentCommunicationNotes());
        dto.setCheckupDate(record.getCheckupDate());
        if (record.getConductedByUser() != null) {
            dto.setConductedByUserName(record.getConductedByUser().getUsername()); // Corrected: use getUsername()
            dto.setConductedByUserId(record.getConductedByUser().getUserId()); // Also set ID
        }
        dto.setVisionLeft(record.getVisionLeft());
        dto.setVisionRight(record.getVisionRight());
        dto.setVisionNotes(record.getVisionNotes());
        dto.setHearingLeft(record.getHearingLeft());
        dto.setHearingRight(record.getHearingRight());
        dto.setHearingNotes(record.getHearingNotes());
        dto.setDentalOralHealthStatus(record.getDentalOralHealthStatus());
        dto.setDentalNotes(record.getDentalNotes());
        dto.setScoliosisScreeningResult(record.getScoliosisScreeningResult());
        dto.setScoliosisNotes(record.getScoliosisNotes());
        dto.setBloodPressureSystolic(record.getBloodPressureSystolic());
        dto.setBloodPressureDiastolic(record.getBloodPressureDiastolic());
        dto.setHeartRate(record.getHeartRate());
        dto.setTemperatureCelsius(record.getTemperatureCelsius());
        dto.setHeightCm(record.getHeightCm());
        dto.setWeightKg(record.getWeightKg());
        dto.setBmi(record.getBmi());
        dto.setBmiCategory(record.getBmiCategory());
        dto.setGeneralObservations(record.getGeneralObservations());
        dto.setRecommendations(record.getRecommendations());
        return dto;
    }

    // Helper method to calculate BMI category (example implementation)
    private String calculateBmiCategory(double bmi) {
        if (bmi < 18.5) return "Underweight";
        if (bmi < 24.9) return "Normal weight";
        if (bmi < 29.9) return "Overweight";
        return "Obese";
    }

    private void sendHealthCheckupConsentNotificationToParent(User parentUser, Student student, StudentHealthCheckup checkup, String link) {
        String studentName = student.getFullName() != null ? student.getFullName() : student.getStudentCode();
        String eventName = checkup.getHealthEvent() != null && checkup.getHealthEvent().getEventName() != null 
                            ? checkup.getHealthEvent().getEventName() 
                            : "General Checkup";
        String message = String.format("Please provide consent for the upcoming health checkup for %s for your child %s. Details and consent form are available at the link.",
                                     eventName, studentName);
        notificationService.createNotification(parentUser, "HEALTH_CHECKUP_CONSENT_REQUESTED", message, link);
    }

    private void sendHealthCheckupConsentResultNotificationToNurse(User nurse, User parentUser, Student student, StudentHealthCheckup checkup, boolean consentGiven) {
        String studentName = student.getFullName() != null ? student.getFullName() : student.getStudentCode();
        String parentName = parentUser.getFullName() != null ? parentUser.getFullName() : parentUser.getUsername();
        String eventName = checkup.getHealthEvent() != null && checkup.getHealthEvent().getEventName() != null 
                            ? checkup.getHealthEvent().getEventName() 
                            : "General Checkup";
        String consentStatus = consentGiven ? "CONSENTED" : "REJECTED";
        String message = String.format("Parent %s has %s to the health checkup for %s for student %s. Notes: %s",
                                     parentName, consentStatus, eventName, studentName, checkup.getParentCommunicationNotes());
        String link = String.format("/nurse/health-checkups/student/%s/checkup/%d", student.getStudentCode(), checkup.getCheckupResultId());
        notificationService.createNotification(nurse, "HEALTH_CHECKUP_CONSENT_RESULT", message, link);
    }
    
    @Override
    public List<StudentHealthCheckupDTO> getHealthCheckupsForStudentByParent(String studentCode, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User parentUser = userRepository.findByUsername(userDetails.getUsername()) // parentUser is User
                .orElseThrow(() -> new ResourceNotFoundException("Parent user not found: " + userDetails.getUsername()));

        if (!securityService.isParentOfStudentByCode(authentication, studentCode)) { // Changed to use studentCode
            throw new AccessDeniedException("User is not an authorized parent for this student.");
        }
        return studentHealthCheckupRepository.findByStudent_StudentCode(studentCode) // Use findByStudent_StudentCode
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // These methods need to be implemented based on the interface StudentHealthCheckupService
    // Add @Override annotations once their signatures match the interface.

    @Override // Assuming this will be added to interface
    public List<StudentHealthCheckupDTO> getCheckupsByStudentCode(String studentCode) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Student student = studentRepository.findByStudentCode(studentCode)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with code: " + studentCode));

        boolean authorized = false;
        if (securityService.isAdmin(authentication) || securityService.isNurse(authentication)) {
            authorized = true;
        } else if (securityService.isParentOfStudent(authentication, studentCode)) {
            authorized = true;
        }
        // TODO: Student authorization removed - needs to be implemented without user relationship

        if (!authorized) {
            throw new AccessDeniedException("User is not authorized to view health checkups for this student.");
        }

        return studentHealthCheckupRepository.findByStudent_StudentCode(studentCode)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Override // Assuming this will be added to interface
    public List<StudentHealthCheckupDTO> getCheckupsByEventId(Integer eventId) {
        // Add security checks: nurse/admin can see all for an event.
        // Parents/students might see their own if they are part of the event - more complex query.
        // For now, restrict to nurse/admin.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)) {
            throw new AccessDeniedException("User not authorized to view all checkups for this event.");
        }
        return studentHealthCheckupRepository.findByHealthEvent_EventId(eventId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Override // Assuming this will be added to interface
    public StudentHealthCheckupDTO getStudentHealthCheckupById(Integer checkupResultId) {
        StudentHealthCheckup checkup = studentHealthCheckupRepository.findById(checkupResultId)
            .orElseThrow(() -> new ResourceNotFoundException("StudentHealthCheckup record not found with id: " + checkupResultId));
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String studentCode = checkup.getStudent().getStudentCode();

        boolean authorized = false;
        if (securityService.isAdmin(authentication) || securityService.isNurse(authentication)) {
            authorized = true;
        } else if (securityService.isParentOfStudent(authentication, studentCode)) {
            authorized = true;
        } else if (checkup.getStudent().getStudentCode().equals(userDetails.getUserCode())) {
            // Allow student to see their own record using userCode comparison
            authorized = true;
        }

        if (!authorized) {
            throw new AccessDeniedException("User is not authorized to view this health checkup.");
        }
        return convertToDTO(checkup);
    }

    @Override
    public List<StudentHealthCheckupDTO> getAllHealthCheckups(String status, String grade, LocalDate startDate, LocalDate endDate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)) {
            throw new AccessDeniedException("User not authorized to view all health checkups.");
        }

        List<StudentHealthCheckup> checkups;
        
        if (startDate != null && endDate != null) {
            checkups = studentHealthCheckupRepository.findByCheckupDateBetween(startDate, endDate);
        } else {
            checkups = studentHealthCheckupRepository.findAll();
        }

        // Apply additional filtering if needed
        return checkups.stream()
            .filter(checkup -> {
                if (grade != null && !grade.isEmpty()) {
                    String studentGrade = checkup.getStudent().getGradeLevel() != null ? 
                        checkup.getStudent().getGradeLevel().getGradeName() : "";
                    return studentGrade.equals(grade);
                }
                return true;
            })
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteStudentHealthCheckup(Integer checkupId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!securityService.isNurse(authentication) && !securityService.isAdmin(authentication)) {
            throw new AccessDeniedException("User not authorized to delete health checkups.");
        }

        StudentHealthCheckup checkup = studentHealthCheckupRepository.findById(checkupId)
            .orElseThrow(() -> new ResourceNotFoundException("StudentHealthCheckup record not found with id: " + checkupId));
        
        studentHealthCheckupRepository.delete(checkup);
    }
}

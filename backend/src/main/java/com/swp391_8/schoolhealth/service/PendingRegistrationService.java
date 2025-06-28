package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.ParentRegistrationRequest;
import com.swp391_8.schoolhealth.dto.PendingRegistrationResponse;
import com.swp391_8.schoolhealth.model.PendingRegistration;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.PendingRegistrationRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PendingRegistrationService {
    
    private static final Logger logger = LoggerFactory.getLogger(PendingRegistrationService.class);
    
    @Autowired
    private PendingRegistrationRepository pendingRegistrationRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // Đăng ký yêu cầu tài khoản parent
    @Transactional
    public PendingRegistrationResponse submitRegistrationRequest(ParentRegistrationRequest request) {
        logger.info("Processing parent registration request for username: {}", request.getUsername());
        
        // Kiểm tra username đã tồn tại trong hệ thống
        if (userService.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already taken. Please choose a different username.");
        }
        
        // Kiểm tra email đã tồn tại trong hệ thống  
        if (userService.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email '" + request.getEmail() + "' is already in use. Please use a different email address.");
        }
        
        // Kiểm tra username đã có yêu cầu chờ phê duyệt
        if (pendingRegistrationRepository.existsByUsernameAndStatus(request.getUsername(), PendingRegistration.RegistrationStatus.PENDING)) {
            throw new IllegalArgumentException("A registration request with username '" + request.getUsername() + "' is already pending approval.");
        }
        
        // Kiểm tra email đã có yêu cầu chờ phê duyệt
        if (pendingRegistrationRepository.existsByEmailAndStatus(request.getEmail(), PendingRegistration.RegistrationStatus.PENDING)) {
            throw new IllegalArgumentException("A registration request with email '" + request.getEmail() + "' is already pending approval.");
        }
        
        // Kiểm tra parent code đã tồn tại trong hệ thống
        if (userService.existsByUserCode(request.getParentCode())) {
            throw new IllegalArgumentException("Parent code '" + request.getParentCode() + "' is already in use. Please choose a different parent code.");
        }
        
        // Kiểm tra parent code đã có yêu cầu chờ phê duyệt
        if (pendingRegistrationRepository.existsByParentCodeAndStatus(request.getParentCode(), PendingRegistration.RegistrationStatus.PENDING)) {
            throw new IllegalArgumentException("A registration request with parent code '" + request.getParentCode() + "' is already pending approval.");
        }
        
        // Xác thực thông tin học sinh
        validateStudentInformation(request.getStudentCode(), request.getStudentFullName(), request.getStudentDateOfBirth());
        
        // Kiểm tra đã có parent nào đăng ký cho student này chưa
        List<PendingRegistration> existingRequests = pendingRegistrationRepository.findByStudentCodeAndStatus(
            request.getStudentCode(), PendingRegistration.RegistrationStatus.PENDING);
        if (!existingRequests.isEmpty()) {
            throw new IllegalArgumentException("There is already a pending registration request for student: " + request.getStudentCode());
        }
        
        // Tạo PendingRegistration entity
        PendingRegistration pendingRegistration = new PendingRegistration();
        pendingRegistration.setUsername(request.getUsername());
        pendingRegistration.setPassword(passwordEncoder.encode(request.getPassword())); // Mã hóa password
        pendingRegistration.setFullName(request.getFullName());
        pendingRegistration.setEmail(request.getEmail());
        pendingRegistration.setPhoneNumber(request.getPhoneNumber());
        pendingRegistration.setGender(request.getGender());
        pendingRegistration.setAddress(request.getAddress());
        pendingRegistration.setEmergencyContact(request.getEmergencyContact());
        pendingRegistration.setRelationshipWithStudent(request.getRelationshipWithStudent());
        pendingRegistration.setParentCode(request.getParentCode());
        pendingRegistration.setStudentCode(request.getStudentCode());
        pendingRegistration.setStudentFullName(request.getStudentFullName());
        pendingRegistration.setStudentClass(request.getStudentClass());
        
        // Parse student date of birth
        try {
            LocalDateTime dob = LocalDateTime.parse(request.getStudentDateOfBirth() + "T00:00:00");
            pendingRegistration.setStudentDateOfBirth(dob);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format for student date of birth. Please use yyyy-MM-dd format.");
        }
        
        PendingRegistration saved = pendingRegistrationRepository.save(pendingRegistration);
        logger.info("Parent registration request submitted successfully for username: {}", request.getUsername());
        
        return new PendingRegistrationResponse(saved);
    }
    
    // Xác thực thông tin học sinh
    private void validateStudentInformation(String studentCode, String studentFullName, String studentDateOfBirth) {
        Optional<Student> studentOpt = studentRepository.findByStudentCode(studentCode);
        if (!studentOpt.isPresent()) {
            throw new IllegalArgumentException("Student with code '" + studentCode + "' not found in the system.");
        }
        
        Student student = studentOpt.get();
        
        // Kiểm tra tên học sinh có khớp không
        if (!student.getFullName().equalsIgnoreCase(studentFullName.trim())) {
            throw new IllegalArgumentException("Student full name does not match our records for student code: " + studentCode);
        }
        
        // Kiểm tra ngày sinh (nếu student có date_of_birth)
        if (student.getDateOfBirth() != null) {
            try {
                LocalDateTime providedDob = LocalDateTime.parse(studentDateOfBirth + "T00:00:00");
                
                // So sánh chỉ phần ngày, tháng, năm
                if (!student.getDateOfBirth().equals(providedDob.toLocalDate())) {
                    throw new IllegalArgumentException("Student date of birth does not match our records for student code: " + studentCode);
                }
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("Invalid date format for student date of birth. Please use yyyy-MM-dd format.");
            }
        }
    }
    
    // Lấy tất cả yêu cầu chờ phê duyệt
    public List<PendingRegistrationResponse> getAllPendingRegistrations() {
        List<PendingRegistration> pendingList = pendingRegistrationRepository.findByStatusOrderByRequestedAtAsc(
            PendingRegistration.RegistrationStatus.PENDING);
        
        return pendingList.stream()
            .map(PendingRegistrationResponse::new)
            .collect(Collectors.toList());
    }
    
    // Lấy tất cả yêu cầu theo trạng thái
    public List<PendingRegistrationResponse> getRegistrationsByStatus(PendingRegistration.RegistrationStatus status) {
        List<PendingRegistration> registrations = pendingRegistrationRepository.findByStatusOrderByRequestedAtDesc(status);
        
        return registrations.stream()
            .map(PendingRegistrationResponse::new)
            .collect(Collectors.toList());
    }
    
    // Phê duyệt yêu cầu đăng ký
    @Transactional
    public PendingRegistrationResponse approveRegistration(Integer registrationId, String adminNotes, User approvedBy) {
        logger.info("Processing approval for registration ID: {}", registrationId);
        
        Optional<PendingRegistration> registrationOpt = pendingRegistrationRepository.findByIdAndStatus(
            registrationId, PendingRegistration.RegistrationStatus.PENDING);
        
        if (!registrationOpt.isPresent()) {
            throw new IllegalArgumentException("Pending registration not found or already processed.");
        }
        
        PendingRegistration registration = registrationOpt.get();
        
        // Kiểm tra lại username và email chưa được sử dụng
        if (userService.existsByUsername(registration.getUsername())) {
            throw new IllegalArgumentException("Username '" + registration.getUsername() + "' is already taken.");
        }
        
        if (userService.existsByEmail(registration.getEmail())) {
            throw new IllegalArgumentException("Email '" + registration.getEmail() + "' is already in use.");
        }
        
        // Tạo tài khoản User và Parent
        userService.registerUserWithEncodedPassword(
            registration.getUsername(),
            registration.getPassword(), // Đã được mã hóa
            registration.getFullName(),
            registration.getEmail(),
            registration.getPhoneNumber(),
            registration.getGender(),
            registration.getRelationshipWithStudent(),
            UserService.UserRole.Parent,
            null, null, null, // Nurse specific fields
            registration.getAddress(),
            registration.getEmergencyContact(),
            registration.getParentCode() // Pass parentCode as custom user code
        );
        
        // Cập nhật trạng thái yêu cầu
        registration.setStatus(PendingRegistration.RegistrationStatus.APPROVED);
        registration.setProcessedBy(approvedBy);
        registration.setAdminNotes(adminNotes);
        registration.setProcessedAt(LocalDateTime.now());
        
        PendingRegistration updated = pendingRegistrationRepository.save(registration);
        logger.info("Registration approved successfully for username: {}", registration.getUsername());
        
        return new PendingRegistrationResponse(updated);
    }
    
    // Từ chối yêu cầu đăng ký
    @Transactional
    public PendingRegistrationResponse rejectRegistration(Integer registrationId, String rejectionReason, String adminNotes, User rejectedBy) {
        logger.info("Processing rejection for registration ID: {}", registrationId);
        
        Optional<PendingRegistration> registrationOpt = pendingRegistrationRepository.findByIdAndStatus(
            registrationId, PendingRegistration.RegistrationStatus.PENDING);
        
        if (!registrationOpt.isPresent()) {
            throw new IllegalArgumentException("Pending registration not found or already processed.");
        }
        
        PendingRegistration registration = registrationOpt.get();
        
        // Cập nhật trạng thái yêu cầu
        registration.setStatus(PendingRegistration.RegistrationStatus.REJECTED);
        registration.setProcessedBy(rejectedBy);
        registration.setRejectionReason(rejectionReason);
        registration.setAdminNotes(adminNotes);
        registration.setProcessedAt(LocalDateTime.now());
        
        PendingRegistration updated = pendingRegistrationRepository.save(registration);
        logger.info("Registration rejected for username: {}", registration.getUsername());
        
        return new PendingRegistrationResponse(updated);
    }
    
    // Đếm số lượng yêu cầu chờ phê duyệt
    public long countPendingRegistrations() {
        return pendingRegistrationRepository.countByStatus(PendingRegistration.RegistrationStatus.PENDING);
    }
    
    // Lấy thông tin chi tiết một yêu cầu
    public Optional<PendingRegistrationResponse> getRegistrationById(Integer id) {
        return pendingRegistrationRepository.findById(id)
            .map(PendingRegistrationResponse::new);
    }
}

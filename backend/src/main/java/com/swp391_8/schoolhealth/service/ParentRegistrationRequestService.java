package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.ParentRegistrationRequestDTO;
import com.swp391_8.schoolhealth.model.ParentRegistrationRequest;
import com.swp391_8.schoolhealth.model.Role;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.ParentRegistrationRequestRepository;
import com.swp391_8.schoolhealth.repository.RoleRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParentRegistrationRequestService {
    
    private final ParentRegistrationRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    /**
     * Tạo request đăng ký mới từ parent với validation toàn diện
     */
    @Transactional
    public ParentRegistrationRequestDTO createRegistrationRequest(ParentRegistrationRequestDTO requestDTO) {
        // Validation toàn diện với User table
        StringBuilder validationErrors = new StringBuilder();
        
        // Kiểm tra parent code
        if (requestRepository.existsByParentCode(requestDTO.getParentCode())) {
            validationErrors.append("Parent ID already has a pending registration request. ");
        }
        if (userRepository.existsByUserCode(requestDTO.getParentCode())) {
            validationErrors.append("Parent ID already exists in the system. ");
        }
        
        // Kiểm tra username  
        if (requestRepository.existsByUsername(requestDTO.getUsername())) {
            validationErrors.append("Username already has a pending registration request. ");
        }
        if (userRepository.existsByUsername(requestDTO.getUsername())) {
            validationErrors.append("Username already exists in the system. ");
        }
        
        // Kiểm tra email
        if (requestRepository.existsByEmail(requestDTO.getEmail())) {
            validationErrors.append("Email already has a pending registration request. ");
        }
        if (userRepository.existsByEmail(requestDTO.getEmail())) {
            validationErrors.append("Email already exists in the system. ");
        }
        
        // Kiểm tra phone number
        if (requestRepository.existsByPhoneNumber(requestDTO.getPhoneNumber())) {
            validationErrors.append("Phone number already has a pending registration request. ");
        }
        if (userRepository.existsByPhoneNumber(requestDTO.getPhoneNumber())) {
            validationErrors.append("Phone number already exists in the system. ");
        }
        
        // Validation format
        if (requestDTO.getEmail() != null && !isValidEmail(requestDTO.getEmail())) {
            validationErrors.append("Invalid email format. ");
        }
        
        if (requestDTO.getPhoneNumber() != null && !isValidPhoneNumber(requestDTO.getPhoneNumber())) {
            validationErrors.append("Phone number must be 10-15 digits. ");
        }
        
        if (requestDTO.getPassword() != null && requestDTO.getPassword().length() < 6) {
            validationErrors.append("Password must be at least 6 characters long. ");
        }
        
        // Nếu có lỗi validation, throw exception với message chi tiết
        if (validationErrors.length() > 0) {
            throw new RuntimeException(validationErrors.toString().trim());
        }

        ParentRegistrationRequest request = new ParentRegistrationRequest();
        request.setParentCode(requestDTO.getParentCode());
        request.setUsername(requestDTO.getUsername());
        request.setPassword(requestDTO.getPassword()); // Note: Should hash this in production
        request.setFullName(requestDTO.getFullName());
        request.setEmail(requestDTO.getEmail());
        request.setPhoneNumber(requestDTO.getPhoneNumber());
        request.setStudentCode(requestDTO.getStudentCode());
        request.setStudentName(requestDTO.getStudentName());
        request.setRelationship(requestDTO.getRelationship());
        request.setStatus(ParentRegistrationRequest.RequestStatus.PENDING);

        ParentRegistrationRequest savedRequest = requestRepository.save(request);
        return convertToDTO(savedRequest);
    }
    
    /**
     * Validate email format
     */
    private boolean isValidEmail(String email) {
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }
    
    /**
     * Validate phone number format
     */
    private boolean isValidPhoneNumber(String phoneNumber) {
        return phoneNumber.matches("^[0-9]{10,15}$");
    }

    /**
     * Lấy tất cả registration requests
     */
    public List<ParentRegistrationRequestDTO> getAllRegistrationRequests() {
        return requestRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy requests theo status
     */
    public List<ParentRegistrationRequestDTO> getRequestsByStatus(String status) {
        ParentRegistrationRequest.RequestStatus requestStatus = 
            ParentRegistrationRequest.RequestStatus.valueOf(status.toUpperCase());
        return requestRepository.findByStatusOrderByCreatedAtDesc(requestStatus)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy số lượng pending requests
     */
    public long getPendingRequestsCount() {
        return requestRepository.countByStatus(ParentRegistrationRequest.RequestStatus.PENDING);
    }

    /**
     * Approve registration request và tạo user account
     */
    @Transactional
    public Map<String, Object> approveRequest(Integer requestId, Integer adminId) {
        ParentRegistrationRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Registration request not found"));

        if (request.getStatus() != ParentRegistrationRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Request is not in pending status");
        }

        // Generate new password for security
        String generatedPassword = generateSecurePassword();

        // Tạo user account
        createUserFromRequest(request, generatedPassword);

        // Cập nhật request status
        request.setStatus(ParentRegistrationRequest.RequestStatus.APPROVED);
        request.setReviewedBy(adminId);
        request.setReviewedAt(LocalDateTime.now());

        ParentRegistrationRequest savedRequest = requestRepository.save(request);
        
        // Return both DTO and generated password
        Map<String, Object> result = new HashMap<>();
        result.put("request", convertToDTO(savedRequest));
        result.put("generatedPassword", generatedPassword);
        result.put("originalRequest", request);
        
        return result;
    }

    /**
     * Decline registration request
     */
    @Transactional
    public ParentRegistrationRequestDTO declineRequest(Integer requestId, Integer adminId, String reason) {
        ParentRegistrationRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Registration request not found"));

        if (request.getStatus() != ParentRegistrationRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Request is not in pending status");
        }

        request.setStatus(ParentRegistrationRequest.RequestStatus.DECLINED);
        request.setDeclineReason(reason);
        request.setReviewedBy(adminId);
        request.setReviewedAt(LocalDateTime.now());

        ParentRegistrationRequest savedRequest = requestRepository.save(request);
        return convertToDTO(savedRequest);
    }

    /**
     * Tạo user account từ approved request
     */
    private void createUserFromRequest(ParentRegistrationRequest request, String generatedPassword) {
        // Tìm Parent role
        Role parentRole = roleRepository.findByRoleName("Parent")
                .orElseThrow(() -> new RuntimeException("Parent role not found"));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(generatedPassword); // Use generated password
        user.setUserCode(request.getParentCode());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(parentRole);
        user.setIsActive(true);

        userRepository.save(user);
    }

    /**
     * Generate secure password for new user
     */
    private String generateSecurePassword() {
        // Generate a secure random password
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
        StringBuilder password = new StringBuilder();
        
        for (int i = 0; i < 12; i++) {
            int index = (int) (Math.random() * chars.length());
            password.append(chars.charAt(index));
        }
        
        return password.toString();
    }

    /**
     * Convert entity to DTO
     */
    private ParentRegistrationRequestDTO convertToDTO(ParentRegistrationRequest request) {
        ParentRegistrationRequestDTO dto = new ParentRegistrationRequestDTO();
        dto.setRequestId(request.getRequestId());
        dto.setParentCode(request.getParentCode());
        dto.setUsername(request.getUsername());
        // Don't include password in DTO
        dto.setFullName(request.getFullName());
        dto.setEmail(request.getEmail());
        dto.setPhoneNumber(request.getPhoneNumber());
        dto.setStudentCode(request.getStudentCode());
        dto.setStudentName(request.getStudentName());
        dto.setRelationship(request.getRelationship());
        dto.setStatus(request.getStatus().toString());
        dto.setDeclineReason(request.getDeclineReason());
        dto.setReviewedBy(request.getReviewedBy());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setReviewedAt(request.getReviewedAt());

        // Get reviewer name if available
        if (request.getReviewedBy() != null) {
            Optional<User> reviewer = userRepository.findById(request.getReviewedBy());
            reviewer.ifPresent(user -> dto.setReviewedByName(user.getFullName()));
        }

        return dto;
    }

    /**
     * Get request by ID
     */
    public ParentRegistrationRequestDTO getRequestById(Integer requestId) {
        ParentRegistrationRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Registration request not found"));
        return convertToDTO(request);
    }
}

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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParentRegistrationRequestService {
    
    private final ParentRegistrationRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    /**
     * Tạo request đăng ký mới từ parent
     */
    @Transactional
    public ParentRegistrationRequestDTO createRegistrationRequest(ParentRegistrationRequestDTO requestDTO) {
        // Kiểm tra xem parent code đã tồn tại request nào chưa
        if (requestRepository.existsByParentCode(requestDTO.getParentCode())) {
            throw new RuntimeException("Parent code already has a registration request");
        }
        
        // Kiểm tra xem username đã được sử dụng chưa
        if (requestRepository.existsByUsername(requestDTO.getUsername()) || 
            userRepository.existsByUsername(requestDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        // Kiểm tra xem email đã được sử dụng chưa
        if (requestRepository.existsByEmail(requestDTO.getEmail()) || 
            userRepository.existsByEmail(requestDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
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
    public ParentRegistrationRequestDTO approveRequest(Integer requestId, Integer adminId) {
        ParentRegistrationRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Registration request not found"));

        if (request.getStatus() != ParentRegistrationRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Request is not in pending status");
        }

        // Tạo user account
        createUserFromRequest(request);

        // Cập nhật request status
        request.setStatus(ParentRegistrationRequest.RequestStatus.APPROVED);
        request.setReviewedBy(adminId);
        request.setReviewedAt(LocalDateTime.now());

        ParentRegistrationRequest savedRequest = requestRepository.save(request);
        return convertToDTO(savedRequest);
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
    private void createUserFromRequest(ParentRegistrationRequest request) {
        // Tìm Parent role
        Role parentRole = roleRepository.findByRoleName("Parent")
                .orElseThrow(() -> new RuntimeException("Parent role not found"));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword()); // Note: Should hash this in production
        user.setUserCode(request.getParentCode());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(parentRole);
        user.setIsActive(true);

        userRepository.save(user);
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

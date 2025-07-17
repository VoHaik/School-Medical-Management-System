package com.swp391_8.schoolhealth.service.impl;

import com.swp391_8.schoolhealth.dto.MedicationRequestDTO;
import com.swp391_8.schoolhealth.dto.MedicationRequestResponseDTO;
import com.swp391_8.schoolhealth.model.MedicationRequest;
import com.swp391_8.schoolhealth.model.MedicationRequest.MedicationRequestStatus;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.MedicationRequestRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.service.MedicationRequestServiceInterface;
import com.swp391_8.schoolhealth.service.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicationRequestServiceImpl implements MedicationRequestServiceInterface {

    @Autowired
    private MedicationRequestRepository medicationRequestRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SecurityService securityService;

    private MedicationRequestResponseDTO convertToResponseDTO(MedicationRequest request) {
        if (request == null) {
            return null;
        }

        String studentName = "N/A";
        String studentCode = null;
        if (request.getStudent() != null) {
            studentCode = request.getStudent().getStudentCode();
            studentName = request.getStudent().getFullName(); // Use student's fullName directly
            if (studentName == null || studentName.trim().isEmpty()) {
                studentName = "Student Code: " + studentCode; // Fallback
            }
        }
        
        String requestedByName = (request.getRequestedBy() != null) ?
                            request.getRequestedBy().getFullName() : "N/A";
        String approvedByName = (request.getApprovedBy() != null) ?
                                request.getApprovedBy().getFullName() : null;
        String administeredByName = (request.getAdministeredBy() != null) ?
                                    request.getAdministeredBy().getFullName() : null;

        return new MedicationRequestResponseDTO(
                request.getRequestId(),
                studentCode,
                studentName,
                requestedByName,
                request.getMedicationName(),
                request.getDosage(),
                request.getFrequency(),
                request.getStartDate(),
                request.getEndDate(),
                request.getReason(),
                request.getNotes(),
                request.getStatus() != null ? request.getStatus().name() : null,
                request.getRequestDate(),
                approvedByName,
                request.getApprovalDate(),
                administeredByName,
                request.getAdministeredAt(),
                request.getAdministrationNotes()
        );
    }

    @Override
    @Transactional
    public MedicationRequestResponseDTO createMedicationRequest(MedicationRequestDTO medicationRequestDTO, String requestedByUsername, String studentCode) {
        User requestedBy = userRepository.findByUsername(requestedByUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + requestedByUsername));
                
        Student student = studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with code: " + studentCode));

        MedicationRequest request = new MedicationRequest();
        request.setRequestedBy(requestedBy);
        request.setStudent(student);
        request.setMedicationName(medicationRequestDTO.getMedicationName());
        request.setDosage(medicationRequestDTO.getDosage());
        request.setFrequency(medicationRequestDTO.getFrequency());
        request.setStartDate(medicationRequestDTO.getStartDate());
        request.setEndDate(medicationRequestDTO.getEndDate());
        request.setReason(medicationRequestDTO.getReason());

        // Initialize with defaults for new requests
        request.setStatus(MedicationRequestStatus.PENDING);
        request.setRequestDate(LocalDateTime.now());
        request.setNotes(medicationRequestDTO.getNotes()); // Store parent's notes

        MedicationRequest savedRequest = medicationRequestRepository.save(request);
        return convertToResponseDTO(savedRequest);
    }

    @Override
    @Transactional
    public MedicationRequestResponseDTO updateMedicationRequest(Integer requestId, MedicationRequestDTO medicationRequestDTO) {
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicationRequest not found with id: " + requestId));
        
        // Update only what's allowed (not status, etc.)
        // Only allow updates if status is PENDING
        if (request.getStatus() != MedicationRequestStatus.PENDING) {
            throw new IllegalStateException("Only PENDING requests can be updated.");
        }
        
        request.setMedicationName(medicationRequestDTO.getMedicationName());
        request.setDosage(medicationRequestDTO.getDosage());
        request.setFrequency(medicationRequestDTO.getFrequency());
        request.setStartDate(medicationRequestDTO.getStartDate());
        request.setEndDate(medicationRequestDTO.getEndDate());
        request.setReason(medicationRequestDTO.getReason());
        request.setNotes(medicationRequestDTO.getNotes());
        
        MedicationRequest updatedRequest = medicationRequestRepository.save(request);
        return convertToResponseDTO(updatedRequest);
    }

    @Override
    @Transactional
    public void deleteMedicationRequest(Integer requestId) {
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicationRequest not found with id: " + requestId));
        
        // Only allow deletion if status is PENDING
        if (request.getStatus() != MedicationRequestStatus.PENDING) {
            throw new IllegalStateException("Only PENDING requests can be deleted.");
        }
        
        medicationRequestRepository.deleteById(requestId);
    }

    @Override
    public MedicationRequestResponseDTO getMedicationRequestById(Integer requestId) {
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicationRequest not found with id: " + requestId));
        return convertToResponseDTO(request);
    }

    @Override
    public List<MedicationRequestResponseDTO> getAllMedicationRequests() {
        return medicationRequestRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }    @Override
    public List<MedicationRequestResponseDTO> getMedicationRequestsByStatus(MedicationRequestStatus status) {
        return medicationRequestRepository.findByStatusOrderByRequestDateDesc(status).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicationRequestResponseDTO> getMedicationRequestsByStudentCode(String studentCode) {
        return medicationRequestRepository.findByStudent_StudentCode(studentCode).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MedicationRequestResponseDTO approveMedicationRequest(Integer requestId, String approverUsername, String notes) {
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicationRequest not found with id: " + requestId));
        
        User approver = userRepository.findByUsername(approverUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + approverUsername));
        
        if (request.getStatus() != MedicationRequestStatus.PENDING) {
            throw new IllegalStateException("Only PENDING requests can be approved. Current status: " + request.getStatus());
        }
        
        request.setStatus(MedicationRequestStatus.APPROVED);
        request.setApprovedBy(approver);
        request.setActionDate(LocalDateTime.now());
        request.setApprovalDate(LocalDateTime.now());
        
        if (notes != null && !notes.trim().isEmpty()) {
            // Append new notes to existing ones
            String existingNotes = request.getNotes();
            String newNotes = (existingNotes != null && !existingNotes.trim().isEmpty()) ? 
                            existingNotes + "\n\nApproval Notes (" + LocalDateTime.now() + "):\n" + notes :
                            "Approval Notes (" + LocalDateTime.now() + "):\n" + notes;
            request.setNotes(newNotes);
        }
        
        MedicationRequest updatedRequest = medicationRequestRepository.save(request);
        return convertToResponseDTO(updatedRequest);
    }

    @Override
    @Transactional
    public MedicationRequestResponseDTO rejectMedicationRequest(Integer requestId, String rejectorUsername, String notes) {
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicationRequest not found with id: " + requestId));
        
        User rejector = userRepository.findByUsername(rejectorUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + rejectorUsername));
        
        if (request.getStatus() != MedicationRequestStatus.PENDING) {
            throw new IllegalStateException("Only PENDING requests can be rejected. Current status: " + request.getStatus());
        }
        
        request.setStatus(MedicationRequestStatus.REJECTED);
        request.setApprovedBy(rejector); // Using the same field but for rejection
        request.setActionDate(LocalDateTime.now());
        
        if (notes != null && !notes.trim().isEmpty()) {
            // Append new notes to existing ones
            String existingNotes = request.getNotes();
            String newNotes = (existingNotes != null && !existingNotes.trim().isEmpty()) ? 
                            existingNotes + "\n\nRejection Notes (" + LocalDateTime.now() + "):\n" + notes :
                            "Rejection Notes (" + LocalDateTime.now() + "):\n" + notes;
            request.setNotes(newNotes);
        }
        
        MedicationRequest updatedRequest = medicationRequestRepository.save(request);
        return convertToResponseDTO(updatedRequest);
    }

    @Override
    @Transactional
    public MedicationRequestResponseDTO administeredMedicationRequest(Integer requestId, String administeredByUsername, String notes) {
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicationRequest not found with id: " + requestId));
        
        User administrator = userRepository.findByUsername(administeredByUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + administeredByUsername));
        
        if (request.getStatus() != MedicationRequestStatus.APPROVED) {
            throw new IllegalStateException("Only APPROVED requests can be administered. Current status: " + request.getStatus());
        }
        
        request.setStatus(MedicationRequestStatus.ADMINISTERED);
        request.setAdministeredBy(administrator);
        request.setAdministeredAt(LocalDateTime.now());
        request.setAdministrationNotes(notes);
        
        MedicationRequest updatedRequest = medicationRequestRepository.save(request);
        return convertToResponseDTO(updatedRequest);
    }

    @Override
    public boolean canReviewMedicationRequest(User user, Integer requestId) {
        if (user == null) return false;
          // Check if user has the appropriate role
        // This is a simple check that can be made more sophisticated based on your requirements
        if (user.getRole().getRoleName().equals("SchoolNurse") || user.getRole().getRoleName().equals("Admin")) {
            return true;
        }
        
        return false;
    }

    @Override
    public boolean canManageMedicationRequest(Authentication authentication, Integer requestId) {
        if (authentication == null) return false;
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userDetails.getId()));
        
        MedicationRequest request = medicationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicationRequest not found with id: " + requestId));
        
        // A user can manage a request if they are the requester OR nurse with appropriate role
        if (request.getRequestedBy() != null && request.getRequestedBy().getId().equals(user.getId())) {
            return true;
        }        // For nurses or admins, check role
        if (userDetails.getAuthorities().stream().anyMatch(auth -> 
                auth.getAuthority().equals("SchoolNurse") || auth.getAuthority().equals("Admin"))) {
            return true;
        }
        
        return false;
    }

    @Override
    public List<MedicationRequestResponseDTO> getMedicationRequestsByStudentCodeAndStatus(String studentCode, List<MedicationRequestStatus> statuses) {
        return medicationRequestRepository.findByStudent_StudentCodeAndStatusIn(studentCode, statuses).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
}

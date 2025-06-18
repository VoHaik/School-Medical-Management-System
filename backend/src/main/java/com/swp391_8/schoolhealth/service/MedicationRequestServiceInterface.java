package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.MedicationRequestDTO;
import com.swp391_8.schoolhealth.dto.MedicationRequestResponseDTO;
import com.swp391_8.schoolhealth.model.MedicationRequest.MedicationRequestStatus;
import com.swp391_8.schoolhealth.model.User;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.List;

public interface MedicationRequestServiceInterface {
    MedicationRequestResponseDTO createMedicationRequest(MedicationRequestDTO medicationRequestDTO, String requestedByUsername, String studentCode);
    
    MedicationRequestResponseDTO updateMedicationRequest(Integer requestId, MedicationRequestDTO medicationRequestDTO);
    
    void deleteMedicationRequest(Integer requestId);
    
    MedicationRequestResponseDTO getMedicationRequestById(Integer requestId);
    
    List<MedicationRequestResponseDTO> getAllMedicationRequests();
    
    List<MedicationRequestResponseDTO> getMedicationRequestsByStatus(MedicationRequestStatus status);
    
    List<MedicationRequestResponseDTO> getMedicationRequestsByStudentCode(String studentCode);
    
    MedicationRequestResponseDTO approveMedicationRequest(Integer requestId, String approverUsername, String notes);
    
    MedicationRequestResponseDTO rejectMedicationRequest(Integer requestId, String rejectorUsername, String notes);
    
    MedicationRequestResponseDTO administeredMedicationRequest(Integer requestId, String administeredByUsername, String notes);
    
    boolean canReviewMedicationRequest(User user, Integer requestId);
    
    boolean canManageMedicationRequest(Authentication authentication, Integer requestId);
    
    List<MedicationRequestResponseDTO> getMedicationRequestsByStudentCodeAndStatus(String studentCode, List<MedicationRequestStatus> statuses);
}

package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.HealthDeclarationDTO;
import com.swp391_8.schoolhealth.dto.MedicationDTO;
import java.util.List;
import java.util.Optional;

public interface HealthDeclarationService {
    HealthDeclarationDTO saveHealthDeclaration(HealthDeclarationDTO dto, String username);
    Optional<HealthDeclarationDTO> getHealthDeclarationByStudentCode(String studentCode);
    List<HealthDeclarationDTO> getAllHealthDeclarationsByStudentCode(String studentCode);
    
    // Method to get all health declarations (for admin/nurse dashboard)
    List<HealthDeclarationDTO> getAllHealthDeclarations();
    
    // Method to get accepted health declaration for student
    Optional<HealthDeclarationDTO> getAcceptedHealthDeclarationByStudentCode(String studentCode);
    // Optional<HealthDeclarationDTO> getDraftHealthDeclarationByStudentCode(String studentCode);
    // Add other methods as needed, e.g., for fetching specific declarations
    
    // Method to get approved medications for a student
    List<MedicationDTO> getApprovedMedicationsForStudent(String studentCode);
    
    // Phương thức mới để phê duyệt hoặc từ chối khai báo sức khỏe
    HealthDeclarationDTO reviewHealthDeclaration(
        Integer declarationId, 
        String status,  // "APPROVED" hoặc "REJECTED"
        String reviewNotes,
        String reviewerUsername
    );
    
    // Phương thức lấy danh sách khai báo sức khỏe cần phê duyệt
    List<HealthDeclarationDTO> getPendingHealthDeclarations();
      // Phương thức lấy khai báo sức khỏe theo ID
    HealthDeclarationDTO getHealthDeclarationById(Integer declarationId);
    
    // Phương thức cho y tá chỉnh sửa hồ sơ sức khỏe học sinh
    HealthDeclarationDTO nurseEditHealthDeclaration(
        String studentCode,
        HealthDeclarationDTO healthDeclarationData,
        String nurseUsername
    );
}

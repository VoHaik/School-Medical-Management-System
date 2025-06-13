package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.HealthDeclarationDTO;
import java.util.Optional;

public interface HealthDeclarationService {
    HealthDeclarationDTO saveHealthDeclaration(HealthDeclarationDTO dto, String username);
    Optional<HealthDeclarationDTO> getHealthDeclarationByStudentCode(String studentCode);
    // Optional<HealthDeclarationDTO> getDraftHealthDeclarationByStudentCode(String studentCode);
    // Add other methods as needed, e.g., for fetching specific declarations
}

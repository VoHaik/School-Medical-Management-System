package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.MedicalEventDTO;
import java.time.LocalDate;
import java.util.List;

public interface MedicalEventServiceInterface {
    List<MedicalEventDTO> getAllMedicalEvents(String studentCode, LocalDate startDate, LocalDate endDate, String severity, String eventTypeName, String status);
    
    List<MedicalEventDTO> getMedicalEventsByStudentStudentCode(String studentCode);
    
    MedicalEventDTO createMedicalEvent(MedicalEventDTO medicalEventDTO, String creatorUsername);
    
    MedicalEventDTO updateMedicalEvent(Integer eventId, MedicalEventDTO medicalEventDTO, String updaterUsername);
    
    void deleteMedicalEvent(Integer eventId);
}

package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.ConsultationDTO;
import java.util.List;

public interface ConsultationService {
    ConsultationDTO findById(Integer id);
    List<ConsultationDTO> findByStudentCode(String studentCode);
    ConsultationDTO createConsultation(ConsultationDTO consultationDTO);
    ConsultationDTO updateConsultation(Integer id, ConsultationDTO consultationDTO);
    void deleteConsultation(Integer id);
}

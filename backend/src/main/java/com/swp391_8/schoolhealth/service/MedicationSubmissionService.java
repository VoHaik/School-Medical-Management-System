package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.MedicationSubmissionDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MedicationSubmissionService {
    MedicationSubmissionDTO saveMedicationSubmission(MedicationSubmissionDTO medicationSubmissionDTO, MultipartFile doctorNote);
    List<MedicationSubmissionDTO> getMedicationSubmissionsByStudentCode(String studentCode);
}

package com.swp391_8.schoolhealth.service.impl;

import com.swp391_8.schoolhealth.dto.MedicationSubmissionDTO;
import com.swp391_8.schoolhealth.model.MedicationSubmission;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.repository.MedicationSubmissionRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.service.MedicationSubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MedicationSubmissionServiceImpl implements MedicationSubmissionService {

    @Autowired
    private MedicationSubmissionRepository medicationSubmissionRepository;

    @Autowired
    private StudentRepository studentRepository; // Assuming you have a StudentRepository

    private final Path fileStorageLocation = Paths.get("uploads/doctors-notes").toAbsolutePath().normalize();

    public MedicationSubmissionServiceImpl() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Override
    public MedicationSubmissionDTO saveMedicationSubmission(MedicationSubmissionDTO dto, MultipartFile doctorNote) {
        Student student = studentRepository.findByStudentCode(dto.getStudentCode())
                .orElseThrow(() -> new RuntimeException("Student not found with code: " + dto.getStudentCode()));

        MedicationSubmission submission = new MedicationSubmission();
        submission.setStudent(student);
        submission.setMedicationName(dto.getMedicationName());
        submission.setDosage(dto.getDosage());
        submission.setFrequency(dto.getFrequency());
        submission.setStartDate(dto.getStartDate());
        submission.setEndDate(dto.getEndDate());
        submission.setReason(dto.getReason());
        submission.setSubmissionDate(dto.getSubmissionDate());
        // submission.setParent(student.getParent()); // Assuming Student entity has a getParent() method

        if (doctorNote != null && !doctorNote.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + doctorNote.getOriginalFilename();
            try {
                Path targetLocation = this.fileStorageLocation.resolve(fileName);
                Files.copy(doctorNote.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
                submission.setDoctorNotePath(targetLocation.toString());
            } catch (IOException ex) {
                throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
            }
        }

        MedicationSubmission savedSubmission = medicationSubmissionRepository.save(submission);
        return convertToDTO(savedSubmission);
    }

    @Override
    public List<MedicationSubmissionDTO> getMedicationSubmissionsByStudentCode(String studentCode) {
        return medicationSubmissionRepository.findByStudentStudentCode(studentCode).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private MedicationSubmissionDTO convertToDTO(MedicationSubmission submission) {
        MedicationSubmissionDTO dto = new MedicationSubmissionDTO();
        dto.setSubmissionId(submission.getSubmissionId());
        dto.setStudentCode(submission.getStudent().getStudentCode());
        // dto.setParentId(submission.getParent().getUserId()); // Assuming Parent entity has getUserId()
        dto.setMedicationName(submission.getMedicationName());
        dto.setDosage(submission.getDosage());
        dto.setFrequency(submission.getFrequency());
        dto.setStartDate(submission.getStartDate());
        dto.setEndDate(submission.getEndDate());
        dto.setReason(submission.getReason());
        dto.setDoctorNotePath(submission.getDoctorNotePath());
        dto.setSubmissionDate(submission.getSubmissionDate());
        return dto;
    }
}

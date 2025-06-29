package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.GradeLevelDTO;
import com.swp391_8.schoolhealth.model.GradeLevel;
import com.swp391_8.schoolhealth.repository.GradeLevelRepository;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GradeLevelService {
    
    private final GradeLevelRepository gradeLevelRepository;

    @Transactional(readOnly = true)
    public List<GradeLevelDTO> getAllActiveGradeLevels() {
        return gradeLevelRepository.findByIsActiveTrueOrderByGradeName()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GradeLevelDTO getGradeLevelById(Integer gradeId) {
        GradeLevel gradeLevel = gradeLevelRepository.findById(gradeId)
                .orElseThrow(() -> new ResourceNotFoundException("GradeLevel", "id", gradeId));
        return convertToDTO(gradeLevel);
    }

    @Transactional(readOnly = true)
    public GradeLevelDTO getGradeLevelByNumber(Integer gradeNumber) {
        GradeLevel gradeLevel = gradeLevelRepository.findByGradeNumber(gradeNumber)
                .orElseThrow(() -> new ResourceNotFoundException("GradeLevel", "gradeNumber", gradeNumber));
        return convertToDTO(gradeLevel);
    }

    @Transactional(readOnly = true)
    public List<GradeLevelDTO> getGradeLevelsByRange(Integer minGrade, Integer maxGrade) {
        return gradeLevelRepository.findByGradeNumberBetweenAndIsActiveTrue(minGrade, maxGrade)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GradeLevelDTO> getGradeLevelsByAge(Integer age) {
        // Since we removed age fields, we'll approximate based on typical age-grade mapping
        // Age 6 = Grade 1, Age 7 = Grade 2, etc.
        Integer approximateGrade = Math.max(1, Math.min(12, age - 5));
        return gradeLevelRepository.findByGradeNumberAndIsActiveTrue(approximateGrade)
                .map(this::convertToDTO)
                .map(List::of)
                .orElse(List.of());
    }

    @Transactional
    public void initializeStandardGradeLevels() {
        // Initialize grades 1-12 if they don't exist
        for (int i = 1; i <= 12; i++) {
            String gradeName = GradeLevel.generateGradeName(i);
            if (!gradeLevelRepository.existsByGradeName(gradeName)) {
                GradeLevel gradeLevel = new GradeLevel();
                gradeLevel.setGradeName(gradeName);
                gradeLevel.setIsActive(true);
                gradeLevelRepository.save(gradeLevel);
            }
        }
    }

    @Transactional
    public GradeLevelDTO createGradeLevel(GradeLevelDTO gradeLevelDTO) {
        if (gradeLevelRepository.existsByGradeName(gradeLevelDTO.getGradeName())) {
            throw new IllegalArgumentException("Grade name " + gradeLevelDTO.getGradeName() + " already exists");
        }

        GradeLevel gradeLevel = convertToEntity(gradeLevelDTO);
        GradeLevel savedGradeLevel = gradeLevelRepository.save(gradeLevel);
        return convertToDTO(savedGradeLevel);
    }

    @Transactional
    public GradeLevelDTO updateGradeLevel(Integer gradeId, GradeLevelDTO gradeLevelDTO) {
        GradeLevel existingGradeLevel = gradeLevelRepository.findById(gradeId)
                .orElseThrow(() -> new ResourceNotFoundException("GradeLevel", "id", gradeId));

        // Check if grade name is being changed and if it conflicts
        if (!existingGradeLevel.getGradeName().equals(gradeLevelDTO.getGradeName())) {
            if (gradeLevelRepository.existsByGradeName(gradeLevelDTO.getGradeName())) {
                throw new IllegalArgumentException("Grade name " + gradeLevelDTO.getGradeName() + " already exists");
            }
        }

        existingGradeLevel.setGradeName(gradeLevelDTO.getGradeName());
        existingGradeLevel.setIsActive(gradeLevelDTO.getIsActive());

        GradeLevel updatedGradeLevel = gradeLevelRepository.save(existingGradeLevel);
        return convertToDTO(updatedGradeLevel);
    }

    @Transactional
    public void deleteGradeLevel(Integer gradeId) {
        GradeLevel gradeLevel = gradeLevelRepository.findById(gradeId)
                .orElseThrow(() -> new ResourceNotFoundException("GradeLevel", "id", gradeId));
        gradeLevelRepository.delete(gradeLevel);
    }

    // Utility method to get grade display options for frontend
    @Transactional(readOnly = true)
    public List<String> getGradeDisplayOptions() {
        return gradeLevelRepository.findByIsActiveTrueOrderByGradeName()
                .stream()
                .map(grade -> grade.getGradeName())
                .collect(Collectors.toList());
    }

    private GradeLevelDTO convertToDTO(GradeLevel gradeLevel) {
        GradeLevelDTO dto = new GradeLevelDTO();
        dto.setGradeId(gradeLevel.getGradeId());
        dto.setGradeName(gradeLevel.getGradeName());
        dto.setIsActive(gradeLevel.getIsActive());
        return dto;
    }

    private GradeLevel convertToEntity(GradeLevelDTO dto) {
        GradeLevel gradeLevel = new GradeLevel();
        gradeLevel.setGradeName(dto.getGradeName());
        gradeLevel.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        return gradeLevel;
    }
}

package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.HealthCheckupTypeDTO;
import com.swp391_8.schoolhealth.model.HealthCheckupType;
import com.swp391_8.schoolhealth.repository.HealthCheckupTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HealthCheckupTypeService {
    
    @Autowired
    private HealthCheckupTypeRepository healthCheckupTypeRepository;
    
    public List<HealthCheckupTypeDTO> getAllActiveCheckupTypes() {
        return healthCheckupTypeRepository.findAllActiveOrderByTypeName()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<HealthCheckupTypeDTO> searchCheckupTypes(String searchTerm) {
        return healthCheckupTypeRepository.searchActiveCheckupTypes(searchTerm)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public HealthCheckupTypeDTO getCheckupTypeById(Long id) {
        Optional<HealthCheckupType> checkupType = healthCheckupTypeRepository.findById(id);
        return checkupType.map(this::convertToDTO).orElse(null);
    }
    
    public HealthCheckupTypeDTO createCheckupType(HealthCheckupTypeDTO dto) {
        HealthCheckupType checkupType = convertToEntity(dto);
        HealthCheckupType savedCheckupType = healthCheckupTypeRepository.save(checkupType);
        return convertToDTO(savedCheckupType);
    }
    
    public HealthCheckupTypeDTO updateCheckupType(Long id, HealthCheckupTypeDTO dto) {
        Optional<HealthCheckupType> existingCheckupType = healthCheckupTypeRepository.findById(id);
        if (existingCheckupType.isPresent()) {
            HealthCheckupType checkupType = existingCheckupType.get();
            updateEntityFromDTO(checkupType, dto);
            HealthCheckupType savedCheckupType = healthCheckupTypeRepository.save(checkupType);
            return convertToDTO(savedCheckupType);
        }
        return null;
    }
    
    public boolean deleteCheckupType(Long id) {
        Optional<HealthCheckupType> checkupType = healthCheckupTypeRepository.findById(id);
        if (checkupType.isPresent()) {
            HealthCheckupType type = checkupType.get();
            type.setIsActive(false); // Soft delete
            healthCheckupTypeRepository.save(type);
            return true;
        }
        return false;
    }
    
    private HealthCheckupTypeDTO convertToDTO(HealthCheckupType entity) {
        HealthCheckupTypeDTO dto = new HealthCheckupTypeDTO();
        dto.setCheckupTypeId(entity.getCheckupTypeId());
        dto.setTypeName(entity.getTypeName());
        dto.setDescription(entity.getDescription());
        dto.setIsRequiredMeasurement(entity.getIsRequiredMeasurement());
        dto.setIsRequiredVitalSigns(entity.getIsRequiredVitalSigns());
        dto.setIsRequiredVisionTest(entity.getIsRequiredVisionTest());
        dto.setIsRequiredHearingTest(entity.getIsRequiredHearingTest());
        dto.setEstimatedDurationMinutes(entity.getEstimatedDurationMinutes());
        dto.setIsActive(entity.getIsActive());
        return dto;
    }
    
    private HealthCheckupType convertToEntity(HealthCheckupTypeDTO dto) {
        HealthCheckupType entity = new HealthCheckupType();
        updateEntityFromDTO(entity, dto);
        return entity;
    }
    
    private void updateEntityFromDTO(HealthCheckupType entity, HealthCheckupTypeDTO dto) {
        entity.setTypeName(dto.getTypeName());
        entity.setDescription(dto.getDescription());
        entity.setIsRequiredMeasurement(dto.getIsRequiredMeasurement());
        entity.setIsRequiredVitalSigns(dto.getIsRequiredVitalSigns());
        entity.setIsRequiredVisionTest(dto.getIsRequiredVisionTest());
        entity.setIsRequiredHearingTest(dto.getIsRequiredHearingTest());
        entity.setEstimatedDurationMinutes(dto.getEstimatedDurationMinutes());
        if (dto.getIsActive() != null) {
            entity.setIsActive(dto.getIsActive());
        }
    }
}

package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.VaccineDTO;
import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.model.Vaccine;
import com.swp391_8.schoolhealth.repository.VaccineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VaccineService {

    @Autowired
    private VaccineRepository vaccineRepository;

    // Mapper methods
    private VaccineDTO convertToDTO(Vaccine vaccine) {
        VaccineDTO dto = new VaccineDTO();
        dto.setVaccineId(vaccine.getVaccineId());
        dto.setName(vaccine.getName());
        dto.setDiseaseTargeted(vaccine.getDiseaseTargeted());
        dto.setDescription(vaccine.getDescription());
        dto.setManufacturer(vaccine.getManufacturer());
        dto.setStandardDoses(vaccine.getStandardDoses());
        return dto;
    }

    private Vaccine convertToEntity(VaccineDTO dto) {
        Vaccine vaccine = new Vaccine();
        // vaccineId is auto-generated, not set from DTO for creation
        vaccine.setName(dto.getName());
        vaccine.setDiseaseTargeted(dto.getDiseaseTargeted());
        vaccine.setDescription(dto.getDescription());
        vaccine.setManufacturer(dto.getManufacturer());
        vaccine.setStandardDoses(dto.getStandardDoses());
        return vaccine;
    }

    @Transactional
    public VaccineDTO createVaccine(VaccineDTO vaccineDTO) {
        Vaccine vaccine = convertToEntity(vaccineDTO);
        // Add any validation or business logic before saving, e.g., check for existing name
        if (vaccineRepository.findByName(vaccine.getName()).isPresent()) {
            throw new IllegalArgumentException("Vaccine with name '" + vaccine.getName() + "' already exists.");
        }
        vaccine = vaccineRepository.save(vaccine);
        return convertToDTO(vaccine);
    }

    @Transactional(readOnly = true)
    public List<VaccineDTO> getAllVaccines() {
        return vaccineRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VaccineDTO getVaccineById(Integer vaccineId) {
        Vaccine vaccine = vaccineRepository.findById(vaccineId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaccine not found with id: " + vaccineId));
        return convertToDTO(vaccine);
    }

    @Transactional
    public VaccineDTO updateVaccine(Integer vaccineId, VaccineDTO vaccineDTO) {
        Vaccine existingVaccine = vaccineRepository.findById(vaccineId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaccine not found with id: " + vaccineId));

        // Check if name is being changed and if the new name already exists
        if (!existingVaccine.getName().equals(vaccineDTO.getName()) &&
            vaccineRepository.findByName(vaccineDTO.getName()).isPresent()) {
            throw new IllegalArgumentException("Vaccine with name '" + vaccineDTO.getName() + "' already exists.");
        }

        existingVaccine.setName(vaccineDTO.getName());
        existingVaccine.setDiseaseTargeted(vaccineDTO.getDiseaseTargeted());
        existingVaccine.setDescription(vaccineDTO.getDescription());
        existingVaccine.setManufacturer(vaccineDTO.getManufacturer());
        existingVaccine.setStandardDoses(vaccineDTO.getStandardDoses());
        
        existingVaccine = vaccineRepository.save(existingVaccine);
        return convertToDTO(existingVaccine);
    }

    @Transactional
    public void deleteVaccine(Integer vaccineId) {
        Vaccine vaccine = vaccineRepository.findById(vaccineId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaccine not found with id: " + vaccineId));
        // Add any checks here, e.g., if the vaccine is in use by StudentVaccination records, etc.
        // For now, direct delete:
        vaccineRepository.delete(vaccine);
    }
}

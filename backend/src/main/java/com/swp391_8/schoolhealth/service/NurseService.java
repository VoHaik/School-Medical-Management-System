package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.Nurse;
import com.swp391_8.schoolhealth.repository.NurseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NurseService {

    @Autowired
    private NurseRepository nurseRepository;

    public List<Nurse> getAllNurses() {
        return nurseRepository.findAll();
    }

    public Optional<Nurse> getNurseById(Integer id) {
        return nurseRepository.findById(id);
    }

    public Optional<Nurse> getNurseByCode(String nurseCode) {
        return nurseRepository.findByNurseCode(nurseCode);
    }

    @Transactional
    public Nurse createNurse(Nurse nurse) {
        // The nurseCode is now expected to be set by the caller,
        // as it should correspond to the User's user_code.
        // If nurse.getNurseCode() is null or empty, it indicates an issue with
        // how the Nurse object is being prepared before calling this service method.
        // For example, a User object should be created first, its user_code generated,
        // and then that user_code used as the nurseCode.
        if (nurse.getNurseCode() == null || nurse.getNurseCode().isEmpty()) {
            // This situation should ideally be prevented by the calling code.
            // Throwing an exception or logging a warning might be appropriate.
            // For now, we'll proceed assuming it might be set, or rely on database constraints if it's mandatory.
            // Consider adding validation: throw new IllegalArgumentException("Nurse code cannot be null or empty.");
        }
        
        // Ensure professionalId is not null or empty, as it's a required field.
        if (nurse.getProfessionalId() == null || nurse.getProfessionalId().isEmpty()) {
            throw new IllegalArgumentException("Professional ID cannot be null or empty.");
        }

        return nurseRepository.save(nurse);
    }

    @Transactional
    public Optional<Nurse> updateNurse(Integer id, Nurse nurseDetails) {
        return nurseRepository.findById(id).map(nurse -> {
            // Update fields except for nurseCode and user
            if (nurseDetails.getProfessionalId() != null) {
                nurse.setProfessionalId(nurseDetails.getProfessionalId());
            }
            if (nurseDetails.getSpecialization() != null) {
                nurse.setSpecialization(nurseDetails.getSpecialization());
            }
            if (nurseDetails.getQualification() != null) {
                nurse.setQualification(nurseDetails.getQualification());
            }
            
            return nurseRepository.save(nurse);
        });
    }

    @Transactional
    public boolean deleteNurse(Integer id) {
        return nurseRepository.findById(id).map(nurse -> {
            nurseRepository.delete(nurse);
            return true;
        }).orElse(false);
    }
}

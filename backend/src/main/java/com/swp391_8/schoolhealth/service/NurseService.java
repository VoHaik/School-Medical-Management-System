package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.Nurse;
import com.swp391_8.schoolhealth.model.User;
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

    public Optional<Nurse> getNurseByUserId(Integer userId) {
        return nurseRepository.findByUserUserId(userId);
    }

    @Transactional
    public Nurse createNurse(Nurse nurse) {
        // Generate a unique nurse code if not provided
        if (nurse.getNurseCode() == null || nurse.getNurseCode().isEmpty()) {
            // Use user code if available, otherwise generate a new one
            User user = nurse.getUser();
            if (user != null && user.getUserCode() != null) {
                nurse.setNurseCode("NURSE_" + user.getUserCode());
            } else {
                nurse.setNurseCode("NURSE_" + System.currentTimeMillis());
            }
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

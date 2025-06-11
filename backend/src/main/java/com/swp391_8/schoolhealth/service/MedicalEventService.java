package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.MedicalEvent;
import com.swp391_8.schoolhealth.repository.MedicalEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalEventService {

    @Autowired
    private MedicalEventRepository medicalEventRepository;

    // Service methods for School Nurse will be added here later

    public List<MedicalEvent> getMedicalEventsByStudentId(Integer studentId) {
        return medicalEventRepository.findByStudentId(studentId);
    }
}

package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.HealthCheckup;
import com.swp391_8.schoolhealth.repository.HealthCheckupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HealthCheckupService {
    @Autowired
    private HealthCheckupRepository healthCheckupRepository;

    public List<HealthCheckup> getAll() {
        return healthCheckupRepository.findAll();
    }

    public Optional<HealthCheckup> getById(Long id) {
        return healthCheckupRepository.findById(id);
    }

    public List<HealthCheckup> getByStudentId(String studentId) {
        return healthCheckupRepository.findByStudentId(studentId);
    }

    public List<HealthCheckup> getByEventId(Long eventId) {
        return healthCheckupRepository.findByEventId(eventId);
    }

    public HealthCheckup save(HealthCheckup checkup) {
        return healthCheckupRepository.save(checkup);
    }

    public void delete(Long id) {
        healthCheckupRepository.deleteById(id);
    }
}

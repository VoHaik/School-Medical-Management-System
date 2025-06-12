package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Integer> {
    List<Medication> findByStudentStudentCode(String studentCode);
}
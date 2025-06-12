package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.MedicationSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationSubmissionRepository extends JpaRepository<MedicationSubmission, Long> {
    List<MedicationSubmission> findByStudentStudentCode(String studentCode);
}

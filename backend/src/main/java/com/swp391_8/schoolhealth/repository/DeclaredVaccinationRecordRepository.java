package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.DeclaredVaccinationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeclaredVaccinationRecordRepository extends JpaRepository<DeclaredVaccinationRecord, Integer> { // Changed ID to Integer
    List<DeclaredVaccinationRecord> findByStudent_StudentCode(String studentCode); // Corrected method and parameter
    List<DeclaredVaccinationRecord> findByVerificationStatus(DeclaredVaccinationRecord.VerificationStatus verificationStatus); // Use Enum type
}

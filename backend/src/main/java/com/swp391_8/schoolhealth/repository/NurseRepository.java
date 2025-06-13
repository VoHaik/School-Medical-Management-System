package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.Nurse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NurseRepository extends JpaRepository<Nurse, Integer> {
    
    // Find nurse by nurse code
    Optional<Nurse> findByNurseCode(String nurseCode);
    
    // Find nurse by user ID
    Optional<Nurse> findByUserUserId(Integer userId);
    
    // Check if nurse exists by nurse code
    boolean existsByNurseCode(String nurseCode);
    
    // Check if nurse exists by user ID
    boolean existsByUserUserId(Integer userId);
}

package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.HealthCheckup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthCheckupRepository extends JpaRepository<HealthCheckup, Integer> {
    List<HealthCheckup> findByStudentStudentIdOrderByCheckupDateDesc(Integer studentId);
    // Add any other custom query methods if needed
}

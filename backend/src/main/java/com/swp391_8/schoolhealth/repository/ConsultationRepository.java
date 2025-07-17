package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Integer> {
    List<Consultation> findByStudentStudentCodeOrderByConsultationDateDesc(String studentCode);
    // Add other query methods if needed, e.g., find by date range, etc.
}

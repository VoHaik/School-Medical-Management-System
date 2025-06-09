package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.HealthDeclaration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface HealthDeclarationRepository extends JpaRepository<HealthDeclaration, Integer> {
    // Find by student ID - assuming a student might have only one active or latest declaration
    // Or multiple, in which case the service layer would handle the logic to pick one.
    Optional<HealthDeclaration> findByStudent_StudentId(Integer studentId); 

    // If a student can have multiple declarations (e.g., drafts and submitted versions)
    List<HealthDeclaration> findAllByStudent_StudentId(Integer studentId);

    // Example: Find by student ID and draft status
    Optional<HealthDeclaration> findByStudent_StudentIdAndIsDraft(Integer studentId, boolean isDraft);

    List<HealthDeclaration> findAllByStudent_StudentIdAndIsDraft(Integer studentId, boolean isDraft);
}

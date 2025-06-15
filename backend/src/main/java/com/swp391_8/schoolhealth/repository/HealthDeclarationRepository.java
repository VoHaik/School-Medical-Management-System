package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.HealthDeclaration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface HealthDeclarationRepository extends JpaRepository<HealthDeclaration, Integer> {
    // Find by student code - assuming a student might have only one active or latest declaration
    // Or multiple, in which case the service layer would handle the logic to pick one.
    Optional<HealthDeclaration> findByStudent_StudentCode(String studentCode); 

    // If a student can have multiple declarations (e.g., drafts and submitted versions)
    List<HealthDeclaration> findAllByStudent_StudentCode(String studentCode);

    // Example: Find by student code and draft status
    Optional<HealthDeclaration> findByStudent_StudentCodeAndIsDraft(String studentCode, boolean isDraft);

    List<HealthDeclaration> findAllByStudent_StudentCodeAndIsDraft(String studentCode, boolean isDraft);

    // Find the latest (by declarationDate) non-draft declaration for a student
    Optional<HealthDeclaration> findFirstByStudent_StudentCodeAndIsDraftOrderByDeclarationDateDesc(String studentCode, boolean isDraft);

    // Find all declarations for a student, ordered by date
    List<HealthDeclaration> findAllByStudent_StudentCodeOrderByDeclarationDateDesc(String studentCode);
}

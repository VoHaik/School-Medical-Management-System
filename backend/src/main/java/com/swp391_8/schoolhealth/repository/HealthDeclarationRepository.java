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
    
    // Tìm khai báo sức khỏe theo trạng thái
    List<HealthDeclaration> findByStatus(HealthDeclaration.HealthDeclarationStatus status);
    
    // Tìm khai báo sức khỏe theo trạng thái và sắp xếp theo ngày khai báo (mới nhất lên đầu)
    List<HealthDeclaration> findByStatusOrderByDeclarationDateDesc(HealthDeclaration.HealthDeclarationStatus status);    
    
    // Tìm tất cả khai báo sức khỏe và sắp xếp theo ngày khai báo (mới nhất lên đầu)
    List<HealthDeclaration> findAllByOrderByDeclarationDateDesc();
    
    // Tìm khai báo sức khỏe theo học sinh và trạng thái
    List<HealthDeclaration> findByStudent_StudentCodeAndStatus(String studentCode, HealthDeclaration.HealthDeclarationStatus status);
    
    // Tìm khai báo sức khỏe được chấp nhận mới nhất của học sinh
    Optional<HealthDeclaration> findFirstByStudent_StudentCodeAndStatusOrderByDeclarationDateDesc(String studentCode, HealthDeclaration.HealthDeclarationStatus status);
    
    // Tìm khai báo sức khỏe mới nhất của học sinh (cho nurse edit)
    Optional<HealthDeclaration> findTopByStudent_StudentCodeOrderByDeclarationDateDesc(String studentCode);
    
    // Đếm số lượng khai báo sức khỏe theo trạng thái (cho nurse dashboard)
    long countByStatus(HealthDeclaration.HealthDeclarationStatus status);
}

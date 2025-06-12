package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> { // Changed primary key type to String
    List<Student> findByClassName(String className);
<<<<<<< Updated upstream
    Optional<Student> findByUserId(Integer userId); // Corrected: findByUser_Id to findByUserId
    
    // Find students by parent ID using the relationship table
    // This query is kept as it's specific and might be optimized differently by JPA
    // than a method derived from ParentStudentRelationshipRepository.
    @Query("SELECT s FROM Student s JOIN ParentStudentRelationship psr ON s.studentId = psr.student.studentId WHERE psr.parent.userId = :parentId")
=======
    Optional<Student> findByUser_Id(Integer userId); // Deprecated - use findByUser instead
    Optional<Student> findByUser(com.swp391_8.schoolhealth.model.User user); // Added for direct entity reference
    Optional<Student> findByStudentCode(String studentCode); // Added findByStudentCode
    
    // Find students by parent ID using the relationship table
    // This query might need to be updated or removed if StudentService.getStudentsByParentId is preferred
    @Query("SELECT s FROM Student s JOIN ParentStudentRelationship psr ON s.studentCode = psr.student.studentCode WHERE psr.parent.user.userId = :parentId") // Changed to studentCode and psr.parent.user.userId
>>>>>>> Stashed changes
    List<Student> findByParentId(@Param("parentId") Integer parentId);
}

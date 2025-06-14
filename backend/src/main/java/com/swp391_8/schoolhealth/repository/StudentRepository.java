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
    Optional<Student> findByUser_Id(Integer userId); // Deprecated - use findByUser instead
    Optional<Student> findByUser(com.swp391_8.schoolhealth.model.User user); // Added for direct entity reference
    Optional<Student> findByStudentCode(String studentCode); // Added findByStudentCode
    
    // Find students by parent code using the relationship table
    @Query("SELECT s FROM Student s JOIN ParentStudentRelationship psr ON s.studentCode = psr.student.studentCode WHERE psr.parent.parentCode = :parentCode")
    List<Student> findByParentCode(@Param("parentCode") String parentCode);
}

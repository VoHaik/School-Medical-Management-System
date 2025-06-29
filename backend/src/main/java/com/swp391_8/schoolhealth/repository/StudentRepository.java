package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.model.User; // Import User
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> { // Changed primary key type to String
    List<Student> findByClassName(String className);
    Optional<Student> findByStudentCode(String studentCode); // Added findByStudentCode
    
    // Find students by parent user ID using a subquery
    @Query("SELECT s FROM Student s JOIN ParentStudentRelationship psr ON s.studentCode = psr.student.studentCode WHERE psr.parent.parentCode IN (SELECT u.userCode FROM User u WHERE u.userId = :parentUserId)")
    List<Student> findStudentsByParentUserId(@Param("parentUserId") Integer parentUserId);

    // Find students by parent user code (username) using a subquery
    @Query("SELECT s FROM Student s JOIN ParentStudentRelationship psr ON s.studentCode = psr.student.studentCode WHERE psr.parent.parentCode IN (SELECT u.userCode FROM User u WHERE u.username = :parentUsername)")
    List<Student> findStudentsByParentUsername(@Param("parentUsername") String parentUsername);

    // Find students by parent user code (which is Parent.parentCode)
    @Query("SELECT s FROM Student s JOIN ParentStudentRelationship psr ON s.studentCode = psr.student.studentCode WHERE psr.parent.parentCode = :parentUserCode")
    List<Student> findStudentsByParentUserCode(@Param("parentUserCode") String parentUserCode); 
    
    // Convenience method with shorter name
    @Query("SELECT s FROM Student s JOIN ParentStudentRelationship psr ON s.studentCode = psr.student.studentCode WHERE psr.parent.parentCode = :parentCode")
    List<Student> findByParentCode(@Param("parentCode") String parentCode);

    // Find parent users by list of class IDs
    @Query("SELECT DISTINCT u FROM User u JOIN ParentStudentRelationship psr ON u.userCode = psr.parent.parentCode " +
           "JOIN Student s ON psr.student.studentCode = s.studentCode WHERE s.className IN :classIds")
    List<User> findParentUsersByClassIds(@Param("classIds") List<String> classIds);
    
    // Find students by grade level IDs for vaccination consent
    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.gradeLevel WHERE s.gradeLevel.gradeId IN :gradeLevelIds")
    List<Student> findStudentsByGradeLevelIds(@Param("gradeLevelIds") List<Integer> gradeLevelIds);
}

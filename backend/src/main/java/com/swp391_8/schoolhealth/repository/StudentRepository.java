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
    Optional<Student> findByUser_UserId(Integer userId); // Changed from findByUser_Id to findByUser_UserId
    Optional<Student> findByUser(User user); // Kept for direct entity reference
    Optional<Student> findByStudentCode(String studentCode); // Added findByStudentCode
    
    // Find students by parent user ID using a subquery
    @Query("SELECT s FROM Student s JOIN ParentStudentRelationship psr ON s.studentCode = psr.student.studentCode WHERE psr.parent.parentCode IN (SELECT u.userCode FROM User u WHERE u.userId = :parentUserId)")
    List<Student> findStudentsByParentUserId(@Param("parentUserId") Integer parentUserId);

    // Find students by parent user code (username) using a subquery
    @Query("SELECT s FROM Student s JOIN ParentStudentRelationship psr ON s.studentCode = psr.student.studentCode WHERE psr.parent.parentCode IN (SELECT u.userCode FROM User u WHERE u.username = :parentUsername)")
    List<Student> findStudentsByParentUsername(@Param("parentUsername") String parentUsername);

    // Added method to find Student by the user_id of the User associated with the Student entity itself
    Optional<Student> findByUserUserId(Integer userId); // This was likely intended instead of findByUser_UserId for direct student user

    // Find students by parent user code (which is Parent.parentCode)
    @Query("SELECT s FROM Student s JOIN ParentStudentRelationship psr ON s.studentCode = psr.student.studentCode WHERE psr.parent.parentCode = :parentUserCode")
    List<Student> findStudentsByParentUserCode(@Param("parentUserCode") String parentUserCode); 
}

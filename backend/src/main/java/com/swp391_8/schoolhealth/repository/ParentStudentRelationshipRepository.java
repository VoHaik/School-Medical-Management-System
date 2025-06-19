package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.ParentStudentRelationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParentStudentRelationshipRepository extends JpaRepository<ParentStudentRelationship, Integer> {
    
    // Find all relationships for a specific parent by their parent code
    List<ParentStudentRelationship> findByParentParentCode(String parentCode);
    
    // Find all relationships for a specific parent by their Parent Code (replaces findByParentUserId)
    @Query("SELECT psr FROM ParentStudentRelationship psr WHERE psr.parent.parentCode = :parentCode")
    List<ParentStudentRelationship> findByParentCode(@Param("parentCode") String parentCode);
    
    // Find all relationships for a specific student by their Student Code
    List<ParentStudentRelationship> findByStudentStudentCode(String studentCode);
    
    // Check if a specific parent-student relationship exists by parent's code and student's code
    boolean existsByParentParentCodeAndStudentStudentCode(String parentCode, String studentCode);
    
    // Check if a specific parent-student relationship exists by parent's code and student's code (replaces existsByParentUserIdAndStudentStudentCode)
    @Query("SELECT CASE WHEN COUNT(psr) > 0 THEN true ELSE false END FROM ParentStudentRelationship psr WHERE psr.parent.parentCode = :parentCode AND psr.student.studentCode = :studentCode")
    boolean existsByParentCodeAndStudentStudentCode(@Param("parentCode") String parentCode, @Param("studentCode") String studentCode);
    
    // Find a specific relationship by parent's Parent Code and student's Student Code (replaces findByParentAndStudent)
    @Query("SELECT psr FROM ParentStudentRelationship psr WHERE psr.parent.parentCode = :parentCode AND psr.student.studentCode = :studentCode")
    Optional<ParentStudentRelationship> findByParentCodeAndStudentCode(@Param("parentCode") String parentCode, @Param("studentCode") String studentCode);
    
    // Check if a specific parent-student relationship exists by parent's user code and student's code
    @Query("SELECT CASE WHEN COUNT(psr) > 0 THEN true ELSE false END FROM ParentStudentRelationship psr JOIN User u ON psr.parent.parentCode = u.userCode WHERE u.userCode = :parentUserCode AND psr.student.studentCode = :studentCode")
    boolean existsByParent_User_UserCodeAndStudent_StudentCode(@Param("parentUserCode") String parentUserCode, @Param("studentCode") String studentCode); // Corrected method name and Query

    // Find all relationships for a specific parent by their user ID
    @Query("SELECT psr FROM ParentStudentRelationship psr JOIN User u ON psr.parent.parentCode = u.userCode WHERE u.userId = :userId")
    List<ParentStudentRelationship> findByParent_User_UserId(@Param("userId") Integer userId); // Corrected method name, Query and type of userId

    // Check if a specific parent-student relationship exists by parent's user ID and student's code
    @Query("SELECT CASE WHEN COUNT(psr) > 0 THEN true ELSE false END FROM ParentStudentRelationship psr JOIN User u ON psr.parent.parentCode = u.userCode WHERE u.userId = :parentUserId AND psr.student.studentCode = :studentCode")
    boolean existsByParentUserUserIdAndStudentStudentCode(@Param("parentUserId") Integer parentUserId, @Param("studentCode") String studentCode); // Corrected method name, Query and type of parentUserId
}

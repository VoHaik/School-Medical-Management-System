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
    
    // Find all relationships for a specific parent by their User ID (through Parent entity)
    @Query("SELECT psr FROM ParentStudentRelationship psr WHERE psr.parent.user.userId = :userId")
    List<ParentStudentRelationship> findByParentUserId(@Param("userId") Integer userId);
    
    // Find all relationships for a specific student by their Student Code
    List<ParentStudentRelationship> findByStudentStudentCode(String studentCode);
    
    // Check if a specific parent-student relationship exists by parent's code and student's code
    boolean existsByParentParentCodeAndStudentStudentCode(String parentCode, String studentCode);
    
    // Check if a specific parent-student relationship exists by parent's User ID and student's code
    @Query("SELECT CASE WHEN COUNT(psr) > 0 THEN true ELSE false END FROM ParentStudentRelationship psr WHERE psr.parent.user.userId = :parentUserId AND psr.student.studentCode = :studentCode")
    boolean existsByParentUserIdAndStudentStudentCode(@Param("parentUserId") Integer parentUserId, @Param("studentCode") String studentCode);
    
    // Find a specific relationship by parent's User ID and student's Student Code
    @Query("SELECT psr FROM ParentStudentRelationship psr WHERE psr.parent.user.userId = :parentUserId AND psr.student.studentCode = :studentCode")
    Optional<ParentStudentRelationship> findByParentAndStudent(@Param("parentUserId") Integer parentUserId, @Param("studentCode") String studentCode);
}

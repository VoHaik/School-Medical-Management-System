package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.ParentStudentRelationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParentStudentRelationshipRepository extends JpaRepository<ParentStudentRelationship, Integer> {
    
    // Find all relationships for a specific parent
    List<ParentStudentRelationship> findByParentUserId(Integer parentUserId);
    
    // Find all relationships for a specific student
    List<ParentStudentRelationship> findByStudentStudentId(Integer studentId);
    
    // Check if a specific parent-student relationship exists
    boolean existsByParentUserIdAndStudentStudentId(Integer parentUserId, Integer studentId);
    
    // Find relationship by parent and student
    @Query("SELECT psr FROM ParentStudentRelationship psr WHERE psr.parent.userId = :parentUserId AND psr.student.studentId = :studentId")
    ParentStudentRelationship findByParentAndStudent(@Param("parentUserId") Integer parentUserId, @Param("studentId") Integer studentId);
}

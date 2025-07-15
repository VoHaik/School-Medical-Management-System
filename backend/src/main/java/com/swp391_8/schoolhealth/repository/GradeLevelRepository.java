package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.GradeLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradeLevelRepository extends JpaRepository<GradeLevel, Integer> {
    
    // Find by grade name
    Optional<GradeLevel> findByGradeName(String gradeName);
    
    // Find all active grades ordered by grade name (alphabetically)
    List<GradeLevel> findByIsActiveTrueOrderByGradeName();
    
    // Find active grades by grade name
    Optional<GradeLevel> findByGradeNameAndIsActiveTrue(String gradeName);
    
    // Check if grade name exists
    boolean existsByGradeName(String gradeName);
    
    // Custom query to find grades by grade number extracted from grade name
    @Query("SELECT g FROM GradeLevel g WHERE g.isActive = true AND g.gradeName LIKE CONCAT('Grade ', :gradeNumber)")
    Optional<GradeLevel> findByGradeNumberAndIsActiveTrue(Integer gradeNumber);
    
    @Query("SELECT g FROM GradeLevel g WHERE g.gradeName LIKE CONCAT('Grade ', :gradeNumber)")
    Optional<GradeLevel> findByGradeNumber(Integer gradeNumber);
    
    @Query("SELECT g FROM GradeLevel g WHERE g.isActive = true AND CAST(SUBSTRING(g.gradeName, 7) AS integer) BETWEEN :minGrade AND :maxGrade ORDER BY CAST(SUBSTRING(g.gradeName, 7) AS integer)")
    List<GradeLevel> findByGradeNumberBetweenAndIsActiveTrue(Integer minGrade, Integer maxGrade);
    
    @Query("SELECT CASE WHEN COUNT(g) > 0 THEN true ELSE false END FROM GradeLevel g WHERE g.gradeName = CONCAT('Grade ', :gradeNumber)")
    boolean existsByGradeNumber(Integer gradeNumber);
    
    // Find grade levels associated with a health event
    @Query(value = "SELECT gl.* FROM grade_levels gl " +
                   "INNER JOIN health_event_grade_levels hegl ON gl.grade_id = hegl.grade_id " +
                   "WHERE hegl.event_id = :eventId", 
           nativeQuery = true)
    List<GradeLevel> findGradeLevelsByEventId(@Param("eventId") Integer eventId);
    
    // Find by list of grade names
    List<GradeLevel> findByGradeNameIn(List<String> gradeNames);
}

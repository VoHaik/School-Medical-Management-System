package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.HealthEvent;
import com.swp391_8.schoolhealth.model.GradeLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HealthEventRepository extends JpaRepository<HealthEvent, Integer> {
    Optional<HealthEvent> findByEventName(String eventName);
    List<HealthEvent> findByScheduledDateBetween(LocalDate startDate, LocalDate endDate);
    List<HealthEvent> findByStatus(HealthEvent.Status status);
    
    // Use JOIN FETCH to eagerly fetch targetGradeLevels to avoid N+1 queries
    @Query("SELECT DISTINCT he FROM HealthEvent he LEFT JOIN FETCH he.targetGradeLevels")
    List<HealthEvent> findAllWithGradeLevels();
    
    // Single event with grade levels
    @Query("SELECT he FROM HealthEvent he LEFT JOIN FETCH he.targetGradeLevels WHERE he.eventId = :eventId")
    Optional<HealthEvent> findByIdWithGradeLevels(@Param("eventId") Integer eventId);
    
    // Use JOIN to find events targeting specific grade level
    @Query("SELECT he FROM HealthEvent he JOIN he.targetGradeLevels tgl WHERE tgl.gradeId = :gradeId")
    List<HealthEvent> findByTargetGradeLevel(@Param("gradeId") Integer gradeId);
    
    // Alternative method to find by grade name
    @Query("SELECT he FROM HealthEvent he JOIN he.targetGradeLevels tgl WHERE tgl.gradeName = :gradeName")
    List<HealthEvent> findByTargetGradeName(@Param("gradeName") String gradeName);
    
    // Find events by event type
    List<HealthEvent> findByEventType(HealthEvent.EventType eventType);

    // Count events by type and status
    Long countByEventTypeAndStatus(HealthEvent.EventType eventType, HealthEvent.Status status);
}

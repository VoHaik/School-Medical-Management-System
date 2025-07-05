package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.HealthEventType;
import com.swp391_8.schoolhealth.model.HealthEventTypeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthEventTypeRepository extends JpaRepository<HealthEventType, HealthEventTypeId> {
    
    List<HealthEventType> findByEventId(Integer eventId);
    
    void deleteByEventId(Integer eventId);
    
    @Query("SELECT het FROM HealthEventType het JOIN FETCH het.healthCheckupType WHERE het.eventId = :eventId ORDER BY het.sequenceOrder")
    List<HealthEventType> findByEventIdWithCheckupType(@Param("eventId") Integer eventId);
}

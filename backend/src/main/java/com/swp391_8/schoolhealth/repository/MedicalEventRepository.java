package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.MedicalEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;

import java.util.List;

@Repository
public interface MedicalEventRepository extends JpaRepository<MedicalEvent, Integer> {
    List<MedicalEvent> findByStudent_StudentCode(String studentCode);

    @Query("SELECT me FROM MedicalEvent me JOIN me.student s " +
           "WHERE (:studentCode IS NULL OR s.studentCode = :studentCode) " +
           "AND (:startDateTime IS NULL OR me.eventDatetime >= :startDateTime) " +
           "AND (:endDateTime IS NULL OR me.eventDatetime <= :endDateTime) " +
           "AND (:severity IS NULL OR me.severity = :severity) " +
           "AND (:eventType IS NULL OR me.eventType = :eventType) " +
           "AND (:status IS NULL OR me.status = :status)") // Added status
    List<MedicalEvent> findMedicalEventsByCriteria(
            @Param("studentCode") String studentCode,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime,
            @Param("severity") String severity,
            @Param("eventType") String eventType,
            @Param("status") String status // Added status parameter
    );
}

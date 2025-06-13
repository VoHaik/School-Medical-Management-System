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
    List<MedicalEvent> findByStudentStudentCode(String studentCode);

    @Query("SELECT me FROM MedicalEvent me JOIN me.student s " +
           "WHERE (:studentCode IS NULL OR s.studentCode = :studentCode) " +
           "AND (:startDate IS NULL OR me.eventDatetime >= :startDateTime) " +
           "AND (:endDate IS NULL OR me.eventDatetime <= :endDateTime) " +
           "AND (:severity IS NULL OR me.severity = :severity) " +
           "AND (:eventType IS NULL OR me.eventType = :eventType) " +
           "AND (:status IS NULL OR me.status = :status)")
    List<MedicalEvent> findAllFiltered(@Param("studentCode") String studentCode,
                                       @Param("startDate") LocalDateTime startDateTime, // Changed to LocalDateTime
                                       @Param("endDate") LocalDateTime endDateTime, // Changed to LocalDateTime
                                       @Param("severity") String severity,
                                       @Param("eventType") String eventType,
                                       @Param("status") String status);
}

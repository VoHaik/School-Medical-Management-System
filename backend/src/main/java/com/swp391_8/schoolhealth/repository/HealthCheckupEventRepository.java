package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.HealthCheckupEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HealthCheckupEventRepository extends JpaRepository<HealthCheckupEvent, Integer> {
    Optional<HealthCheckupEvent> findByEventName(String eventName);
    List<HealthCheckupEvent> findByScheduledDateBetween(LocalDate startDate, LocalDate endDate);
    List<HealthCheckupEvent> findByStatus(HealthCheckupEvent.EventStatus status);
    List<HealthCheckupEvent> findByTargetGradeLevelsContaining(String gradeLevel);
}

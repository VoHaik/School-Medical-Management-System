package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.HealthEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HealthEventRepository extends JpaRepository<HealthEvent, Integer> {
    Optional<HealthEvent> findByEventName(String eventName);
    List<HealthEvent> findByScheduledDateBetween(LocalDate startDate, LocalDate endDate);
    List<HealthEvent> findByStatus(HealthEvent.Status status);
    List<HealthEvent> findByTargetGradeLevelsContaining(String gradeLevel);
}

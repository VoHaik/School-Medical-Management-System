package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.GradeLevel;
import com.swp391_8.schoolhealth.model.VaccinationEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDate; // Changed from java.util.Date to java.time.LocalDate
import com.swp391_8.schoolhealth.model.Vaccine;
import com.swp391_8.schoolhealth.model.VaccinationEvent.EventStatus; // Import Enum

public interface VaccinationEventRepository extends JpaRepository<VaccinationEvent, Integer> { // Changed ID type to Integer
    List<VaccinationEvent> findByEventNameContainingIgnoreCase(String eventName);
    // Changed parameter type from Date to LocalDate for scheduledDateStart and scheduledDateEnd
    List<VaccinationEvent> findByScheduledDateStartBetween(LocalDate startDate, LocalDate endDate);
    List<VaccinationEvent> findByStatus(EventStatus status); // Changed parameter type to Enum
    List<VaccinationEvent> findByVaccine_VaccineId(Integer vaccineId);
    List<VaccinationEvent> findByVaccine(Vaccine vaccine);
    
    // Method to find events that target a specific grade level
    List<VaccinationEvent> findByTargetGradesContaining(GradeLevel gradeLevel);
}

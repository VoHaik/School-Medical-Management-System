package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.VaccinationConsent;
import com.swp391_8.schoolhealth.model.HealthEvent;
import com.swp391_8.schoolhealth.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VaccinationConsentRepository extends JpaRepository<VaccinationConsent, Integer> {
    
    // Find consent by event and student
    Optional<VaccinationConsent> findByHealthEventAndStudent(HealthEvent healthEvent, Student student);
    
    // Find all consents for an event
    List<VaccinationConsent> findByHealthEvent(HealthEvent healthEvent);
    
    // Find consents by status
    List<VaccinationConsent> findByConsentStatus(VaccinationConsent.ConsentStatus status);
    
    // Find pending consents for a specific event
    @Query("SELECT vc FROM VaccinationConsent vc WHERE vc.healthEvent.eventId = :eventId AND vc.consentStatus = 'PENDING'")
    List<VaccinationConsent> findPendingConsentsByEventId(@Param("eventId") Integer eventId);
    
    // Find consents that need reminders (pending and sent more than X days ago)
    @Query("SELECT vc FROM VaccinationConsent vc WHERE vc.consentStatus = 'PENDING' AND vc.sentDate < :reminderThreshold")
    List<VaccinationConsent> findConsentsNeedingReminder(@Param("reminderThreshold") LocalDateTime reminderThreshold);
    
    // Count consents by status for an event
    @Query("SELECT COUNT(vc) FROM VaccinationConsent vc WHERE vc.healthEvent.eventId = :eventId AND vc.consentStatus = :status")
    Long countByEventIdAndStatus(@Param("eventId") Integer eventId, @Param("status") VaccinationConsent.ConsentStatus status);
    
    // Find all consents for a student
    @Query("SELECT vc FROM VaccinationConsent vc WHERE vc.student.studentCode = :studentCode ORDER BY vc.sentDate DESC")
    List<VaccinationConsent> findByStudentCode(@Param("studentCode") String studentCode);
    
    // Find all consents for a student with health event, vaccines, and student details
    @Query("SELECT vc FROM VaccinationConsent vc " +
           "JOIN FETCH vc.healthEvent he " +
           "LEFT JOIN FETCH he.healthEventVaccines hev " +
           "LEFT JOIN FETCH hev.vaccine " +
           "JOIN FETCH vc.student " +
           "WHERE vc.student.studentCode = :studentCode ORDER BY vc.sentDate DESC")
    List<VaccinationConsent> findByStudentCodeWithDetails(@Param("studentCode") String studentCode);
}

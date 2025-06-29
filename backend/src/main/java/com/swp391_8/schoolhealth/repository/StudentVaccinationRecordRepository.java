package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.StudentVaccinationRecord;
import com.swp391_8.schoolhealth.model.HealthEvent;
import com.swp391_8.schoolhealth.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentVaccinationRecordRepository extends JpaRepository<StudentVaccinationRecord, Integer> {
    
    // Find vaccination record by event and student
    Optional<StudentVaccinationRecord> findByHealthEventAndStudent(HealthEvent healthEvent, Student student);
    
    // Find all vaccination records for an event
    @Query("SELECT svr FROM StudentVaccinationRecord svr LEFT JOIN FETCH svr.student LEFT JOIN FETCH svr.student.gradeLevel WHERE svr.healthEvent.eventId = :eventId")
    List<StudentVaccinationRecord> findByEventId(@Param("eventId") Integer eventId);
    
    // Find vaccination records by status
    List<StudentVaccinationRecord> findByVaccinationStatus(StudentVaccinationRecord.VaccinationStatus status);
    
    // Find scheduled vaccinations for a specific date
    @Query("SELECT svr FROM StudentVaccinationRecord svr WHERE svr.scheduledDate = :date AND svr.vaccinationStatus = 'SCHEDULED'")
    List<StudentVaccinationRecord> findScheduledVaccinationsForDate(@Param("date") LocalDate date);
    
    // Find vaccination history for a student
    @Query("SELECT svr FROM StudentVaccinationRecord svr LEFT JOIN FETCH svr.healthEvent WHERE svr.student.studentCode = :studentCode ORDER BY svr.vaccinationDate DESC, svr.scheduledDate DESC")
    List<StudentVaccinationRecord> findVaccinationHistoryByStudentCode(@Param("studentCode") String studentCode);
    
    // Count vaccinations by status for an event
    @Query("SELECT COUNT(svr) FROM StudentVaccinationRecord svr WHERE svr.healthEvent.eventId = :eventId AND svr.vaccinationStatus = :status")
    Long countByEventIdAndStatus(@Param("eventId") Integer eventId, @Param("status") StudentVaccinationRecord.VaccinationStatus status);
    
    // Find overdue vaccinations
    @Query("SELECT svr FROM StudentVaccinationRecord svr WHERE svr.scheduledDate < :currentDate AND svr.vaccinationStatus = 'SCHEDULED'")
    List<StudentVaccinationRecord> findOverdueVaccinations(@Param("currentDate") LocalDate currentDate);
    
    // Find students who received consent for an event
    @Query("SELECT svr FROM StudentVaccinationRecord svr WHERE svr.healthEvent.eventId = :eventId AND svr.consentReceivedDate IS NOT NULL")
    List<StudentVaccinationRecord> findStudentsWithConsentForEvent(@Param("eventId") Integer eventId);
}

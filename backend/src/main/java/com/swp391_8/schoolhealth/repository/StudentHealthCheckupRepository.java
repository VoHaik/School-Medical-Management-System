package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.StudentHealthCheckup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentHealthCheckupRepository extends JpaRepository<StudentHealthCheckup, Integer> {
    List<StudentHealthCheckup> findByStudent_StudentCode(String studentCode);
    List<StudentHealthCheckup> findByHealthCheckupEvent_EventId(Integer eventId);
    Optional<StudentHealthCheckup> findByHealthCheckupEvent_EventIdAndStudent_StudentCode(Integer eventId, String studentCode);
    Optional<StudentHealthCheckup> findByHealthCheckupEvent_EventIdAndStudent_UserId(Integer eventId, Integer userId);
    List<StudentHealthCheckup> findByStudent_UserId(Integer userId);
    List<StudentHealthCheckup> findByCheckupDateBetween(LocalDate startDate, LocalDate endDate);
    List<StudentHealthCheckup> findByConductedByUser_UserId(Integer userId);
    List<StudentHealthCheckup> findByParentConsentStatus(StudentHealthCheckup.ConsentStatus consentStatus);

    @Query("SELECT shc FROM StudentHealthCheckup shc WHERE shc.healthCheckupEvent.eventId = :eventId AND shc.followUpNeeded = true")
    List<StudentHealthCheckup> findByEventIdAndFollowUpNeeded(@Param("eventId") Integer eventId);

    @Query("SELECT shc FROM StudentHealthCheckup shc WHERE shc.student.studentCode = :studentCode ORDER BY shc.checkupDate DESC")
    List<StudentHealthCheckup> findLatestByStudentCode(@Param("studentCode") String studentCode);
}

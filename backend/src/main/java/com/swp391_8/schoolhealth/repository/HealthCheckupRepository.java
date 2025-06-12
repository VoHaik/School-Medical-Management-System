package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.HealthCheckup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;

import java.util.List;

@Repository
public interface HealthCheckupRepository extends JpaRepository<HealthCheckup, Integer> {
    List<HealthCheckup> findByStudentStudentCodeOrderByCheckupDateDesc(String studentCode);
    
    @Query("SELECT hc FROM HealthCheckup hc JOIN hc.student s " +
           "WHERE (:studentCode IS NULL OR s.studentCode = :studentCode) " +
           "AND (:startDateTime IS NULL OR hc.checkupDate >= :startDateTime) " +
           "AND (:endDateTime IS NULL OR hc.checkupDate <= :endDateTime) " +
           "AND (:checkupType IS NULL OR hc.checkupType = :checkupType) " +
           "AND (:status IS NULL OR hc.status = :status)")
    List<HealthCheckup> findAllFiltered(@Param("studentCode") String studentCode,
                                        @Param("startDateTime") LocalDateTime startDateTime,
                                        @Param("endDateTime") LocalDateTime endDateTime,
                                        @Param("checkupType") String checkupType,
                                        @Param("status") String status);
}

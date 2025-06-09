package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.MedicationRequest;
import com.swp391_8.schoolhealth.model.StatusType; // Added import
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRequestRepository extends JpaRepository<MedicationRequest, Integer> {

    List<MedicationRequest> findByStudentStudentId(Integer studentId);

    List<MedicationRequest> findBySubmittedByUserUserId(Integer userId);

    List<MedicationRequest> findByStudentStudentIdAndSubmittedByUserUserId(Integer studentId, Integer userId);

    // Updated methods to query by StatusType's statusName
    List<MedicationRequest> findByStudentStudentIdAndStatusTypeStatusName(Integer studentId, String statusName);
    List<MedicationRequest> findBySubmittedByUserUserIdAndStatusTypeStatusName(Integer userId, String statusName);
    List<MedicationRequest> findByStatusTypeStatusName(String statusName);

}

package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.MedicationRequest;
import com.swp391_8.schoolhealth.model.MedicationRequest.MedicationRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRequestRepository extends JpaRepository<MedicationRequest, Integer> {

    List<MedicationRequest> findByStudentStudentCode(String studentCode);

    List<MedicationRequest> findByParentUserId(Integer parentId);

    List<MedicationRequest> findByStudentStudentCodeAndParentUserId(String studentCode, Integer parentId);

    // Add more specific queries if needed, e.g., by status
    List<MedicationRequest> findByStudentStudentCodeAndStatus(String studentCode, MedicationRequestStatus status);
    List<MedicationRequest> findByParentUserIdAndStatus(Integer parentId, MedicationRequestStatus status);
    List<MedicationRequest> findByStatus(MedicationRequestStatus status);

}

package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.MedicationRequest;
import com.swp391_8.schoolhealth.model.MedicationRequest.MedicationRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRequestRepository extends JpaRepository<MedicationRequest, Integer> {

    List<MedicationRequest> findByStudentId(Integer studentId);

    List<MedicationRequest> findByParentId(Integer parentId);

    List<MedicationRequest> findByStudentIdAndParentId(Integer studentId, Integer parentId);

    // Add more specific queries if needed, e.g., by status
    List<MedicationRequest> findByStudentIdAndStatus(Integer studentId, MedicationRequestStatus status);
    List<MedicationRequest> findByParentIdAndStatus(Integer parentId, MedicationRequestStatus status);
    List<MedicationRequest> findByStatus(MedicationRequestStatus status);

}

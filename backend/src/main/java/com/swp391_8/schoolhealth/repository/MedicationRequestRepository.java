package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.MedicationRequest;
import com.swp391_8.schoolhealth.model.StatusType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRequestRepository extends JpaRepository<MedicationRequest, Integer> {

    List<MedicationRequest> findByStudentStudentCode(String studentCode);

<<<<<<< Updated upstream
    // List<MedicationRequest> findByParentId(Integer parentId); // Commented out as submittedBy is used now

    // List<MedicationRequest> findByStudentIdAndParentId(Integer studentId, Integer parentId); // Commented out

    List<MedicationRequest> findByStudentStudentIdAndSubmittedByUserId(Integer studentId, Integer userId); // Added

    List<MedicationRequest> findBySubmittedByUserId(Integer userId); // Added

    List<MedicationRequest> findByStudentIdAndStatus(Integer studentId, StatusType status);
    
    // List<MedicationRequest> findByParentIdAndStatus(Integer parentId, StatusType status); // Commented out

    List<MedicationRequest> findByStatus(StatusType status);
=======
    List<MedicationRequest> findByParentUserId(Integer parentId);

    List<MedicationRequest> findByStudentStudentCodeAndParentUserId(String studentCode, Integer parentId);

    // Add more specific queries if needed, e.g., by status
    List<MedicationRequest> findByStudentStudentCodeAndStatus(String studentCode, MedicationRequestStatus status);
    List<MedicationRequest> findByParentUserIdAndStatus(Integer parentId, MedicationRequestStatus status);
    List<MedicationRequest> findByStatus(MedicationRequestStatus status);
>>>>>>> Stashed changes

}

package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.MedicationRequest;
import com.swp391_8.schoolhealth.model.MedicationRequest.MedicationRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRequestRepository extends JpaRepository<MedicationRequest, Integer> {

    List<MedicationRequest> findByStudent_StudentCode(String studentCode); // Corrected field name

    // For parents viewing their requests
    List<MedicationRequest> findByRequestedBy_UsernameOrderByRequestDateDesc(String username);

    // For parents viewing requests for a specific student they are associated with
    List<MedicationRequest> findByStudent_StudentCodeAndRequestedBy_UsernameOrderByRequestDateDesc(String studentCode, String username);

    // For nurses/admins viewing all requests
    List<MedicationRequest> findAllByOrderByRequestDateDesc();

    // For nurses/admins viewing requests for a specific student
    List<MedicationRequest> findByStudent_StudentCodeOrderByRequestDateDesc(String studentCode);
    
    // For nurses/admins viewing requests by status
    List<MedicationRequest> findByStatusOrderByRequestDateDesc(MedicationRequestStatus status);

    // For nurses/admins viewing requests by multiple statuses (e.g., for a dashboard)
    List<MedicationRequest> findByStatusInOrderByRequestDateDesc(List<MedicationRequestStatus> statuses);

    // For nurses/admins viewing requests for a specific student and status
    List<MedicationRequest> findByStudent_StudentCodeAndStatusOrderByRequestDateDesc(String studentCode, MedicationRequestStatus status);

    // If you need a method to find requests by parent user and status:
    List<MedicationRequest> findByRequestedBy_UsernameAndStatusOrderByRequestDateDesc(String username, MedicationRequestStatus status);

}

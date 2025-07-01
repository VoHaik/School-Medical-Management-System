package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.StudentHealthCheckupDTO;
import com.swp391_8.schoolhealth.dto.StudentHealthCheckupRequestDTO;
import com.swp391_8.schoolhealth.model.StudentHealthCheckup;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.List;

public interface StudentHealthCheckupService {

    /**
     * Creates a new health checkup record for a student based on a request DTO.
     * This is typically done by a nurse or admin after performing a checkup.
     *
     * @param requestDTO The DTO containing the details for creating the health checkup.
     * @param authentication The authentication information of the user conducting the checkup.
     * @return A DTO representing the newly created student health checkup record.
     */
    StudentHealthCheckupDTO createStudentHealthCheckup(StudentHealthCheckupRequestDTO requestDTO, Authentication authentication);

    /**
     * Requests consent from a parent for a specific health checkup record.
     *
     * @param checkupId The ID of the health checkup record.
     * @param authentication The authentication information of the user requesting the consent.
     */
    void requestConsentFromParent(Integer checkupId, Authentication authentication);

    /**
     * Records or updates the consent status for a specific health checkup result by a parent.
     *
     * @param checkupId The ID of the health checkup record.
     * @param consent True if consent is given, false otherwise.
     * @param notes Optional notes regarding the consent.
     * @param authentication The authentication information of the parent providing/updating consent.
     * @return A DTO representing the updated student health checkup record with consent information.
     */
    StudentHealthCheckupDTO recordParentConsent(Integer checkupId, boolean consent, String notes, Authentication authentication);

    /**
     * Updates an existing health checkup record for a student.
     * This is typically done by a nurse or admin to add or modify checkup results.
     *
     * @param checkupId The ID of the health checkup record to update.
     * @param requestDTO The DTO containing the updated details of the health checkup.
     * @param authentication The authentication information of the user updating the checkup.
     * @return A DTO representing the updated student health checkup record.
     */
    StudentHealthCheckupDTO updateStudentHealthCheckup(Integer checkupId, StudentHealthCheckupRequestDTO requestDTO, Authentication authentication);

    /**
     * Retrieves all health checkup records for a specific student by their parent.
     *
     * @param studentCode The code of the student.
     * @param authentication The authentication information of the parent.
     * @return A list of DTOs representing the student's health checkup records.
     */
    List<StudentHealthCheckupDTO> getHealthCheckupsForStudentByParent(String studentCode, Authentication authentication);

    /**
     * Retrieves all health checkup records for a specific student.
     *
     * @param studentCode The code of the student.
     * @return A list of DTOs representing the student's health checkup records.
     */
    List<StudentHealthCheckupDTO> getCheckupsByStudentCode(String studentCode);

    /**
     * Retrieves all health checkup records associated with a specific health checkup event.
     *
     * @param eventId The ID of the health checkup event.
     * @return A list of DTOs representing health checkup records for that event.
     */
    List<StudentHealthCheckupDTO> getCheckupsByEventId(Integer eventId);

    /**
     * Retrieves a specific student health checkup record by its ID.
     *
     * @param checkupResultId The ID of the health checkup record.
     * @return A DTO representing the student health checkup record.
     */
    StudentHealthCheckupDTO getStudentHealthCheckupById(Integer checkupResultId);

    /**
     * Retrieves all health checkup records with optional filtering.
     *
     * @param status Optional status filter
     * @param grade Optional grade filter
     * @param startDate Optional start date filter
     * @param endDate Optional end date filter
     * @return A list of DTOs representing filtered health checkup records.
     */
    List<StudentHealthCheckupDTO> getAllHealthCheckups(String status, String grade, LocalDate startDate, LocalDate endDate);

    /**
     * Deletes a student health checkup record by its ID.
     *
     * @param checkupId The ID of the health checkup record to delete.
     */
    void deleteStudentHealthCheckup(Integer checkupId);

    // Removed recordConsent(String studentCode, Integer eventId, boolean consent) as it is redundant
    // Removed updateConsentStatus(Integer checkupId, String studentCode, StudentHealthCheckup.ConsentStatus consentStatus, String notes) due to signature mismatch
}

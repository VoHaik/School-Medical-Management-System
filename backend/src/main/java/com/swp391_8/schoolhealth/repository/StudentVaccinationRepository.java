package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.StudentVaccination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentVaccinationRepository extends JpaRepository<StudentVaccination, Integer> {
    List<StudentVaccination> findByStudent_User_UserId(Integer userId); // Corrected: was findByStudentStudentId
    List<StudentVaccination> findByStudent_StudentCode(String studentCode); // Corrected method name
    List<StudentVaccination> findByStudent_StudentCodeIn(List<String> studentCodes); // Corrected method name
    List<StudentVaccination> findByVaccineVaccineId(Integer vaccineId);
    List<StudentVaccination> findByVaccinationEventId(Integer eventId); // Corrected: was findByVaccinationEvent_Id in some previous thoughts, ensuring it's findByVaccinationEventId
    List<StudentVaccination> findByAdministeredByNurseUserId(Integer nurseId);
    List<StudentVaccination> findByConsentGivenByParentUserId(Integer parentId);

    // Example: Find vaccinations for a student with a specific vaccine
    @Query("SELECT sv FROM StudentVaccination sv WHERE sv.student.user.userId = :studentId AND sv.vaccine.vaccineId = :vaccineId")
    List<StudentVaccination> findByStudentAndVaccine(@Param("studentId") Integer studentId, @Param("vaccineId") Integer vaccineId);

    // Find by consent status
    List<StudentVaccination> findByConsentStatus(StudentVaccination.ConsentStatus consentStatus);
}

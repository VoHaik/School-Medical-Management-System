package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.StudentVaccination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentVaccinationRepository extends JpaRepository<StudentVaccination, Integer> {
    List<StudentVaccination> findByStudent_StudentCode(String studentCode);
    List<StudentVaccination> findByStudent_StudentCodeIn(List<String> studentCodes);
    List<StudentVaccination> findByVaccineVaccineId(Integer vaccineId);
    List<StudentVaccination> findByHealthEvent_EventId(Integer eventId);
    List<StudentVaccination> findByAdministeredByNurseUserId(Integer nurseId);
    List<StudentVaccination> findByConsentGivenByParentUserId(Integer parentId);

    // Find vaccinations for a student with a specific vaccine
    @Query("SELECT sv FROM StudentVaccination sv WHERE sv.student.studentCode = :studentCode AND sv.vaccine.vaccineId = :vaccineId")
    List<StudentVaccination> findByStudentAndVaccine(@Param("studentCode") String studentCode, @Param("vaccineId") Integer vaccineId);

    // Find by consent status
    List<StudentVaccination> findByConsentStatus(StudentVaccination.ConsentStatus consentStatus);

    // Find completed vaccinations for a student
    List<StudentVaccination> findByStudent_StudentCodeAndConsentStatus(String studentCode, StudentVaccination.ConsentStatus consentStatus);
}

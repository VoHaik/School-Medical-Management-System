package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.HealthDeclarationMedication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthDeclarationMedicationRepository extends JpaRepository<HealthDeclarationMedication, Integer> {
    List<HealthDeclarationMedication> findByHealthDeclarationDeclarationId(Integer declarationId);
}

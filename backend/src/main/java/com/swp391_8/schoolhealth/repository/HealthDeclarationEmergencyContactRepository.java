package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.HealthDeclarationEmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthDeclarationEmergencyContactRepository extends JpaRepository<HealthDeclarationEmergencyContact, Integer> {
    List<HealthDeclarationEmergencyContact> findByHealthDeclarationDeclarationId(Integer declarationId);
}

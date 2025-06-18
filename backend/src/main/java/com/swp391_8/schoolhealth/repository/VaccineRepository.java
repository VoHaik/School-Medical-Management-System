package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VaccineRepository extends JpaRepository<Vaccine, Integer> {
    Optional<Vaccine> findByName(String name);
    Optional<Vaccine> findByNameIgnoreCase(String name);
}

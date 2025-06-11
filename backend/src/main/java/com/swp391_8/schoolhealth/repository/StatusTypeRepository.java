package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.StatusType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StatusTypeRepository extends JpaRepository<StatusType, Integer> {
    Optional<StatusType> findByStatusName(String statusName);
}

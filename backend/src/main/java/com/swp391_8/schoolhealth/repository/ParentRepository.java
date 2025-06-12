package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParentRepository extends JpaRepository<Parent, Integer> {
    
    // Find parent by parent code
    Optional<Parent> findByParentCode(String parentCode);
    
    // Find parent by user ID
    Optional<Parent> findByUserUserId(Integer userId);
    
    // Check if parent exists by parent code
    boolean existsByParentCode(String parentCode);
    
    // Check if parent exists by user ID
    boolean existsByUserUserId(Integer userId);
}

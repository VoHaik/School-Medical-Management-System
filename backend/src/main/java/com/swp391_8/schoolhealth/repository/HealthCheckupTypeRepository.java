package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.HealthCheckupType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthCheckupTypeRepository extends JpaRepository<HealthCheckupType, Long> {
    
    List<HealthCheckupType> findByIsActiveTrue();
    
    HealthCheckupType findByTypeName(String typeName);
    
    @Query("SELECT hct FROM HealthCheckupType hct WHERE hct.isActive = true ORDER BY hct.typeName")
    List<HealthCheckupType> findAllActiveOrderByTypeName();
    
    @Query("SELECT hct FROM HealthCheckupType hct WHERE hct.isActive = true AND " +
           "(hct.typeName LIKE %:searchTerm% OR hct.description LIKE %:searchTerm%)")
    List<HealthCheckupType> searchActiveCheckupTypes(String searchTerm);
}

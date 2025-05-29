package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.Role;
import com.swp391_8.schoolhealth.model.Role.ERole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}
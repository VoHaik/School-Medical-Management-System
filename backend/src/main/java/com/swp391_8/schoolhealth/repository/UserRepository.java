package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("SELECT u FROM User u WHERE LOWER(u.username) = LOWER(:username)")
    Optional<User> findByUsername(String username);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE LOWER(u.username) = LOWER(:username)")
    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    Optional<User> findByUserCode(String userCode);

    Boolean existsByUserCode(String userCode); // Added to check if a user_code already exists

    // Find the highest user_code for a given prefix to help generate the next sequential code
    @Query("SELECT MAX(u.userCode) FROM User u WHERE u.userCode LIKE :prefix%")
    Optional<String> findLastUserCodeByPrefix(@Param("prefix") String prefix);
}

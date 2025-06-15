package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
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

    // Find users by role name
    List<User> findByRole_RoleName(String roleName); // Corrected: was findByRoles_Name

    // Assuming a Student entity has a 'parents' collection mapped as List<User> parents
    // Or, if there's a join table like 'student_parent' linking student_id to parent_user_id.
    // The query below assumes a direct relationship or a join table that can be navigated.
    // This query needs to be adjusted based on your actual entity relationships.
    // Example 1: If Student entity has a field `Set<User> parents`:
    // @Query("SELECT p FROM Student s JOIN s.parents p WHERE s.userId = :studentId")
    // List<User> findParentsByStudentId(@Param("studentId") Integer studentId);

    // Example 2: If User (Parent) has a field `Set<Student> children` and Student is a type of User:
    // This is more complex as it implies a many-to-many or a specific parent-child link table.
    // Let's assume a simpler scenario for now: A Student entity might have a direct link to parent User IDs
    // or a join table `student_parent_links (student_user_id, parent_user_id)`.

    // If your User entity has a list of children (students are also Users):
    // And User has a role 'PARENT'
    // And Student has a list of parents (Users with role 'PARENT')
    // This query assumes a join table `user_children` where `parent_id` is the User with ROLE_PARENT
    // and `child_id` is the User with ROLE_STUDENT.
    // This is a placeholder and needs to match your actual data model for parent-child relationships.
    @Query(value = "SELECT u.* FROM users u " +
                   "JOIN student_parent sp ON u.user_id = sp.parent_id " +
                   "JOIN roles r ON u.role_id = r.role_id " +
                   "WHERE sp.student_id = :studentId AND r.role_name = 'PARENT'", nativeQuery = true)
    List<User> findParentsByStudentId(@Param("studentId") Integer studentId);

    // Find parents associated with a student via ParentStudentRelationship
    @Query("SELECT psr.parent FROM ParentStudentRelationship psr WHERE psr.student.studentCode = :studentCode")
    List<User> findParentsByStudentCode(@Param("studentCode") String studentCode);

    // Find students associated with a parent via ParentStudentRelationship
    @Query("SELECT psr.student.user FROM ParentStudentRelationship psr WHERE psr.parent.parentCode = :parentCode") // Assuming Parent entity is a User, so psr.parent is a User
    List<User> findStudentsByParentCode(@Param("parentCode") String parentCode);
}

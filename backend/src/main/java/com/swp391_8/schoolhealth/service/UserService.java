package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.Role;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.model.Parent;
import com.swp391_8.schoolhealth.model.Nurse;
import com.swp391_8.schoolhealth.repository.RoleRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.repository.ParentRepository;
import com.swp391_8.schoolhealth.repository.NurseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ParentRepository parentRepository;

    @Autowired
    private NurseRepository nurseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Keep autowired for now, but won't use encode()

    // Enum for user roles to maintain API compatibility
    public enum UserRole {
        Parent, SchoolNurse, Admin, Manager, Student
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional // Added Transactional
    public User registerUser(String username, String password, String fullName, String email, String phone, 
                             String gender, String relationshipWithStudent, UserRole userRole) { // Changed gender to relationshipWithStudent, added gender back
        // Create new user
        User user = new User();
        // Ensure user_code is set first and is not null
        String generatedUserCode = username.replaceAll("[^a-zA-Z0-9]", "") + "CODE";
        if (generatedUserCode.isEmpty()) { 
            generatedUserCode = "DEFAULT" + System.currentTimeMillis();
            logger.warn("Generated an empty user_code for username: {}. Using fallback: {}", username, generatedUserCode);
        }
        user.setUserCode(generatedUserCode);
        user.setUsername(username);
        user.setPassword(password); // Store plain text password
        user.setFullName(fullName); // Set on User
        user.setEmail(email);
        user.setPhoneNumber(phone); // Set on User
        user.setIsActive(true);

        // Map UserRole enum to database role names
        String roleName;
        switch (userRole) {
            case Parent:
                roleName = "Parent"; // Standardized to match Role names
                break;
            case SchoolNurse:
                roleName = "SchoolNurse"; // Standardized to match Role names
                break;
            case Admin:
                roleName = "Admin"; // Standardized to match Role names
                break;
            case Manager:
                roleName = "Manager"; // Standardized to match Role names
                break;
            case Student:
                roleName = "Student"; // Standardized to match Role names
                break;
            default:
                // Fallback or throw error, for now, let's use Parent as a default if not specified or invalid
                logger.warn("Unspecified or invalid UserRole provided: {}. Defaulting to Parent.", userRole);
                roleName = "Parent";
        }

        Optional<Role> roleOptional = roleRepository.findByRoleName(roleName);
        if (roleOptional.isEmpty()) {
            logger.error("Critical Error: Role {} not found in database.", roleName);
            List<Role> availableRoles = roleRepository.findAll();
            if (!availableRoles.isEmpty()) {
                logger.info("Available roles in database: {}",
                    availableRoles.stream()
                        .map(Role::getRoleName)
                        .collect(Collectors.joining(", ")));
            }
            throw new RuntimeException("Role " + roleName + " not found. Ensure roles are initialized.");
        }
        
        user.setRole(roleOptional.get());
        User savedUser = userRepository.save(user); // Save User first to get ID
        logger.info("User '{}' registered successfully with role: {}", savedUser.getUsername(), savedUser.getRole().getRoleName());

        // Create Parent or Nurse specific entity
        if (userRole == UserRole.Parent) {
            Parent parent = new Parent();
            parent.setUser(savedUser);
            parent.setFullName(fullName);
            parent.setPhoneNumber(phone);
            parent.setGender(gender); // Set gender
            parent.setRelationshipWithStudent(relationshipWithStudent); // Set relationship
            // parent.setParentCode("P" + savedUser.getUserId()); // Example parent code
            parentRepository.save(parent);
            logger.info("Parent profile created for user: {}", savedUser.getUsername());
        } else if (userRole == UserRole.SchoolNurse) {
            Nurse nurse = new Nurse();
            nurse.setUser(savedUser);
            nurse.setFullName(fullName);
            nurse.setPhoneNumber(phone);
            nurse.setGender(gender); // Set gender
            // nurse.setNurseCode("N" + savedUser.getUserId()); // Example nurse code
            nurseRepository.save(nurse);
            logger.info("Nurse profile created for user: {}", savedUser.getUsername());
        }

        return savedUser;
    }

    public Optional<User> findById(Integer userId) {
        return userRepository.findById(userId);
    }
}

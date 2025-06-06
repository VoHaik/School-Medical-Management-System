package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.Role;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.RoleRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
    private PasswordEncoder passwordEncoder;

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

    public User registerUser(String username, String password, String fullName, String email, String phone, UserRole userRole) {
        // Create new user
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhoneNumber(phone);

        // Map UserRole enum to database role names
        String roleName;
        switch (userRole) {
            case Parent:
                roleName = "PARENT";
                break;
            case SchoolNurse:
                roleName = "MEDICAL_STAFF";
                break;
            case Admin:
                roleName = "ADMIN";
                break;
            case Manager:
                roleName = "TEACHER";
                break;
            case Student:
                roleName = "STUDENT";
                break;
            default:
                roleName = "PARENT";
        }

        // Find the role in the database by role name
        Optional<Role> roleOptional = roleRepository.findByRoleName(roleName);
        if (roleOptional.isEmpty()) {
            logger.error("Critical Error: Role {} not found in database. This indicates a database initialization problem.", roleName);
            // List all available roles for debugging
            List<Role> availableRoles = roleRepository.findAll();
            if (!availableRoles.isEmpty()) {
                logger.info("Available roles in database: {}", 
                    availableRoles.stream()
                        .map(Role::getRoleName)
                        .collect(Collectors.joining(", ")));
            }
            
            throw new RuntimeException("Role " + roleName + " not found in database. Please ensure database is properly initialized with all required roles.");
        }
        
        // Set the single role (ManyToOne relationship)
        user.setRole(roleOptional.get());
        logger.info("User '{}' assigned role: {} (mapped to {})", username, userRole, roleName);

        // Save user
        return userRepository.save(user);
    }
}

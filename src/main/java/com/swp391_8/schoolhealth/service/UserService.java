package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.Role;
import com.swp391_8.schoolhealth.model.Role.ERole;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.model.User.UserRole;
import com.swp391_8.schoolhealth.repository.RoleRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
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

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User registerUser(String username, String password, String fullName, String email, String phone, UserRole role) {
        // Create new user
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhone(phone);
        user.setRole(role);

        // Set corresponding role in roles collection for backward compatibility
        Set<Role> roles = new HashSet<>();
        ERole eRole;
        switch (role) {
            case Parent:
                eRole = ERole.ROLE_PARENT;
                break;
            case SchoolNurse:
                eRole = ERole.ROLE_MEDICAL_STAFF;
                break;
            case Admin:
                eRole = ERole.ROLE_ADMIN;
                break;
            case Manager:
                eRole = ERole.ROLE_TEACHER;
                break;            case Student:
                eRole = ERole.ROLE_STUDENT;
                break;
            default:
                eRole = ERole.ROLE_PARENT;
        }        // Find the role in the database
        Optional<Role> roleOptional = roleRepository.findByName(eRole);
        if (roleOptional.isEmpty()) {
            logger.error("Critical Error: Role {} not found in database. This indicates a database initialization problem.", eRole);
              // List all available roles for debugging
            List<Role> availableRoles = roleRepository.findAll();
            if (!availableRoles.isEmpty()) {
                logger.info("Available roles in database: {}", 
                    availableRoles.stream()
                        .map(r -> r.getEnumName().toString())
                        .collect(Collectors.joining(", ")));
            }
            
            throw new RuntimeException("Role " + eRole + " not found in database. Please ensure database is properly initialized with all required roles.");
        }
        
        roles.add(roleOptional.get());
        logger.info("User '{}' assigned role: {} (mapped to {})", username, role, eRole);

        user.setRoles(roles);

        // Save user
        return userRepository.save(user);
    }
}

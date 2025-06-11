package com.swp391_8.schoolhealth.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.swp391_8.schoolhealth.model.Role;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.RoleRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;

import jakarta.transaction.Transactional;
import java.util.Optional;

/**
 * This class creates default user accounts when the application starts.
 * It will only create accounts if they don't already exist in the database.
 */
@Component
public class UserAccountInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(UserAccountInitializer.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        logger.info("Initializing default user accounts");
        
        // Create roles if they don't exist
        createRoleIfNotExists("Admin", "System administrator with full access");
        createRoleIfNotExists("SchoolNurse", "Medical staff with access to health records");
        createRoleIfNotExists("Manager", "School management personnel");
        createRoleIfNotExists("Parent", "Parent or guardian of students");
        createRoleIfNotExists("Student", "Student account");
        
        // Get role references
        Role adminRole = roleRepository.findByRoleName("Admin")
                .orElseThrow(() -> new RuntimeException("Admin role not found"));
                
        Role nurseRole = roleRepository.findByRoleName("SchoolNurse")
                .orElseThrow(() -> new RuntimeException("SchoolNurse role not found"));
                
        Role managerRole = roleRepository.findByRoleName("Manager")
                .orElseThrow(() -> new RuntimeException("Manager role not found"));
                
        Role parentRole = roleRepository.findByRoleName("Parent")
                .orElseThrow(() -> new RuntimeException("Parent role not found"));
          // Create user accounts with the password "Password123" (plain text for testing)
        String password = "Password123"; // Plain text password for testing
        // Note: In production, use: passwordEncoder.encode("Password123");
        
        // Create admin account
        createUserIfNotExists("admin.user", password, "admin@schoolhealth.edu", "555-100-1000", 
                "Admin User", adminRole);
        
        // Create nurse account
        createUserIfNotExists("nurse.johnson", password, "nurse.johnson@schoolhealth.edu", "555-200-2000", 
                "Sarah Johnson", nurseRole);
        
        // Create manager account
        createUserIfNotExists("manager.davis", password, "manager.davis@schoolhealth.edu", "555-300-3000", 
                "Michael Davis", managerRole);
        
        // Create parent account
        createUserIfNotExists("parent.smith", password, "parent.smith@email.com", "555-400-4000", 
                "Jennifer Smith", parentRole);
                
        logger.info("User account initialization completed");
    }
    
    private void createRoleIfNotExists(String roleName, String description) {
        if (!roleRepository.existsByRoleName(roleName)) {
            Role role = new Role(roleName, description);
            roleRepository.save(role);
            logger.info("Created role: {}", roleName);
        } else {
            logger.info("Role already exists: {}", roleName);
        }
    }
    
    private void createUserIfNotExists(String username, String password, String email, String phoneNumber, 
                                    String fullName, Role role) {
        if (!userRepository.existsByUsername(username)) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(password);
            user.setEmail(email);
            user.setPhoneNumber(phoneNumber);
            user.setFullName(fullName);
            user.setRole(role);
            
            userRepository.save(user);
            logger.info("Created user account: {}", username);
        } else {
            logger.info("User already exists: {}", username);
        }
    }
}

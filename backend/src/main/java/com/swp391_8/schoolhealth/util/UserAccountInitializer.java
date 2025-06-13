package com.swp391_8.schoolhealth.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.swp391_8.schoolhealth.model.Role;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.model.Nurse; // Added import
import com.swp391_8.schoolhealth.model.Parent; // Added import
import com.swp391_8.schoolhealth.repository.RoleRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.repository.NurseRepository; // Added import
import com.swp391_8.schoolhealth.repository.ParentRepository; // Added import

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
    private NurseRepository nurseRepository; // Autowired NurseRepository

    @Autowired
    private ParentRepository parentRepository; // Autowired ParentRepository
    
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
        
        String password = "Password123"; 
        
        // Create admin account
        createUserIfNotExists("admin.user", password, "admin@schoolhealth.edu", adminRole, null, null, null);
        
        // Create nurse account
        createUserIfNotExists("nurse.johnson", password, "nurse.johnson@schoolhealth.edu", nurseRole, "Sarah Johnson", "555-200-2000", "Female"); // Added gender
        
        // Create manager account
        createUserIfNotExists("manager.davis", password, "manager.davis@schoolhealth.edu", managerRole, null, null, null);
        
        // Create parent account
        createUserIfNotExists("parent.smith", password, "parent.smith@email.com", parentRole, "Jennifer Smith", "555-400-4000", "Female"); // Added gender
                
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
    
    private void createUserIfNotExists(String username, String password, String email, Role role, 
                                    String specificFullName, String specificPhoneNumber, String gender) { // Renamed parameters for clarity
        if (!userRepository.existsByUsername(username)) {
            User user = new User();
            String generatedUserCode = username.replaceAll("[^a-zA-Z0-9]", "") + "CODE";
            if (generatedUserCode.isEmpty()) { 
                generatedUserCode = "DEFAULT" + System.currentTimeMillis(); 
                logger.warn("Generated an empty user_code for username: {}. Using fallback: {}", username, generatedUserCode);
            }
            user.setUserCode(generatedUserCode); 
            
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password)); 
            user.setEmail(email);
            // Set fullName and phoneNumber on User entity directly if provided for the role, 
            // otherwise it might be null or set based on specific role logic below.
            user.setFullName(specificFullName); // Set on User
            user.setPhoneNumber(specificPhoneNumber); // Set on User
            user.setRole(role);
            user.setIsActive(true); 
            
            userRepository.save(user); // Save User first
            logger.info("Created user account: {} with user_code: {}", username, user.getUserCode());

            // If role is SchoolNurse, create and save Nurse entity
            if (role.getRoleName().equals("SchoolNurse") && specificFullName != null && specificPhoneNumber != null && gender != null) {
                Nurse nurse = new Nurse();
                nurse.setUser(user);
                nurse.setFullName(specificFullName); // Also set on Nurse
                nurse.setPhoneNumber(specificPhoneNumber); // Also set on Nurse
                nurse.setGender(gender); 
                // Generate and set nurse_code
                String generatedNurseCode = "NUR" + user.getUsername().replaceAll("[^a-zA-Z0-9]", "") + System.currentTimeMillis() % 10000;
                if (generatedNurseCode.length() > 50) { // Assuming nurse_code has a max length, e.g., 50
                    generatedNurseCode = generatedNurseCode.substring(0, 50);
                }
                nurse.setNurseCode(generatedNurseCode);
                nurseRepository.save(nurse);
                logger.info("Created Nurse profile for user: {} with nurse_code: {}", username, generatedNurseCode);
            }

            // If role is Parent, create and save Parent entity
            if (role.getRoleName().equals("Parent") && specificFullName != null && specificPhoneNumber != null && gender != null) {
                Parent parent = new Parent();
                parent.setUser(user);
                parent.setFullName(specificFullName); // Also set on Parent
                parent.setPhoneNumber(specificPhoneNumber); // Also set on Parent
                parent.setGender(gender); 
                // Generate and set parent_code
                String generatedParentCode = "PAR" + user.getUsername().replaceAll("[^a-zA-Z0-9]", "") + System.currentTimeMillis() % 10000;
                if (generatedParentCode.length() > 50) { // Assuming parent_code has a max length, e.g., 50
                    generatedParentCode = generatedParentCode.substring(0, 50);
                }
                parent.setParentCode(generatedParentCode);
                // Assuming relationshipWithStudent is a required field for Parent, set a default or get from params
                // For UserAccountInitializer, we might not have a specific student yet, so a default is plausible.
                // If it's nullable or set later, this line can be omitted or adjusted.
                parent.setRelationshipWithStudent("Parent"); // Example default value
                parentRepository.save(parent);
                logger.info("Created Parent profile for user: {} with parent_code: {}", username, generatedParentCode);
            }
            // For Admin and Manager, or other roles not Parent/Nurse, 
            // fullName and phoneNumber will be on the User entity if provided in the call.
            // Otherwise, they will be null or set based on specific role logic.
        } else {
            logger.info("User already exists: {}", username);
        }
    }
}

package com.swp391_8.schoolhealth.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.swp391_8.schoolhealth.model.Role;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.model.Nurse;
import com.swp391_8.schoolhealth.model.Parent;
import com.swp391_8.schoolhealth.repository.RoleRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.repository.NurseRepository;
import com.swp391_8.schoolhealth.repository.ParentRepository;

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
    private NurseRepository nurseRepository;

    @Autowired
    private ParentRepository parentRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        logger.info("Initializing default user accounts");
        
        // Create roles if they don't exist
        createRoleIfNotExists("Admin", "System administrator with full access");
        createRoleIfNotExists("SchoolNurse", "Medical staff with access to health records");
        createRoleIfNotExists("Manager", "School management personnel"); // Assuming Manager might be like a Teacher role for user_code generation
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
        createUserIfNotExists("admin.user", "ADM001", password, "admin@schoolhealth.edu", adminRole, "Admin User", "555-100-1000", "N/A");
        
        // Create nurse account
        // User code for Nurse will be their nurse_code
        createUserIfNotExists("nurse.johnson", "NUR001", password, "nurse.johnson@schoolhealth.edu", nurseRole, "Sarah Johnson", "555-200-2000", "Female");
        
        // Create manager account (using a TEA prefix for user_code as an example, adjust if Manager has its own prefix)
        createUserIfNotExists("manager.davis", "TEA001", password, "manager.davis@schoolhealth.edu", managerRole, "David Manager", "555-300-3000", "Male");
        
        // Create parent account
        // User code for Parent will be their parent_code
        createUserIfNotExists("parent.smith", "PAR001", password, "parent.smith@email.com", parentRole, "Jennifer Smith", "555-400-4000", "Female");
                
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
    
    private void createUserIfNotExists(String username, String userCode, String password, String email, Role role, 
                                    String fullName, String phoneNumber, String gender) {
        if (!userRepository.existsByUsername(username) && !userRepository.existsByUserCode(userCode)) {
            User user = new User();
            user.setUserCode(userCode); 
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password)); 
            user.setEmail(email);
            user.setFullName(fullName); 
            user.setPhoneNumber(phoneNumber);
            // Gender is not a field on the User model directly, but passed for Nurse/Parent. 
            // If User needs gender, it should be added to the User model.
            user.setRole(role);
            user.setIsActive(true); 
            
            User savedUser = userRepository.save(user); // Save User first
            logger.info("Created user account: {} with user_code: {}", username, savedUser.getUserCode());

            // If role is SchoolNurse, create and save Nurse entity
            if (role.getRoleName().equals("SchoolNurse")) {
                if (nurseRepository.findByNurseCode(savedUser.getUserCode()).isPresent()) {
                    logger.warn("Nurse profile with code {} already exists. Skipping creation.", savedUser.getUserCode());
                    return;
                }
                Nurse nurse = new Nurse();
                nurse.setNurseCode(savedUser.getUserCode()); // Use User's userCode as Nurse's nurseCode
                nurse.setFullName(fullName); 
                nurse.setPhoneNumber(phoneNumber); 
                nurse.setGender(gender); 
                // nurse.setUser(savedUser); // This line is removed
                // Professional ID might be required, set a default or make it nullable for initialization
                nurse.setProfessionalId("NUR-PID-" + System.currentTimeMillis() % 10000); // Example Professional ID
                nurseRepository.save(nurse);
                logger.info("Created Nurse profile for user: {} with nurse_code: {}", username, nurse.getNurseCode());
            }

            // If role is Parent, create and save Parent entity
            if (role.getRoleName().equals("Parent")) {
                if (parentRepository.findByParentCode(savedUser.getUserCode()).isPresent()) {
                    logger.warn("Parent profile with code {} already exists. Skipping creation.", savedUser.getUserCode());
                    return;
                }
                Parent parent = new Parent();
                parent.setParentCode(savedUser.getUserCode()); // Use User's userCode as Parent's parentCode
                parent.setFullName(fullName); 
                parent.setPhoneNumber(phoneNumber); 
                parent.setGender(gender); 
                // parent.setUser(savedUser); // This line is removed
                parent.setAddress("Default Address"); // Example default value
                parent.setEmergencyContact(phoneNumber); // Example, using phone number as emergency contact
                parent.setRelationshipWithStudent("Parent"); // Example default value
                parentRepository.save(parent);
                logger.info("Created Parent profile for user: {} with parent_code: {}", username, parent.getParentCode());
            }
        } else {
            if (userRepository.existsByUsername(username)) {
                logger.info("User with username '{}' already exists.", username);
            } else {
                logger.info("User with user_code '{}' already exists.", userCode);
            }
        }
    }
}

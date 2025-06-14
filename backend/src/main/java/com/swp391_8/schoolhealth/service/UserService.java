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
    private PasswordEncoder passwordEncoder;

    // Enum for user roles to maintain API compatibility
    public enum UserRole {
        Parent, SchoolNurse, Admin, Manager, Student // Manager can be treated like Teacher for prefix
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    private synchronized String generateNextUserCode(String prefix, int length) {
        String likePattern = prefix + "%";
        Optional<String> lastUserCodeOpt = userRepository.findLastUserCodeByPrefix(likePattern);
        int nextNum = 1;
        if (lastUserCodeOpt.isPresent()) {
            String lastCode = lastUserCodeOpt.get();
            try {
                String numericPart = lastCode.substring(prefix.length());
                nextNum = Integer.parseInt(numericPart) + 1;
            } catch (NumberFormatException e) {
                logger.error("Error parsing numeric part of user_code: {}. Falling back to sequence 1.", lastCode, e);
                // Fallback or more sophisticated error handling might be needed
            }
        }
        return prefix + String.format("%0" + (length - prefix.length()) + "d", nextNum);
    }

    @Transactional // Added Transactional
    public User registerUser(String username, String password, String fullName, String email, String phone, 
                             String gender, String relationshipWithStudent, UserRole userRole,
                             String professionalId, String specialization, String qualification, // Nurse specific
                             String address, String emergencyContact // Parent specific (emergencyContact already in phone, but can be distinct)
                             ) { // Changed gender to relationshipWithStudent, added gender back
        // Create new user
        User user = new User();
        String roleName;
        String userCodePrefix;
        int userCodeLength;

        switch (userRole) {
            case Parent:
                roleName = "Parent"; // Standardized to match Role names in DB (e.g., "Parent" not "ROLE_PARENT")
                userCodePrefix = "PAR"; 
                userCodeLength = 6; // e.g., PAR001
                break;
            case SchoolNurse:
                roleName = "SchoolNurse";
                userCodePrefix = "NUR";
                userCodeLength = 6; // e.g., NUR001
                break;
            case Admin:
                roleName = "Admin";
                userCodePrefix = "ADM";
                userCodeLength = 6; // e.g., ADM001
                break;
            case Manager: // Assuming Manager is like Teacher for user_code generation
                roleName = "Manager";
                userCodePrefix = "TEA"; // Or specific prefix for Manager e.g., "MGR"
                userCodeLength = 6; // e.g., TEA001
                break;
            case Student:
                roleName = "Student";
                userCodePrefix = "STU";
                userCodeLength = 7; // e.g., STU0001 (4 digits for student number)
                break;
            default:
                // Fallback or throw error, for now, let's use Parent as a default if not specified or invalid
                logger.warn("Unspecified or invalid UserRole provided: {}. Defaulting to Parent.", userRole);
                roleName = "Parent";
                userCodePrefix = "PAR";
                userCodeLength = 6;
        }

        String generatedUserCode = generateNextUserCode(userCodePrefix, userCodeLength);
        // Ensure generatedUserCode is unique, regenerate if collision (highly unlikely with synchronized method and DB sequence logic)
        while(userRepository.existsByUserCode(generatedUserCode)){
            logger.warn("Generated user_code {} already exists. Regenerating.", generatedUserCode);
            generatedUserCode = generateNextUserCode(userCodePrefix, userCodeLength);
        }
        user.setUserCode(generatedUserCode);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password)); // Password should be encoded
        user.setFullName(fullName); // Set on User
        user.setEmail(email);
        user.setPhoneNumber(phone); // Set on User
        user.setIsActive(true);

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
        User savedUser = userRepository.save(user); // Save User first to get ID and generated user_code
        logger.info("User '{}' registered successfully with user_code: {} and role: {}", savedUser.getUsername(), savedUser.getUserCode(), savedUser.getRole().getRoleName());

        // Create Parent or Nurse specific entity
        if (userRole == UserRole.Parent) {
            Parent parent = new Parent();
            // parent.setUser(savedUser); // Removed: Parent no longer directly holds User
            parent.setParentCode(savedUser.getUserCode()); // Set parent_code from User's user_code
            parent.setFullName(fullName); // Consider if this should come from User or be distinct
            parent.setPhoneNumber(phone); // Consider if this should come from User or be distinct
            parent.setGender(gender); 
            parent.setRelationshipWithStudent(relationshipWithStudent); 
            parent.setAddress(address); // Set address for parent
            parent.setEmergencyContact(emergencyContact != null ? emergencyContact : phone); // Set emergency contact
            parentRepository.save(parent);
            logger.info("Parent profile created for user: {} with parent_code: {}", savedUser.getUsername(), parent.getParentCode());
        } else if (userRole == UserRole.SchoolNurse) {
            Nurse nurse = new Nurse();
            // nurse.setUser(savedUser); // Removed: Nurse no longer directly holds User
            nurse.setNurseCode(savedUser.getUserCode()); // Set nurse_code from User's user_code
            nurse.setFullName(savedUser.getFullName());
            nurse.setPhoneNumber(savedUser.getPhoneNumber());
            nurse.setGender(gender);
            nurse.setProfessionalId(professionalId); // Set from parameter
            nurse.setSpecialization(specialization); // Set from parameter
            nurse.setQualification(qualification); // Set from parameter
            
            if (nurse.getProfessionalId() == null || nurse.getProfessionalId().isEmpty()) {
                 logger.error("Professional ID for Nurse {} is not set during registration. Nurse profile cannot be saved without it.", nurse.getNurseCode());
                 // This should ideally throw an error or be validated before this point
                 throw new IllegalArgumentException("Professional ID is required for School Nurse registration.");
            }
            nurseRepository.save(nurse);
            logger.info("Nurse profile created for user: {} with nurse_code: {}", savedUser.getUsername(), nurse.getNurseCode());
        }

        return savedUser;
    }

    public Optional<User> findById(Integer userId) {
        return userRepository.findById(userId);
    }

    public Optional<User> findByUserCode(String userCode) {
        return userRepository.findByUserCode(userCode);
    }
}

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

import java.util.HashSet;
import java.util.Set;

@Service
public class UserService {

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
                break;
            case Student:
                // Map Student to ROLE_PARENT due to database constraint
                // ROLE_STUDENT is not allowed by the database CHECK constraint
                eRole = ERole.ROLE_PARENT;
                break;
            default:
                eRole = ERole.ROLE_PARENT;
        }

        Role roleEntity = roleRepository.findByName(eRole)
                .orElseThrow(() -> new RuntimeException("Error: Role " + eRole + " is not found."));
        roles.add(roleEntity);
        user.setRoles(roles);

        // Save user
        return userRepository.save(user);
    }
}

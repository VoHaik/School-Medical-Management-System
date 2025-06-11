package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.model.Role;
import com.swp391_8.schoolhealth.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TestController {

    @Autowired
    private RoleRepository roleRepository;

    @GetMapping(value = "/roles", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        
        Map<String, Object> response = new HashMap<>();
        response.put("totalRoles", roles.size());        response.put("roles", roles.stream().map(role -> {
            Map<String, Object> roleInfo = new HashMap<>();
            roleInfo.put("id", role.getId());
            roleInfo.put("name", role.getName());
            roleInfo.put("roleName", role.getRoleName());
            return roleInfo;
        }).toList());
        
        return ResponseEntity.ok(response);
    }    @GetMapping(value = "/health", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Authentication system is running");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/public", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> publicEndpoint() {
        return ResponseEntity.ok(Map.of(
            "message", "Public endpoint accessible",
            "timestamp", System.currentTimeMillis()
        ));
    }
    
    @GetMapping(value = "/user", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('SCHOOLNURSE') or hasRole('TEACHER') or hasRole('PARENT') or hasRole('STUDENT')")
    public ResponseEntity<?> userAccess(Principal principal) {
        return ResponseEntity.ok(Map.of(
            "message", "User content accessible",
            "user", principal != null ? principal.getName() : "anonymous",
            "timestamp", System.currentTimeMillis()
        ));
    }
}

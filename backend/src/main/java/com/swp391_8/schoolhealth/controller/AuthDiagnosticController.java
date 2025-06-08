package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.LoginRequest;
import com.swp391_8.schoolhealth.dto.MessageResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthDiagnosticController {

    private static final Logger logger = LoggerFactory.getLogger(AuthDiagnosticController.class);

    @PostMapping("/test-login")
    public ResponseEntity<?> testLogin(@RequestBody LoginRequest loginRequest) {
        logger.info("Received test login request for username: {}", loginRequest.getUsername());
        
        Map<String, Object> response = new HashMap<>();
        response.put("receivedUsername", loginRequest.getUsername());
        // Don't log actual password, just log a masked version for security
        response.put("receivedPasswordLength", loginRequest.getPassword().length());
        response.put("timestamp", System.currentTimeMillis());
        
        if ("parent.smith".equals(loginRequest.getUsername()) && "Password123".equals(loginRequest.getPassword())) {
            response.put("status", "success");
            response.put("message", "Test credentials are correct! In real auth, this would succeed.");
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "error");
            response.put("message", "Test credentials are incorrect! Expected: parent.smith/Password123");
            return ResponseEntity.status(401).body(response);
        }
    }
    
    @GetMapping("/auth-test")
    public ResponseEntity<?> authTest() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Auth diagnostic endpoint is working");
        response.put("testCredentials", Map.of("username", "parent.smith", "password", "Password123"));
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}

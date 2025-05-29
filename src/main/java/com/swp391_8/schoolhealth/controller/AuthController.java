package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.JwtResponse;
import com.swp391_8.schoolhealth.dto.LoginRequest;
import com.swp391_8.schoolhealth.dto.MessageResponse;
import com.swp391_8.schoolhealth.dto.SignupRequest;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.security.jwt.JwtUtils;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import com.swp391_8.schoolhealth.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserService userService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getFullName(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        // Check if username is already taken
        if (userService.existsByUsername(signupRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!", false));
        }

        // Check if email is already in use
        if (userService.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!", false));
        }

        // Create new user account
        User user = userService.registerUser(
                signupRequest.getUsername(),
                signupRequest.getPassword(),
                signupRequest.getFullName(),
                signupRequest.getEmail(),
                signupRequest.getPhone(),
                signupRequest.getRole()
        );

        return ResponseEntity.ok(new MessageResponse("User registered successfully!", true));
    }
}

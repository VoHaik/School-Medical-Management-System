package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.JwtResponse;
import com.swp391_8.schoolhealth.dto.LoginRequest;
import com.swp391_8.schoolhealth.dto.MessageResponse;
import com.swp391_8.schoolhealth.dto.SignupRequest;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.security.jwt.JwtUtils;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import com.swp391_8.schoolhealth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication and authorization endpoints for user login, registration and profile management")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserService userService;    @Operation(
        summary = "User Login",
        description = "Authenticate user with username/email and password. Returns JWT token and user information."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Login successful",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = JwtResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "401", 
            description = "Invalid credentials",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = MessageResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "400", 
            description = "Bad request - Invalid input format"
        )
    })
    @PostMapping(value = "/signin", 
                 produces = MediaType.APPLICATION_JSON_VALUE, 
                 consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> authenticateUser(
            @Parameter(description = "Login credentials containing username/email and password", required = true)
            @Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            // Ensure all parameters are correctly passed to JwtResponse constructor
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new JwtResponse(
                            jwt, 
                            userDetails.getId(), 
                            userDetails.getUsername(), 
                            userDetails.getEmail(), 
                            userDetails.getFullName(), 
                            userDetails.getPhoneNumber(), 
                            roles
                    ));
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return ResponseEntity
                    .status(401)
                    .body(new MessageResponse("Error: Invalid username or password!", false));
        } catch (org.springframework.security.authentication.DisabledException e) {
            return ResponseEntity
                    .status(401)
                    .body(new MessageResponse("Error: Account is disabled!", false));
        } catch (org.springframework.security.authentication.LockedException e) {
            return ResponseEntity
                    .status(401)
                    .body(new MessageResponse("Error: Account is locked!", false));
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        }
    }

    @Operation(
        summary = "User Registration",
        description = "Register a new user account. Note: STUDENT role registration is restricted."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Registration successful",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = MessageResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "400", 
            description = "Registration failed - validation errors or user already exists"
        ),
        @ApiResponse(
            responseCode = "403", 
            description = "Student registration not allowed"
        )
    })
    @PostMapping(value = "/signup", 
                 produces = MediaType.APPLICATION_JSON_VALUE, 
                 consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> registerUser(
            @Parameter(description = "Registration details including username, email, password and role", required = true)
            @Valid @RequestBody SignupRequest signupRequest) {
        logger.info("Processing registration request for user: {}", signupRequest.getUsername());
        try {
            // Prevent self-registration for STUDENT role
            // signupRequest.getRole() returns UserService.UserRole enum type
            if (signupRequest.getRole() != null && signupRequest.getRole() == UserService.UserRole.Student) {
                logger.warn("Registration failed: Attempt to self-register as a STUDENT ('{}')", signupRequest.getUsername());
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Student accounts cannot be registered through this form. Please contact an administrator.", false));
            }

            // Check if username is already taken
            if (userService.existsByUsername(signupRequest.getUsername())) {
                logger.warn("Registration failed: Username '{}' is already taken", signupRequest.getUsername());
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Username '" + signupRequest.getUsername() + "' is already taken! Please choose a different username.", false));
            }

            // Check if email is already in use
            if (userService.existsByEmail(signupRequest.getEmail())) {
                logger.warn("Registration failed: Email '{}' is already in use", signupRequest.getEmail());
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Email '" + signupRequest.getEmail() + "' is already in use! Please use a different email address.", false));
            }

            // Validate password strength
            if (signupRequest.getPassword().length() < 6) {
                logger.warn("Registration failed: Password is too weak");
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Password must be at least 6 characters long!", false));
            }

            // Create new user account
            User user = userService.registerUser(
                    signupRequest.getUsername(),
                    signupRequest.getPassword(),
                    signupRequest.getFullName(),
                    signupRequest.getEmail(),
                    signupRequest.getPhone(),
                    signupRequest.getGender(),
                    signupRequest.getRelationship(),
                    signupRequest.getRole(),
                    // Nurse-specific fields: professionalId, specialization, qualification
                    null, // professionalId - assuming not provided in general signup
                    null, // specialization - assuming not provided
                    null, // qualification - assuming not provided
                    // Parent-specific fields: address, emergencyContact
                    null, // address - assuming not provided in general signup or handle if SignupRequest is updated
                    null  // emergencyContact - assuming not provided or handle if SignupRequest is updated
            );

            logger.info("User '{}' registered successfully with role: {}", user.getUsername(), user.getRole());
            return ResponseEntity.ok(new MessageResponse(
                    "User registered successfully! Welcome, " + user.getFullName() + "! You can now log in with your credentials.",
                    true)
            );        } catch (IllegalArgumentException e) {
            logger.error("Registration failed due to invalid argument: {}", e.getMessage());
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Registration failed. " + e.getMessage(), false));
        } catch (RuntimeException e) {
            logger.error("Registration failed with runtime exception: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(500)
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        } catch (Exception e) {
            logger.error("Registration failed with unexpected exception", e);
            return ResponseEntity
                    .status(500)
                    .body(new MessageResponse("Error: Registration failed due to a server error. Please try again later or contact support if the issue persists.", false));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity
                    .status(401)
                    .body(new MessageResponse("Error: User not authenticated", false));
        }

        List<String> roles = userDetails.getAuthorities().stream()
                        .map(item -> item.getAuthority())
                        .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(
                null, // No need to return a new token
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getFullName(),
                userDetails.getPhoneNumber(), // Added missing phoneNumber
                roles
        ));
    }

    @GetMapping("/user/profile")
    public ResponseEntity<?> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity
                    .status(401)
                    .body(new MessageResponse("Error: User not authenticated", false));
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        if (userDetails == null) {
            return ResponseEntity
                    .status(401)
                    .body(new MessageResponse("Error: User not authenticated", false));
        }

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(
                null, // No token in profile response
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getFullName(),
                userDetails.getPhoneNumber(),
                roles
        ));
    }
}

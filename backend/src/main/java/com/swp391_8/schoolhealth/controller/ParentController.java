package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.MessageResponse;
import com.swp391_8.schoolhealth.model.Parent;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.service.ParentService;
import com.swp391_8.schoolhealth.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/parents")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ParentController {

    @Autowired
    private ParentService parentService;

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SCHOOLNURSE')")
    public ResponseEntity<List<Parent>> getAllParents() {
        List<Parent> parents = parentService.getAllParents();
        return ResponseEntity.ok(parents);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SCHOOLNURSE') or @securityService.isParent(authentication, #id)")
    public ResponseEntity<?> getParentById(@PathVariable Integer id) {
        Optional<Parent> parent = parentService.getParentById(id);
        return parent.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{parentCode}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SCHOOLNURSE') or @securityService.isParentByCode(authentication, #parentCode)")
    public ResponseEntity<?> getParentByCode(@PathVariable String parentCode) {
        Optional<Parent> parent = parentService.getParentByCode(parentCode);
        return parent.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SCHOOLNURSE') or authentication.principal.id == #userId")
    public ResponseEntity<?> getParentByUserId(@PathVariable Integer userId) {
        Optional<Parent> parent = parentService.getParentByUserId(userId);
        return parent.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SCHOOLNURSE')")
    public ResponseEntity<?> createParent(@RequestBody Map<String, Object> parentData) {
        try {
            // Extract user_id from parent data
            Integer userId = (Integer) parentData.get("userId");
            if (userId == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("User ID is required", false));
            }

            // Find the user
            Optional<User> userOptional = userService.findById(userId); // Changed from getUserById to findById
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest().body(new MessageResponse("User not found", false));
            }

            // Create parent object
            Parent parent = new Parent();
            parent.setUser(userOptional.get());

            // Set parent code if provided
            String parentCode = (String) parentData.get("parentCode");
            if (parentCode != null && !parentCode.isEmpty()) {
                parent.setParentCode(parentCode);
            }

            // Set other fields
            parent.setAddress((String) parentData.get("address"));
            parent.setEmergencyContact((String) parentData.get("emergencyContact"));
            parent.setRelationshipWithStudent((String) parentData.get("relationshipWithStudent"));

            // Save the parent
            Parent savedParent = parentService.createParent(parent);
            return ResponseEntity.ok(savedParent);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error creating parent: " + e.getMessage(), false));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SCHOOLNURSE') or @securityService.isParent(authentication, #id)")
    public ResponseEntity<?> updateParent(@PathVariable Integer id, @RequestBody Map<String, Object> parentData) {
        try {
            // Create parent object for update
            Parent parentDetails = new Parent();
            parentDetails.setAddress((String) parentData.get("address"));
            parentDetails.setEmergencyContact((String) parentData.get("emergencyContact"));
            parentDetails.setRelationshipWithStudent((String) parentData.get("relationshipWithStudent"));

            // Update the parent
            Optional<Parent> updatedParent = parentService.updateParent(id, parentDetails);
            return updatedParent.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error updating parent: " + e.getMessage(), false));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteParent(@PathVariable Integer id) {
        boolean deleted = parentService.deleteParent(id);
        if (deleted) {
            return ResponseEntity.ok(new MessageResponse("Parent deleted successfully", true));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

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

    @GetMapping("/{parentCode}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SCHOOLNURSE') or @securityService.isParentByCode(authentication, #parentCode)")
    public ResponseEntity<?> getParentByCode(@PathVariable String parentCode) {
        Optional<Parent> parent = parentService.getParentByCode(parentCode);
        return parent.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SCHOOLNURSE')")
    public ResponseEntity<?> createParent(@RequestBody Map<String, Object> parentData) {
        try {
            String userCode = (String) parentData.get("userCode");
            if (userCode == null || userCode.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("User code is required", false));
            }

            Optional<User> userOptional = userService.findByUserCode(userCode);
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest().body(new MessageResponse("User not found with code: " + userCode, false));
            }
            User user = userOptional.get();

            // Validate if a parent profile already exists for this user code
            if (parentService.getParentByCode(user.getUserCode()).isPresent()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Parent profile already exists for user code: " + user.getUserCode(), false));
            }

            Parent parent = new Parent();
            parent.setParentCode(user.getUserCode()); // Set parentCode from User's userCode

            // Optional: Validate parentCode from request body if provided
            String requestParentCode = (String) parentData.get("parentCode");
            if (requestParentCode != null && !requestParentCode.isEmpty() && !requestParentCode.equals(user.getUserCode())) {
                return ResponseEntity.badRequest().body(new MessageResponse("Provided parentCode in request body does not match user's userCode.", false));
            }
            
            parent.setAddress((String) parentData.get("address"));
            parent.setEmergencyContact((String) parentData.get("emergencyContact"));
            parent.setRelationshipWithStudent((String) parentData.get("relationshipWithStudent"));

            Parent savedParent = parentService.createParent(parent);
            return ResponseEntity.ok(savedParent);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error creating parent: " + e.getMessage(), false));
        }
    }

    @PutMapping("/{parentCode}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SCHOOLNURSE') or @securityService.isParentByCode(authentication, #parentCode)")
    public ResponseEntity<?> updateParent(@PathVariable String parentCode, @RequestBody Map<String, Object> parentData) {
        try {
            Parent parentDetails = new Parent();
            parentDetails.setAddress((String) parentData.get("address"));
            parentDetails.setEmergencyContact((String) parentData.get("emergencyContact"));
            parentDetails.setRelationshipWithStudent((String) parentData.get("relationshipWithStudent"));

            Optional<Parent> updatedParent = parentService.updateParentByCode(parentCode, parentDetails);
            return updatedParent.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error updating parent: " + e.getMessage(), false));
        }
    }

    @DeleteMapping("/{parentCode}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteParent(@PathVariable String parentCode) {
        boolean deleted = parentService.deleteParentByCode(parentCode);
        if (deleted) {
            return ResponseEntity.ok(new MessageResponse("Parent deleted successfully with code: " + parentCode, true));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

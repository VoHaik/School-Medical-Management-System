package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.MessageResponse;
import com.swp391_8.schoolhealth.model.Nurse;
import com.swp391_8.schoolhealth.repository.UserRepository;
import com.swp391_8.schoolhealth.service.NurseService;
import com.swp391_8.schoolhealth.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/nurses")
@CrossOrigin(origins = "*", maxAge = 3600)
public class NurseController {

    @Autowired
    private NurseService nurseService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Nurse>> getAllNurses() {
        List<Nurse> nurses = nurseService.getAllNurses();
        return ResponseEntity.ok(nurses);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isNurse(authentication, #id)")
    public ResponseEntity<?> getNurseById(@PathVariable Integer id) {
        Optional<Nurse> nurse = nurseService.getNurseById(id);
        return nurse.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{nurseCode}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isNurseByCode(authentication, #nurseCode)")
    public ResponseEntity<?> getNurseByCode(@PathVariable String nurseCode) {
        Optional<Nurse> nurse = nurseService.getNurseByCode(nurseCode);
        return nurse.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /*
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #userId")
    public ResponseEntity<?> getNurseByUserId(@PathVariable Integer userId) {
        Optional<Nurse> nurse = nurseService.getNurseByUserId(userId);
        return nurse.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    */

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createNurse(@RequestBody Map<String, Object> nurseData) {
        try {
            // Expect userCode instead of userId
            String userCode = (String) nurseData.get("userCode");
            if (userCode == null || userCode.isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("userCode is required", false));
            }

            // Find the user by userCode
            Optional<com.swp391_8.schoolhealth.model.User> userOptional = userRepository.findByUserCode(userCode);
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest().body(new MessageResponse("User not found with userCode: " + userCode, false));
            }
            com.swp391_8.schoolhealth.model.User user = userOptional.get();

            // Verify the user has the SchoolNurse role (optional, but good practice)
            if (user.getRole() == null || !"SchoolNurse".equals(user.getRole().getRoleName())) {
                 return ResponseEntity.badRequest().body(new MessageResponse("User with userCode: " + userCode + " is not a SchoolNurse.", false));
            }

            // Check if a Nurse profile already exists for this user_code
            if (nurseService.getNurseByCode(user.getUserCode()).isPresent()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Nurse profile already exists for userCode: " + user.getUserCode(), false));
            }

            // Create nurse object
            Nurse nurse = new Nurse();
            nurse.setNurseCode(user.getUserCode()); // Set nurse_code from User's user_code

            // Set other fields
            String professionalId = (String) nurseData.get("professionalId");
            if (professionalId == null || professionalId.isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("professionalId is required for Nurse", false));
            }
            nurse.setProfessionalId(professionalId);
            nurse.setSpecialization((String) nurseData.get("specialization"));
            nurse.setQualification((String) nurseData.get("qualification"));
            
            nurse.setFullName(user.getFullName()); 
            nurse.setPhoneNumber(user.getPhoneNumber());

            // Save the nurse
            Nurse savedNurse = nurseService.createNurse(nurse);
            return ResponseEntity.ok(savedNurse);

        } catch (IllegalArgumentException e) { // Catch specific exceptions from service
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage(), false));
        } 
        catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error creating nurse: " + e.getMessage(), false));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isNurse(authentication, #id)")
    public ResponseEntity<?> updateNurse(@PathVariable Integer id, @RequestBody Map<String, Object> nurseData) {
        try {
            // Create nurse object for update
            Nurse nurseDetails = new Nurse();
            nurseDetails.setProfessionalId((String) nurseData.get("professionalId"));
            nurseDetails.setSpecialization((String) nurseData.get("specialization"));
            nurseDetails.setQualification((String) nurseData.get("qualification"));

            // Update the nurse
            Optional<Nurse> updatedNurse = nurseService.updateNurse(id, nurseDetails);
            return updatedNurse.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error updating nurse: " + e.getMessage(), false));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteNurse(@PathVariable Integer id) {
        boolean deleted = nurseService.deleteNurse(id);
        if (deleted) {
            return ResponseEntity.ok(new MessageResponse("Nurse deleted successfully", true));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

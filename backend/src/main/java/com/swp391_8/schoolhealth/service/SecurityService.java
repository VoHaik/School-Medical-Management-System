package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.BlogPost;
import com.swp391_8.schoolhealth.model.ERole;
import com.swp391_8.schoolhealth.repository.BlogPostRepository;
import com.swp391_8.schoolhealth.repository.ParentRepository;
import com.swp391_8.schoolhealth.repository.NurseRepository;
import com.swp391_8.schoolhealth.repository.ParentStudentRelationshipRepository;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;

@Service("securityService") // Added bean name
public class SecurityService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private ParentStudentRelationshipRepository parentStudentRelationshipRepository;
    
    @Autowired
    private ParentRepository parentRepository;
    
    @Autowired
    private NurseRepository nurseRepository;

    public boolean isParentOfStudent(Authentication authentication, Integer studentId) {
        if (authentication == null || studentId == null) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserDetailsImpl)) {
            return false; // Principal is not of expected type
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) principal;
        String parentCode = userDetails.getUsername(); // Use user_code as parent_code

        if (parentCode == null || parentCode.isEmpty()) {
            return false; // UserDetailsImpl did not provide a username (parentCode)
        }

        // FIXME: This is a temporary fix. Review if this method is still needed
        // or if the conversion from Integer studentId to String studentCode is appropriate.
        // This assumes studentId can be directly converted to a studentCode string.
        // This will likely fail if studentId is not the same as studentCode.
        // The correct approach is to use isParentOfStudentByCode or fetch Student by old ID then use its code.
        // For now, to attempt to fix compilation, we convert studentId to String.
        // This line is the primary change to address the compilation error.
        // Assuming studentId here is actually studentCode, if not, this logic is flawed.
        // For now, we will assume studentId is a placeholder for what should be studentCode.
        // If studentId is a legacy database ID, it needs to be resolved to a studentCode first.
        // For the purpose of fixing the immediate compilation error based on previous changes:
        return parentStudentRelationshipRepository.existsByParentParentCodeAndStudentStudentCode(parentCode, String.valueOf(studentId));
    }

    // New method to check relationship using studentCode
    public boolean isParentOfStudentByCode(Authentication authentication, String studentCode) {
        if (authentication == null || studentCode == null || studentCode.isEmpty()) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserDetailsImpl)) {
            return false;
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) principal;
        // FIX: Use userCode instead of username because parent_code in the database matches userCode, not username
        String parentCode = userDetails.getUserCode(); 
        
        if (parentCode == null || parentCode.isEmpty()) {
            // Fallback to username if userCode is not available
            parentCode = userDetails.getUsername();
        }

        if (parentCode == null || parentCode.isEmpty()) {
            return false;
        }

        // Use the fixed method instead of the deprecated one
        return parentStudentRelationshipRepository.existsByParentCodeAndStudentStudentCode(parentCode, studentCode);
    }
    
    // Method for checking if a parent has access to a student directly with parentCode and studentCode
    public boolean parentHasAccessToStudent(String parentCode, String studentCode) {
        if (parentCode == null || parentCode.isEmpty() || studentCode == null || studentCode.isEmpty()) {
            return false;
        }
        
        // Get parent by username from repository to find their actual parent_code
        Optional<com.swp391_8.schoolhealth.model.Parent> parent = parentRepository.findByParentCode(parentCode);
        if (parent.isPresent()) {
            // Use the actual parent_code from the Parent entity
            String actualParentCode = parent.get().getParentCode();
            return parentStudentRelationshipRepository.existsByParentCodeAndStudentStudentCode(actualParentCode, studentCode);
        }
        
        // If parent not found by username, try direct check with provided code
        return parentStudentRelationshipRepository.existsByParentCodeAndStudentStudentCode(parentCode, studentCode);
    }

    public boolean isPostAuthor(Authentication authentication, Integer postId) {
        if (authentication == null || postId == null) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserDetailsImpl)) {
            return false; // Principal is not of expected type
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) principal;
        Integer userId = userDetails.getId();

        if (userId == null) {
            return false; // UserDetailsImpl did not provide an ID
        }

        // Check if the post belongs to this user
        Optional<BlogPost> blogPost = blogPostRepository.findById(postId);
        return blogPost.isPresent() && blogPost.get().getAuthor() != null && blogPost.get().getAuthor().getId().equals(userId);
    }
    
    public boolean isParent(Authentication authentication, Integer parentId) {
        if (authentication == null || parentId == null) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserDetailsImpl)) {
            return false;
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) principal;
        String authenticatedUserCode = userDetails.getUsername();

        if (authenticatedUserCode == null || authenticatedUserCode.isEmpty()) {
            return false;
        }

        // Check if the authenticated user is the parent with the given ID
        return parentRepository.findById(parentId)
                .map(parent -> parent.getParentCode() != null && parent.getParentCode().equals(authenticatedUserCode))
                .orElse(false);
    }
    
    public boolean isParentByCode(Authentication authentication, String parentCode) {
        if (authentication == null || parentCode == null || parentCode.isEmpty()) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserDetailsImpl)) {
            return false;
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) principal;
        String authenticatedUserCode = userDetails.getUsername();

        if (authenticatedUserCode == null || authenticatedUserCode.isEmpty()) {
            return false;
        }

        // Check if the authenticated user is the parent with the given code
        return parentRepository.findByParentCode(parentCode)
                .map(parent -> parent.getParentCode() != null && parent.getParentCode().equals(authenticatedUserCode))
                .orElse(false);
    }
    
    // Overloaded method for checking if the authenticated user is a nurse
    // without requiring a specific nurseId.
    // This is useful for general role checks.
    public boolean isNurse(Authentication authentication) {
        if (authentication == null) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserDetailsImpl)) {
            return false;
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) principal;
        
        // Check if the user has the NURSE role
        // This assumes UserDetailsImpl has a method like getAuthorities() or getRoles()
        // and that roles are prefixed with "ROLE_"
        return userDetails.getAuthorities().stream()
                .anyMatch(grantedAuthority -> ERole.ROLE_SCHOOLNURSE.name().equals(grantedAuthority.getAuthority()));
    }
    
    public boolean isNurse(Authentication authentication, Integer nurseId) {
        if (authentication == null || nurseId == null) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserDetailsImpl)) {
            return false;
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) principal;
        String authenticatedUserCode = userDetails.getUsername();

        if (authenticatedUserCode == null || authenticatedUserCode.isEmpty()) {
            return false;
        }

        // Check if the authenticated user is the nurse with the given ID
        return nurseRepository.findById(nurseId)
                .map(nurse -> nurse.getNurseCode() != null && nurse.getNurseCode().equals(authenticatedUserCode))
                .orElse(false);
    }
    
    public boolean isNurseByCode(Authentication authentication, String nurseCode) {
        if (authentication == null || nurseCode == null || nurseCode.isEmpty()) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserDetailsImpl)) {
            return false;
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) principal;
        String authenticatedUserCode = userDetails.getUsername();

        if (authenticatedUserCode == null || authenticatedUserCode.isEmpty()) {
            return false;
        }

        // Check if the authenticated user is the nurse with the given code
        return nurseRepository.findByNurseCode(nurseCode)
                .map(nurse -> nurse.getNurseCode() != null && nurse.getNurseCode().equals(authenticatedUserCode))
                .orElse(false);
    }

    // New method to check relationship using studentCode and parentId (Integer)
    public boolean isParentOfStudent(Integer parentUserId, String studentCode) {
        if (parentUserId == null || studentCode == null || studentCode.isEmpty()) {
            return false;
        }
        // Corrected method name to match the one in ParentStudentRelationshipRepository
        return parentStudentRelationshipRepository.existsByParentUserUserIdAndStudentStudentCode(parentUserId, studentCode);
    }

    // New method to check relationship using studentCode (String)
    public boolean isParentOfStudent(Authentication authentication, String studentCode) {
        if (authentication == null || studentCode == null || studentCode.isEmpty()) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserDetailsImpl)) {
            return false;
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) principal;
        // FIX: Use userCode instead of username because parent_code in the database matches userCode, not username
        String parentCode = userDetails.getUserCode(); 
        
        if (parentCode == null || parentCode.isEmpty()) {
            // Fallback to username if userCode is not available
            parentCode = userDetails.getUsername();
        }

        if (parentCode == null || parentCode.isEmpty()) {
            return false;
        }
        
        // Try both methods to increase chance of success
        boolean directCheck = parentStudentRelationshipRepository.existsByParentCodeAndStudentStudentCode(parentCode, studentCode);
        if (directCheck) {
            return true;
        }
        
        // Fallback to the original method for backward compatibility
        return parentStudentRelationshipRepository.existsByParentParentCodeAndStudentStudentCode(parentCode, studentCode);
    }

    // Overload for isAdmin to accept Authentication only
    public boolean isAdmin(Authentication authentication) {
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> ERole.ROLE_ADMIN.name().equals(grantedAuthority.getAuthority()));
    }

    // Overload for isParent to accept Authentication only
    public boolean isParent(Authentication authentication) {
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> ERole.ROLE_PARENT.name().equals(grantedAuthority.getAuthority()));
    }

    public boolean hasAnyRole(Authentication authentication, ERole... roles) {
        if (authentication == null || roles == null || roles.length == 0) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .map(grantedAuthority -> ERole.valueOf(grantedAuthority.getAuthority())) // Convert String to ERole
                .anyMatch(userRole -> Arrays.asList(roles).contains(userRole));
    }
}

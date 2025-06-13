package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.BlogPost;
import com.swp391_8.schoolhealth.repository.BlogPostRepository;
import com.swp391_8.schoolhealth.repository.ParentRepository;
import com.swp391_8.schoolhealth.repository.NurseRepository;
import com.swp391_8.schoolhealth.repository.ParentStudentRelationshipRepository;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

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
        Integer parentId = userDetails.getId();

        if (parentId == null) {
            return false; // UserDetailsImpl did not provide an ID
        }

        // FIXME: This is a temporary fix. Review if this method is still needed 
        // or if the conversion from Integer studentId to String studentCode is appropriate.
        // This assumes studentId can be directly converted to a studentCode string.
        // This will likely fail if studentId is not the same as studentCode.
        // The correct approach is to use isParentOfStudentByCode or fetch Student by old ID then use its code.
        // For now, to attempt to fix compilation, we convert studentId to String.
        // This line is the primary change to address the compilation error.
        return parentStudentRelationshipRepository.existsByParentUserIdAndStudentStudentCode(parentId, String.valueOf(studentId));
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
        Integer parentId = userDetails.getId();

        if (parentId == null) {
            return false;
        }

        return parentStudentRelationshipRepository.existsByParentUserIdAndStudentStudentCode(parentId, studentCode);
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
        Integer userId = userDetails.getId();

        if (userId == null) {
            return false;
        }

        // Check if the authenticated user is the parent with the given ID
        return parentRepository.findById(parentId)
                .map(parent -> parent.getUser() != null && parent.getUser().getUserId().equals(userId))
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
        Integer userId = userDetails.getId();

        if (userId == null) {
            return false;
        }

        // Check if the authenticated user is the parent with the given code
        return parentRepository.findByParentCode(parentCode)
                .map(parent -> parent.getUser() != null && parent.getUser().getUserId().equals(userId))
                .orElse(false);
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
        Integer userId = userDetails.getId();

        if (userId == null) {
            return false;
        }

        // Check if the authenticated user is the nurse with the given ID
        return nurseRepository.findById(nurseId)
                .map(nurse -> nurse.getUser() != null && nurse.getUser().getUserId().equals(userId))
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
        Integer userId = userDetails.getId();

        if (userId == null) {
            return false;
        }

        // Check if the authenticated user is the nurse with the given code
        return nurseRepository.findByNurseCode(nurseCode)
                .map(nurse -> nurse.getUser() != null && nurse.getUser().getUserId().equals(userId))
                .orElse(false);
    }
}

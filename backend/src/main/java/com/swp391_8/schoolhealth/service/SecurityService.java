package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.BlogPost;
import com.swp391_8.schoolhealth.repository.BlogPostRepository;
import com.swp391_8.schoolhealth.repository.ParentStudentRelationshipRepository;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SecurityService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private ParentStudentRelationshipRepository parentStudentRelationshipRepository;

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

        // Check if there exists a parent-student relationship
        return parentStudentRelationshipRepository.existsByParentUserIdAndStudentStudentId(parentId, studentId);
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
}

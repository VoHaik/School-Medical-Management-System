package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.BlogPost;
import com.swp391_8.schoolhealth.repository.BlogPostRepository;
import com.swp391_8.schoolhealth.repository.ParentStudentRelationshipRepository;
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

        // Get the authenticated user's ID
        Integer parentId = null;
        try {
            parentId = (Integer) authentication.getPrincipal().getClass().getMethod("getId").invoke(authentication.getPrincipal());
        } catch (Exception e) {
            return false;
        }

        // Check if there exists a parent-student relationship
        return parentStudentRelationshipRepository.existsByParentUserIdAndStudentStudentId(parentId, studentId);
    }

    public boolean isPostAuthor(Authentication authentication, Integer postId) {
        if (authentication == null || postId == null) {
            return false;
        }

        // Get the authenticated user's ID
        Integer userId = null;
        try {
            userId = (Integer) authentication.getPrincipal().getClass().getMethod("getId").invoke(authentication.getPrincipal());
        } catch (Exception e) {
            return false;
        }

        // Check if the post belongs to this user
        Optional<BlogPost> blogPost = blogPostRepository.findById(postId);
        return blogPost.isPresent() && blogPost.get().getAuthor() != null && blogPost.get().getAuthor().getId().equals(userId);
    }
}

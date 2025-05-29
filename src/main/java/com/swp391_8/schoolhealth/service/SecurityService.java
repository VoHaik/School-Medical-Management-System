package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.BlogPost;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.repository.BlogPostRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SecurityService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private BlogPostRepository blogPostRepository;

    public boolean isParentOfStudent(Authentication authentication, Long studentId) {
        if (authentication == null || studentId == null) {
            return false;
        }

        // Get the authenticated user's ID
        Long parentId = null;
        try {
            parentId = (Long) authentication.getPrincipal().getClass().getMethod("getId").invoke(authentication.getPrincipal());
        } catch (Exception e) {
            return false;
        }

        // Check if the student belongs to this parent
        Optional<Student> student = studentRepository.findById(studentId);
        return student.isPresent() && student.get().getParent() != null && student.get().getParent().getId().equals(parentId);
    }

    public boolean isPostAuthor(Authentication authentication, Long postId) {
        if (authentication == null || postId == null) {
            return false;
        }

        // Get the authenticated user's ID
        Long userId = null;
        try {
            userId = (Long) authentication.getPrincipal().getClass().getMethod("getId").invoke(authentication.getPrincipal());
        } catch (Exception e) {
            return false;
        }

        // Check if the post belongs to this user
        Optional<BlogPost> blogPost = blogPostRepository.findById(postId);
        return blogPost.isPresent() && blogPost.get().getAuthor() != null && blogPost.get().getAuthor().getId().equals(userId);
    }
}

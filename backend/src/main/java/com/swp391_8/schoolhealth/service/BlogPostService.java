package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.exception.ResourceNotFoundException;
import com.swp391_8.schoolhealth.model.BlogPost;
import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.BlogPostRepository;
import com.swp391_8.schoolhealth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlogPostService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private UserRepository userRepository;

    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public BlogPost getPostById(Integer id) {
        return blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BlogPost", "id", id));
    }

    public List<BlogPost> getPostsByAuthorId(Integer authorId) {
        return blogPostRepository.findByCreatedByUserUserId(authorId); // Changed from findByCreatedByUser_Id to findByCreatedByUserUserId
    }

    public BlogPost createPost(BlogPost blogPost, Integer authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId));
        blogPost.setCreatedByUser(author); // Changed from setAuthor to setCreatedByUser
        return blogPostRepository.save(blogPost);
    }

    public BlogPost createTestPost(BlogPost blogPost) {
        // For testing purposes only - creates post without author
        return blogPostRepository.save(blogPost);
    }

    public BlogPost updatePost(Integer id, BlogPost blogPostDetails) {
        BlogPost blogPost = getPostById(id);
        blogPost.setTitle(blogPostDetails.getTitle());
        blogPost.setContentText(blogPostDetails.getContentText()); // Changed from setContent and getContent to setContentText and getContentText
        
        // Update additional fields if they exist and are valid for BlogPost entity
        // blogPost.setSummary(blogPostDetails.getSummary()); // Summary field does not exist in BlogPost
        // blogPost.setTags(blogPostDetails.getTags()); // Tags field does not exist in BlogPost
        // blogPost.setCategoryId(blogPostDetails.getCategoryId()); // CategoryId field does not exist in BlogPost
        if (blogPostDetails.getSlug() != null) {
            blogPost.setSlug(blogPostDetails.getSlug());
        }
        if (blogPostDetails.getPublishedAt() != null) {
            blogPost.setPublishedAt(blogPostDetails.getPublishedAt());
        }
        
        return blogPostRepository.save(blogPost);
    }

    public void deletePost(Integer id) {
        BlogPost blogPost = getPostById(id);
        blogPostRepository.delete(blogPost);
    }
}
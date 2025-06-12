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
        return blogPostRepository.findByAuthorId(authorId);
    }

    public BlogPost createPost(BlogPost blogPost, Integer authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId));
        blogPost.setAuthor(author);
        return blogPostRepository.save(blogPost);
    }

    public BlogPost createTestPost(BlogPost blogPost) {
        // For testing purposes only - creates post without author
        return blogPostRepository.save(blogPost);
    }

    public BlogPost updatePost(Integer id, BlogPost blogPostDetails) {
        BlogPost blogPost = getPostById(id);
        blogPost.setTitle(blogPostDetails.getTitle());
        blogPost.setContent(blogPostDetails.getContent());
        
        // Update additional fields if they exist
        if (blogPostDetails.getSummary() != null) {
            blogPost.setSummary(blogPostDetails.getSummary());
        }
        if (blogPostDetails.getTags() != null) {
            blogPost.setTags(blogPostDetails.getTags());
        }
        if (blogPostDetails.getCategoryId() != null) {
            blogPost.setCategoryId(blogPostDetails.getCategoryId());
        }
        
        return blogPostRepository.save(blogPost);
    }

    public void deletePost(Integer id) {
        BlogPost blogPost = getPostById(id);
        blogPostRepository.delete(blogPost);
    }
}
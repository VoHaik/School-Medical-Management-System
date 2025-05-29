package com.swp391_8.schoolhealth.service;

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

    public BlogPost getPostById(Long id) {
        return blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));
    }

    public List<BlogPost> getPostsByAuthorId(Long authorId) {
        return blogPostRepository.findByAuthorId(authorId);
    }

    public BlogPost createPost(BlogPost blogPost, Long authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + authorId));
        blogPost.setAuthor(author);
        return blogPostRepository.save(blogPost);
    }

    public BlogPost updatePost(Long id, BlogPost blogPostDetails) {
        BlogPost blogPost = getPostById(id);
        blogPost.setTitle(blogPostDetails.getTitle());
        blogPost.setContent(blogPostDetails.getContent());
        return blogPostRepository.save(blogPost);
    }

    public void deletePost(Long id) {
        BlogPost blogPost = getPostById(id);
        blogPostRepository.delete(blogPost);
    }
}
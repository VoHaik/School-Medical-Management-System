package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.model.BlogPost;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import com.swp391_8.schoolhealth.service.BlogPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blog")
public class BlogPostController {

    @Autowired
    private BlogPostService blogPostService;    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BlogPost>> getAllPosts() {
        List<BlogPost> posts = blogPostService.getAllPosts();
        return ResponseEntity.ok(posts);
    }    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BlogPost> getPostById(@PathVariable Integer id) {
        BlogPost post = blogPostService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    @GetMapping(value = "/author/{authorId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BlogPost>> getPostsByAuthorId(@PathVariable Integer authorId) {
        List<BlogPost> posts = blogPostService.getPostsByAuthorId(authorId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping(value = "/my-posts", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('STUDENT') or hasRole('PARENT')")
    public ResponseEntity<List<BlogPost>> getMyPosts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<BlogPost> posts = blogPostService.getPostsByAuthorId(userDetails.getId());
        return ResponseEntity.ok(posts);
    }

    @PostMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('STUDENT') or hasRole('PARENT')")
    public ResponseEntity<BlogPost> createPost(@RequestBody BlogPost blogPost) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        BlogPost newPost = blogPostService.createPost(blogPost, userDetails.getId());
        return ResponseEntity.ok(newPost);
    }

    @PostMapping(value = "/test-create", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BlogPost> createTestPost() {
        BlogPost testPost = new BlogPost();
        testPost.setTitle("Test Blog Post");
        testPost.setContent("This is a test blog post to verify the API is working correctly.");
        testPost.setSummary("Test post summary");
        testPost.setCategoryId(1);
        
        // For testing, we'll create without authentication
        // In real scenario, this should be removed
        BlogPost newPost = blogPostService.createTestPost(testPost);
        return ResponseEntity.ok(newPost);
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("(hasRole('STUDENT') or hasRole('PARENT')) and @securityService.isPostAuthor(authentication, #id)")
    public ResponseEntity<BlogPost> updatePost(@PathVariable Integer id, @RequestBody BlogPost blogPost) {
        BlogPost updatedPost = blogPostService.updatePost(id, blogPost);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("((hasRole('STUDENT') or hasRole('PARENT')) and @securityService.isPostAuthor(authentication, #id)) or hasRole('ADMIN')")
    public ResponseEntity<?> deletePost(@PathVariable Integer id) {
        blogPostService.deletePost(id);
        return ResponseEntity.ok().build();
    }
}

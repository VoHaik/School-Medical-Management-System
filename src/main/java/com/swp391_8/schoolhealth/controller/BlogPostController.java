package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.model.BlogPost;
import com.swp391_8.schoolhealth.security.services.UserDetailsImpl;
import com.swp391_8.schoolhealth.service.BlogPostService;
import org.springframework.beans.factory.annotation.Autowired;
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
    private BlogPostService blogPostService;

    @GetMapping
    public ResponseEntity<List<BlogPost>> getAllPosts() {
        List<BlogPost> posts = blogPostService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogPost> getPostById(@PathVariable Long id) {
        BlogPost post = blogPostService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<BlogPost>> getPostsByAuthorId(@PathVariable Long authorId) {
        List<BlogPost> posts = blogPostService.getPostsByAuthorId(authorId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/my-posts")
    @PreAuthorize("hasRole('STUDENT') or hasRole('PARENT')")
    public ResponseEntity<List<BlogPost>> getMyPosts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<BlogPost> posts = blogPostService.getPostsByAuthorId(userDetails.getId());
        return ResponseEntity.ok(posts);
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT') or hasRole('PARENT')")
    public ResponseEntity<BlogPost> createPost(@RequestBody BlogPost blogPost) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        BlogPost newPost = blogPostService.createPost(blogPost, userDetails.getId());
        return ResponseEntity.ok(newPost);
    }

    @PutMapping("/{id}")
    @PreAuthorize("(hasRole('STUDENT') or hasRole('PARENT')) and @securityService.isPostAuthor(authentication, #id)")
    public ResponseEntity<BlogPost> updatePost(@PathVariable Long id, @RequestBody BlogPost blogPost) {
        BlogPost updatedPost = blogPostService.updatePost(id, blogPost);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("((hasRole('STUDENT') or hasRole('PARENT')) and @securityService.isPostAuthor(authentication, #id)) or hasRole('ADMIN')")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        blogPostService.deletePost(id);
        return ResponseEntity.ok().build();
    }
}

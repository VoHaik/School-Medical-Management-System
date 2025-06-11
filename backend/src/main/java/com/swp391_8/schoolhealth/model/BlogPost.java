package com.swp391_8.schoolhealth.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Blogposts") // Changed "BlogPosts" to "Blogposts"
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "blog_post_id") // Changed "post_id" to "blog_post_id"
    private Integer id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // @Column(length = 500)
    // private String summary;

    @Column(name = "slug") // Added slug field
    private String slug;

    // @ElementCollection
    // @CollectionTable(name = "blog_post_tags", joinColumns = @JoinColumn(name = "post_id")) // Changed to post_id
    // @Column(name = "tag")
    // private java.util.List<String> tags;

    // @Column(name = "category_id")
    // private Integer categoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id") // Changed "user_id" to "created_by_user_id"
    @JsonIgnore
    private User author;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "published_at") // Added published_at field
    private LocalDateTime publishedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Manual getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // public String getSummary() {
    //     return summary;
    // }

    // public void setSummary(String summary) {
    //     this.summary = summary;
    // }

    // public java.util.List<String> getTags() {
    //     return tags;
    // }

    // public void setTags(java.util.List<String> tags) {
    //     this.tags = tags;
    // }

    // public Integer getCategoryId() {
    //     return categoryId;
    // }

    // public void setCategoryId(Integer categoryId) {
    //     this.categoryId = categoryId;
    // }

    public String getSlug() { // Added getter for slug
        return slug;
    }

    public void setSlug(String slug) { // Added setter for slug
        this.slug = slug;
    }

    public LocalDateTime getPublishedAt() { // Added getter for publishedAt
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) { // Added setter for publishedAt
        this.publishedAt = publishedAt;
    }
}
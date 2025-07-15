package com.swp391_8.schoolhealth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostDTO {
    private Integer id;
    private String title;
    private String content;
    private String summary;
    private List<String> tags;
    private Integer categoryId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Author information (safe to expose)
    private Integer authorId;
    private String authorName;
    private String authorRole;
    private String authorTitle; // e.g., "School Nurse", "Senior Nurse"
}

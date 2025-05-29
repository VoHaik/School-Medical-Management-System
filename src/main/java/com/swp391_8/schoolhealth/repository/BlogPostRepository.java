package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    List<BlogPost> findByAuthorId(Long authorId);
    List<BlogPost> findAllByOrderByCreatedAtDesc();
}
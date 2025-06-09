package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Integer> {
    List<BlogPost> findByAuthorId(Integer authorId);
    List<BlogPost> findAllByOrderByCreatedAtDesc();
}
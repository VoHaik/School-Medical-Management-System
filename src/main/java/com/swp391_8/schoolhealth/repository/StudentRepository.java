package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByParentId(Long parentId);
    List<Student> findByClassName(String className);
    Optional<Student> findByUserId(Long userId);
}

package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    List<Student> findByClassName(String className);
    Optional<Student> findByUserId(Integer userId);
    
    // Find students by parent ID using the relationship table
    @Query("SELECT s FROM Student s JOIN ParentStudentRelationship psr ON s.studentId = psr.student.studentId WHERE psr.parent.userId = :parentId")
    List<Student> findByParentId(@Param("parentId") Integer parentId);
}

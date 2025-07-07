package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.ParentRegistrationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParentRegistrationRequestRepository extends JpaRepository<ParentRegistrationRequest, Integer> {
    
    // Tìm request theo parent code
    Optional<ParentRegistrationRequest> findByParentCode(String parentCode);
    
    // Tìm request theo username
    Optional<ParentRegistrationRequest> findByUsername(String username);
    
    // Tìm request theo email
    Optional<ParentRegistrationRequest> findByEmail(String email);
    
    // Lấy tất cả requests theo status
    List<ParentRegistrationRequest> findByStatusOrderByCreatedAtDesc(ParentRegistrationRequest.RequestStatus status);
    
    // Lấy tất cả requests sắp xếp theo ngày tạo
    List<ParentRegistrationRequest> findAllByOrderByCreatedAtDesc();
    
    // Đếm số request pending
    @Query("SELECT COUNT(r) FROM ParentRegistrationRequest r WHERE r.status = :status")
    long countByStatus(@Param("status") ParentRegistrationRequest.RequestStatus status);
    
    // Tìm requests được review bởi admin
    List<ParentRegistrationRequest> findByReviewedByOrderByReviewedAtDesc(Integer reviewedBy);
    
    // Kiểm tra xem parent code đã có request nào chưa
    boolean existsByParentCode(String parentCode);
    
    // Kiểm tra xem username đã được sử dụng chưa
    boolean existsByUsername(String username);
    
    // Kiểm tra xem email đã được sử dụng chưa
    boolean existsByEmail(String email);
}

package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.PendingRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PendingRegistrationRepository extends JpaRepository<PendingRegistration, Integer> {
    
    // Tìm tất cả yêu cầu đăng ký theo trạng thái
    List<PendingRegistration> findByStatusOrderByRequestedAtDesc(PendingRegistration.RegistrationStatus status);
    
    // Tìm tất cả yêu cầu đăng ký chờ phê duyệt
    List<PendingRegistration> findByStatusOrderByRequestedAtAsc(PendingRegistration.RegistrationStatus status);
    
    // Kiểm tra username đã tồn tại trong yêu cầu chờ phê duyệt chưa
    boolean existsByUsernameAndStatus(String username, PendingRegistration.RegistrationStatus status);
    
    // Kiểm tra email đã tồn tại trong yêu cầu chờ phê duyệt chưa
    boolean existsByEmailAndStatus(String email, PendingRegistration.RegistrationStatus status);
    
    // Kiểm tra parent code đã tồn tại trong yêu cầu chờ phê duyệt chưa
    boolean existsByParentCodeAndStatus(String parentCode, PendingRegistration.RegistrationStatus status);
    
    // Tìm yêu cầu theo student code và trạng thái
    List<PendingRegistration> findByStudentCodeAndStatus(String studentCode, PendingRegistration.RegistrationStatus status);
    
    // Tìm yêu cầu theo student code và full name để xác thực
    @Query("SELECT pr FROM PendingRegistration pr WHERE pr.studentCode = :studentCode AND pr.studentFullName = :studentFullName AND pr.status = :status")
    List<PendingRegistration> findByStudentCodeAndStudentFullNameAndStatus(
        @Param("studentCode") String studentCode, 
        @Param("studentFullName") String studentFullName, 
        @Param("status") PendingRegistration.RegistrationStatus status
    );
    
    // Đếm số lượng yêu cầu chờ phê duyệt
    long countByStatus(PendingRegistration.RegistrationStatus status);
    
    // Tìm theo ID và trạng thái
    Optional<PendingRegistration> findByIdAndStatus(Integer id, PendingRegistration.RegistrationStatus status);
}

package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.MedicationInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository đơn giản hóa cho MedicationInventory
 * Chỉ bao gồm các truy vấn cần thiết cho quản lý thuốc cơ bản
 */
@Repository
public interface MedicationInventoryRepository extends JpaRepository<MedicationInventory, Integer> {
      // Tìm thuốc theo tên
    List<MedicationInventory> findByMedicationNameContainingIgnoreCase(String name);
    
    // Tìm thuốc với tên chính xác
    MedicationInventory findByMedicationNameIgnoreCase(String name);
    
    // Tìm thuốc sắp hết hạn sử dụng
    List<MedicationInventory> findByExpiryDateBefore(LocalDate date);
    
    // Tìm thuốc có số lượng thấp hơn ngưỡng quy định
    List<MedicationInventory> findByQuantityLessThan(int threshold);
    
    // Query tùy chỉnh để tìm thuốc dựa trên nhiều điều kiện
    @Query("SELECT m FROM MedicationInventory m WHERE " +
           "(:name IS NULL OR LOWER(m.medicationName) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:form IS NULL OR m.form = :form) AND " +
           "(:includeExpired = true OR m.expiryDate > CURRENT_DATE)")
    List<MedicationInventory> findMedicationsByFilters(String name, String form, boolean includeExpired);
}

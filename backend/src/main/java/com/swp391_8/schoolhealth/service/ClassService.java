package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.ClassDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClassService {

    // In a real application, this would interact with a repository to fetch classes from the database
    public List<ClassDTO> getAllClasses() {
        // For now, returning a hardcoded list of classes
        List<ClassDTO> classes = new ArrayList<>();
        
        classes.add(new ClassDTO("1A", "Lớp 1A", "Grade 1", "2024-2025", "Nguyễn Thị Mai"));
        classes.add(new ClassDTO("1B", "Lớp 1B", "Grade 1", "2024-2025", "Trần Văn Hòa"));
        classes.add(new ClassDTO("2A", "Lớp 2A", "Grade 2", "2024-2025", "Lê Thị Hương"));
        classes.add(new ClassDTO("2B", "Lớp 2B", "Grade 2", "2024-2025", "Phạm Văn Minh"));
        classes.add(new ClassDTO("3A", "Lớp 3A", "Grade 3", "2024-2025", "Đỗ Thị Lan"));
        classes.add(new ClassDTO("3B", "Lớp 3B", "Grade 3", "2024-2025", "Vũ Văn Thành"));
        classes.add(new ClassDTO("4A", "Lớp 4A", "Grade 4", "2024-2025", "Hoàng Thị Hà"));
        classes.add(new ClassDTO("4B", "Lớp 4B", "Grade 4", "2024-2025", "Bùi Văn Nam"));
        classes.add(new ClassDTO("5A", "Lớp 5A", "Grade 5", "2024-2025", "Ngô Thị Linh"));
        classes.add(new ClassDTO("5B", "Lớp 5B", "Grade 5", "2024-2025", "Đặng Văn Hùng"));
        
        return classes;
    }
}

package com.swp391_8.schoolhealth.controller;

import com.swp391_8.schoolhealth.dto.ClassDTO;
import com.swp391_8.schoolhealth.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    @GetMapping
    @PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN', 'TEACHER') or hasAnyAuthority('ROLE_SCHOOLNURSE', 'ROLE_ADMIN', 'ROLE_TEACHER')")
    public ResponseEntity<List<ClassDTO>> getAllClasses() {
        List<ClassDTO> classes = classService.getAllClasses();
        return ResponseEntity.ok(classes);
    }
}

package com.swp391_8.schoolhealth.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/public")
public class PublicController {

    @GetMapping("/test")
    public Map<String, String> publicTest() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Public API is working!");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return response;
    }
}

package com.swp391_8.schoolhealth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@Tag(name = "Test API", description = "Simple test endpoints to verify Swagger integration")
public class TestController {

    @Operation(
        summary = "Health Check",
        description = "Simple health check endpoint to test if the API is working"
    )
    @ApiResponse(responseCode = "200", description = "API is working correctly")
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "timestamp", LocalDateTime.now(),
            "message", "School Medical Management System API is running",
            "swagger", "http://localhost:8080/swagger-ui/index.html"
        ));
    }

    @Operation(
        summary = "API Info",
        description = "Get basic information about the API"
    )
    @ApiResponse(responseCode = "200", description = "API information retrieved successfully")
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> apiInfo() {
        return ResponseEntity.ok(Map.of(
            "name", "School Medical Management System API",
            "version", "1.0.0",
            "description", "Comprehensive health management system for schools",
            "documentation", "http://localhost:8080/swagger-ui/index.html",
            "openapi_json", "http://localhost:8080/v3/api-docs"
        ));
    }
}

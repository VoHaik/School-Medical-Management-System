package com.swp391_8.schoolhealth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "Standard error response format")
public class ErrorResponseSchema {
    
    @Schema(description = "Error code", example = "VALIDATION_ERROR")
    private String code;
    
    @Schema(description = "Human readable error message", example = "Invalid username or password")
    private String message;
    
    @Schema(description = "Timestamp when error occurred", example = "2024-01-15T10:30:00Z")
    private LocalDateTime timestamp;
    
    @Schema(description = "HTTP status code", example = "400")
    private int status;
    
    @Schema(description = "Request path that caused the error", example = "/api/auth/signin")
    private String path;
    
    // Constructors
    public ErrorResponseSchema() {
        this.timestamp = LocalDateTime.now();
    }
    
    public ErrorResponseSchema(String code, String message, int status, String path) {
        this.code = code;
        this.message = message;
        this.status = status;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters and setters
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public int getStatus() {
        return status;
    }
    
    public void setStatus(int status) {
        this.status = status;
    }
    
    public String getPath() {
        return path;
    }
    
    public void setPath(String path) {
        this.path = path;
    }
}

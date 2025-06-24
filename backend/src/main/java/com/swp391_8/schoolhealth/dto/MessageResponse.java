package com.swp391_8.schoolhealth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MessageResponse {
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("success")
    private boolean success;

    // Manual constructor for compatibility
    public MessageResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }
}
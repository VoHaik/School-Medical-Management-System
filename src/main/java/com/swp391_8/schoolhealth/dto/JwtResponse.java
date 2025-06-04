package com.swp391_8.schoolhealth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    @JsonProperty("token")
    private String token;
    
    @JsonProperty("type")
    private String type = "Bearer";
    
    @JsonProperty("id")
    private Long id;
    
    @JsonProperty("username")
    private String username;
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("fullName")
    private String fullName;
    
    @JsonProperty("roles")
    private List<String> roles;

    public JwtResponse(String token, Long id, String username, String email, String fullName, List<String> roles) {
        this.token = token;
        this.type = "Bearer";
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.roles = roles;
    }
}
package com.swp391_8.schoolhealth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Integer eventId;
    private String title;
    private String description;
    private Date startDate;
    private Date endDate;
    private String location;
    private String type;
    private String targetAudience;
    // private Integer studentId; // If events can be student-specific in the DTO context
    private String createdBy;
    private Date createdAt;
}

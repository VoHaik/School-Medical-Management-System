package com.swp391_8.schoolhealth.repository;

import com.swp391_8.schoolhealth.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // Custom query to find events relevant to a parent.
    // This might involve checking student enrollments, school-wide events, etc.
    // For simplicity, let's assume events are not directly tied to a single parent but are more general
    // or filtered by other criteria in the service layer.
    // Example: Find events occurring on or after a certain date.
    List<Event> findByStartDateGreaterThanEqualOrderByStartDateAsc(Date date); // MODIFIED HERE

    // If events are targeted (e.g., by grade or school section), you'd add parameters here.
    // List<Event> findByTargetAudienceAndEventDateGreaterThanEqualOrderByEventDateAsc(String targetAudience, Date date);
}

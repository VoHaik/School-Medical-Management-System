package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.dto.EventDTO;
import java.util.List;

public interface EventService {
    List<EventDTO> getUpcomingEvents(); // Or more specific like getEventsForParent(Long parentId)
    // Potentially add methods for creating/managing events if admins use the system for that
}

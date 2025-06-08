package com.swp391_8.schoolhealth.service.impl;

import com.swp391_8.schoolhealth.dto.EventDTO;
import com.swp391_8.schoolhealth.model.Event;
import com.swp391_8.schoolhealth.repository.EventRepository;
import com.swp391_8.schoolhealth.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Override
    public List<EventDTO> getUpcomingEvents() {
        // Fetch events from today onwards
        return eventRepository.findByEventDateGreaterThanEqualOrderByEventDateAsc(new Date()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // In a more complex scenario, this method might take a parentId or studentId
    // to filter events relevant to that parent's children (e.g., by grade, class, or school section)
    // public List<EventDTO> getEventsForParent(Long parentId) { ... }

    private EventDTO convertToDTO(Event event) {
        EventDTO dto = new EventDTO();
        dto.setEventId(event.getEventId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setEventDate(event.getEventDate());
        dto.setLocation(event.getLocation());
        dto.setCategory(event.getCategory());
        return dto;
    }

    // private Event convertToEntity(EventDTO dto) { // If needed for create/update
    //     Event event = new Event();
    //     // ... map fields from DTO to entity
    //     return event;
    // }
}

package com.swp391_8.schoolhealth.service.impl;

import com.swp391_8.schoolhealth.dto.EventDTO;
import com.swp391_8.schoolhealth.model.Event;
import com.swp391_8.schoolhealth.model.Student;
import com.swp391_8.schoolhealth.repository.EventRepository;
import com.swp391_8.schoolhealth.repository.ParentStudentRelationshipRepository;
import com.swp391_8.schoolhealth.repository.StudentRepository;
import com.swp391_8.schoolhealth.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ParentStudentRelationshipRepository parentStudentRelationshipRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public List<EventDTO> getUpcomingEvents() {
        // Fetch events from today onwards
        return eventRepository.findByStartDateGreaterThanEqualOrderByStartDateAsc(new Date()).stream() // MODIFIED HERE
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventDTO> getUpcomingEventsForParent(String parentCode, String studentCode) {
        List<String> targetAudiences = new ArrayList<>();
        targetAudiences.add("ALL"); // All users get these events
        targetAudiences.add("PARENTS"); // All parents get these events

        // If a specific studentCode is provided, try to find events targeted to their class/grade
        // This requires Student entity to have a field like 'grade' or 'className' that can be used as a targetAudience string
        if (studentCode != null && !studentCode.isEmpty()) {
            Optional<Student> studentOpt = studentRepository.findByStudentCode(studentCode);
            if (studentOpt.isPresent()) {
                Student student = studentOpt.get();
                // Assuming Student model has a getClassName() or similar that matches target_audience values
                if (student.getClassName() != null && !student.getClassName().isEmpty()) {
                    targetAudiences.add(student.getClassName()); // e.g., "GRADE_5A", "CLASS_10B"
                }
                // You could add more specific targeting based on student attributes if needed
            }
        }

        // Fetch events that are for ALL, for PARENTS, or for the specific student's class/grade
        return eventRepository.findByTargetAudienceInAndStartDateGreaterThanEqualOrderByStartDateAsc(targetAudiences, new Date())
                .stream()
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
        dto.setEventDate(event.getStartDate()); // Also ensure DTO mapping uses the correct getter if it was relying on getEventDate() which returned startDate
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

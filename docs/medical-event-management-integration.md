# Medical Event Management Integration

## Overview
This document explains the integration of Medical Event Management into the School Health Management System, specifically within the Medication Management module. This feature allows school nurses to track, manage, and report medical incidents and events that occur at the school.

## Features
The Medical Events management tab includes the following features:

1. **Event Recording**: Record medical incidents such as injuries, illnesses, accidents, and emergencies
2. **Student Association**: Link events to specific students
3. **Severity Classification**: Categorize events by severity (LOW, MEDIUM, HIGH, CRITICAL)
4. **Symptom Tracking**: Record symptoms associated with each event
5. **Action Tracking**: Document actions taken to address the medical event
6. **Parent Notification**: Track whether parents were notified
7. **Follow-up Management**: Schedule and manage follow-up actions if required
8. **Referral Documentation**: Record details if a student was referred to external healthcare

## Technical Implementation

### Frontend Components
- **MedicalEventTab.js**: Main component for managing medical events
- **Integration in MedicationManagement.js**: Added as a new tab in the existing medication management interface
- **NurseDashboard.js**: Added navigation link for direct access to the Medical Events tab

### Backend Components
- **MedicalEvent.java**: Entity representing medical events
- **MedicalEventDTO.java**: Data Transfer Object for medical events
- **MedicalEventRepository.java**: Repository for database operations
- **MedicalEventService.java**: Service layer with business logic
- **MedicalEventController.java**: REST API endpoints for medical events

## User Flow
1. Nurse navigates to the Medical Events tab via:
   - Medication Management tab navigation
   - Direct link from Nurse Dashboard
2. The nurse can view a list of all recorded medical events
3. To add a new event, the nurse clicks "Add Medical Event" and fills in:
   - Student information
   - Event type and severity
   - Description of the incident
   - Symptoms observed
   - Actions taken
   - Whether parents were notified
   - Referral information if applicable
   - Follow-up requirements
4. Events can be filtered, edited, or deleted as needed

## Event Types
- INJURY
- ILLNESS
- ACCIDENT
- EMERGENCY
- MEDICATION (Medication-related issues)
- OUTBREAK (Disease outbreaks)
- FALL
- FEVER
- ALLERGIC_REACTION
- OTHER

## Severity Levels
- LOW - Minor issues requiring minimal intervention
- MEDIUM - Moderate issues requiring attention but not urgent
- HIGH - Serious issues requiring immediate attention
- CRITICAL - Life-threatening situations requiring emergency response

## Status Types
- ACTIVE - Currently being managed
- RESOLVED - Issue has been addressed
- FOLLOW_UP - Requires additional follow-up
- REFERRED - Student has been referred to external healthcare

## Access Control
Access to the Medical Events feature is restricted to users with the following roles:
- SchoolNurse
- Admin

## Future Enhancements
1. **Reporting**: Generate statistical reports on medical events
2. **Notifications**: Automated notifications for critical events
3. **Integration with Health Declarations**: Link events to student health declarations
4. **Mobile Support**: Optimize for use on mobile devices for quick recording during emergencies

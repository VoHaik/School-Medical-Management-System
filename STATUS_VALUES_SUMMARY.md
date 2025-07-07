# Status Values Summary - School Medical Management System

This document lists all status values used across the project for consistency and reference.

## Health Event Status (Backend Enum: HealthEvent.Status)
**Location**: `backend/src/main/java/com/swp391_8/schoolhealth/model/HealthEvent.java`
- `SCHEDULED` - Event is scheduled for the future
- `IN_PROGRESS` - Event is currently ongoing
- `COMPLETED` - Event has been completed
- `CANCELLED` - Event has been cancelled
- `POSTPONED` - Event has been postponed to a later date

## Vaccination Status
**Used in**: Student vaccination records, vaccination management
- `SCHEDULED` - Vaccination is scheduled
- `COMPLETED` - Vaccination has been administered
- `MISSED` - Student missed the vaccination appointment
- `CONTRAINDICATED` - Vaccination is contraindicated for the student
- `POSTPONED` - Vaccination has been postponed

## Vaccination Consent Status
**Used in**: Vaccination consent forms, parent approvals
- `PENDING` - Consent form sent to parent, waiting for response
- `APPROVED` - Parent has approved vaccination
- `REJECTED` - Parent has rejected/declined vaccination

## Health Checkup Status (for records)
**Used in**: Health checkup records, student health status
- `Completed` - Health checkup has been completed
- `Pending` - Health checkup is pending
- `Cancelled` - Health checkup has been cancelled
- `Normal` - Health status is normal (for generalHealthStatus)
- `Attention Required` - Health status requires attention
- `Medical Follow-up` - Health status requires medical follow-up

## User/Student Status
**Used in**: User management, student management
- `active` - User/student is active in the system
- `inactive` - User/student is inactive/deactivated

## Medication Request Status
**Used in**: Medication management system
- `PENDING` - Request is pending approval
- `PENDING_APPROVAL` - Request is pending approval (alternative)
- `APPROVED` - Request has been approved
- `REJECTED` - Request has been rejected

## Medical Event Status
**Used in**: Medical events tracking
- `ACTIVE` - Medical event is active
- `RESOLVED` - Medical event has been resolved
- `FOLLOW_UP` - Medical event requires follow-up
- `REFERRED` - Medical event has been referred

## Health Declaration Status
**Used in**: Health declarations, health status tracking
- `APPROVED` - Health declaration approved
- `PENDING` - Health declaration pending review
- `REJECTED` - Health declaration rejected

## Frontend Status Display Colors
The frontend uses consistent color mapping for status display:

### Event Status Colors
- `SCHEDULED` → `info` (blue)
- `IN_PROGRESS` → `warning` (orange)
- `COMPLETED` → `success` (green)
- `CANCELLED` → `error` (red)
- `POSTPONED` → `warning` (orange)

### Vaccination Status Colors
- `completed` → `success` (green)
- `scheduled` → `info` (blue)
- `missed` → `error` (red)
- `postponed` → `warning` (orange)

### Consent Status Colors
- `APPROVED` → `success` (green)
- `PENDING` → `warning` (orange)
- `REJECTED`/`DECLINED` → `error` (red)

## Implementation Notes

1. **Backend Enums**: The HealthEvent.Status enum is properly defined in the backend and should be used consistently.

2. **Frontend Dropdowns**: All status dropdowns in the frontend (EventManagement, filters, etc.) use the correct status values.

3. **Database Constraints**: SQL constraints exist to enforce valid status values:
   ```sql
   CHECK (consent_status IN ('PENDING', 'APPROVED', 'REJECTED'))
   CHECK (vaccination_status IN ('SCHEDULED', 'COMPLETED', 'MISSED', 'CONTRAINDICATED', 'POSTPONED'))
   ```

4. **Consistency**: All status values are standardized across the application for consistent user experience.

## Recent Improvements

- ✅ Event "view" dialog now clearly displays event description with improved styling
- ✅ Status filter dropdowns include all valid status values
- ✅ Color-coded status chips for better visual identification
- ✅ Proper enum usage in backend for type safety
- ✅ Consistent status value handling across frontend components

## Usage Guidelines

1. **New Status Values**: Always add new status values to the backend enum first, then update frontend components.
2. **Color Mapping**: Use the established color scheme for consistent UI.
3. **Database Updates**: Update SQL constraints when adding new status values.
4. **Frontend Updates**: Update all relevant dropdowns and filters when status values change.

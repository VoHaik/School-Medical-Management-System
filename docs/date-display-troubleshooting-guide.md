# Date Display Troubleshooting Guide

## Issue Description
Date fields not displaying correctly in the frontend, particularly in the HealthCheckupEventListItem component.

## Backend Field Names
In the HealthCheckupEvent entity:
- Field name: `scheduledDate` (LocalDate)
- Database column: `scheduled_date`

In the HealthCheckupEventDTO:
- Field name: `scheduledDate` (LocalDate)

## Frontend Implementation

### Correct Usage in HealthCheckupEventListItem.js
```javascript
// Correct way to display scheduled date
<Typography variant="caption" display="block" gutterBottom>
  {t.scheduledDate}: {event.scheduledDate ? formatDate(event.scheduledDate) : t.notSpecified}
</Typography>
```

### Date Formatting Function
Located in `frontend/src/hooks/useUIText.js`:
```javascript
const formatDate = (dateString) => {
  if (!dateString) return UI_TEXT.notAvailable;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return UI_TEXT.notAvailable;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  } catch (error) {
    console.warn('Date formatting error:', error);
    return UI_TEXT.notAvailable;
  }
};
```

## Common Issues and Solutions

### 1. Field Name Mismatch
**Problem**: Using old field names like `startDate` or `endDate`
**Solution**: Use `scheduledDate` as per the entity definition

### 2. Null/Undefined Date Values
**Problem**: Date shows as "N/A" or empty
**Solution**: Check if the backend is returning the date properly and add null checks

### 3. Date Format Issues
**Problem**: Date displays as invalid or wrong format
**Solution**: Use the improved formatDate function with better error handling

### 4. Backend Data Issues
**Problem**: Dates not being serialized properly from Java LocalDate
**Solution**: Ensure Spring Boot is configured for proper JSON serialization

## Debugging Steps

1. **Check Browser Network Tab**
   - Open developer tools → Network tab
   - Look for the API call returning health checkup events
   - Verify the response contains `scheduledDate` field
   - Check if the date format is correct (YYYY-MM-DD for LocalDate)

2. **Check Console for Errors**
   - Look for date formatting errors in console
   - Check for JavaScript errors in date parsing

3. **Verify Component Props**
   ```javascript
   console.log('Event data:', event);
   console.log('Scheduled date:', event.scheduledDate);
   ```

4. **Test Date Formatting**
   ```javascript
   console.log('Formatted date:', formatDate(event.scheduledDate));
   ```

## Expected API Response Format
```json
{
  "eventId": 1,
  "eventName": "Khám sức khỏe định kỳ lớp 5",
  "eventType": "HEALTH_CHECKUP",
  "description": "Khám sức khỏe tổng quát cho học sinh lớp 5",
  "scheduledDate": "2024-12-30",
  "location": "Phòng y tế trường",
  "status": "PLANNED",
  "typesOfCheckups": ["VISION", "HEARING", "DENTAL"],
  "targetGradeLevels": "Grade 5",
  "createdAt": "2024-12-25T10:00:00",
  "updatedAt": "2024-12-25T10:00:00"
}
```

## Fixed Files
- `frontend/src/components/healthcheckup/HealthCheckupEventListItem.js` - Updated to use scheduledDate
- `frontend/src/hooks/useUIText.js` - Improved date formatting function
- `frontend/src/pages/nurse/HealthCheckupEventManagement.js` - Updated to use English UI text

## Testing
1. Navigate to the Health Checkup Event Management page
2. Create a test event with a specific scheduled date
3. Verify the date displays correctly in the format "Dec 30, 2024"
4. Check that Vietnamese content (event name, description) displays properly
5. Verify all UI labels are in English

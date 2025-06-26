# API Error Troubleshooting Guide

This document provides guidance for resolving common API errors encountered in the School Medical Management System.

## Common Error Codes

### 400 Bad Request
- **Possible Causes**:
  - Missing required fields in request
  - Invalid data formats (e.g., incorrect date format)
  - Validation failures on the server
- **Solutions**:
  - Check console logs for detailed error messages
  - Ensure all required fields are populated
  - Format dates correctly (YYYY-MM-DD)
  - Verify that class IDs exist in the system

### 401 Unauthorized
- **Possible Causes**:
  - Token expired or invalid
  - User not logged in
- **Solutions**:
  - Refresh the page or log out and log in again
  - Check if the session has expired

### 403 Forbidden
- **Possible Causes**:
  - User lacks permission for the requested action
- **Solutions**:
  - Verify user roles and permissions
  - Contact system administrator if you need access

### 500 Server Error
- **Possible Causes**:
  - Backend server issue
  - Database error
  - Exception in server code
- **Solutions**:
  - Check server logs for details
  - Verify database connectivity
  - Contact development team with error details

## Health Checkup Event API Troubleshooting

### Creating Events
- Ensure `eventName`, `eventType`, and `scheduledDate` (or `startDate`) are provided
- For vaccination events, ensure `classesToNotify` contains at least one class ID
- Verify `typesOfCheckups` contains at least one valid entry

### Fetching Classes
If the classes API returns an error:
1. Check if the backend ClassController is deployed
2. Verify permissions for the API endpoint
3. Check network connectivity
4. The form will use sample data as a fallback

## Debug Steps for API Issues

1. Open browser developer console (F12)
2. Go to Network tab and filter for XHR/Fetch requests
3. Check the request payload and response data
4. Look for specific error messages in the response
5. Verify request headers include Authorization token
6. Check for CORS-related errors

## Getting Help

If you cannot resolve an API error:
1. Take a screenshot of the error in the developer console
2. Note the steps that led to the error
3. Contact the system administrator with these details

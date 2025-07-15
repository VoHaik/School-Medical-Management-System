# JWT Authentication Fix Guide

## Issue Description

The application was experiencing 401 Unauthorized errors when making API requests to protected endpoints despite users appearing to have the correct roles in the frontend. This was primarily affecting nurse functionality when trying to access medication requests and health declarations.

## Root Causes Identified

1. **Inconsistent Token Management**: Multiple methods were used to store and retrieve the JWT token (in `localStorage` directly and within the user object), which could lead to stale or inconsistent tokens.

2. **Role/Authority Mismatch**: The backend was checking for authorities in one format (`hasAuthority('SchoolNurse')`) while the frontend was potentially sending tokens with roles in a different format (`ROLE_SCHOOLNURSE`).

3. **Insufficient JWT Payload**: The JWT token didn't include role information in the payload, making it difficult for the backend to verify permissions properly.

4. **Inconsistent API Call Authorization**: Different parts of the application used different methods to attach authorization headers to API calls.

## Implemented Solutions

### 1. Centralized Authentication Logic

Created a unified API request utility (`axiosWithAuth.js`) that:
- Consistently retrieves the most up-to-date token from all possible storage locations
- Applies the token to all API requests automatically
- Handles 401 errors uniformly
- Provides detailed logging for debugging authentication issues

### 2. Enhanced JWT Token Generation

Updated the JWT token generation in `JwtUtils.java` to:
- Include roles directly in the token payload
- Add the user ID for additional verification
- Provide more detailed logging around token generation

### 3. Improved Role/Authority Handling

Modified the backend authorization checks to:
- Accept multiple formats of role/authority names (both with and without the `ROLE_` prefix)
- Log current authentication details for easier debugging

### 4. Enhanced Error Logging

Added comprehensive logging throughout the authentication flow to:
- Log token details (expiration, roles, etc.)
- Track authentication success/failure reasons
- Monitor authorization decisions

## Files Modified

1. **Frontend**:
   - Created `frontend/src/utils/axiosWithAuth.js` (new centralized authentication utility)
   - Updated `frontend/src/pages/nurse/NurseDashboard.js` (using the new utility)
   - Updated `frontend/src/pages/medical/MedicationManagement.js` (using the new utility)

2. **Backend**:
   - Updated `backend/src/main/java/com/swp391_8/schoolhealth/security/jwt/JwtUtils.java` (enhanced token generation)
   - Updated `backend/src/main/java/com/swp391_8/schoolhealth/security/jwt/AuthTokenFilter.java` (improved token validation)
   - Updated `backend/src/main/java/com/swp391_8/schoolhealth/controller/MedicationRequestController.java` (fixed authorization checks)

## How to Test the Fix

1. Login with a nurse account
2. Navigate to the Nurse Dashboard
3. The dashboard should now display the correct counts from the backend API
4. Navigate to Medication Management - pending requests should now load correctly
5. Test the approve/reject functionality for medication requests
6. Verify that health declarations can also be accessed and managed

## Possible Future Improvements

1. Implement token refresh mechanism to extend sessions without requiring re-login
2. Add more comprehensive role-based access control with fine-grained permissions
3. Consider moving from localStorage to httpOnly cookies for enhanced security
4. Add request/response interceptors to automatically handle expired tokens

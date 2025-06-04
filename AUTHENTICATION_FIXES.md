# Authentication Flow Analysis & Fixes

## Issues Identified & Solutions

### 1. Role Mapping Conflict (CRITICAL)
**Problem:** Frontend registers users with `User.UserRole` enum (Student, Parent, etc.) but backend security uses `Role.ERole` enum (ROLE_STUDENT, ROLE_PARENT, etc.). Students were being mapped to ROLE_PARENT due to database constraints.

**Solution Implemented:**
- Fixed `UserService.registerUser()` to properly map Student → ROLE_STUDENT
- Removed fallback to ROLE_PARENT when ROLE_STUDENT is not found
- Added proper error handling with detailed logging
- Created SQL scripts to ensure all roles exist in database

### 2. Database Role Initialization
**Problem:** `ROLE_STUDENT` might not exist in the database.

**Solution Implemented:**
- Updated `DatabaseInitializer.java` to create all required roles
- Created `ensure_all_roles.sql` script for manual database setup
- Added `TestController` to verify database roles

### 3. JWT Configuration Issues
**Problem:** JWT secret and token validation could have mismatches.

**Solution Implemented:**
- Verified JWT secret configuration in `application.properties`
- Ensured proper Base64 encoding handling in `JwtUtils`
- Added comprehensive JWT token validation logging

### 4. Authentication Flow Testing
**Problem:** No easy way to test the complete authentication flow.

**Solution Implemented:**
- Created `auth-test.html` comprehensive test page
- Added `TestController` with endpoints to verify system status
- Enhanced error handling in `AuthController` for better debugging

### 5. Frontend-Backend Integration
**Problem:** Multiple authentication systems (React + Static HTML) could conflict.

**Solution:** 
- Both systems use the same backend API endpoints
- Token storage mechanism is consistent (localStorage)
- Role checking is aligned between systems

## How to Test the Authentication Flow

1. **Start the Application:**
   ```cmd
   cd "c:\Users\trand\OneDrive\Documents\GitHub\SWP391-Project"
   mvn spring-boot:run
   ```

2. **Run SQL Setup (if needed):**
   ```sql
   -- Execute ensure_all_roles.sql in SQL Server
   ```

3. **Test Authentication:**
   - Open http://localhost:8080/auth-test.html
   - Check system status and database roles
   - Test registration with different roles
   - Test login with created users
   - Verify JWT token handling

## Expected Behavior After Fixes

### Registration Flow:
1. User submits registration form with role "Student"
2. Backend maps Student → ROLE_STUDENT
3. Database stores user with both `role='Student'` and `roles` collection containing ROLE_STUDENT
4. Registration succeeds with proper role assignment

### Login Flow:
1. User submits username/password
2. Backend authenticates user
3. JWT token generated with proper authorities
4. Token includes ROLE_STUDENT authority
5. Frontend receives token with correct roles

### Authorization:
1. `@PreAuthorize("hasRole('STUDENT')")` works correctly
2. Student can access student-specific endpoints
3. Role-based access control functions properly

## Key Files Modified:

1. **UserService.java** - Fixed role mapping logic
2. **AuthController.java** - Enhanced error handling
3. **TestController.java** - Added test endpoints
4. **WebSecurityConfig.java** - Added test endpoint access
5. **auth-test.html** - Comprehensive test interface
6. **ensure_all_roles.sql** - Database role setup script

## Testing Checklist:

- [ ] All roles exist in database (check via /api/test/roles)
- [ ] Student registration maps to ROLE_STUDENT
- [ ] JWT tokens contain correct authorities
- [ ] Login returns proper role information
- [ ] Student can access student-specific endpoints
- [ ] Parent can access parent-specific endpoints
- [ ] Authorization annotations work correctly

## Next Steps:

1. Start the application using `start-spring-app.bat`
2. Navigate to http://localhost:8080/auth-test.html
3. Run through the test scenarios
4. Check application logs for any remaining issues
5. Test the React frontend authentication
6. Verify end-to-end authentication flow

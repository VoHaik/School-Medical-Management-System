# 🏥 School Medical Management System - Swagger API Documentation

## 📋 Overview

This document provides comprehensive instructions for using Swagger with the School Medical Management System. Swagger provides interactive API documentation that allows you to explore, test, and understand all available endpoints.

## 🚀 Quick Start

### Option 1: Automated Script (Recommended)
```powershell
# Run the automated PowerShell script
./scripts/start-with-swagger.ps1
```

### Option 2: Manual Startup
1. **Start Backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Access Swagger UI:**
   - Open: http://localhost:8080/swagger-ui.html

## 🌐 API Documentation URLs

| Resource | URL | Description |
|----------|-----|-------------|
| **Swagger UI** | http://localhost:8080/swagger-ui.html | Interactive API documentation |
| **OpenAPI JSON** | http://localhost:8080/api-docs | OpenAPI specification in JSON format |
| **OpenAPI YAML** | http://localhost:8080/api-docs.yaml | OpenAPI specification in YAML format |
| **Frontend App** | http://localhost:3000 | React frontend application |

## 🔐 Authentication Guide

### Step 1: Get JWT Token
1. Go to frontend: http://localhost:3000/login
2. Login with valid credentials:
   - **Parent Account:** parent@test.com / password123
   - **Nurse Account:** nurse@test.com / password123
   - **Admin Account:** admin@test.com / password123

3. Open browser DevTools (F12)
4. Go to Network tab
5. Look for the login request response
6. Copy the JWT token from the response

### Step 2: Authorize in Swagger
1. Open Swagger UI: http://localhost:8080/swagger-ui/index.html
2. Click the **"Authorize"** button (🔒 icon)
3. Enter: `Bearer <your-jwt-token>`
4. Click **"Authorize"**
5. Now you can test protected endpoints

### Step 3: Test Endpoints
- All endpoints now include your authentication
- Green checkmarks ✅ indicate successful authorization
- Red X marks ❌ indicate authentication issues

## 📚 API Categories

### 🔐 Authentication (`/api/auth`)
- **POST** `/api/auth/signin` - User login
- **POST** `/api/auth/signup` - User registration
- **GET** `/api/auth/profile` - Get user profile

**Example Login Request:**
```json
{
  "username": "parent@test.com",
  "password": "password123"
}
```

### 🏥 Medical Events (`/api/medical-events`)
- **GET** `/api/medical-events` - Get all medical events (Nurse/Admin)
- **POST** `/api/medical-events` - Create new medical event
- **PUT** `/api/medical-events/{id}` - Update medical event
- **DELETE** `/api/medical-events/{id}` - Delete medical event
- **GET** `/api/medical-events/student/{studentCode}` - Get events for specific student

**Example Medical Event Creation:**
```json
{
  "studentCode": "ST001",
  "eventType": "INJURY",
  "severity": "Medium",
  "symptoms": ["Pain", "Swelling"],
  "description": "Student fell during PE class",
  "actionTaken": "Applied ice pack and monitored",
  "parentNotified": true,
  "status": "Resolved"
}
```

### 💊 Medication Requests (`/api/medication-requests`)
- **GET** `/api/medication-requests` - Get all requests (Parent view)
- **POST** `/api/medication-requests` - Submit new medication request
- **PUT** `/api/medication-requests/{id}` - Update request
- **DELETE** `/api/medication-requests/{id}` - Cancel request
- **POST** `/api/medication-requests/{id}/approve` - Approve request (Nurse)
- **POST** `/api/medication-requests/{id}/reject` - Reject request (Nurse)

**Example Medication Request:**
```json
{
  "studentCode": "ST001",
  "medicationName": "Paracetamol",
  "dosage": "500mg",
  "frequency": "Every 6 hours",
  "duration": "3 days",
  "reason": "Fever and headache",
  "prescribedBy": "Dr. Smith"
}
```

### 👨‍🎓 Student Management (`/api/students`)
- **GET** `/api/students` - Get all students (Admin/Nurse)
- **GET** `/api/students/{id}` - Get student by ID
- **POST** `/api/students` - Add new student
- **PUT** `/api/students/{id}` - Update student information
- **GET** `/api/students/my-children` - Get children (Parent view)

### 👩‍⚕️ Nurse Dashboard (`/api/nurse`)
- **GET** `/api/nurse/dashboard` - Nurse dashboard data
- **GET** `/api/nurse/pending-requests` - Pending medication requests
- **GET** `/api/nurse/today-events` - Today's medical events

### 👨‍👩‍👧‍👦 Parent Portal (`/api/parent`)
- **GET** `/api/parent/children` - Get parent's children
- **GET** `/api/parent/requests` - Get medication requests
- **POST** `/api/parent/health-declaration` - Submit health declaration

### 🏛️ Admin Functions (`/api/admin`)
- **GET** `/api/admin/users` - Manage users
- **POST** `/api/admin/reports` - Generate reports
- **GET** `/api/admin/analytics` - System analytics

## 🛠️ Testing Scenarios

### Scenario 1: Parent Submits Medication Request
1. **Login as Parent** via `/api/auth/signin`
2. **Get Student List** via `/api/parent/children`
3. **Submit Request** via `POST /api/medication-requests`
4. **Track Status** via `GET /api/medication-requests`

### Scenario 2: Nurse Handles Medical Event
1. **Login as Nurse** via `/api/auth/signin`
2. **Create Event** via `POST /api/medical-events`
3. **View Dashboard** via `/api/nurse/dashboard`
4. **Process Requests** via `/api/nurse/pending-requests`

### Scenario 3: Admin User Management
1. **Login as Admin** via `/api/auth/signin`
2. **View Users** via `/api/admin/users`
3. **Generate Reports** via `/api/admin/reports`

## 🔍 Advanced Testing

### Query Parameters
Many endpoints support filtering:
```
GET /api/medical-events?studentCode=ST001&severity=High&startDate=2024-01-01
```

### Pagination
Some endpoints support pagination:
```
GET /api/students?page=0&size=10&sort=name,asc
```

### Date Formats
Use ISO 8601 format for dates:
```
2024-01-15T10:30:00Z
```

## 🐛 Troubleshooting

### Common Issues

#### 1. **401 Unauthorized**
- **Cause:** Missing or invalid JWT token
- **Solution:** Re-login and update Authorization header

#### 2. **403 Forbidden**
- **Cause:** Insufficient permissions for the endpoint
- **Solution:** Check user role requirements in API description

#### 3. **404 Not Found**
- **Cause:** Incorrect endpoint URL or missing resource
- **Solution:** Verify endpoint path and resource ID

#### 4. **500 Internal Server Error**
- **Cause:** Server-side error
- **Solution:** Check server logs and validate request data

### Debug Tips
1. **Check Network Tab** in browser DevTools
2. **Verify Request Format** matches API documentation
3. **Validate JWT Token** hasn't expired
4. **Review Server Logs** for detailed error messages

## 📱 Frontend Integration

### Generate TypeScript Client
```bash
# Install OpenAPI Generator
npm install @openapitools/openapi-generator-cli -g

# Generate TypeScript client
openapi-generator-cli generate \
  -i http://localhost:8080/api-docs \
  -g typescript-axios \
  -o ./src/api-client
```

### Usage in React
```typescript
import { AuthControllerApi, Configuration } from './api-client';

const apiConfig = new Configuration({
  basePath: 'http://localhost:8080',
  accessToken: localStorage.getItem('token')
});

const authApi = new AuthControllerApi(apiConfig);

// Login user
const loginUser = async (credentials) => {
  const response = await authApi.authenticateUser(credentials);
  return response.data;
};
```

## 🎯 Best Practices

### API Testing
1. **Start with Authentication** - Always test login first
2. **Use Realistic Data** - Test with valid student codes, dates
3. **Test Error Cases** - Try invalid data to see error responses
4. **Check Permissions** - Test with different user roles

### Development Workflow
1. **API First** - Design endpoints in Swagger before implementation
2. **Mock Data** - Use Swagger to test with mock responses
3. **Validate Schemas** - Ensure request/response match documentation
4. **Integration Testing** - Test end-to-end workflows

## 📞 Support

### Development Team Contacts
- **Backend Issues:** backend@schoolhealth.com
- **Frontend Issues:** frontend@schoolhealth.com
- **API Documentation:** api@schoolhealth.com

### Useful Links
- **GitHub Repository:** https://github.com/VoHaik/School-Medical-Management-System
- **Bug Reports:** GitHub Issues
- **Feature Requests:** GitHub Discussions

## 📄 API Reference Summary

| Category | Endpoints | Authentication | Description |
|----------|-----------|----------------|-------------|
| **Auth** | 3 | Public/Protected | Login, Registration, Profile |
| **Medical Events** | 5 | Nurse/Admin | Medical incident management |
| **Medication** | 8 | Parent/Nurse | Medication request workflow |
| **Students** | 6 | Role-based | Student profile management |
| **Nurse** | 4 | Nurse only | Nurse dashboard functions |
| **Parent** | 4 | Parent only | Parent portal features |
| **Admin** | 6 | Admin only | System administration |

---

## 🎉 Happy API Testing!

This Swagger integration provides a comprehensive way to explore, understand, and test the School Medical Management System API. Use it to build better integrations and ensure robust application functionality.

**Remember:** Always test with different user roles to ensure proper access control! 🔐

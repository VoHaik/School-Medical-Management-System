# School Medical Management System - Swagger API Documentation

## 🚀 Swagger Integration Complete

Đã hoàn thành tích hợp Swagger/OpenAPI cho toàn bộ School Medical Management System APIs với authentication JWT và documentation đầy đủ.

## 📋 API Categories Documented

### 1. **Authentication & Authorization** 
- **Controller**: `AuthController`
- **Endpoints**: Login, Register, Password reset, JWT token management
- **Security**: Public endpoints + JWT protected endpoints

### 2. **Student Management**
- **Controller**: `StudentController`
- **Endpoints**: CRUD operations for students, profiles, academic info
- **Security**: Role-based access (Admin, Nurse, Parent, Student)

### 3. **Medical Events & Checkups**
- **Controllers**: 
  - `MedicalEventController` - Health event management
  - `HealthCheckupRecordsController` - Health checkup records
- **Endpoints**: Create events, manage checkups, track medical history
- **Security**: Nurse/Admin access required

### 4. **Medication Management**
- **Controller**: `MedicationRequestController`
- **Endpoints**: Medication requests, approvals, tracking
- **Security**: Nurse/Admin role required

### 5. **Vaccination Management**
- **Controllers**:
  - `VaccinationManagementController` - Event and record management
  - `StudentVaccinationController` - Individual vaccination records
- **Endpoints**: Vaccination events, consent management, record tracking
- **Security**: Role-based access with parent consent features

### 6. **Health Blog & Communication**
- **Controller**: `BlogPostController`
- **Endpoints**: Health articles, nurse blog posts, public health information
- **Security**: Public read access, nurse/admin write access

### 7. **Notifications System**
- **Controller**: `NotificationController`
- **Endpoints**: User notifications, read status, alert management
- **Security**: User-specific notifications with authentication

### 8. **Administrative Functions**
- **Controller**: `AdminController`
- **Endpoints**: System administration, user management, reporting
- **Security**: Admin role required

## 🔧 Technical Implementation

### Dependencies Added
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

### Configuration Files

#### 1. `OpenAPIConfig.java`
- Central OpenAPI configuration
- JWT Bearer authentication scheme
- API information and contact details
- Server definitions for different environments

#### 2. `WebSecurityConfig.java` Updates
- Added Swagger UI endpoints to permit list
- Security exceptions for documentation access
- Maintained API protection with JWT

#### 3. `application.yaml` Enhancement
```yaml
springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    operations-sorter: method
    tags-sorter: alpha
  packages-to-scan: com.swp391_8.schoolhealth.controller
```

#### 4. `SwaggerConfig.java`
- Static resource handling for Swagger UI
- Resource mapping configuration
- View controller setup

## 🔒 Security Integration

### JWT Authentication in Swagger
1. **Bearer Token Scheme**: Configured in OpenAPIConfig
2. **Authorization Header**: `Authorization: Bearer <JWT_TOKEN>`
3. **Swagger UI Integration**: "Authorize" button for token input
4. **Role-based Access**: Different endpoints require different roles

### Security Annotations
- `@SecurityRequirement(name = "bearerAuth")` on all controllers
- `@PreAuthorize` annotations documented in API descriptions
- Role descriptions in endpoint documentation

## 📖 API Documentation Features

### Comprehensive Annotations
- `@Tag`: Controller categorization
- `@Operation`: Endpoint descriptions and summaries
- `@ApiResponses`: HTTP status codes and response descriptions
- `@Parameter`: Request parameter documentation
- `@Schema`: Request/response body schemas

### Response Codes Documented
- **200**: Success responses
- **201**: Created (POST endpoints)
- **400**: Bad request/validation errors
- **401**: Unauthorized/authentication required
- **403**: Forbidden/insufficient privileges
- **404**: Resource not found
- **500**: Internal server error

## 🌐 Access URLs

### Development Environment
- **Swagger UI**: http://localhost:8080/swagger-ui/index.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs
- **OpenAPI YAML**: http://localhost:8080/v3/api-docs.yaml

### Production Considerations
- Update server URLs in OpenAPIConfig.java
- Configure proper CORS settings
- Set up API rate limiting
- Enable HTTPS for production

## 🚀 Usage Instructions

### 1. Starting the Application
```bash
cd backend
mvn spring-boot:run
```

### 2. Accessing Swagger UI
1. Open browser to http://localhost:8080/swagger-ui/index.html
2. Browse API categories and endpoints
3. View request/response schemas

### 3. Authentication Testing
1. Use `/api/auth/signin` endpoint to login
2. Copy JWT token from response
3. Click "Authorize" button in Swagger UI
4. Enter: `Bearer <your-jwt-token>`
5. Test protected endpoints

### 4. Testing Endpoints
- Expand endpoint categories
- Click "Try it out" on specific endpoints
- Fill in required parameters
- Execute requests and view responses

## 📋 Next Steps

### Enhancements for Production
1. **API Versioning**: Add version headers and URL versioning
2. **Rate Limiting**: Implement API rate limiting documentation
3. **Error Handling**: Standardize error response formats
4. **Pagination**: Document pagination parameters for list endpoints
5. **File Upload**: Add documentation for file upload endpoints
6. **Webhooks**: Document any webhook endpoints
7. **Examples**: Add request/response examples for complex endpoints

### Monitoring and Analytics
1. **API Metrics**: Monitor API usage through Swagger
2. **Performance**: Track response times for documented endpoints
3. **Error Tracking**: Monitor error rates by endpoint
4. **User Analytics**: Track which endpoints are most used

## 🔍 Testing Script

Use the provided `test-swagger.bat` script to automatically:
- Start the backend server
- Test Swagger UI accessibility
- Test API documentation endpoints
- Open Swagger UI in browser
- Display access URLs and usage instructions

## 📞 Support

For issues with API documentation:
1. Check that all required dependencies are installed
2. Verify server is running on correct port (8080)
3. Ensure JWT token is properly formatted in Authorization header
4. Review console logs for any configuration errors
5. Validate request payloads match documented schemas

---

**✅ Swagger Integration Status: COMPLETE**
- ✅ All major controllers documented
- ✅ JWT authentication integrated
- ✅ Role-based security documented
- ✅ Comprehensive API responses documented
- ✅ Testing scripts provided
- ✅ Production-ready configuration

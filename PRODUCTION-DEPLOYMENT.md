# School Medical Management System - Production Deployment Guide

## 🚀 Production Deployment Checklist

### Pre-Deployment Requirements

#### ✅ System Requirements
- **Java**: OpenJDK 21 or higher
- **Database**: Microsoft SQL Server 2019 or higher
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: 10GB free space minimum
- **Network**: Ports 8080 (application), 1433 (database)

#### ✅ Security Requirements
- [ ] Generate strong JWT secret key (512-bit)
- [ ] Create dedicated database user with minimal privileges
- [ ] Configure firewall rules
- [ ] Set up SSL certificates for HTTPS
- [ ] Review CORS configuration for frontend domains

### 🛠️ Build and Package

```bash
# Navigate to backend directory
cd backend

# Clean and build the application
mvn clean package -DskipTests

# Verify the JAR file is created
ls -la target/SWP391-Project-1.0-SNAPSHOT.jar
```

### 🗄️ Database Setup

#### 1. Create Production Database
```sql
-- Connect to SQL Server as administrator
CREATE DATABASE HealthSchoolDB_PROD;
GO

-- Create dedicated user for the application
CREATE LOGIN school_health_app WITH PASSWORD = 'YourStrongPassword123!';
GO

USE HealthSchoolDB_PROD;
GO

CREATE USER school_health_app FOR LOGIN school_health_app;
GO

-- Grant necessary permissions
ALTER ROLE db_datareader ADD MEMBER school_health_app;
ALTER ROLE db_datawriter ADD MEMBER school_health_app;
ALTER ROLE db_ddladmin ADD MEMBER school_health_app;
GO
```

#### 2. Import Data (if migrating)
```bash
# If you have existing data, export from development and import to production
# Use SQL Server Management Studio or sqlcmd for data migration
```

### 🔐 Environment Configuration

#### 1. Set Environment Variables
```bash
# Linux/Mac
export DB_USERNAME="school_health_app"
export DB_PASSWORD="YourStrongPassword123!"
export JWT_SECRET="$(openssl rand -base64 64)"
export ALLOWED_ORIGINS="https://your-frontend-domain.com"

# Windows (PowerShell)
$env:DB_USERNAME="school_health_app"
$env:DB_PASSWORD="YourStrongPassword123!"
$env:JWT_SECRET="YourGeneratedJWTSecret"
$env:ALLOWED_ORIGINS="https://your-frontend-domain.com"
```

#### 2. Generate JWT Secret
```bash
# Generate a secure 512-bit JWT secret
openssl rand -base64 64
```

### 🚀 Deployment Options

#### Option 1: Direct JAR Execution
```bash
# Make the startup script executable
chmod +x scripts/start-production.sh

# Run the application
./scripts/start-production.sh
```

#### Option 2: Systemd Service (Linux)
```bash
# Copy the service file
sudo cp scripts/school-health.service /etc/systemd/system/

# Enable and start the service
sudo systemctl enable school-health
sudo systemctl start school-health

# Check status
sudo systemctl status school-health
```

#### Option 3: Docker Deployment
```bash
# Build Docker image
docker build -t school-health-api .

# Run container
docker run -d \
  -p 8080:8080 \
  -e DB_USERNAME=school_health_app \
  -e DB_PASSWORD=YourPassword \
  -e JWT_SECRET=YourJWTSecret \
  school-health-api
```

### 🔍 Health Checks

#### 1. Application Health
```bash
# Check if application is running
curl -f http://localhost:8080/actuator/health

# Expected response:
# {"status":"UP"}
```

#### 2. Database Connectivity
```bash
# Test database connection through application
curl -f http://localhost:8080/actuator/info
```

#### 3. API Endpoints
```bash
# Test main API endpoint
curl -f http://localhost:8080/api/health-checkup-types
```

### 📊 Monitoring and Logging

#### Application Logs
```bash
# View application logs
tail -f logs/application.log

# View access logs
tail -f logs/access.log
```

#### Performance Monitoring
- Monitor memory usage: `free -h`
- Check CPU usage: `top` or `htop`
- Database connections: Check SQL Server Performance Monitor

### 🔧 Troubleshooting

#### Common Issues

1. **Application won't start**
   - Check environment variables are set
   - Verify database connectivity
   - Check Java version compatibility

2. **Database connection failed**
   - Verify SQL Server is running
   - Check firewall rules
   - Validate credentials

3. **Memory issues**
   - Increase heap size in JAVA_OPTS
   - Monitor for memory leaks

4. **Performance issues**
   - Check database query performance
   - Monitor application metrics
   - Review log files for errors

### 🔄 Updates and Maintenance

#### Application Updates
```bash
# Stop the application
sudo systemctl stop school-health

# Backup current JAR
cp target/SWP391-Project-1.0-SNAPSHOT.jar target/backup/

# Deploy new version
mvn clean package -DskipTests

# Start the application
sudo systemctl start school-health
```

#### Database Maintenance
- Regular backups (daily recommended)
- Index maintenance
- Update statistics
- Monitor disk space

### 📞 Support and Documentation

- **API Documentation**: Available at `/api-docs` when running
- **Health Monitoring**: Available at `/actuator/health`
- **Application Info**: Available at `/actuator/info`

### 🔒 Security Best Practices

1. **Never expose database credentials in logs**
2. **Use HTTPS in production**
3. **Regularly rotate JWT secrets**
4. **Keep dependencies updated**
5. **Monitor security logs**
6. **Implement rate limiting**
7. **Use strong passwords and authentication**

### 📋 Post-Deployment Verification

- [ ] Application starts successfully
- [ ] Database connectivity works
- [ ] All API endpoints respond correctly
- [ ] Frontend can connect to backend
- [ ] User authentication works
- [ ] File uploads work (if applicable)
- [ ] Email notifications work (if configured)
- [ ] Backup procedures are in place
- [ ] Monitoring is configured
- [ ] SSL certificates are valid

---

**For technical support, contact the development team.**

**Last updated**: July 16, 2025
**Version**: 1.0-SNAPSHOT

#!/bin/bash

# Production Startup Script for School Medical Management System
# ==============================================================

echo "Starting School Medical Management System in Production Mode..."

# Set production environment variables
export SPRING_PROFILES_ACTIVE=production

# Java options for production
export JAVA_OPTS="-Xms512m -Xmx2048m -XX:+UseG1GC -XX:+UseStringDeduplication -Djava.security.egd=file:/dev/./urandom"

# Application properties
export SERVER_PORT=8080
export DB_HOST="localhost"
export DB_PORT=1433
export DB_NAME="HealthSchoolDB_PROD"

# CRITICAL: Set these environment variables before running in production!
# export DB_USERNAME="your_db_username"
# export DB_PASSWORD="your_db_password"
# export JWT_SECRET="your_512_bit_jwt_secret"

# Validate required environment variables
if [[ -z "$DB_USERNAME" ]]; then
    echo "ERROR: DB_USERNAME environment variable is not set!"
    exit 1
fi

if [[ -z "$DB_PASSWORD" ]]; then
    echo "ERROR: DB_PASSWORD environment variable is not set!"
    exit 1
fi

if [[ -z "$JWT_SECRET" ]]; then
    echo "ERROR: JWT_SECRET environment variable is not set!"
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs

echo "Environment: Production"
echo "Java Options: $JAVA_OPTS"
echo "Server Port: $SERVER_PORT"
echo "Database Host: $DB_HOST:$DB_PORT"
echo "Database Name: $DB_NAME"

# Start the application
java $JAVA_OPTS -jar target/SWP391-Project-1.0-SNAPSHOT.jar \
    --spring.profiles.active=production \
    --server.port=$SERVER_PORT \
    --spring.datasource.url="jdbc:sqlserver://$DB_HOST:$DB_PORT;databaseName=$DB_NAME;encrypt=true;trustServerCertificate=false;characterEncoding=UTF-8;useUnicode=true" \
    --spring.datasource.username=$DB_USERNAME \
    --spring.datasource.password=$DB_PASSWORD \
    --schoolhealth.app.jwtSecret=$JWT_SECRET

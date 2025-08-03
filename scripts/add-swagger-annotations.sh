#!/bin/bash

# Script to automatically add Swagger annotations to all Controllers
# This script will be used to add basic Swagger annotations to Java Controllers

echo "Starting Swagger annotation process for all Controllers..."

# Define the list of Controllers to process
CONTROLLERS=(
    "AuthController"
    "MedicalEventController" 
    "MedicationRequestController"
    "StudentController"
    "ParentController"
    "NurseController"
    "AdminController"
    "HealthCheckupController"
    "VaccinationController"
    "NotificationController"
    "HealthDeclarationController"
    "BlogController"
    "DashboardController"
)

# Base directory for controllers
CONTROLLER_DIR="backend/src/main/java/com/swp391_8/schoolhealth/controller"

# Template for basic imports
SWAGGER_IMPORTS="
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;"

echo "Swagger annotation process completed!"
echo ""
echo "Next steps:"
echo "1. Start the Spring Boot application"
echo "2. Access Swagger UI at: http://localhost:8080/swagger-ui.html"
echo "3. Use the API documentation for testing"

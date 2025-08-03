package com.swp391_8.schoolhealth.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "Bearer Authentication";
        
        return new OpenAPI()
                .info(new Info()
                        .title("School Medical Management System API")
                        .version("v1.0")
                        .description("Comprehensive API documentation for School Medical Management System. " +
                                "This system manages student health records, medical events, medication requests, " +
                                "vaccination schedules, and health checkups for educational institutions.\n\n" +
                                "## Authentication\n" +
                                "This API uses JWT Bearer token authentication. To authenticate:\n" +
                                "1. Login via `/api/auth/signin` endpoint\n" +
                                "2. Use the returned JWT token in the Authorization header\n" +
                                "3. Format: `Authorization: Bearer <your_jwt_token>`")
                        .contact(new Contact()
                                .name("School Health Development Team")
                                .email("dev@schoolhealth.com")
                                .url("https://github.com/VoHaik/School-Medical-Management-System"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Local Development Server"),
                        new Server()
                                .url("https://api.schoolhealth.production.com")
                                .description("Production Server")
                ))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, 
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT token for API authentication. " +
                                                "Get your token from /api/auth/signin endpoint.\n\n" +
                                                "Example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName));
    }
}

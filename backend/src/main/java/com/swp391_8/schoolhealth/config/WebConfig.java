// Backend API Configuration for English Interface with Vietnamese Content
// File: backend/src/main/java/com/swp391_8/schoolhealth/config/WebConfig.java

package com.swp391_8.schoolhealth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // CORS configuration removed - handled by WebSecurityConfig.java

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        // Ensure UTF-8 encoding for Vietnamese content support
        StringHttpMessageConverter stringConverter = new StringHttpMessageConverter(StandardCharsets.UTF_8);
        converters.add(0, stringConverter);
    }

    @Bean
    public HttpMessageConverter<String> responseBodyConverter() {
        return new StringHttpMessageConverter(StandardCharsets.UTF_8);
    }
}

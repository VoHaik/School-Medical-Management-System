package com.swp391_8.schoolhealth.config;

import com.swp391_8.schoolhealth.security.jwt.AuthEntryPointJwt;
import com.swp391_8.schoolhealth.security.jwt.AuthTokenFilter;
import com.swp391_8.schoolhealth.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {
    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }    @Bean
    public PasswordEncoder passwordEncoder() {
        // For testing: use NoOp password encoder (stores passwords in plain text)
        // WARNING: This is only for development/testing purposes
        return org.springframework.security.crypto.password.NoOpPasswordEncoder.getInstance(); // ENABLED for testing
        
        // For production, use BCrypt:
        // return new BCryptPasswordEncoder(); // COMMENTED OUT for testing
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Set up a more permissive CORS configuration for development
        configuration.setAllowedOriginPatterns(java.util.Arrays.asList("http://localhost:3000")); // MODIFIED: Use specific origin pattern
        configuration.setAllowedHeaders(java.util.Arrays.asList("*"));
        configuration.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        // Specifically expose these headers which are often needed for authentication
        configuration.setExposedHeaders(java.util.Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Methods",
            "Access-Control-Allow-Headers",
            "Access-Control-Allow-Credentials"
        ));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply to all paths
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // For debugging, temporarily allow all requests to test connectivity
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Use the local bean
            .csrf(csrf -> csrf.disable()) // Disable CSRF entirely for simplicity in development
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // Common authentication endpoints
                .requestMatchers("/api/blog").permitAll() // Cho phép GET /api/blog không cần xác thực
                .requestMatchers("/api/blog/**").permitAll() // Cho phép GET /api/blog/{id} không cần xác thực
                .requestMatchers("/").permitAll()
                .requestMatchers("/*.html").permitAll()
                .requestMatchers("/register.html").permitAll()
                .requestMatchers("/auth-test.html").permitAll() // Allow test page
                .requestMatchers("/css/**").permitAll()
                .requestMatchers("/js/**").permitAll()
                .requestMatchers("/images/**").permitAll()
                .requestMatchers("/favicon.ico").permitAll()
                .requestMatchers("/logo192.png").permitAll() // Thêm cho phép truy cập logo192.png
                .anyRequest().authenticated() // All other requests must be authenticated
            );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}

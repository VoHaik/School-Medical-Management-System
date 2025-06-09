package com.swp391_8.schoolhealth.utils;

import com.swp391_8.schoolhealth.model.User;
import com.swp391_8.schoolhealth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.regex.Pattern;

@Component
public class PasswordMigrationRunner implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(PasswordMigrationRunner.class);

    // BCrypt encoded passwords typically start with $2a$, $2b$, or $2y$ followed by a cost factor.
    // Example: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
    // Corrected regex: ^\$2[aby]\$\d{2}\$.{53}
    // Further refined regex to be more specific about the characters in the hash part.
    private static final Pattern BCRYPT_PATTERN = Pattern.compile("^\\$2[aby]\\$\\d{2}\\$[A-Za-z0-9./]{53}$");

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        logger.info("Starting password migration process...");

        List<User> users = userRepository.findAll();
        int updatedCount = 0;

        for (User user : users) {
            String currentPassword = user.getPassword();
            if (currentPassword == null || currentPassword.isEmpty()) {
                logger.warn("User {} has a null or empty password. Skipping.", user.getUsername());
                continue;
            }

            // Check if the password is NOT already BCrypt hashed
            if (!BCRYPT_PATTERN.matcher(currentPassword).matches()) {
                logger.info("User {}'s password is not BCrypt hashed. Re-hashing...", user.getUsername());
                String newHashedPassword = passwordEncoder.encode(currentPassword);
                user.setPassword(newHashedPassword);
                userRepository.save(user);
                updatedCount++;
                logger.info("Successfully re-hashed and updated password for user {}.", user.getUsername());
            } else {
                logger.info("User {}'s password is already BCrypt hashed. Skipping.", user.getUsername());
            }
        }

        if (updatedCount > 0) {
            logger.info("Password migration process completed. {} user(s) updated.", updatedCount);
        } else {
            logger.info("Password migration process completed. No passwords needed re-hashing.");
        }
        
        // To prevent this runner from executing every time, you might want to:
        // 1. Remove or comment out the @Component annotation after the first successful run.
        // 2. Or, implement a more sophisticated check (e.g., a flag in a properties file or database)
        //    to ensure it only runs once.
        // For now, it will run on every application startup.
    }
}

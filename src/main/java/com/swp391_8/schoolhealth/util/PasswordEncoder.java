
package com.swp391_8.schoolhealth.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.LinkedHashMap;
import java.util.Map;

public class PasswordEncoder {

    public static void main(String[] args) {
        // Ensure spring-security-crypto (usually part of spring-boot-starter-security) is on the classpath.
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12); // Cost factor 12

        // IMPORTANT: Review and update the usernames and plain-text passwords below.
        // These are placeholders. You need to provide the actual usernames that exist in your 'Users' table
        // and the new plain-text passwords you want to set for them.
        Map<String, String> usersToUpdate = new LinkedHashMap<>();
        usersToUpdate.put("admin", "your_actual_password_for_admin");
        usersToUpdate.put("nurse_example", "your_actual_password_for_nurse");
        usersToUpdate.put("teacher_example", "your_actual_password_for_teacher");
        usersToUpdate.put("parent_example", "your_actual_password_for_parent");
        // Add more users from your database as needed, e.g., usersToUpdate.put("actual_username", "actual_plain_password");

        System.out.println("-- Generated SQL UPDATE statements for User Passwords --");
        System.out.println("-- Review these statements carefully before execution on your SchoolHealthDB. --");
        System.out.println("-- Target Table: Users, Username Column: username, Password Column: password --");
        System.out.println("-- (Adjust table/column names if different in your schema) --");
        System.out.println();

        for (Map.Entry<String, String> entry : usersToUpdate.entrySet()) {
            String username = entry.getKey();
            String plainPassword = entry.getValue();

            if (plainPassword.startsWith("your_actual_password_for_")) {
                System.out.println(String.format("-- WARNING: Password for user '%s' is a placeholder. SQL generated with placeholder hash.", username));
                // You might want to skip generating SQL for placeholder passwords or handle it differently
            }

            String hashedPassword = encoder.encode(plainPassword);

            // Assumes: Table 'Users', username column 'username', password column 'password'.
            // The summary indicated the User entity's password field was 'password'.
            String sqlUpdateStatement = String.format("UPDATE Users SET password = '%s' WHERE username = '%s';", hashedPassword, username);
            System.out.println(sqlUpdateStatement);
        }

        System.out.println();
        System.out.println("-- End of SQL statements. --");
        System.out.println("-- Remember to replace placeholder passwords in this file and re-run to get final SQL. --");
    }
}

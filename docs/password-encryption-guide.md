# Password Encryption Configuration Guide

## Current Configuration (Testing Mode)

The system is currently configured to store passwords in **plain text** for testing and development purposes.

## Files Modified for Plain Text Passwords

### 1. WebSecurityConfig.java
```java
@Bean
public PasswordEncoder passwordEncoder() {
    // For testing: use NoOp password encoder (stores passwords in plain text)
    // WARNING: This is only for development/testing purposes
    return org.springframework.security.crypto.password.NoOpPasswordEncoder.getInstance();
    
    // For production, use BCrypt:
    // return new BCryptPasswordEncoder();
}
```

### 2. UserAccountInitializer.java
```java
// Create user accounts with the password "Password123" (plain text for testing)
String password = "Password123"; // Plain text password for testing
// Note: In production, use: passwordEncoder.encode("Password123");
```

### 3. UserService.java
```java
// For testing: store password in plain text
user.setPassword(password);
// For production: use encoded password
// user.setPassword(passwordEncoder.encode(password));
```

### 4. create-user-accounts.sql
```sql
-- Using plain text passwords for testing
DECLARE @PlainTextPassword NVARCHAR(255) = 'Password123';
```

## How to Re-enable Password Encryption

When ready for production or to test with encrypted passwords:

### Step 1: Update WebSecurityConfig.java
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

### Step 2: Update UserAccountInitializer.java
```java
// Create user accounts with the password "Password123"
String password = passwordEncoder.encode("Password123");
```

### Step 3: Update UserService.java
```java
user.setPassword(passwordEncoder.encode(password));
```

### Step 4: Update SQL Script
```sql
-- The password shown here represents a hashed version of 'Password123'
DECLARE @HashedPassword NVARCHAR(255) = '$2a$10$5PxR8PKZ5r6lHKCTdFYQNO6VoQdqXGi4KfEgkmEjFS7J.H9Xnxbqm';
```

### Step 5: Clear Existing Users
After re-enabling encryption, you'll need to recreate user accounts because existing plain text passwords won't work with the BCrypt encoder:

```sql
-- Clear existing users (be careful in production!)
DELETE FROM Users WHERE username IN ('admin.user', 'nurse.johnson', 'manager.davis', 'parent.smith');
```

Then restart the application to recreate users with encrypted passwords.

## Security Implications

### Current State (Plain Text)
- ✅ Easy testing and debugging
- ✅ Can see actual passwords in database
- ❌ **MAJOR SECURITY RISK** - Never use in production
- ❌ Passwords visible to anyone with database access

### With Encryption Enabled
- ✅ Secure password storage
- ✅ Production ready
- ✅ Passwords hashed with BCrypt
- ❌ Cannot recover original passwords (by design)

## Testing Login

With plain text passwords, you can test login using:
- Username: `admin.user`, Password: `Password123`
- Username: `nurse.johnson`, Password: `Password123`
- Username: `manager.davis`, Password: `Password123`
- Username: `parent.smith`, Password: `Password123`

The passwords are stored exactly as "Password123" in the database.

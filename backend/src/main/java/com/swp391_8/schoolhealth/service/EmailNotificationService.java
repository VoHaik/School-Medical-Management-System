package com.swp391_8.schoolhealth.service;

import com.swp391_8.schoolhealth.model.ParentRegistrationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailNotificationService.class);

    /**
     * Send approval notification via email
     */
    public void sendApprovalNotification(ParentRegistrationRequest request, String generatedPassword) {
        try {
            // For now, log the notification details
            // In a real implementation, you would integrate with an email service like SendGrid, AWS SES, etc.
            
            String emailContent = createApprovalEmailContent(request, generatedPassword);
            
            logger.info("=== PARENT REGISTRATION APPROVED ===");
            logger.info("Sending approval notification to: {}", request.getEmail());
            logger.info("Username: {}", request.getUsername());
            logger.info("Generated Password: {}", generatedPassword);
            logger.info("Email Content:");
            logger.info(emailContent);
            logger.info("========================================");
            
            // TODO: Implement actual email sending
            // EmailService.sendEmail(request.getEmail(), "Account Approved", emailContent);
            
        } catch (Exception e) {
            logger.error("Failed to send approval notification to {}", request.getEmail(), e);
        }
    }

    /**
     * Send approval notification via SMS
     */
    public void sendSMSNotification(ParentRegistrationRequest request, String generatedPassword) {
        try {
            String smsContent = String.format(
                "FPT Junior High School: Your parent account has been approved! " +
                "Username: %s, Password: %s. " +
                "Login at: http://localhost:3000/login",
                request.getUsername(), 
                generatedPassword
            );
            
            logger.info("=== SMS NOTIFICATION ===");
            logger.info("Sending SMS to: {}", request.getPhoneNumber());
            logger.info("Content: {}", smsContent);
            logger.info("=========================");
            
            // TODO: Implement actual SMS sending
            // SMSService.sendSMS(request.getPhoneNumber(), smsContent);
            
        } catch (Exception e) {
            logger.error("Failed to send SMS notification to {}", request.getPhoneNumber(), e);
        }
    }

    /**
     * Create email content for approval notification
     */
    private String createApprovalEmailContent(ParentRegistrationRequest request, String generatedPassword) {
        return String.format("""
            Dear %s,
            
            Congratulations! Your parent account registration for FPT Junior High School Health Management System has been approved.
            
            Your Account Details:
            - Username: %s
            - Password: %s
            - Email: %s
            
            You can now log in to access the health management system at: http://localhost:3000/login
            
            What you can do with your account:
            ✓ Submit health declarations for your child
            ✓ View your child's health records
            ✓ Request medication administration
            ✓ Access vaccination records
            ✓ Receive health notifications
            
            For your security:
            - Please change your password after first login
            - Keep your login credentials secure
            - Contact us if you experience any issues
            
            If you have any questions, please contact:
            - Email: health@fpt-junior.edu.vn
            - Phone: (024) 123-4567
            - Office Hours: Monday - Friday, 8:00 AM - 4:00 PM
            
            Thank you for choosing FPT Junior High School Health Management System.
            
            Best regards,
            FPT Junior High School Health Office
            """, 
            request.getFullName(),
            request.getUsername(),
            generatedPassword,
            request.getEmail()
        );
    }

    /**
     * Send rejection notification
     */
    public void sendRejectionNotification(ParentRegistrationRequest request, String reason) {
        try {
            String emailContent = String.format("""
                Dear %s,
                
                We regret to inform you that your parent account registration for FPT Junior High School Health Management System has been declined.
                
                Reason: %s
                
                If you believe this was an error or if you have questions, please contact:
                - Email: health@fpt-junior.edu.vn
                - Phone: (024) 123-4567
                - Office Hours: Monday - Friday, 8:00 AM - 4:00 PM
                
                You may resubmit your registration with the correct information.
                
                Best regards,
                FPT Junior High School Health Office
                """,
                request.getFullName(),
                reason != null ? reason : "Please contact the school office for more information."
            );
            
            logger.info("=== PARENT REGISTRATION REJECTED ===");
            logger.info("Sending rejection notification to: {}", request.getEmail());
            logger.info("Email Content:");
            logger.info(emailContent);
            logger.info("======================================");
            
        } catch (Exception e) {
            logger.error("Failed to send rejection notification to {}", request.getEmail(), e);
        }
    }
}

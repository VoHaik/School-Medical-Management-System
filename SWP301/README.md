# School Health Management Software

A comprehensive web-based application for school health departments to efficiently manage student health records, medications, medical events, vaccinations, and health check-ups.

## Features

### Information Portal
- School information and health documents
- Experience-sharing blog for health staff and parents
- Announcements and news related to health initiatives

### User Management
- Role-based access control (Parents, Health Staff, Administrators)
- Secure authentication with password protection
- User profile management and customization

### Parent Functions
- Student health record declaration (allergies, chronic diseases, medical history, vision, hearing, vaccinations)
- Medication administration requests with scheduling and dosage information
- View health check-up results and vaccination records
- Receive notifications about medical events and follow-up consultations

### Health Staff Functions
- Record and handle medical events (accidents, fever, falls, epidemics)
- Manage medications and medical supplies inventory
- Manage vaccination process with consent forms and post-vaccination monitoring
- Manage periodic health check-ups with scheduling and result tracking
- User profile management and student health history access

### Vaccination Management Process
1. Send vaccination consent forms to parents
2. Prepare list of students for vaccination
3. Administer vaccines and record results
4. Post-vaccination monitoring and follow-up

### Health Check-up Management Process
1. Send health check-up notification forms with examination details
2. Prepare list of students for examination
3. Conduct examinations and record results
4. Send results to parents and schedule consultations if needed

### Dashboard & Reports
- Health statistics and trends visualization
- Medical event tracking and incident reports
- Vaccination compliance reports and reminders
- Health check-up summary reports and analytics
- Customizable reporting tools for administrators

## Getting Started

1. Clone this repository
2. Open index.html in your browser or use Live Server extension in VS Code
3. Use the login/registration functionality to access the system

### Test Accounts
- **Parent Account**: email: parent@example.com / password: password123
- **Health Staff**: email: staff@example.com / password: password123
- **Administrator**: email: admin@example.com / password: password123

## Project Structure
- `/css` - Stylesheet files for all pages
- `/js` - JavaScript functionality
- `/images` - Image assets and icons
- `index.html` - Homepage with introduction
- `login.html` & `register.html` - Authentication pages
- `dashboard.html` - Main dashboard after login
- `health-records.html` - Student health record management
- `medications.html` - Medication administration tracking
- `medical-events.html` - Medical incident recording
- `vaccinations.html` - Vaccination process management
- `health-checkups.html` - Health check-up management
- `profile.html` - User profile management

## Technologies Used
- HTML5 for structure
- CSS3 for styling and responsive design
- JavaScript for client-side functionality
- Chart.js for data visualization
- Font Awesome for icons

## Responsive Design
The application is designed to work across various device sizes:
- Desktop computers
- Tablets
- Mobile phones

## Future Enhancements
- Backend integration with Node.js/PHP
- Database implementation with MySQL/MongoDB
- Real-time notifications using WebSockets
- Mobile application development
- AI-powered health analytics and predictions

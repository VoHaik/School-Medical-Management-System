# School Health Management System

A comprehensive health management system for schools, featuring a React frontend, Node.js backend, and Java Spring Boot API.

## Project Structure

- `frontend/`: React frontend application
- `backend/`: Java Spring Boot API
- `scripts/`: Database and system administration scripts

## User Accounts

The system includes predefined user accounts for different roles:

| Role      | Username       | Password    | Access Rights                                  |
|-----------|---------------|-------------|-----------------------------------------------|
| Admin     | admin.user    | Password123 | Full system access, user management           |
| Nurse     | nurse.johnson | Password123 | Medical records, health checkups, medications |
| Parent    | parent.smith  | Password123 | Child health records, consent forms           |

These accounts are automatically created when the backend application starts. For more details on user account management, see [User Account Management Guide](user-account-management-guide.md).

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Java JDK 11 or higher
- Maven

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/SWP391-Project.git
cd SWP391-Project
```

### 2. Set up the Java backend

```bash
mvn clean install
```

### 3. Set up the React frontend

```bash
cd frontend
npm install
```

### 4. Set up the Node.js backend

```bash
cd ../backend
npm install
```

## Running the Application

### Quick Start (Windows)

For Windows users, we've provided convenient batch scripts to start the application:

#### Option 1: Start everything with a single command

```
start-all.bat
```

This will start all components of the application (Java API, Node.js server, and React frontend) in separate windows.

#### Option 2: Start components individually

1. To start the backend services (Java API and Node.js server):
   ```
   start-backend.bat
   ```

2. To start the React frontend:
   ```
   start-frontend.bat
   ```

3. Access the application:
   - Frontend (development mode): http://localhost:3000
   - Backend API: http://localhost:8080
   - Node.js server: http://localhost:5000

### Manual Setup

If you prefer to start the services manually, follow these steps:

#### 1. Start the Java backend

```bash
mvn spring-boot:run
```

This will start the Java Spring Boot API on port 8080.

#### 2. Build the React frontend

```bash
cd frontend
npm run build
```

This will create a production build of the React application in the `frontend/build` directory.

#### 3. Start the Node.js backend

```bash
cd ../backend
npm start
```

This will start the Node.js server on port 5000, which will serve the React frontend and proxy API requests to the Java backend.

#### 4. Access the application

Open your browser and navigate to `http://localhost:5000` to access the application.

## Development Mode

### Running the React frontend in development mode

```bash
cd frontend
npm start
```

This will start the React development server on port 3000. The React development server will proxy API requests to the Java backend.

### Running the Node.js backend in development mode

```bash
cd backend
npm run dev
```

This will start the Node.js server with nodemon, which will automatically restart the server when changes are detected.

## Features

- User authentication (login, registration)
- Student profile management
- Health blog (managed by school nurses)
- Health documentation
- Responsive design

## Technologies Used

- Frontend:
  - React
  - React Router
  - Axios
  - Tailwind CSS
  - Font Awesome

- Backend:
  - Node.js
  - Express
  - http-proxy-middleware

- API:
  - Java Spring Boot
  - Spring Security
  - JPA/Hibernate
  - MySQL

## Troubleshooting

### Common Issues

#### "localhost refused to connect" Error

If you encounter a "localhost refused to connect" error when trying to access the application:

1. **Wait for initialization**: The services might still be starting up. Wait a minute and try again.

2. **Check command windows**: Look at the command windows for any error messages. If you see errors:
   - For frontend issues: Check if there are any dependency or compilation errors
   - For backend issues: Check if the ports are already in use or if there are database connection issues

3. **Verify ports are available**: Make sure no other applications are using ports 3000, 5000, or 8080.

4. **Set PORT environment variable**: If the React app isn't starting on port 3000, explicitly set the PORT:
   ```
   set PORT=3000
   npm start
   ```

5. **Restart the application**: Close all command windows and run the start scripts again.

6. **Clear node_modules**: If you're experiencing dependency issues:
   ```
   cd frontend
   rd /s /q node_modules
   npm install
   ```

   ```
   cd backend
   rd /s /q node_modules
   npm install
   ```

#### Database Connection Issues

If you encounter database connection issues:

1. **Verify MySQL is running**: Make sure your MySQL server is running on port 3306.

2. **Check database credentials**: Verify that the username and password in `application.properties` match your MySQL credentials.

3. **Create the database**: Make sure the `school_health_db` database exists:
   ```sql
   CREATE DATABASE school_health_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

## Known Issues and Fixes

### Database Character Encoding Issue

Some users might encounter a "conversion from varchar to NCHAR" database error when accessing medication requests. This is a known issue with character encoding in the database schema.

#### Symptoms
- Error messages containing "conversion from varchar to NCHAR is unsupported"
- Error messages containing "Could not extract column [8] from JDBC ResultSet"
- Data not displaying correctly in medication requests views

#### Fix
We've included a fix script to address this issue. Follow these steps:

1. Navigate to the scripts directory:
   ```bash
   cd scripts
   ```

2. Run the database fix script (as administrator):
   ```powershell
   .\fix-database-conversion-issues.ps1
   ```

3. Restart the backend service after applying the fix:
   ```bash
   cd ..
   cd backend
   mvn spring-boot:run
   ```

The script converts the varchar columns to nvarchar/NCHAR in the SQL Server database to support Unicode characters correctly.

If you're still experiencing issues after running the script, please contact the system administrator.

# Unicode Support (Vietnamese Character Support)

The application has been updated to fully support Unicode characters, including Vietnamese. This includes:

- Database columns converted from VARCHAR to NVARCHAR
- Java entities updated with `@Nationalized` annotations
- Proper UTF-8 encoding across all application layers

If you encounter any issues with character display, please run the conversion script:

```powershell
# Navigate to scripts directory
cd scripts

# Run the full Unicode conversion script
.\full-unicode-conversion.ps1
```

For detailed information about the Unicode implementation, see [Unicode Support Implementation Guide](docs/unicode-support-implementation-guide.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

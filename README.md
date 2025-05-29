# School Health Management System

A comprehensive health management system for schools, featuring a React frontend, Node.js backend, and Java Spring Boot API.

## Project Structure

- `frontend/`: React frontend application
- `backend/`: Node.js backend server
- `src/`: Java Spring Boot API

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
- Student blog
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

## License

This project is licensed under the MIT License - see the LICENSE file for details.

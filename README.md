# Resume Builder Application

A full-stack web application for creating and managing professional resumes. Built with React.js, Spring Boot, and MySQL.

## Features

- User authentication (signup, login)
- Create, edit, and delete resumes
- Step-by-step resume building process
- Multiple resume sections (personal info, education, experience, skills)
- Resume preview and print functionality
- Responsive design

## Tech Stack

### Frontend
- React.js with TypeScript
- Material UI for components
- React Router for navigation
- Formik and Yup for form handling and validation
- Axios for API requests

### Backend
- Java Spring Boot
- Spring Security with JWT authentication
- Spring Data JPA for database operations
- MySQL database

## Project Structure

```
resume-builder/
├── frontend/                # React frontend
│   ├── public/              # Static files
│   └── src/                 # Source files
│       ├── components/      # Reusable components
│       ├── pages/           # Page components
│       └── services/        # API services
└── backend/                 # Spring Boot backend
    └── src/
        └── main/
            ├── java/        # Java source files
            │   └── com/
            │       └── resumebuilder/
            │           └── api/
            │               ├── controller/  # REST controllers
            │               ├── model/       # Entity classes
            │               ├── repository/  # Data repositories
            │               ├── security/    # Security configuration
            │               ├── dto/         # Data transfer objects
            │               └── service/     # Business logic
            └── resources/   # Application properties
```

## Getting Started

### Prerequisites
- Node.js and npm
- Java 17 or higher
- Maven
- MySQL

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Configure the database connection in `src/main/resources/application.properties`
3. Build and run the Spring Boot application:
   ```
   mvn spring-boot:run
   ```
   The backend will start on http://localhost:8080

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
   The frontend will start on http://localhost:3000

## Usage

1. Register a new account or login with existing credentials
2. Create a new resume or edit existing ones
3. Fill in the required information in each section
4. Preview your resume
5. Print or save your resume as PDF

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
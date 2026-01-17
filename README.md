# SkyWings Airline Management System

A comprehensive full-stack airline management application built with Spring Boot (Backend) and React (Frontend).

## 🚀 Features

- **Flight Search**: Search for flights by origin, destination, and date (with smart airport suggestions).
- **Booking System**: Select flights, enter passenger details, and confirm bookings.
- **User Authentication**: Secure login and registration with JWT.
- **Admin Dashboard**: Manage flights and bookings (Role-based access).
- **Responsive Design**: Modern UI built with Tailwind CSS.

## 🛠️ Tech Stack

### Backend
- **Java 17+**
- **Spring Boot 3** (Web, JPA, Security)
- **PostgreSQL** (Database)
- **Maven** (Build Tool)

### Frontend
- **React 18** (Vite)
- **Tailwind CSS**
- **Axios** (API Communication)
- **Lucide React** (Icons)

## ⚙️ Setup & Installation

### Prerequisites
- Java JDK 17 or higher
- Node.js & npm
- PostgreSQL running locally

### 1. Database Setup
Create a PostgreSQL database named `airline_db`.
```sql
CREATE DATABASE airline_db;
```

### 2. Environment Variables
Create a `.env` file in the root directory (or set these in your IDE/Terminal) with the following secrets:

```properties
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_jwt_secret_key
```
> **Note:** A `.env` file has been created for you with default values.

### 3. Backend Setup
Navigate to the `backend` directory and run the application:

```bash
cd backend
mvn spring-boot:run
```
*Ensure the environment variables are visible to the process.*

### 4. Frontend Setup
Navigate to the `frontend` directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📂 Project Structure

- `backend/`: Spring Boot server code
- `frontend/`: React client code
- `.env`: Environment configuration (git-ignored)

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

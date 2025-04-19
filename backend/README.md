# TajoType Backend

Backend server for the TajoType typing game, handling user authentication, password management, and game statistics.

## Features

- User registration and login
- Google Sign-In integration
- Password reset functionality with email notifications
- Game statistics tracking
- JWT-based authentication
- PostgreSQL database with Supabase but you can also use your postgreSQL local database

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database (via Supabase or local)
- SMTP server for sending emails
- Google OAuth 2.0 credentials (for Google Sign-In)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example` and fill in your configuration:
   ```
   # Database Configuration
   DB_HOST=your-supabase-host
   DB_PORT=5432
   DB_NAME=your-database-name
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password

   # JWT Configuration
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRES_IN=1h

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-specific-password

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5500

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

3. Create the database tables:
   - Use the SQL commands in `src/utils/database.sql`
   - Execute them in your Supabase SQL editor or local PostgreSQL

4. Start the server:
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/google` - Sign in with Google
  ```json
  {
    "credential": "google-id-token"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/forgot-password` - Request password reset
  ```json
  {
    "email": "user@example.com"
  }
  ```

- `POST /api/auth/reset-password` - Reset password with token
  ```json
  {
    "token": "reset-token",
    "newPassword": "newpassword123"
  }
  ```

## Google Sign-In Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add your authorized JavaScript origins:
   ```
   http://localhost:5500
   http://your-production-domain.com
   ```
6. Add your authorized redirect URIs:
   ```
   http://localhost:5500/src/components/pages/login.html
   http://your-production-domain.com/src/components/pages/login.html
   ```
7. Copy your Client ID and Client Secret
8. Update your `.env` file with these credentials

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Password reset tokens expire after 1 hour
- CORS enabled for frontend access
- SSL/TLS encryption for database connection

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   └── user.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── utils/
│   │   └── database.sql
│   └── index.js
├── .env.example
├── package.json
└── README.md
```

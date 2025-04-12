# TajoType Game

## Introduction
A modern typing game built with HTML, CSS, and Vanilla JavaScript. Features include user authentication (including Google Sign-In), typing statistics tracking, and a beautiful UI design.

## Features
- User authentication (Email/Password and Google Sign-In)
- Real-time typing speed measurement
- Statistics tracking
- Modern UI with Tailwind CSS
- Responsive design

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- Google Cloud account (for Google Sign-In)

### Frontend Setup
1. Clone the repository
2. Install Live Server extension in VS Code
3. Configure Google Sign-In:
   - Get your Google OAuth credentials from Google Cloud Console
   - Update `src/components/pages/login.html` with your Google Client ID
   - Make sure to add your development URL (http://localhost:5500) to authorized origins

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Create `.env` file from `.env.example` and configure:
   - Database credentials
   - JWT secret
   - SMTP settings for email
   - Google OAuth credentials
   - Frontend URL

3. Set up the database:
   - Use the SQL commands in `backend/src/utils/database.sql`
   - Execute them in your PostgreSQL database

4. Start the backend server:
   ```bash
   npm run dev
   ```

## Google Sign-In Configuration
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins:
   ```
   http://localhost:5500
   http://127.0.0.1:5500
   ```
6. Add authorized redirect URIs:
   ```
   http://localhost:5500/src/components/pages/login.html
   http://127.0.0.1:5500/src/components/pages/login.html
   ```
7. Copy credentials to your environment files

## Development
Use VS Code with Live Server for frontend development. The backend will run on http://localhost:3000.

## Contributing
Feel free to enrich it with new features and a sexy design. Just keep it as a vanilla JavaScript project (no frameworks like React, Vue, or Svelte).

And most important of all, have fun 🔥

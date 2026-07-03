# SkillForge - Learning Management System

A full-stack Learning Management System (LMS) built with the MERN stack (MongoDB, Express, React, Node.js). 

## Features

- **User Authentication**: Secure login and registration with Role-Based Access Control (Students and Instructors).
- **Instructor Dashboard**: Instructors can create and manage courses, upload lessons (videos, PDFs), create assignments, and grade student submissions.
- **Student Dashboard**: Students can browse available courses, enroll, track their learning progress, watch video lessons, and submit assignments.
- **Video Player**: Built-in support for embedding YouTube videos and playing locally uploaded video files.
- **Responsive Design**: Clean and modern UI built with React and Tailwind CSS.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router DOM, Axios, Lucide React (Icons).
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Authentication**: JSON Web Tokens (JWT).

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nigamkumar3435-spec/Learning-Management-System.git
   cd Learning-Management-System
   ```

2. Install Backend Dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install Frontend Dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

Create a `.env` file in the `backend` directory with the following variables:
```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/lms_fresh_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
```

### Running the Application

1. Start the Backend Server (runs on port 5001):
   ```bash
   cd backend
   npm run dev
   ```

2. Start the Frontend Development Server (runs on Vite default port, e.g., 5174):
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5174`.

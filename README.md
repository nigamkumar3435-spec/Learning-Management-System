# 🎓 SkillForge - Learning Management System

![React](https://img.shields.io/badge/Frontend-React%20\(Vite\)-61DAFB?style=for-the-badge\&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge\&logo=node.js)
![Express.js](https://img.shields.io/badge/Framework-Express.js-000000?style=for-the-badge\&logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge\&logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/UI-TailwindCSS-38B2AC?style=for-the-badge\&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

# 📚 Overview

**SkillForge** is a modern, full-stack **Learning Management System (LMS)** developed using the **MERN Stack (MongoDB, Express.js, React, Node.js)**. The platform enables instructors to create and manage educational content while providing students with an engaging environment to enroll in courses, learn through multimedia lessons, complete assignments, and monitor their academic progress.

The application follows a role-based architecture with dedicated dashboards for students and instructors, secure authentication, responsive design, and an intuitive user experience.

---

# ✨ Key Features

## 🔐 Authentication & Authorization

* Secure User Registration
* User Login
* JWT-Based Authentication
* Password Encryption
* Protected Routes
* Role-Based Access Control (RBAC)
* Student & Instructor Roles

---

## 👨‍🏫 Instructor Dashboard

* Create New Courses
* Edit Course Details
* Delete Courses
* Upload Video Lessons
* Upload PDF Notes
* Create Assignments
* Review Student Submissions
* Grade Assignments
* Manage Enrolled Students

---

## 👨‍🎓 Student Dashboard

* Browse Available Courses
* Enroll in Courses
* Access Learning Materials
* Watch Video Lessons
* Download PDF Resources
* Submit Assignments
* Track Course Progress
* View Grades and Feedback

---

## 🎥 Learning Experience

* Embedded YouTube Videos
* Local Video Playback
* PDF Learning Resources
* Organized Course Modules
* Progress Tracking

---

## 📊 Dashboard Features

### Student Dashboard

* Enrolled Courses
* Learning Progress
* Assignment Status
* Completed Lessons
* Recent Activity

### Instructor Dashboard

* Total Courses
* Student Enrollments
* Assignment Management
* Course Statistics
* Student Performance

---

## 📱 Responsive Design

* Mobile Friendly
* Tablet Optimized
* Desktop Responsive
* Modern UI with Tailwind CSS
* Clean Navigation

---

# 🛠️ Tech Stack

## Frontend

* React (Vite)
* React Router DOM
* Axios
* Tailwind CSS
* Lucide React Icons

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose ODM

## Authentication

* JSON Web Token (JWT)
* bcrypt Password Hashing

---

# 📂 Project Structure

```text
Learning-Management-System/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

# 🏗️ System Architecture

```text
React Frontend
        │
        ▼
REST API (Express.js)
        │
        ▼
JWT Authentication
        │
        ▼
Business Logic
        │
        ▼
MongoDB Database
```

---

# 🚀 Getting Started

## Prerequisites

Before running the project, install:

* Node.js (v14 or later)
* MongoDB (Local or Atlas)
* Git

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/nigamkumar3435-spec/Learning-Management-System.git
```

```bash
cd Learning-Management-System
```

---

## Install Backend Dependencies

```bash
cd backend
npm install
```

---

## Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

# Environment Variables

Create a `.env` file inside the **backend** directory.

```env
NODE_ENV=development

PORT=5001

MONGO_URI=mongodb://localhost:27017/lms_fresh_db

JWT_SECRET=your_jwt_secret_key

JWT_EXPIRE=30d
```

---

# Running the Application

## Start Backend

```bash
cd backend
npm run dev
```

Backend runs on:

```text
http://localhost:5001
```

---

## Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:5174
```

---

# User Roles

## 👨‍🎓 Student

* Register & Login
* Browse Courses
* Enroll in Courses
* Watch Video Lessons
* Access PDFs
* Submit Assignments
* Track Progress
* View Grades

---

## 👨‍🏫 Instructor

* Create Courses
* Upload Lessons
* Upload Learning Materials
* Create Assignments
* Evaluate Student Work
* Grade Assignments
* Manage Courses

---

# Core Functionalities

* JWT Authentication
* Role-Based Access Control
* Course Management
* Student Enrollment
* Video Lessons
* PDF Resources
* Assignment Submission
* Grading System
* Progress Tracking
* Responsive User Interface

---

# Future Enhancements

* Online Course Payments (Stripe/Razorpay)
* Certificate Generation
* Live Video Classes
* Quiz & Examination Module
* Discussion Forums
* Course Reviews & Ratings
* Email Notifications
* AI-Based Course Recommendations
* Attendance Tracking
* Learning Analytics Dashboard
* Progressive Web App (PWA)
* Docker Deployment
* CI/CD Integration

---

# Screenshots

Create a **screenshots/** folder and include images such as:

```text
screenshots/
├── homepage.png
├── login.png
├── student-dashboard.png
├── instructor-dashboard.png
├── course-details.png
├── video-player.png
├── assignment-page.png
└── profile.png
```

---

# Learning Outcomes

This project demonstrates practical knowledge of:

* Full-Stack MERN Development
* REST API Development
* JWT Authentication
* MongoDB Database Design
* React Component Architecture
* Role-Based Access Control (RBAC)
* File Upload Handling
* State Management
* Responsive Web Design
* CRUD Operations
* Secure Backend Development

---

# Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push to your branch.
5. Open a Pull Request.

---

# License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Nigam Kumar**

🎓 B.Tech – Computer Science Engineering
🏫 Indore Institute of Science and Technology, Indore

**GitHub:** https://github.com/nigamkumar3435-spec

**LinkedIn:** https://www.linkedin.com/in/nigam-kumar01

---

# ⭐ Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub.

Your support helps improve the project and encourages future development.

---

### 🚀 Empowering Digital Education Through Modern Full-Stack Web Technologies.


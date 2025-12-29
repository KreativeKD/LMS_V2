# CourseZ LMS V2 🚀

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)

> **Transform your learning experience with CourseZ** - A modern, animated Learning Management System designed for SPIT students, featuring personalized courses, interactive quizzes, and comprehensive dashboards.

![CourseZ Demo](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=CourseZ+LMS+Demo+GIF)  
*Animated demo of CourseZ LMS in action*

## ✨ Features

### 🎓 For Students
- **Interactive Course Content**: Access structured courses with chapters and units
- **Quiz System**: Test your knowledge with automated quizzes and instant feedback
- **Progress Tracking**: Monitor your learning journey with detailed analytics
- **Personalized Dashboard**: View enrolled courses, completed modules, and achievements

### 👨‍🏫 For Teachers
- **Course Management**: Create and edit courses with rich content
- **Student Oversight**: Track student progress and performance
- **Quiz Creation**: Design comprehensive quizzes with various question types

### 🛡️ For Admins
- **User Management**: Handle registrations, approvals, and system settings
- **System Configuration**: Customize platform settings and permissions
- **Analytics Dashboard**: Gain insights into platform usage and performance

### 🔐 Security & Access
- **JWT Authentication**: Secure login and session management
- **Role-Based Access**: Different permissions for Students, Teachers, and Admins
- **Request System**: Controlled access with approval workflows

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server-side runtime and web framework
- **MongoDB** with **Mongoose** - NoSQL database and ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - Modern UI library with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library
- **CSS3 Animations** - Smooth, professional animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/lms-v2.git
   cd lms-v2
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📖 Usage

### First Time Setup
1. Run the backend seed script to create an admin user:
   ```bash
   cd backend
   node utils/seedAdmin.js
   ```

2. Login as admin to configure the system

3. Teachers can request access or be created by admin

4. Students can register and request access

### Creating Content
- **Admins/Teachers**: Use the Course Editor to create courses with chapters and units
- **Quizzes**: Add quizzes to test student knowledge
- **Content**: Upload materials and resources

## 🎨 Screenshots

### Landing Page
![Landing Page](https://via.placeholder.com/600x300/1F2937/FFFFFF?text=Landing+Page+Screenshot)

### Student Dashboard
![Student Dashboard](https://via.placeholder.com/600x300/10B981/FFFFFF?text=Student+Dashboard)

### Course View
![Course View](https://via.placeholder.com/600x300/3B82F6/FFFFFF?text=Course+View)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for SPIT students by faculty
- Personalized lectures by Dr. Kiran Talele
- Inspired by modern e-learning platforms

---

**Made with ❤️ for SPIT Students**

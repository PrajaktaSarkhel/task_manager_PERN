# 🚀 Taskly: Professional Task Management System

A modern, full-stack task management application built with the PERN stack, featuring secure JWT authentication and a responsive React interface.

## 📋 Overview

**Taskly** is a secure task management application where users can create, organize, and track their personal tasks. Each user has a private workspace with complete CRUD functionality, powered by cloud-hosted PostgreSQL and protected by JWT authentication.

## ✨ Key Features

- 🔒 **Secure Authentication** - JWT-based login/signup with bcrypt password hashing
- ✅ **Full CRUD Operations** - Create, read, update, and delete tasks
- 👤 **Private Workspaces** - Users only see and manage their own tasks
- 🎨 **Modern UI** - Glassmorphism design with Tailwind CSS
- ☁️ **Cloud Database** - PostgreSQL hosted on Supabase
- 📱 **Responsive Design** - Works seamlessly on all devices

## 🛠 Tech Stack

**Frontend:**
- React.js + Vite
- Tailwind CSS
- Axios

**Backend:**
- Node.js + Express.js
- JWT for authentication
- Bcrypt for password hashing

**Database:**
- PostgreSQL (Supabase)

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm
- Supabase account

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/taskly.git
cd taskly
```

### 2. Database Setup
Run this SQL in your Supabase SQL Editor:
```sql
-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=your_secret_key
PORT=5001
```

Start server:
```bash
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5001/api
```

Start app:
```bash
npm run dev
```

Visit `http://localhost:5173` 🎉

## 📁 Project Structure
```
taskly/
├── frontend/                # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Auth context
│   │   └── utils/          # API utilities
│   └── package.json
│
├── backend/                # Express API
│   ├── config/            # Database config
│   ├── middleware/        # Auth middleware
│   ├── routes/            # API routes
│   └── package.json
│
└── README.md
```

## 🔗 Links

- **Frontend Live Demo:** [Your Deployed Frontend URL]
- **Backend API:** [Your Deployed Backend URL]
- **Repository:** [https://github.com/yourusername/taskly](https://github.com/yourusername/taskly)

## 🛡 Security Features

- Passwords hashed with bcrypt (never stored in plain text)
- JWT tokens for stateless authentication
- Protected API endpoints
- User data isolation
- Environment variables for sensitive data

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user

### Tasks (Requires JWT Token)
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

**Your Name** - your.email@example.com

**Project Link:** [https://github.com/yourusername/taskly](https://github.com/yourusername/taskly)

---

<div align="center">

⭐ **Star this repo if you find it helpful!** ⭐

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div>
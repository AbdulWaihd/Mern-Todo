<div align="center">

# ✨ Taskflow
### AI-Powered Task Management Platform

**Turn vague goals into actionable plans — automatically.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Taskflow-7c3aed?style=for-the-badge&logo=vercel)](https://mern-todo-ten-gamma.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Gemini](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 📖 Overview

Taskflow is a full-stack AI-powered productivity platform 
built with the MERN stack. The standout feature is the 
**AI Smart Planner** — users type any high-level goal and 
Google Gemini AI automatically generates a complete, 
prioritized action plan with deadlines.

🔗 **Live:** https://mern-todo-ten-gamma.vercel.app

---

## 📸 Screenshots

### Dashboard
![Dashboard](./frontend/src/assets/screenshot-dashboard.webp)

### AI Smart Planner
![AI Planner](./frontend/src/assets/screenshot-ai-planner.webp)

### Contact Us
![Contact](./frontend/src/assets/screenshot-contact.webp)

---

## 🚀 Features

### 🤖 AI Smart Planner
- Type any goal (e.g. *"Prepare for my OS exam"*) and 
  Gemini AI generates a complete action plan instantly
- Each subtask includes: title, description, priority 
  level, estimated time, and suggested deadline
- Edit, remove, or reorder subtasks before saving
- Bulk save all subtasks with one click
- Tasks grouped under parent goal with live progress 
  tracking (e.g. *3/6 done*)
- Collapsible goal groups on dashboard
- Saved AI Goals history panel

### 📋 Task Management
- Full CRUD — create, read, update, delete todos
- Priority levels: High, Medium, Low with 
  color-coded badges
- Sort by: priority, deadline, creation date
- Filter by: All, Pending, Completed
- AI Sort — LLM-based intelligent task prioritization

### 🔐 Authentication & Security
- JWT-based stateless authentication
- bcrypt password hashing
- Protected routes with React Router
- Session persistence across page refreshes
- User avatar dropdown for account actions

### 📄 PDF Export
- Export full task list as a formatted PDF report
- Shows task status, priority, and deadlines
- Client-side generation using jsPDF

### 📬 Contact Form
- Built-in contact page for queries and feedback
- Form pre-fills logged-in user details
- Backend route for message handling

### 🎨 UI/UX
- Premium dark theme with purple accent
- Fully responsive — desktop and mobile
- Hamburger menu for sidebar on mobile (< 600px)
- Glassmorphism design with subtle gradients
- Purple glow effects on hover
- Smooth transitions throughout
- Marketing landing page with app previews

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, React Router 7 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose ODM |
| AI | Google Gemini 1.5 Flash API |
| Auth | JSON Web Tokens (JWT), bcrypt |
| PDF | jsPDF |
| Deployment | Vercel (frontend + backend) |

---

## 🤖 How the AI Feature Works
```
User types goal + deadline + optional context
        ↓
POST /api/ai/breakdown sends to backend
        ↓
Backend sends engineered prompt to Gemini API
        ↓
Gemini returns structured JSON with 4-7 subtasks
        ↓
Frontend renders editable preview list
        ↓
User confirms → POST /api/todos/bulk saves all
        ↓
Dashboard shows tasks grouped under parent goal
```

---

## 📂 Project Structure
```text
taskflow/
├── backend/
│   ├── controllers/
│   │   ├── todoController.js   # CRUD + bulk insert
│   │   └── aiController.js     # Gemini API logic
│   ├── models/
│   │   └── todoModel.js        # Mongoose schema
│   ├── routes/
│   │   ├── todoRoutes.js
│   │   └── aiRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   └── server.js
└── frontend/
    └── src/
        ├── assets/             # App screenshots
        ├── components/         # Navbar, TodoCard
        ├── pages/
        │   ├── LandingPage.jsx
        │   ├── Home.jsx        # Dashboard
        │   ├── AiPlanner.jsx
        │   └── Contact.jsx
        ├── context/            # Auth state
        └── App.jsx             # Routing
```

---

## 📦 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key —
  get free at [aistudio.google.com](https://aistudio.google.com)

### 1. Clone the repo
```bash
git clone https://github.com/AbdulWahid/taskflow.git
cd taskflow
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```
```bash
npm start
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
```
```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## 🌐 Deployment

| Service | Platform | Environment Variables |
|---|---|---|
| Frontend | Vercel | `VITE_API_URL` |
| Backend | Vercel | `MONGO_URI`, `SECRET`, `GEMINI_API_KEY` |

> API keys and secrets are never committed to the
> repository. All sensitive values are managed via
> Vercel environment variable dashboard.

---

## 📜 License

MIT License — free to use and modify.

---

<div align="center">

**Developed by Sheikh Abdul Wahid**

[![Live](https://img.shields.io/badge/Live-Visit%20Taskflow-7c3aed?style=for-the-badge&logo=vercel)](https://mern-todo-ten-gamma.vercel.app)

</div>

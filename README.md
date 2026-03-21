# ✨ Taskflow: AI-Driven Productivity Platform

Taskflow is a high-fidelity MERN stack productivity workspace that leverages **Google Gemini AI** to transform vague goals into prioritized, actionable task plans. Engineered for a professional "Morgen.so" style experience, it automates the cognitive load of planning while providing a premium, distraction-free environment.

---

## 🚀 Key Features

### 🧠 **Smart AI Planner**
- **Actionable Plans**: Input goals like "Prepare for exam" and get 4-7 structured subtasks.
- **Dynamic Estimates**: Includes AI-calculated deadlines and priority rankings.
- **Goal Grouping**: Automatic hierarchical grouping of tasks for a clean, professional dashboard.

### 🎨 **State-of-the-Art UI/UX**
- **Sleek Sidebar Layout**: Intuitive navigation with goal-based quick-links.
- **Glassmorphism Design**: High-end aesthetics featuring backdrop blurs and subtle gradients.
- **Responsive Workspace**: Seamlessly switches between full-width dashboard and mobile-optimized views.
- **Slide-out Task Drawer**: Modern task creation and editing flow that keeps the workspace focused.

### 🔐 **Enterprise-Grade Security**
- **JWT Authentication**: Secure stateless sessions with robust `localStorage` persistence.
- **Auth Persistence**: Engineered to handle page refreshes and session recovery without losing state.
- **Protected Routes**: React Router 7 guards ensuring strict access control.

### 📋 **Task Management**
- **Full CRUD**: Professional task manipulation with instant feedback.
- **Priority Sorting**: Intelligent ordering (High > Medium > Low) to highlight what matters.
- **PDF Reporting**: Export entire task lists to professional PDFs using `jsPDF`.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Vanilla CSS (Premium Tokens), React Router 7.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas with Mongoose ODM.
- **AI**: Google Generative AI (Gemini 1.5 Flash).
- **Tools**: jsPDF, React Icons, JWT.

---

## 📂 Project Structure

```text
todoApp/
├── backend/
│   ├── controllers/      # AI and Todo logic
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth guards (JWT)
│   └── server.js         # Entry point (Production-optimized)
└── frontend/
    ├── src/
    │   ├── components/   # Navbar, TodoCards, Layout elements
    │   ├── pages/        # LandingPage, Dashboard (Home), AI Planner
    │   ├── context/      # AuthState management
    │   └── App.jsx       # Global Routing & Theme shell
```

---

## 💼 CV Highlights (For Your Resume)

### **Key Technical Contributions**
- **AI Integration**: Integrated Google Gemini API to build an automated goal decomposition engine, transforming natural language inputs into structured project plans.
- **Full-Stack Architecture**: Developed a production-ready MERN application with a secure REST API and a high-performance React frontend.
- **Security & Session Management**: Scaled authentication logic to include JWT-based persistence, ensuring 100% session stability across page refreshes and route changes.
- **UI/UX Engineering**: Designed and implemented a custom "High-Fidelity" design system using Vanilla CSS, featuring responsive layouts, glassmorphism, and complex interactive components (sidebars, slide-out drawers).

---

## 📦 Setup & Installation

### 1. Backend Setup
```bash
cd backend
npm install
```
Create `.env`:
```
PORT=3000
MONGO_URI=your_mongodb_uri
SECRET=your_jwt_secret
GEMINI_API_KEY=your_key
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Create `.env`:
```
VITE_API_URL=http://localhost:3000
```

---

**Developed with ❤️ by Sheikh Abdul Wahid**

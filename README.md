# ✨ Taskflow: AI-Driven Productivity Platform

Taskflow is a professional MERN stack productivity workspace that leverages **Google Gemini AI** to transform vague goals into prioritized, actionable task plans. Built for developers and project managers who need to automate the cognitive load of planning.

---

## 🚀 Key Features

### 🧠 **Smart AI Planner**
- **Actionable Plans**: Input goals like "Prepare for exam" and get 4-7 structured subtasks.
- **Dynamic Estimates**: Includes AI-calculated deadlines and priority rankings.
- **Goal Grouping**: Automatic hierarchical grouping of tasks for better organization.

### 🔐 **Enterprise-Grade Security**
- **JWT Authentication**: Secure stateless sessions stored in `localStorage`.
- **OTP Verification**: Email-based OTP system for account recovery (via Nodemailer).
- **Protected Routes**: React Router 7 guards ensuring only authorized users access the dashboard.

### 📋 **Task Management**
- **Full CRUD**: Create, read, update (complete), and delete tasks.
- **Priority Sorting**: Tasks are intelligently ordered (High > Medium > Low).
- **PDF Reporting**: Export entire task lists to professional PDFs using `jsPDF`.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, React Router 7.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas with Mongoose ODM.
- **AI**: Google Generative AI (Gemini Flash).
- **Communication**: Nodemailer for OTP delivery.

---

## 📂 Project Structure

```text
todoApp/
├── backend/
│   ├── controllers/      # AI and Todo logic
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth guards
│   └── server.js         # Entry point
└── frontend/
    ├── src/
    │   ├── components/   # Navbar, TodoCards
    │   ├── pages/        # Landing, Dashboard, AI Planner
    │   ├── hooks/        # Custom Auth logic
    │   └── App.jsx       # Global Routing
```

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
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
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

## 📃 API Routes

### Auth
- `POST /api/user/signup`: Create account
- `POST /api/user/login`: Authenticate

### Protected (Requires JWT)
- `GET /api/todos`: Fetch all tasks
- `POST /api/todos`: Create task
- `POST /api/ai/breakdown`: Generate AI planning subtasks
- `DELETE /api/todos/:id`: Remove task

---

**Developed with ❤️ by Sheikh Abdul Wahid**

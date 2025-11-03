cat > README.md << 'EOF'
# MERN Todo App

A full-stack **Task / Todo Management Application** built using the **MERN Stack** (MongoDB, Express, React, Node.js), featuring authentication (Login / Signup), JWT-based authorization, and CRUD functionality for todos.

---

##  Features

###  **Authentication**
- User Signup & Login  
- JWT Token Authentication  
- Protected Routes (only logged-in users can access Home)

### **Todo Management**
- Create new tasks (with title, description & priority)  
- View all tasks  
- Mark tasks as completed  
- Delete tasks  
- Sorted by **priority (High > Medium > Low)**

###  **UI & Styling**
- Responsive design using **custom CSS** (currently; Tailwind planned)  
- User-specific dashboard: `{username}'s Todo List`  
- Clean layout with Left (Todo List) & Right (Add Todo Form)

---

### Tech Stack
\`\`\`

React + Vite → Used for building the frontend UI

Node.js & Express → Backend server and REST API

MongoDB + Mongoose → Database and data modeling

JWT (JSON Web Token) & bcryptjs → Authentication and password hashing/security

React Router → Frontend page routing and navigation

LocalStorage → Stores user data and JWT token in browser

Custom CSS → UI styling (will later migrate to Tailwind CSS)

\`\`\`

##  Folder Structure

\`\`\`
todoApp/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── config/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── hooks/
│   │   │   ├── useAuthContext.js
│   │   │   └── useLogin.js
│   │   ├── context/AuthContext.jsx
│   │   └── App.jsx
│   └── index.css
├── README.md
└── .gitignore
\`\`\`

---

##  Setup & Installation

###  Clone Repository
\`\`\`bash
git clone https://github.com/your-username/mern-todo-app.git
cd mern-todo-app
\`\`\`

---

### Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`

Create `.env` file inside backend:
\`\`\`
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
\`\`\`

Run server:
\`\`\`bash
npm run dev
\`\`\`

---

###  Frontend Setup
\`\`\`bash
cd ../frontend
npm install
npm run dev
\`\`\`

---

## Authentication Flow (Simplified)

1. User logs in → Backend generates **JWT Token**  
2. Token is stored in **localStorage**  
3. For every request to \`/api/todos\`, token is sent in headers:
   \`\`\`
   Authorization: Bearer <token>
   \`\`\`
4. Backend verifies token → allows access to data

---

##  API Routes

### **Auth Routes**
| Method | Endpoint     | Description      |
|--------|--------------|------------------|
| POST   | /api/user/signup | Create new user |
| POST   | /api/user/login  | Authenticate user |

### **Todo Routes (Protected)**
| Method | Endpoint       | Description        |
|--------|----------------|--------------------|
| GET    | /api/todos     | Get all todos      |
| POST   | /api/todos     | Create a new todo  |
| PUT    | /api/todos/:id | Update (complete)  |
| DELETE | /api/todos/:id | Delete a todo      |

---

##  Upcoming Features
-  Tailwind CSS + React Icons  
-  Dark Mode  
-  Edit Task Functionality  
-  Deploy Backend (Render/     Railway)  
-  Deploy Frontend (Netlify/Vercel)

---

## Contributing

Contributions, issues and feature requests are welcome!  
Feel free to fork and submit a pull request.

---


EOF

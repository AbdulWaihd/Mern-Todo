// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const requireAuth = require('./middleware/requireAuth');
const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://mern-todo-2sa4.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.options(/.*/, cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running ✅');
});

app.use('/api/todos', requireAuth, todoRoutes);
app.use('/api/user', userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(port, () => {
      console.log(` Server running on port ${port}`);
    });
  })
  .catch((err) => console.error(' MongoDB failed:', err.message));

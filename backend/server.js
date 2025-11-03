const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const requireAuth = require('./middleware/requireAuth');
const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Protect Todos API
app.use('/api/todos', requireAuth, todoRoutes);

//  Public Routes (Signup & Login)
app.use('/api/user', userRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(' MongoDB connected');
    app.listen(port, () => {
      console.log(` Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => console.error(' MongoDB failed:', err.message));

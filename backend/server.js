const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const requireAuth = require('./middleware/requireAuth');
const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const port = process.env.PORT || 4000;


const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-todo-tg1e.vercel.app",
  "https://mern-todo-2sa4.vercel.app",
  "https://mern-todo-ten-gamma.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true); // Dynamically allow all frontend URLs
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.options(/.*/, cors());


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running ');
});


app.use('/api/user', userRoutes);
app.use('/api/todos', requireAuth, todoRoutes);
app.use('/api/ai', requireAuth, aiRoutes);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB connected');
    if (process.env.NODE_ENV !== 'production') {
      app.listen(port, () => {
        console.log(` Server running on port ${port}`);
      });
    }
  })
  .catch((err) => console.error(' MongoDB failed:', err.message));

module.exports = app;
